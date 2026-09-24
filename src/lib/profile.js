// Customer profile fields, on top of the existing users/{uid} doc (name,
// email, role, createdAt - see AuthContext.jsx, which already creates this
// doc on signup). This adds the extra Account-page fields without touching
// the auth/role logic that already lives there.
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export const PROFILE_FIELDS = ['firstName', 'lastName', 'phone', 'dob', 'gender'];

// Firestore rejects `undefined` - only write fields that were actually set.
function stripUndefined(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}

export function updateUserProfile(uid, patch) {
  const clean = stripUndefined(patch);
  // Keep the single `name` field (used by the header greeting, order
  // snapshots, etc.) in sync whenever first/last name changes, so nothing
  // else on the site goes stale.
  if (clean.firstName !== undefined || clean.lastName !== undefined) {
    const first = clean.firstName ?? '';
    const last = clean.lastName ?? '';
    const combined = [first, last].filter(Boolean).join(' ').trim();
    if (combined) clean.name = combined;
  }
  return updateDoc(doc(db, 'users', uid), clean);
}

// Per-category notification opt-out, read by useNotificationFeed.js.
// Missing/undefined for a category means "on" (default), so existing
// users with no prefs doc yet still see everything until they turn
// something off.
export function updateNotificationPrefs(uid, prefs) {
  return updateDoc(doc(db, 'users', uid), { notificationPrefs: prefs });
}
