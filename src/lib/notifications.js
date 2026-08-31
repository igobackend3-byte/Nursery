// In-website order notifications ("inbox"), separate from the real emails
// sent via Resend (see emailNotify.js). Stored per-customer at
// users/{uid}/notifications/{id}, written at the same two moments the
// emails fire - order placed, and every admin status change - so the
// in-site inbox and the customer's actual email always stay in sync.
import {
  addDoc, collection, doc, limit, onSnapshot, orderBy, query,
  serverTimestamp, updateDoc, writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';

function notificationsCol(uid) {
  return collection(db, 'users', uid, 'notifications');
}

export function addOrderNotification(uid, { title, message, orderId, type }) {
  return addDoc(notificationsCol(uid), {
    title, message, orderId, type, read: false, createdAt: serverTimestamp(),
  });
}

export function subscribeNotifications(uid, callback) {
  const q = query(notificationsCol(uid), orderBy('createdAt', 'desc'), limit(30));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export function markNotificationRead(uid, notificationId) {
  return updateDoc(doc(db, 'users', uid, 'notifications', notificationId), { read: true });
}

export async function markAllNotificationsRead(uid, notifications) {
  const unread = notifications.filter((n) => !n.read);
  if (unread.length === 0) return;
  const batch = writeBatch(db);
  unread.forEach((n) => batch.update(doc(db, 'users', uid, 'notifications', n.id), { read: true }));
  await batch.commit();
}
