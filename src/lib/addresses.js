// Customer address book, stored at users/{uid}/addresses/{addressId}.
// Shared by the Checkout page and the Account page so both stay in sync.
import {
  addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc,
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
