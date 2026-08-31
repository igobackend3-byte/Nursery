import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { subscribeProducts, subscribeCategories } from '../lib/catalogue';

// Storefront catalogue, now live from Firestore (same products/categories
// collections the admin panel reads/writes - see lib/catalogue.js). Starts
// from the built-in catalogue file as an instant fallback so the site never
// shows a blank/loading storefront, then swaps to the live Firestore data
// as soon as it arrives (near-instant - it's a local-cache-backed
// onSnapshot, not a cold network round trip after the first load). From
// here on, an admin's product/category edits show up for real customers.
const CatalogueContext = createContext(null);

export function CatalogueProvider({ children }) {
  const [products, setProducts] = useState(PRODUCTS);
  const [categories, setCategories] = useState(CATEGORIES);

  useEffect(() => subscribeProducts((live) => {
    if (live.length > 0) setProducts(live);
  }), []);

  useEffect(() => subscribeCategories((live) => {
    if (live.length > 0) setCategories(live);
  }), []);

  const value = useMemo(() => ({
    products,
    categories,
    getProductById: (id) => products.find((p) => p.id === id),
    getProductsByCategory: (slug) => products.filter((p) => p.category === slug),
    getGiftProducts: () => products.filter((p) => p.gift),
    getBestSellers: (count = 8) => [...products].sort((a, b) => b.rating - a.rating).slice(0, count),
  }), [products, categories]);

  return <CatalogueContext.Provider value={value}>{children}</CatalogueContext.Provider>;
}

export function useCatalogue() {
  const ctx = useContext(CatalogueContext);
  if (!ctx) throw new Error('useCatalogue must be used within CatalogueProvider');
  return ctx;
}
