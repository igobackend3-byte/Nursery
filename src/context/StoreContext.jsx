import { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

const StoreContext = createContext(null);

function loadFromStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

let toastCounter = 0;

// Cart/wishlist are guest-usable via localStorage (unchanged from before),
// but once a user is signed in they live in Firestore
// (users/{uid}/cart/{productId}, users/{uid}/wishlist/{productId}) and stay
// in sync in real time via onSnapshot - so e.g. the same account open in two
// tabs sees the same cart. On login, any items sitting in the guest-session
// local cart/wishlist are merged into the user's Firestore cart/wishlist
// once (only into an empty Firestore cart/wishlist, so a returning user's
// real cart is never clobbered by stale guest-session leftovers).
export function StoreProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(() => loadFromStorage('igo-cart'));
  const [wishlist, setWishlist] = useState(() => loadFromStorage('igo-wishlist'));
  const [toasts, setToasts] = useState([]);
  const mergedForUid = useRef({ cart: null, wishlist: null });

  // Guest persistence (unchanged behaviour when signed out).
  useEffect(() => {
    if (user) return;
    localStorage.setItem('igo-cart', JSON.stringify(cart));
  }, [cart, user]);

  useEffect(() => {
    if (user) return;
    localStorage.setItem('igo-wishlist', JSON.stringify(wishlist));
  }, [wishlist, user]);

  // Signed-in: real-time Firestore sync for cart + wishlist. The guest-cart
  // merge has to happen *inside* each snapshot callback (not synchronously
  // right after subscribing) - onSnapshot's first callback is async, so
  // clearing localStorage outside of it would race ahead and wipe the guest
  // data before the merge check ever sees it.
  useEffect(() => {
    if (!user) return undefined;

    const cartCol = collection(db, 'users', user.uid, 'cart');
    const wishlistCol = collection(db, 'users', user.uid, 'wishlist');

    const unsubCart = onSnapshot(cartCol, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, qty: d.data().qty }));

      // One-time merge of guest-session cart into an empty account cart.
      if (mergedForUid.current.cart !== user.uid) {
        mergedForUid.current.cart = user.uid;
        if (items.length === 0) {
          const guestCart = loadFromStorage('igo-cart');
          guestCart.forEach((item) => {
            setDoc(doc(cartCol, String(item.id)), { qty: item.qty, updatedAt: serverTimestamp() });
          });
        }
        localStorage.removeItem('igo-cart');
      }
      setCart(items);
    });

    const unsubWishlist = onSnapshot(wishlistCol, (snap) => {
      const ids = snap.docs.map((d) => d.id);

      if (mergedForUid.current.wishlist !== user.uid) {
        mergedForUid.current.wishlist = user.uid;
        if (ids.length === 0) {
          const guestWishlist = loadFromStorage('igo-wishlist');
          guestWishlist.forEach((id) => {
            setDoc(doc(wishlistCol, String(id)), { addedAt: serverTimestamp() });
          });
        }
        localStorage.removeItem('igo-wishlist');
      }
      setWishlist(ids);
    });

    return () => {
      unsubCart();
      unsubWishlist();
    };
  }, [user]);

  function pushToast(toast) {
    const id = `toast-${++toastCounter}`;
    setToasts((prev) => [...prev, { id, ...toast }]);
  }

  function dismissToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  function addToCart(product, qty = 1) {
    if (user) {
      const existing = cart.find((item) => item.id === String(product.id));
      const nextQty = (existing?.qty ?? 0) + qty;
      setDoc(doc(db, 'users', user.uid, 'cart', String(product.id)), {
        qty: nextQty,
        updatedAt: serverTimestamp(),
      });
    } else {
      setCart((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + qty } : item
          );
        }
        return [...prev, { id: product.id, qty }];
      });
    }
    pushToast({
      type: 'cart',
      message: `${product.name} added to your cart!`,
      actionLabel: 'View Cart',
      actionTo: '/cart',
    });
  }

  function removeFromCart(id) {
    if (user) {
      deleteDoc(doc(db, 'users', user.uid, 'cart', String(id)));
    } else {
      setCart((prev) => prev.filter((item) => item.id !== id));
    }
  }

  function updateCartQty(id, qty) {
    if (qty <= 0) return removeFromCart(id);
    if (user) {
      setDoc(doc(db, 'users', user.uid, 'cart', String(id)), { qty, updatedAt: serverTimestamp() });
    } else {
      setCart((prev) => prev.map((item) => (item.id === id ? { ...item, qty } : item)));
    }
  }

  function toggleWishlist(product) {
    const wasWishlisted = user
      ? wishlist.includes(String(product.id))
      : wishlist.includes(product.id);

    if (user) {
      if (wasWishlisted) {
        deleteDoc(doc(db, 'users', user.uid, 'wishlist', String(product.id)));
      } else {
        setDoc(doc(db, 'users', user.uid, 'wishlist', String(product.id)), { addedAt: serverTimestamp() });
      }
    } else {
      setWishlist((prev) =>
        wasWishlisted ? prev.filter((w) => w !== product.id) : [...prev, product.id]
      );
    }

    pushToast(
      wasWishlisted
        ? { type: 'wishlist-remove', message: 'Removed from your wishlist' }
        : { type: 'wishlist-add', message: 'Added to your wishlist ❤️', actionLabel: 'View Wishlist', actionTo: '/wishlist' }
    );
  }

  const value = {
    cart,
    wishlist,
    addToCart,
    removeFromCart,
    updateCartQty,
    toggleWishlist,
    toasts,
    dismissToast,
    cartCount: cart.reduce((sum, item) => sum + item.qty, 0),
    wishlistCount: wishlist.length,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
