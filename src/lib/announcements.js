// Site-wide notifications the admin broadcasts to customers (offers,
// general announcements, new-product launches, etc - spec section 5).
// Stored once in a top-level `announcements` collection rather than
// fanned out to every customer's own notifications subcollection - that
// would mean writing N documents (one per customer, and re-writing on
// every edit) for something every signed-in customer should just read.
// Each customer's *read* state is personal, so it's tracked separately at
// users/{uid}/readAnnouncements/{announcementId} (see markAnnouncementRead
// below) - the announcement doc itself is never mutated by a read.
import {
  addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query,
  serverTimestamp, setDoc, Timestamp, updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { NOTIFICATION_CATEGORY_ICONS } from './notifications';

const ANNOUNCEMENTS_COL = 'announcements';

export const PRIORITIES = ['low', 'normal', 'high'];

function toTimestamp(value) {
  if (!value) return null;
  return value instanceof Timestamp ? value : Timestamp.fromDate(new Date(value));
}

// ---------- Admin CRUD ----------
export function addAnnouncement(data) {
  return addDoc(collection(db, ANNOUNCEMENTS_COL), {
    category: data.category,
    title: data.title,
    message: data.message,
    icon: data.icon || NOTIFICATION_CATEGORY_ICONS[data.category] || '🔔',
    actionUrl: data.actionUrl || '',
    actionLabel: data.actionLabel || '',
    priority: data.priority || 'normal',
    audience: data.audience || 'all', // 'all' - every signed-in customer, for now
    enabled: data.enabled ?? true,
    scheduledAt: toTimestamp(data.scheduledAt) ?? serverTimestamp(),
    expiresAt: toTimestamp(data.expiresAt),
    createdAt: serverTimestamp(),
  });
}

export function updateAnnouncement(id, patch) {
  const clean = { ...patch };
  if ('scheduledAt' in clean) clean.scheduledAt = toTimestamp(clean.scheduledAt);
  if ('expiresAt' in clean) clean.expiresAt = toTimestamp(clean.expiresAt);
  return updateDoc(doc(db, ANNOUNCEMENTS_COL, id), clean);
}

export function deleteAnnouncement(id) {
  return deleteDoc(doc(db, ANNOUNCEMENTS_COL, id));
}

export function toggleAnnouncementEnabled(id, enabled) {
  return updateDoc(doc(db, ANNOUNCEMENTS_COL, id), { enabled });
}

// Admin sees every announcement (draft/expired/disabled included) so the
// management table can show real Total/Active/Expired/Disabled counts.
export function subscribeAllAnnouncements(callback) {
  const q = query(collection(db, ANNOUNCEMENTS_COL), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }, (err) => {
    console.warn('[announcements] admin subscription failed:', err);
    callback([]);
  });
}

// ---------- Customer-facing ----------
// Filters client-side (enabled + scheduled + not-expired) rather than in
// the query - Firestore can't combine an inequality on `expiresAt` with
// one on `scheduledAt` without a composite index per combination, and this
// collection is small (site-wide, not per-user), so a client filter over
// a real-time snapshot is simpler and just as correct.
export function subscribeActiveAnnouncements(callback) {
  const q = query(collection(db, ANNOUNCEMENTS_COL), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const now = Date.now();
    const active = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((a) => {
        if (!a.enabled) return false;
        const scheduledMs = a.scheduledAt?.toMillis?.() ?? 0;
        if (scheduledMs > now) return false;
        const expiresMs = a.expiresAt?.toMillis?.();
        if (expiresMs && expiresMs < now) return false;
        return true;
      });
    callback(active);
  }, (err) => {
    // Degrade to "no announcements" rather than leaving callers stuck on a
    // permanent loading state - e.g. this collection's rules not being
    // published yet, or a transient network error, should never block the
    // rest of a customer's (already-permitted) personal notifications.
    console.warn('[announcements] subscription failed:', err);
    callback([]);
  });
}

// ---------- Per-customer read state ----------
function readCol(uid) {
  return collection(db, 'users', uid, 'readAnnouncements');
}

export function subscribeReadAnnouncementIds(uid, callback) {
  return onSnapshot(readCol(uid), (snap) => {
    callback(new Set(snap.docs.map((d) => d.id)));
  }, (err) => {
    console.warn('[announcements] read-state subscription failed:', err);
    callback(new Set());
  });
}

export function markAnnouncementRead(uid, announcementId) {
  return setDoc(doc(readCol(uid), announcementId), { readAt: serverTimestamp() });
}

export async function markAllAnnouncementsRead(uid, announcementIds) {
  await Promise.all(announcementIds.map((id) => markAnnouncementRead(uid, id)));
}
