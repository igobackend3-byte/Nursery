// Customer address book, stored at users/{uid}/addresses/{addressId}.
// Shared by the Checkout page and the Account page so both stay in sync.
import {
  addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query,
  serverTimestamp, updateDoc, writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';

export function subscribeAddresses(uid, callback) {
  const q = query(collection(db, 'users', uid, 'addresses'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export function addAddress(uid, address) {
  return addDoc(collection(db, 'users', uid, 'addresses'), {
    ...address,
    createdAt: serverTimestamp(),
  });
}

export function updateAddress(uid, addressId, address) {
  return updateDoc(doc(db, 'users', uid, 'addresses', addressId), address);
}

export function deleteAddress(uid, addressId) {
  return deleteDoc(doc(db, 'users', uid, 'addresses', addressId));
}

// Exactly one address is default at a time - clears the flag on every
// other address in the same batch so it can never end up with two.
export async function setDefaultAddress(uid, addressId) {
  const col = collection(db, 'users', uid, 'addresses');
  const snap = await getDocs(col);
  const batch = writeBatch(db);
  snap.docs.forEach((d) => {
    batch.update(d.ref, { isDefault: d.id === addressId });
  });
  await batch.commit();
}
