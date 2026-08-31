import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  seedCatalogueIfEmpty, subscribeProducts, subscribeCategories,
  updateProductDoc, deleteProductDoc, addProductDoc, updateCategoryDoc,
  addCategoryDoc, deleteCategoryDoc,
} from '../lib/catalogue';

// Products & Categories are now Firestore-backed (see lib/catalogue.js) -
// real, persistent, admin CRUD. On first load, if the products collection
// is empty, the built-in catalogue is seeded into Firestore once
// automatically. Coupons/Settings/Staff are still in-memory only (a
// separate, smaller migration - see the Firebase build plan). Orders live
// in Firestore too, but separately (see src/lib/orders.js), written by the
// real customer checkout flow. Homepage content (Hero, Offers, Garden
// Journal, Garden Services) is real, via lib/contentStore.js.
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
  const [products, setProducts] = useState([]); // Firestore-synced
  const [categories, setCategories] = useState([]); // Firestore-synced
  const [catalogueLoading, setCatalogueLoading] = useState(true);
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

  useEffect(() => {
    let cancelled = false;
    // Swallow errors here deliberately: if this runs before an admin is
    // signed in, the write portion of seeding is correctly rejected by
    // Firestore's security rules (products/categories are admin-write-only)
    // - that's expected, not a bug, so it shouldn't surface as a console error.
    seedCatalogueIfEmpty().catch(() => {}).finally(() => {
      if (cancelled) return;
      setCatalogueLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => subscribeProducts(setProducts), []);
  useEffect(() => subscribeCategories(setCategories), []);

  function updateProduct(id, patch) {
    return updateProductDoc(id, patch);
  }

  function deleteProduct(id) {
    return deleteProductDoc(id);
  }

  function addProduct(product) {
    return addProductDoc(product, products);
  }

  function updateCategory(slug, patch) {
    return updateCategoryDoc(slug, patch);
  }

  function addCategory(category) {
    return addCategoryDoc(category, categories);
  }

  function deleteCategory(slug) {
    return deleteCategoryDoc(slug);
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
    products, updateProduct, deleteProduct, addProduct, catalogueLoading,
    categories, updateCategory, addCategory, deleteCategory,
    customers,
    visitorLeads,
    coupons, addCoupon, updateCoupon, deleteCoupon,
    settings, setSettings,
    staff, setStaff,
    comboOffer, setComboOffer,
  }), [products, categories, catalogueLoading, customers, visitorLeads, coupons, settings, staff, comboOffer]);

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData must be used inside AdminDataProvider');
  return ctx;
}
