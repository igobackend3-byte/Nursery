// Order creation + order history, backed by Firestore's top-level `orders`
// collection (see firestore.rules: readable/writable by the owning
// customer, or an admin). Product details are snapshotted onto the order at
// creation time (name/price/image) so an order's history stays accurate
// even if a product's price or listing changes later.
import {
  addDoc, arrayUnion, collection, doc, getDocs, onSnapshot, orderBy, query,
  serverTimestamp, Timestamp, updateDoc, where, writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';

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
export function updateOrderStatus(orderId, status) {
  const patch = {
    status,
    statusHistory: arrayUnion({ status, at: Timestamp.now() }),
  };
  if (status === 'Delivered') patch.paymentStatus = 'Paid';
  return updateDoc(doc(db, 'orders', orderId), patch);
}
