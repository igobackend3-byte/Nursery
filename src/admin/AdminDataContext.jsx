import { createContext, useContext, useMemo, useState } from 'react';
import { PRODUCTS, CATEGORIES } from '../data/products';

// In-memory only, for now. Seeded from the real catalogue so the
// dashboard reflects real numbers, but nothing here persists past a
// page refresh - there is no database behind it yet (build plan
// Phase 2-3 wires this up to Firestore; only this file changes when
// that happens, nothing that imports useAdminData needs to change).
//
// Orders below are clearly-labelled SAMPLE data (see the banner on the
// Orders page) so the status-update flow can actually be tried - there is
// no real checkout writing orders anywhere yet. Homepage content (Hero,
// Offers, Garden Journal, Garden Services) is NOT here - it's real and it
// persists, via lib/contentStore.js.
const AdminDataContext = createContext(null);

const SEED_SETTINGS = {
  contactEmail: 'hello@igonursery.com',
  contactPhone: '+91 00000 00000',
  address: 'Muttukadu, Chennai, Tamil Nadu',
  instagram: '',
  facebook: '',
};

const ORDER_STATUSES = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
const DELIVERY_SLOTS = ['Tomorrow, 6-9 AM', 'Tomorrow, 9 AM-12 PM', 'Tomorrow, 4-7 PM', 'Standard (2-4 days)'];

// Each sample order's `items` reference real products from the catalogue
// (by product id, at the price/name/image they had when seeded) so the
// order-detail view can show what was actually "bought" - not just a total.
// `amount` is the sum of item subtotals. Still clearly-labelled sample data
// (see the banner on the Orders page): no real checkout writes orders yet.
function buildOrderItems(lines) {
  return lines.map(([productId, qty]) => {
    const p = PRODUCTS.find((prod) => prod.id === productId);
    if (!p) return null;
    return { productId, name: p.name, image: p.image, price: p.price, qty, subtotal: p.price * qty };
  }).filter(Boolean);
}

const SAMPLE_ORDERS = [
  {
    id: 'IGN-20260601', status: 'Delivered', placedOn: '2026-06-01', deliverySlot: 'Standard (2-4 days)',
    customer: 'Ananya R.', email: 'ananya.r@example.com', phone: '+91 98765 43210',
    address: '14/2 Kasturba Nagar, Adyar, Chennai, Tamil Nadu 600020',
    paymentMethod: 'UPI', items: buildOrderItems([['p-1', 1], ['p-5', 1]]),
  },
  {
    id: 'IGN-20260603', status: 'Confirmed', placedOn: '2026-06-03', deliverySlot: 'Tomorrow, 6-9 AM',
    customer: 'Karthik S.', email: 'karthik.s@example.com', phone: '+91 91234 56789',
    address: '22 Kamarajar Salai, Besant Nagar, Chennai, Tamil Nadu 600090',
    paymentMethod: 'Card', items: buildOrderItems([['p-9', 2], ['p-13', 1], ['p-3', 1]]),
  },
  {
    id: 'IGN-20260605', status: 'Packed', placedOn: '2026-06-05', deliverySlot: 'Tomorrow, 9 AM-12 PM',
    customer: 'Priya M.', email: 'priya.m@example.com', phone: '+91 90000 11223',
    address: '7 Eldams Road, Teynampet, Chennai, Tamil Nadu 600018',
    paymentMethod: 'COD', items: buildOrderItems([['p-6', 1]]),
  },
  {
    id: 'IGN-20260606', status: 'Shipped', placedOn: '2026-06-06', deliverySlot: 'Tomorrow, 4-7 PM',
    customer: 'Rahul V.', email: 'rahul.v@example.com', phone: '+91 98989 12121',
    address: '3rd Cross Street, Muttukadu, Chennai, Tamil Nadu 603112',
    paymentMethod: 'UPI', items: buildOrderItems([['p-20', 2], ['p-21', 1], ['p-8', 2]]),
  },
  {
    id: 'IGN-20260607', status: 'Placed', placedOn: '2026-06-07', deliverySlot: 'Standard (2-4 days)',
    customer: 'test', email: 'test@example.com', phone: '+91 90000 00000',
    address: 'Test address, Chennai, Tamil Nadu 600001',
    paymentMethod: 'COD', items: buildOrderItems([['p-7', 1]]),
  },
].map((o) => ({ ...o, amount: o.items.reduce((sum, it) => sum + it.subtotal, 0) }));

const SAMPLE_COUPONS = [
  { id: 1, code: 'WELCOME10', discountPercent: 10, active: true, expiresOn: '2026-12-31' },
  { id: 2, code: 'MONSOON20', discountPercent: 20, active: true, expiresOn: '2026-09-30' },
];

export function AdminDataProvider({ children }) {
  const [products, setProducts] = useState(PRODUCTS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [orders, setOrders] = useState(SAMPLE_ORDERS);
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

  function updateOrderStatus(id, status) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
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
    orders, updateOrderStatus, orderStatuses: ORDER_STATUSES, deliverySlots: DELIVERY_SLOTS,
    customers,
    visitorLeads,
    coupons, addCoupon, updateCoupon, deleteCoupon,
    settings, setSettings,
    staff, setStaff,
    comboOffer, setComboOffer,
  }), [products, categories, orders, customers, visitorLeads, coupons, settings, staff, comboOffer]);

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData must be used inside AdminDataProvider');
  return ctx;
}
