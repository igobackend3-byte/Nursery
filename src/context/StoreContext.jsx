import { createContext, useContext, useEffect, useState } from 'react';

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

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => loadFromStorage('igo-cart'));
  const [wishlist, setWishlist] = useState(() => loadFromStorage('igo-wishlist'));
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('igo-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('igo-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  function pushToast(toast) {
    const id = `toast-${++toastCounter}`;
    setToasts((prev) => [...prev, { id, ...toast }]);
  }

  function dismissToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  function addToCart(product, qty = 1) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { id: product.id, qty }];
    });
    pushToast({
      type: 'cart',
      message: `${product.name} added to your cart!`,
      actionLabel: 'View Cart',
      actionTo: '/cart',
    });
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function updateCartQty(id, qty) {
    if (qty <= 0) return removeFromCart(id);
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, qty } : item)));
  }

  function toggleWishlist(product) {
    const wasWishlisted = wishlist.includes(product.id);
    setWishlist((prev) =>
      wasWishlisted ? prev.filter((w) => w !== product.id) : [...prev, product.id]
    );
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
