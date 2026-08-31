// Order creation + order history, backed by Firestore's top-level `orders`
// collection (see firestore.rules: readable/writable by the owning
// customer, or an admin). Product details are snapshotted onto the order at
// creation time (name/price/image) so an order's history stays accurate
// even if a product's price or listing changes later.
import {
  addDoc, collection, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where, writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { getProductById } from '../data/products';

export const ORDER_STATUSES = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

// `cart` is the useStore() cart shape: [{ id, qty }]. Resolves each id
// against the real product catalogue so the order carries accurate
// name/price/image, then clears the user's Firestore cart on success.
// `authUser` is the Firebase Auth user object (not just the uid) so the
// customer's name/email can be snapshotted onto the order - the admin
// panel's Orders page reads customerName/customerEmail straight off the
// order doc rather than needing a separate per-order profile lookup.
export async function placeOrder(authUser, { cart, address, paymentMethod }) {
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

  const total = items.reduce((sum, it) => sum + it.subtotal, 0);

  const orderRef = await addDoc(collection(db, 'orders'), {
    userId: uid,
    customerName: authUser.displayName || address.label || 'Customer',
    customerEmail: authUser.email,
    customerPhone: address.phone ?? '',
    items,
    total,
    address,
    paymentMethod,
    status: 'Placed',
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

// Admin-side: every order, newest first (allowed by firestore.rules for
// role: 'admin' users).
export function subscribeAllOrders(callback) {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

// Admin-side: update an order's status.
export function updateOrderStatus(orderId, status) {
  return updateDoc(doc(db, 'orders', orderId), { status });
}
