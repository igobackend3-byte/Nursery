import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useCatalogue } from '../context/CatalogueContext';
import { useLanguage } from '../context/LanguageContext';
import { subscribeAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from '../lib/addresses';
import { subscribeMyOrders, STATUS_CLASS } from '../lib/orders';
import { updateUserProfile, updateNotificationPrefs } from '../lib/profile';
import { subscribeRecentlyViewed } from '../lib/recentlyViewed';
import { NOTIFICATION_CATEGORIES } from '../lib/notifications';
import { useNotificationFeed } from '../hooks/useNotificationFeed';
import AddressForm from '../components/AddressForm';
import OrderTimeline from '../components/OrderTimeline';
import ProductCard from '../components/ProductCard';

const BLANK_ADDRESS = { label: 'Home', line1: '', line2: '', city: '', state: '', pincode: '', phone: '', isDefault: false };

// ---------- small shared icon set (line-icon style, no external deps) ----------
const ICONS = {
  overview: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
  orders: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8 12 3 3 8l9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></svg>,
  addresses: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13z" /><circle cx="12" cy="9" r="3" /></svg>,
  wishlist: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
  recent: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>,
  plants: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12" /><path d="M12 12C12 7 8 5 4 5c0 5 3 7 8 7Z" /><path d="M12 12c0-5 4-7 8-7 0 5-3 7-8 7Z" /></svg>,
  rewards: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5" /><path d="m8.5 12.5-1.8 7.5L12 17l5.3 3-1.8-7.5" /></svg>,
  coupons: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1a2 2 0 0 0 0 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a2 2 0 0 0 0-4Z" /><path d="M9 7v10" strokeDasharray="2 2" /></svg>,
  notifications: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" /></svg>,
  logout: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></svg>,
  leafDivider: <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22V12" /><path d="M12 12C12 7 8 5 4 5c0 5 3 7 8 7Z" /><path d="M12 12c0-5 4-7 8-7 0 5-3 7-8 7Z" /></svg>,
};

function formatDate(value, opts = { day: 'numeric', month: 'short', year: 'numeric' }) {
  const date = value?.toDate?.();
  if (!date) return '—';
  return date.toLocaleDateString('en-IN', opts);
}

// ---------------------------------------------------------------- Overview
function PersonalInfoCard({ user, profile, pushToast }) {
  const { t } = useLanguage();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function startEdit() {
    setForm({
      firstName: profile?.firstName ?? (profile?.name ?? '').split(' ')[0] ?? '',
      lastName: profile?.lastName ?? (profile?.name ?? '').split(' ').slice(1).join(' ') ?? '',
      phone: profile?.phone ?? '',
      dob: profile?.dob ?? '',
      gender: profile?.gender ?? '',
    });
    setError('');
    setEditing(true);
  }

  function validate(f) {
    if (!f.firstName.trim()) return t('account.firstNameRequired');
    if (f.phone && !/^[0-9+\-\s]{7,15}$/.test(f.phone)) return t('account.invalidPhone');
    if (f.dob && new Date(f.dob) > new Date()) return t('account.dobFuture');
    return '';
  }

  async function handleSave(e) {
    e.preventDefault();
    const validationError = validate(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setSaving(true);
    setError('');
    try {
      await updateUserProfile(user.uid, form);
      pushToast({ type: 'cart', message: t('account.profileUpdated') });
      setEditing(false);
    } catch (err) {
      setError(t('account.profileSaveFailed'));
      pushToast({ type: 'wishlist-remove', message: t('account.profileSaveFailed') });
    } finally {
      setSaving(false);
    }
  }

  const displayFirst = profile?.firstName ?? (profile?.name ?? user.displayName ?? t('account.customer')).split(' ')[0];
  const displayLast = profile?.lastName ?? (profile?.name ?? '').split(' ').slice(1).join(' ');
  const genderLabel = { female: t('account.female'), male: t('account.male'), other: t('account.other') };

  return (
    <div className="acc-card acc-info-card">
      <div className="acc-card-head">
        <div>
          <p className="acc-card-eyebrow">{t('account.personalInformation')}</p>
          <h2>{t('account.yourDetails')}</h2>
        </div>
        {!editing && (
          <button type="button" className="acc-btn-outline" onClick={startEdit}>{t('account.editProfile')}</button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="acc-info-form">
          <div className="acc-info-grid">
            <label className="acc-field">
              <span>{t('account.firstName')}</span>
              <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
            </label>
            <label className="acc-field">
              <span>{t('account.lastName')}</span>
              <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </label>
            <label className="acc-field">
              <span>{t('account.emailAddress')}</span>
              <input value={user.email} disabled title="Contact support to change your email" />
            </label>
            <label className="acc-field">
              <span>{t('account.phoneNumber')}</span>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
            </label>
            <label className="acc-field">
              <span>{t('account.dateOfBirth')}</span>
              <input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} max={new Date().toISOString().slice(0, 10)} />
            </label>
            <label className="acc-field">
              <span>{t('account.gender')}</span>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option value="">{t('account.preferNotToSay')}</option>
                <option value="female">{t('account.female')}</option>
                <option value="male">{t('account.male')}</option>
                <option value="other">{t('account.other')}</option>
              </select>
            </label>
          </div>
          {error && <p className="acc-error">{error}</p>}
          <div className="acc-info-actions">
            <button type="button" className="acc-btn-ghost" onClick={() => setEditing(false)} disabled={saving}>{t('account.cancel')}</button>
            <button type="submit" className="acc-btn-primary" disabled={saving}>{saving ? t('account.saving') : t('account.saveChanges')}</button>
          </div>
        </form>
      ) : (
        <div className="acc-info-grid acc-info-readonly">
          <div className="acc-field"><span>{t('account.firstName')}</span><strong>{displayFirst || '—'}</strong></div>
          <div className="acc-field"><span>{t('account.lastName')}</span><strong>{displayLast || '—'}</strong></div>
          <div className="acc-field"><span>{t('account.emailAddress')}</span><strong>{user.email}</strong></div>
          <div className="acc-field"><span>{t('account.phoneNumber')}</span><strong>{profile?.phone || '—'}</strong></div>
          <div className="acc-field"><span>{t('account.dateOfBirth')}</span><strong>{profile?.dob ? new Date(profile.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</strong></div>
          <div className="acc-field"><span>{t('account.gender')}</span><strong>{profile?.gender ? (genderLabel[profile.gender] ?? profile.gender) : '—'}</strong></div>
          <div className="acc-field"><span>{t('account.memberSince')}</span><strong>{formatDate(profile?.createdAt)}</strong></div>
        </div>
      )}
    </div>
  );
}

function OverviewTab({ user, profile, pushToast, goToTab, firstName }) {
  const { t } = useLanguage();
  const QUICK_ACTIONS = [
    { key: 'orders', icon: ICONS.orders, title: t('account.qaOrdersTitle'), desc: t('account.qaOrdersDesc') },
    { key: 'wishlist', icon: ICONS.wishlist, title: t('account.qaWishlistTitle'), desc: t('account.qaWishlistDesc') },
    { key: 'addresses', icon: ICONS.addresses, title: t('account.qaAddressesTitle'), desc: t('account.qaAddressesDesc') },
    { key: 'coupons', icon: ICONS.coupons, title: t('account.qaCouponsTitle'), desc: t('account.qaCouponsDesc') },
  ];
  return (
    <>
      <div className="acc-welcome">
        <div>
          <p className="acc-card-eyebrow">{t('account.welcomeBack')}</p>
          <h1>{t('account.hiGreeting').replace('{name}', firstName)}</h1>
          <p className="acc-welcome-sub">{t('account.manageAccountSub')}</p>
        </div>
      </div>

      <PersonalInfoCard user={user} profile={profile} pushToast={pushToast} />

      <div className="acc-quick-head">
        <h2>{t('account.quickActions')}</h2>
      </div>
      <div className="acc-quick-grid">
        {QUICK_ACTIONS.map((qa) => (
          <button key={qa.key} type="button" className="acc-quick-card" onClick={() => goToTab(qa.key)}>
            <span className="acc-quick-icon">{qa.icon}</span>
            <strong>{qa.title}</strong>
            <p>{qa.desc}</p>
          </button>
        ))}
      </div>
    </>
  );
}

// ---------------------------------------------------------------- Orders
function OrdersTab() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const linkedOrderId = searchParams.get('orderId');
  const [orders, setOrders] = useState(null);
  const [expandedId, setExpandedId] = useState(linkedOrderId ?? null);
  const highlightedRef = useRef(null);

  useEffect(() => subscribeMyOrders(user.uid, setOrders), [user.uid]);

  // Deep-linked from an order-confirmation/status email or notification
  // (?orderId=...) - scroll straight to that order and open its tracker,
  // instead of leaving the customer to hunt through their whole history.
  useEffect(() => {
    if (linkedOrderId && orders?.some((o) => o.id === linkedOrderId)) {
      highlightedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [linkedOrderId, orders]);

  if (orders === null) {
    return (
      <div className="acc-card">
        <div className="acc-skeleton-list">
          <div className="acc-skeleton-row" /><div className="acc-skeleton-row" /><div className="acc-skeleton-row" />
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="acc-card">
        <p className="acc-card-eyebrow">{t('account.purchases')}</p>
        <h2>{t('account.orderHistory')}</h2>
        <div className="acc-empty">
          <span className="acc-empty-icon">{ICONS.orders}</span>
          <p>{t('account.noOrdersYet')}</p>
          <Link to="/category/indoor-plants" className="acc-btn-primary">{t('account.startShopping')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="acc-card">
      <p className="acc-card-eyebrow">{t('account.purchases')}</p>
      <h2>{t('account.orderHistory')}</h2>
      <div className="acc-orders-list">
        {orders.map((order) => (
          <div
            className={`acc-order-card${order.id === linkedOrderId ? ' is-linked' : ''}`}
            key={order.id}
            ref={order.id === linkedOrderId ? highlightedRef : undefined}
          >
            <div className="acc-order-head">
              <div>
                <strong>{t('account.orderHash').replace('{id}', order.id.slice(0, 8).toUpperCase())}</strong>
                <span className="acc-order-date">{t('account.placed').replace('{date}', formatDate(order.createdAt))}</span>
              </div>
              <span className={`admin-status-pill ${STATUS_CLASS[order.status] ?? ''}`}>{t(`orders.statuses.${order.status}`)}</span>
            </div>
            <div className="acc-order-items">
              {order.items.map((it) => (
                <div className="acc-order-item" key={it.productId}>
                  <img src={it.image} alt="" />
                  <div>
                    <span>{it.name}</span>
                    <p>{t('account.qtyLine').replace('{n}', it.qty).replace('{price}', it.price)}</p>
                  </div>
                  <strong>₹{it.subtotal}</strong>
                </div>
              ))}
            </div>
            <div className="acc-order-meta">
              <span>{t('account.paymentLine').replace('{method}', order.paymentMethod ?? '—').replace('{status}', order.paymentStatus ?? '—')}</span>
              {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                <span>{t('account.expectedDelivery').replace('{date}', formatDate(order.expectedDeliveryDate))}</span>
              )}
            </div>
            <div className="acc-order-foot">
              <span>{t('account.total')}</span>
              <strong>₹{order.total}</strong>
            </div>
            <button
              type="button"
              className="acc-order-toggle"
              onClick={() => setExpandedId((id) => (id === order.id ? null : order.id))}
            >
              {expandedId === order.id ? t('account.hideTracking') : t('account.trackOrderBtn')}
            </button>
            {expandedId === order.id && <OrderTimeline order={order} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Addresses
function AddressesTab() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [addresses, setAddresses] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK_ADDRESS);
  const [saveError, setSaveError] = useState('');

  useEffect(() => subscribeAddresses(user.uid, setAddresses), [user.uid]);

  function startEdit(addr) {
    setEditing(addr ?? 'new');
    setForm(addr ? { ...addr } : BLANK_ADDRESS);
    setSaveError('');
  }

  async function handleSave(e) {
    e.preventDefault();
    const required = ['line1', 'city', 'state', 'pincode', 'phone'];
    if (required.some((f) => !form[f].trim())) {
      setSaveError(t('account.fillRequiredAddressFields'));
      return;
    }
    setSaveError('');
    if (editing === 'new') {
      await addAddress(user.uid, form);
    } else {
      await updateAddress(user.uid, editing.id, form);
    }
    setEditing(null);
  }

  async function handleDelete(id) {
    if (!confirm(t('account.removeAddressConfirm'))) return;
    await deleteAddress(user.uid, id);
  }

  return (
    <div className="acc-card">
      <div className="acc-card-head">
        <div>
          <p className="acc-card-eyebrow">{t('account.delivery')}</p>
          <h2>{t('account.savedAddresses')}</h2>
        </div>
        {!editing && (
          <button type="button" className="acc-btn-outline" onClick={() => startEdit(null)}>{t('account.addAddressBtn')}</button>
        )}
      </div>

      {addresses === null && (
        <div className="acc-skeleton-list"><div className="acc-skeleton-row" /><div className="acc-skeleton-row" /></div>
      )}

      {editing ? (
        <form onSubmit={handleSave} className="checkout-address-form">
          <AddressForm value={form} onChange={setForm} />
          {saveError && <p className="acc-error">{saveError}</p>}
          <div className="acc-info-actions">
            <button type="button" className="acc-btn-ghost" onClick={() => setEditing(null)}>{t('account.cancel')}</button>
            <button type="submit" className="acc-btn-primary">{t('account.saveAddress')}</button>
          </div>
        </form>
      ) : (
        addresses?.length === 0 ? (
          <div className="acc-empty">
            <span className="acc-empty-icon">{ICONS.addresses}</span>
            <p>{t('account.noAddressesYet')}</p>
          </div>
        ) : (
          <div className="acc-address-grid">
            {addresses?.map((addr) => (
              <div className={`acc-address-card${addr.isDefault ? ' is-default' : ''}`} key={addr.id}>
                <div className="acc-address-card-top">
                  <span className="acc-address-card-label">{addr.label}</span>
                  {addr.isDefault && <span className="acc-default-badge">{t('account.defaultLabel')}</span>}
                </div>
                <p>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                <p>{addr.city}, {addr.state} {addr.pincode}</p>
                <p className="acc-address-phone">📞 {addr.phone}</p>
                <div className="acc-address-card-actions">
                  {!addr.isDefault && (
                    <button type="button" className="acc-btn-ghost-sm" onClick={() => setDefaultAddress(user.uid, addr.id)}>{t('account.setDefault')}</button>
                  )}
                  <button type="button" className="acc-btn-ghost-sm" onClick={() => startEdit(addr)}>{t('account.edit')}</button>
                  <button type="button" className="acc-btn-danger-sm" onClick={() => handleDelete(addr.id)}>{t('account.remove')}</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

// ---------------------------------------------------------------- Wishlist / Recently Viewed / My Plants
function ProductGridTab({ title, eyebrow, productIds, icon, emptyText, emptyCta }) {
  const { getProductById } = useCatalogue();
  const products = productIds === null ? null : productIds.map(getProductById).filter(Boolean);

  return (
    <div className="acc-card">
      <p className="acc-card-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {products === null ? (
        <div className="acc-skeleton-grid"><div /><div /><div /></div>
      ) : products.length === 0 ? (
        <div className="acc-empty">
          <span className="acc-empty-icon">{icon}</span>
          <p>{emptyText}</p>
          {emptyCta}
        </div>
      ) : (
        <div className="acc-product-grid">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

function WishlistTab() {
  const { wishlist } = useStore();
  const { t } = useLanguage();
  return (
    <ProductGridTab
      title={t('account.yourWishlist')}
      eyebrow={t('account.savedForLater')}
      productIds={wishlist}
      icon={ICONS.wishlist}
      emptyText={t('account.nothingSavedYet')}
      emptyCta={<Link to="/category/indoor-plants" className="acc-btn-primary">{t('account.browsePlants')}</Link>}
    />
  );
}

function RecentlyViewedTab() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [ids, setIds] = useState(null);
  useEffect(() => subscribeRecentlyViewed(user.uid, setIds), [user.uid]);
  return (
    <ProductGridTab
      title={t('account.recentlyViewedTitle')}
      eyebrow={t('account.yourBrowsing')}
      productIds={ids}
      icon={ICONS.recent}
      emptyText={t('account.productsViewShowHere')}
    />
  );
}

function MyPlantsTab() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState(null);
  useEffect(() => subscribeMyOrders(user.uid, setOrders), [user.uid]);

  // "My Plants" = every distinct product from delivered orders - a simple,
  // honest reading of "plants you've bought", not a fabricated separate
  // dataset.
  const productIds = useMemo(() => {
    if (orders === null) return null;
    const delivered = orders.filter((o) => o.status === 'Delivered');
    const ids = new Set();
    delivered.forEach((o) => o.items?.forEach((it) => ids.add(it.productId)));
    return Array.from(ids);
  }, [orders]);

  return (
    <ProductGridTab
      title={t('account.myPlantsTitle')}
      eyebrow={t('account.deliveredToYou')}
      productIds={productIds}
      icon={ICONS.plants}
      emptyText={t('account.plantsFromDeliveredOrders')}
    />
  );
}

// ---------------------------------------------------------------- Rewards
function RewardsTab({ profile }) {
  const { t } = useLanguage();
  const points = profile?.loyaltyPoints ?? 0;
  return (
    <div className="acc-card acc-rewards-card">
      <p className="acc-card-eyebrow">{t('account.loyalty')}</p>
      <h2>{t('account.rewardsPoints')}</h2>
      <div className="acc-rewards-hero">
        <span className="acc-rewards-icon">{ICONS.rewards}</span>
        <div>
          <p className="acc-rewards-count">{points}</p>
          <p className="acc-rewards-label">{t('account.pointsEarned')}</p>
        </div>
      </div>
      <p className="acc-rewards-note">{t('account.rewardsNote')}</p>
    </div>
  );
}

// ---------------------------------------------------------------- Coupons
function CouponsTab() {
  const { t } = useLanguage();
  return (
    <div className="acc-card">
      <p className="acc-card-eyebrow">{t('account.savings')}</p>
      <h2>{t('account.couponsOffers')}</h2>
      <div className="acc-empty">
        <span className="acc-empty-icon">{ICONS.coupons}</span>
        <p>{t('account.seeOffersPage')}</p>
        <Link to="/offers" className="acc-btn-primary">{t('account.viewOffers')}</Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Notifications
function NotificationsTab() {
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const { feed, unreadCount, markRead, markAllRead } = useNotificationFeed(user, profile);
  const navigate = useNavigate();

  function handleClick(n) {
    markRead(n);
    if (n.actionUrl) navigate(n.actionUrl);
  }

  return (
    <div className="acc-card">
      <div className="acc-card-head">
        <div>
          <p className="acc-card-eyebrow">{t('account.inbox')}</p>
          <h2>{t('account.notificationsTitle')}{unreadCount > 0 ? ` (${unreadCount})` : ''}</h2>
        </div>
        {unreadCount > 0 && (
          <button type="button" className="acc-btn-outline" onClick={markAllRead}>
            {t('account.markAllReadBtn')}
          </button>
        )}
      </div>
      {feed === null ? (
        <div className="acc-skeleton-list"><div className="acc-skeleton-row" /><div className="acc-skeleton-row" /></div>
      ) : feed.length === 0 ? (
        <div className="acc-empty">
          <span className="acc-empty-icon">🔔</span>
          <strong>{t('common.noNotificationsYet')}</strong>
          <p>{t('notifications.allCaughtUp')}</p>
        </div>
      ) : (
        <ul className="acc-notification-list">
          {feed.map((n) => (
            <li
              key={n.id}
              className={`acc-notification-item${n.read ? '' : ' unread'}`}
              onClick={() => handleClick(n)}
            >
              <span className="acc-notification-icon">{n.icon}</span>
              <div className="acc-notification-body">
                <strong>{n.title}</strong>
                <p>{n.message}</p>
                <div className="acc-notification-foot">
                  <span>{n.createdAt?.toDate?.().toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) ?? ''}</span>
                  {n.actionLabel && <span className="acc-notification-cta">{n.actionLabel} →</span>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- Settings
function NotificationPreferencesCard({ user, profile, pushToast }) {
  const { t } = useLanguage();
  const PREF_LABELS = {
    offers: t('account.prefOffers'), products: t('account.prefProducts'), stock: t('account.prefStock'),
    orders: t('account.prefOrders'), payments: t('account.prefPayments'), wishlist: t('account.prefWishlist'),
    cart: t('account.prefCart'), account: t('account.prefAccount'), general: t('account.prefGeneral'),
  };
  const [prefs, setPrefs] = useState(() => profile?.notificationPrefs ?? {});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPrefs(profile?.notificationPrefs ?? {});
  }, [profile?.notificationPrefs]);

  function toggle(category) {
    setPrefs((prev) => ({ ...prev, [category]: prev[category] === false ? true : false }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateNotificationPrefs(user.uid, prefs);
      pushToast({ type: 'cart', message: t('notifications.title') + ' ' + t('common.success') });
    } catch {
      pushToast({ type: 'wishlist-remove', message: t('common.error') });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="acc-card">
      <p className="acc-card-eyebrow">{t('account.notificationsSection')}</p>
      <h2>{t('account.notificationPreferences')}</h2>
      <div className="acc-pref-list">
        {NOTIFICATION_CATEGORIES.filter((c) => c !== 'orders').map((category) => (
          <label key={category} className="acc-pref-row">
            <span>{PREF_LABELS[category] ?? category}</span>
            <span className={`acc-toggle${prefs[category] !== false ? ' on' : ''}`} onClick={() => toggle(category)} role="switch" aria-checked={prefs[category] !== false} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(category); } }}>
              <span className="acc-toggle-knob" />
            </span>
          </label>
        ))}
        <p className="acc-settings-note" style={{ marginTop: 4 }}>{t('account.orderUpdatesAlwaysOn')}</p>
      </div>
      <button type="button" className="acc-btn-primary" onClick={handleSave} disabled={saving} style={{ marginTop: 14 }}>
        {saving ? t('account.saving') : t('account.savePreferences')}
      </button>
    </div>
  );
}

function SettingsTab({ user, profile, handleLogout, pushToast }) {
  const { t } = useLanguage();
  return (
    <>
      <div className="acc-card">
        <p className="acc-card-eyebrow">{t('account.accountSection')}</p>
        <h2>{t('account.accountSettings')}</h2>
        <div className="acc-info-grid acc-info-readonly">
          <div className="acc-field"><span>{t('account.email')}</span><strong>{user.email}</strong></div>
          <div className="acc-field"><span>{t('account.accountType')}</span><strong>{profile?.role === 'admin' ? t('account.admin') : t('account.customer')}</strong></div>
          <div className="acc-field"><span>{t('account.memberSince')}</span><strong>{formatDate(profile?.createdAt)}</strong></div>
        </div>
        <p className="acc-settings-note">{t('account.contactSupportEmail')}</p>
        <button type="button" className="acc-btn-danger" onClick={handleLogout}>{ICONS.logout} {t('account.logOut')}</button>
      </div>
      <NotificationPreferencesCard user={user} profile={profile} pushToast={pushToast} />
    </>
  );
}

// ---------------------------------------------------------------- Shell
function Account() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, profile, logout, authLoading } = useAuth();
  const { pushToast } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') ?? 'overview';

  const SIDEBAR_ITEMS = [
    { key: 'overview', label: t('account.sidebarOverview'), icon: ICONS.overview },
    { key: 'orders', label: t('account.sidebarOrders'), icon: ICONS.orders },
    { key: 'addresses', label: t('account.sidebarAddresses'), icon: ICONS.addresses },
    { key: 'wishlist', label: t('account.sidebarWishlist'), icon: ICONS.wishlist },
    { key: 'recent', label: t('account.sidebarRecent'), icon: ICONS.recent },
    { key: 'plants', label: t('account.sidebarPlants'), icon: ICONS.plants },
    { key: 'rewards', label: t('account.sidebarRewards'), icon: ICONS.rewards },
    { key: 'coupons', label: t('account.sidebarCoupons'), icon: ICONS.coupons },
    { key: 'notifications', label: t('account.sidebarNotifications'), icon: ICONS.notifications },
    { key: 'settings', label: t('account.sidebarSettings'), icon: ICONS.settings },
  ];

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  function goToTab(key) {
    setSearchParams({ tab: key });
  }

  if (authLoading || !user) {
    return (
      <div className="acc-shell">
        <div className="acc-skeleton-list" style={{ maxWidth: 640, margin: '60px auto' }}>
          <div className="acc-skeleton-row" /><div className="acc-skeleton-row" /><div className="acc-skeleton-row" />
        </div>
      </div>
    );
  }

  const name = profile?.name ?? user.displayName ?? t('account.customer');
  const firstName = name.split(' ')[0];
  const initial = firstName.charAt(0).toUpperCase() || 'C';

  return (
    <div className="acc-shell">
      <div className="acc-layout">
        <aside className="acc-sidebar">
          <div className="acc-sidebar-user">
            <span className="acc-avatar">{initial}</span>
            <div>
              <strong>{name}</strong>
              <p>{user.email}</p>
            </div>
          </div>

          <nav className="acc-nav">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`acc-nav-link${tab === item.key ? ' active' : ''}`}
                onClick={() => goToTab(item.key)}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <button type="button" className="acc-nav-link acc-logout" onClick={handleLogout}>
            {ICONS.logout} {t('account.logOut')}
          </button>

          <span className="acc-sidebar-leaf" aria-hidden="true">{ICONS.leafDivider}</span>
        </aside>

        <div className="acc-content">
          {tab === 'overview' && <OverviewTab user={user} profile={profile} pushToast={pushToast} goToTab={goToTab} firstName={firstName} />}
          {tab === 'orders' && <OrdersTab />}
          {tab === 'addresses' && <AddressesTab />}
          {tab === 'wishlist' && <WishlistTab />}
          {tab === 'recent' && <RecentlyViewedTab />}
          {tab === 'plants' && <MyPlantsTab />}
          {tab === 'rewards' && <RewardsTab profile={profile} />}
          {tab === 'coupons' && <CouponsTab />}
          {tab === 'notifications' && <NotificationsTab />}
          {tab === 'settings' && <SettingsTab user={user} profile={profile} handleLogout={handleLogout} pushToast={pushToast} />}
        </div>
      </div>
    </div>
  );
}

export default Account;
