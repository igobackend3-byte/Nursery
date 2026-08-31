import { createContext, useContext, useMemo, useState } from 'react';
import { PRODUCTS, CATEGORIES } from '../data/products';

// In-memory only, for now. Seeded from the real catalogue so the dashboard
// reflects real numbers, but nothing here persists past a page refresh -
// products/categories/coupons/settings/staff aren't Firestore-backed yet
// (a separate, larger migration - see the Firebase build plan). Orders are
// NOT here anymore - real orders live in Firestore (see src/lib/orders.js),
// written by the real customer checkout flow. Homepage content (Hero,
// Offers, Garden Journal, Garden Services) is also real, via
// lib/contentStore.js.
const AdminDataContext = createContext(null);

const SEED_SETTINGS = {
  contactEmail: 'hello@igonursery.com',
  contactPhone: '+91 00000 00000',
  address: 'Muttukadu, Chennai, Tamil Nadu',
  instagram: '',
  facebook: '',
};

const SAMPLE_COUPONS = [
  { id: 1, code: 'WELCOME10', discountPercent: 10, active: true, expiresOn: '2026-12-31' },
  { id: 2, code: 'MONSOON20', discountPercent: 20, active: true, expiresOn: '2026-09-30' },
];

export function AdminDataProvider({ children }) {
  const [products, setProducts] = useState(PRODUCTS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [customers] = useState([]); // no real customer records yet - see build plan Phase 5
  const [visitorLeads] = useState([]); // no lead-capture form exists on the site yet
  const [coupons, setCoupons] = useState(SAMPLE_COUPONS);
  const [settings, setSettings] = useState(SEED_SETTINGS);
  const [staff, setStaff] = useState([
    { id: 1, name: 'You', email: 'admin@igonursery.com', role: 'super_admin' },
  ]);
  // "Frequently bought together" combo offer: one product, paired with
  // whichever product the customer is currently viewing, at a % off the
  // combined price. Admin-only state for now (see Products page) - showing
  // it live on storefront product pages is a separate change, not made here.
  const [comboOffer, setComboOffer] = useState({ productId: null, discountPercent: 10, active: false });

  function updateProduct(id, patch) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function deleteProduct(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function addProduct(product) {
    // Product ids are strings like "p-123" (see data/products.js), so a
    // plain Math.max over them would silently produce NaN - pull out the
    // numeric suffix of each id instead and pick one past the highest.
    const maxNum = products.reduce((max, p) => {
      const n = Number(String(p.id).replace(/^p-/, ''));
      return Number.isFinite(n) && n > max ? n : max;
    }, 0);
    const id = `p-${maxNum + 1}`;
    setProducts((prev) => [{ ...product, id }, ...prev]);
    return id;
  }

  function updateCategory(slug, patch) {
    setCategories((prev) => prev.map((c) => (c.slug === slug ? { ...c, ...patch } : c)));
  }

  function addCoupon(coupon) {
    const id = Math.max(0, ...coupons.map((c) => c.id)) + 1;
    setCoupons((prev) => [{ ...coupon, id }, ...prev]);
  }

  function updateCoupon(id, patch) {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function deleteCoupon(id) {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  }

  const value = useMemo(() => ({
    products, updateProduct, deleteProduct, addProduct,
    categories, updateCategory,
    customers,
    visitorLeads,
    coupons, addCoupon, updateCoupon, deleteCoupon,
    settings, setSettings,
    staff, setStaff,
    comboOffer, setComboOffer,
  }), [products, categories, customers, visitorLeads, coupons, settings, staff, comboOffer]);

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData must be used inside AdminDataProvider');
  return ctx;
}
