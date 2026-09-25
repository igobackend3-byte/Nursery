// Recently-viewed products for a signed-in customer, stored at
// users/{uid}/recentlyViewed/{productId} - just a product-id reference +
// timestamp (not a duplicated copy of the product), so the Account page
// looks up the live product via CatalogueContext the same way everything
// else on the site does.
import {
  collection, deleteDoc, doc, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc,
} from 'firebase/firestore';
import { db } from './firebase';

const MAX_RECENTLY_VIEWED = 12;

export function trackRecentlyViewed(uid, productId) {
  return setDoc(doc(db, 'users', uid, 'recentlyViewed', String(productId)), {
    viewedAt: serverTimestamp(),
  });
}

export function subscribeRecentlyViewed(uid, callback) {
  const q = query(
    collection(db, 'users', uid, 'recentlyViewed'),
    orderBy('viewedAt', 'desc'),
    limit(MAX_RECENTLY_VIEWED)
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => d.id));
  });
}

export function removeRecentlyViewed(uid, productId) {
  return deleteDoc(doc(db, 'users', uid, 'recentlyViewed', String(productId)));
}
