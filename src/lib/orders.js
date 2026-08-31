// Order creation + order history, backed by Firestore's top-level `orders`
// collection (see firestore.rules: readable/writable by the owning
// customer, or an admin). Product details are snapshotted onto the order at
// creation time (name/price/image) so an order's history stays accurate
// even if a product's price or listing changes later.
import {
  addDoc, arrayUnion, collection, doc, getDoc, getDocs, increment, onSnapshot, orderBy, query,
  serverTimestamp, Timestamp, updateDoc, where, writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { notifyOrderEmail } from './emailNotify';
import { addOrderNotification } from './notifications';

// Loyalty points: 1 point per Rs.100 of a delivered order's total, awarded
// once the order actually reaches Delivered (not on placement - a
// cancelled or never-delivered order earns nothing).
const LOYALTY_POINTS_PER_RUPEE_SPENT = 1 / 100;

// The 8-stage lifecycle every order moves through, in order.
export const ORDER_STATUSES = [
  'Order Placed', 'Order Confirmed', 'Order Processing', 'Packed',
  'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled',
];

// Maps a status label to the CSS modifier class used for its pill
// (see .admin-status-pill / .admin-filter-pill in admin.css and site.css).
// Defined once here so the admin Orders/Dashboard pages and the customer
// Account page can't drift out of sync with each other.
export const STATUS_CLASS = {
  'Order Placed': 'placed',
  'Order Confirmed': 'confirmed',
  'Order Processing': 'processing',
  Packed: 'packed',
  Shipped: 'shipped',
  'Out for Delivery': 'out-for-delivery',
  Delivered: 'delivered',
  Cancelled: 'cancelled',
};

const DELIVERY_ESTIMATE_DAYS = 5;

// `cart` is the useStore() cart shape: [{ id, qty }]. `getProductById` is
// passed in (from useCatalogue()) rather than imported directly, so an
// order always snapshots the live, current-at-checkout-time price/name/
// image from Firestore - not a stale build-time copy - then clears the
// user's Firestore cart on success. `authUser` is the Firebase Auth user
// object (not just the uid) so the customer's name/email can be
// snapshotted onto the order - the admin panel's Orders page reads
// customerName/customerEmail straight off the order doc rather than
// needing a separate per-order profile lookup.
export async function placeOrder(authUser, { cart, address, paymentMethod, getProductById, discount = 0 }) {
  const uid = authUser.uid;
  const items = cart
    .map((item) => {
      const product = getProductById(item.id);
      if (!product) return null;
      return {
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: item.qty,
        subtotal: product.price * item.qty,
      };
    })
    .filter(Boolean);

  if (items.length === 0) throw new Error('Cart is empty.');

  const subtotal = items.reduce((sum, it) => sum + it.subtotal, 0);
  // No real delivery-fee logic or payment gateway exists yet - both kept
  // honest/simple rather than fabricated: delivery is free site-wide (see
  // Checkout/Cart UI), and payment status reflects that only COD is a real
  // "pay later" method - UPI has no live gateway behind it, so it's marked
  // Paid at order time as a placeholder, not a real charge.
  const deliveryCharge = 0;
  const total = Math.max(0, subtotal - discount + deliveryCharge);
  const paymentStatus = paymentMethod === 'COD' ? 'Pending' : 'Paid';

  const now = new Date();
  const expectedDelivery = new Date(now);
  expectedDelivery.setDate(expectedDelivery.getDate() + DELIVERY_ESTIMATE_DAYS);

  const orderRef = await addDoc(collection(db, 'orders'), {
    userId: uid,
    customerName: authUser.displayName || address.label || 'Customer',
    customerEmail: authUser.email,
    customerPhone: address.phone ?? '',
    items,
    subtotal,
    discount,
    deliveryCharge,
    total,
    address,
    paymentMethod,
    paymentStatus,
    status: 'Order Placed',
    statusHistory: [{ status: 'Order Placed', at: Timestamp.fromDate(now) }],
    expectedDeliveryDate: Timestamp.fromDate(expectedDelivery),
    createdAt: serverTimestamp(),
  });

  // The order write above succeeded - it's now genuinely in the database,
  // so this is the only place the confirmation email fires from. Sent only
  // to the customer (never the admin - see emailNotify.js/send-order-email
  // for the admin_new_order type, which exists but is deliberately not
  // called here). Not awaited: a slow/failed email must never surface as a
  // failed checkout, and it must never block the cart-clear step below.
  notifyOrderEmail('confirmation', {
    id: orderRef.id, userId: uid, customerName: authUser.displayName || address.label || 'Customer',
    customerEmail: authUser.email, customerPhone: address.phone ?? '', items, subtotal, discount,
    deliveryCharge, total, address, paymentMethod, paymentStatus, status: 'Order Placed',
    expectedDeliveryDate: expectedDelivery, createdAt: now,
  });

  // Same moment, write the in-website inbox entry - shows up under the
  // bell icon for this signed-in customer, independent of whether the
  // email actually lands (spam filter, typo, etc).
  addOrderNotification(uid, {
    type: 'order_placed',
    orderId: orderRef.id,
    title: 'Order placed',
    message: `Your order #${orderRef.id.slice(0, 8).toUpperCase()} has been placed - total ₹${total}.`,
  }).catch((err) => console.warn('[notifications] order_placed write failed:', err));

  // Clear the cart now that the order has been placed.
  const cartSnap = await getDocs(collection(db, 'users', uid, 'cart'));
  const batch = writeBatch(db);
  cartSnap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();

  return orderRef.id;
}

export function subscribeMyOrders(uid, callback) {
  const q = query(collection(db, 'orders'), where('userId', '==', uid), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export function subscribeOrder(orderId, callback) {
  return onSnapshot(doc(db, 'orders', orderId), (snap) => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  });
}

// Admin-side: every order, newest first (allowed by firestore.rules for
// role: 'admin' users).
export function subscribeAllOrders(callback) {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

// Admin-side: update an order's status, appending a timestamped entry to
// statusHistory so the order-details timeline shows exactly when each
// stage happened. Marking "Delivered" also sets paymentStatus to Paid,
// since a COD order is only actually paid once it's handed over.
export async function updateOrderStatus(orderId, status) {
  const patch = {
    status,
    statusHistory: arrayUnion({ status, at: Timestamp.now() }),
  };
  if (status === 'Delivered') patch.paymentStatus = 'Paid';

  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, patch);

  // Read the order back (with the new status applied) to email the
  // customer. Not awaited past this point - a failed email must never
  // surface as a failed status update in the admin UI.
  const snap = await getDoc(orderRef);
  if (snap.exists()) {
    const order = { id: snap.id, ...snap.data() };
    notifyOrderEmail('status_update', order);
    addOrderNotification(order.userId, {
      type: 'status_update',
      orderId: order.id,
      title: `Order ${status}`,
      message: status === 'Cancelled'
        ? `Your order #${order.id.slice(0, 8).toUpperCase()} has been cancelled.`
        : `Your order #${order.id.slice(0, 8).toUpperCase()} is now: ${status}.`,
    }).catch((err) => console.warn('[notifications] status_update write failed:', err));

    if (status === 'Delivered' && order.userId && !order.loyaltyPointsAwarded) {
      const points = Math.floor((order.total ?? 0) * LOYALTY_POINTS_PER_RUPEE_SPENT);
      if (points > 0) {
        updateDoc(doc(db, 'users', order.userId), { loyaltyPoints: increment(points) })
          .catch((err) => console.warn('[loyalty] points award failed:', err));
      }
      // Marked on the order itself so re-delivering/re-saving the same
      // status (or a future status change back to Delivered) never
      // double-awards points for one order.
      updateDoc(orderRef, { loyaltyPointsAwarded: true }).catch(() => {});
    }
  }
}
