// In-website personal notifications ("inbox"), separate from the real
// emails sent via Resend (see emailNotify.js). Stored per-customer at
// users/{uid}/notifications/{id}. Order-lifecycle events (placed, every
// status change) write here automatically - see lib/orders.js. The
// customer-facing bell/panel (NotificationBell.jsx, Account.jsx) merges
// this per-user stream with the site-wide broadcasts in lib/announcements.js.
import {
  addDoc, collection, doc, limit, onSnapshot, orderBy, query,
  serverTimestamp, updateDoc, writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';

// Category -> default icon, shared between personal notifications and
// admin-authored announcements so the bell/panel renders one consistent
// icon language regardless of which collection a notification came from.
export const NOTIFICATION_CATEGORY_ICONS = {
  offers: '🔥',
  products: '🌱',
  stock: '⚠️',
  orders: '📦',
  payments: '💳',
  wishlist: '❤️',
  cart: '🛒',
  account: '🔐',
  general: '🔔',
};

export const NOTIFICATION_CATEGORIES = Object.keys(NOTIFICATION_CATEGORY_ICONS);

function notificationsCol(uid) {
  return collection(db, 'users', uid, 'notifications');
}

// `category` drives the icon/preferences filtering; `icon` can override it
// per-notification. `actionUrl` is where clicking the notification
// navigates (defaults to the order-history tab for order-category ones,
// handled by the caller).
export function addOrderNotification(uid, { title, message, orderId, type, category = 'orders', icon, actionUrl, priority = 'normal' }) {
  return addDoc(notificationsCol(uid), {
    title, message, orderId, type, category,
    icon: icon ?? NOTIFICATION_CATEGORY_ICONS[category] ?? '🔔',
    actionUrl: actionUrl ?? '/account?tab=orders',
    priority,
    read: false,
    createdAt: serverTimestamp(),
  });
}

export function subscribeNotifications(uid, callback) {
  const q = query(notificationsCol(uid), orderBy('createdAt', 'desc'), limit(30));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data(), source: 'personal' })));
  }, (err) => {
    console.warn('[notifications] subscription failed:', err);
    callback([]);
  });
}

export function markNotificationRead(uid, notificationId) {
  return updateDoc(doc(db, 'users', uid, 'notifications', notificationId), { read: true });
}

export async function markAllNotificationsRead(uid, notifications) {
  const unread = notifications.filter((n) => !n.read && n.source !== 'announcement');
  if (unread.length === 0) return;
  const batch = writeBatch(db);
  unread.forEach((n) => batch.update(doc(db, 'users', uid, 'notifications', n.id), { read: true }));
  await batch.commit();
}
