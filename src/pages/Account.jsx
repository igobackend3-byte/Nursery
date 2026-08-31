import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subscribeAddresses, addAddress, updateAddress, deleteAddress } from '../lib/addresses';
import { subscribeMyOrders } from '../lib/orders';
import AddressForm from '../components/AddressForm';

const STATUS_CLASS = {
  Delivered: 'delivered', Shipped: 'shipped', Packed: 'packed',
  Confirmed: 'confirmed', Placed: 'placed', Cancelled: 'cancelled',
};

const BLANK_ADDRESS = { label: 'Home', line1: '', line2: '', city: '', state: '', pincode: '', phone: '' };

const TAB_ICONS = {
  profile: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  addresses: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13z" /><circle cx="12" cy="9" r="3" />
    </svg>
  ),
  orders: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8 12 3 3 8l9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" />
    </svg>
  ),
};

function ProfileTab() {
  const { user, profile } = useAuth();
  const name = profile?.name ?? user.displayName ?? 'Customer';
  return (
    <div className="cart-summary account-panel">
      <p className="account-panel-eyebrow">ACCOUNT</p>
      <h2>Profile details</h2>
      <div className="account-profile-row"><span>Name</span><strong>{name}</strong></div>
      <div className="account-profile-row"><span>Email</span><strong>{user.email}</strong></div>
      <div className="account-profile-row"><span>Account type</span><strong>{profile?.role === 'admin' ? 'Admin' : 'Customer'}</strong></div>
    </div>
  );
}

function AddressesTab() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState(null);
  const [editing, setEditing] = useState(null); // null | 'new' | address object
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
      setSaveError('Please fill in all the required address fields.');
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
    if (!confirm('Remove this address?')) return;
    await deleteAddress(user.uid, id);
  }

  return (
    <div className="cart-summary account-panel">
      <div className="account-panel-head">
        <div>
          <p className="account-panel-eyebrow">DELIVERY</p>
          <h2>Saved addresses</h2>
        </div>
        {!editing && (
          <button type="button" className="checkout-add-address-btn" onClick={() => startEdit(null)}>+ Add address</button>
        )}
      </div>

      {addresses === null && <p>Loading…</p>}

      {editing ? (
        <form onSubmit={handleSave} className="checkout-address-form">
          <AddressForm value={form} onChange={setForm} />
          {saveError && <p className="auth-error">{saveError}</p>}
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button type="button" className="checkout-add-address-btn" onClick={() => setEditing(null)}>Cancel</button>
            <button type="submit" className="btn-build-garden">Save address</button>
          </div>
        </form>
      ) : (
        addresses?.length === 0 ? (
          <div className="account-empty">
            <div className="account-empty-icon">{TAB_ICONS.addresses}</div>
            <p>No saved addresses yet. Add one to check out faster next time.</p>
          </div>
        ) : (
          <div className="account-address-grid">
            {addresses?.map((addr) => (
              <div className="account-address-card" key={addr.id}>
                <div className="account-address-card-label">{addr.label}</div>
                <p>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                <p>{addr.city}, {addr.state} {addr.pincode}</p>
                <p className="account-address-phone">📞 {addr.phone}</p>
                <div className="account-address-card-actions">
                  <button type="button" className="checkout-add-address-btn" onClick={() => startEdit(addr)}>Edit</button>
                  <button type="button" className="cart-remove" onClick={() => handleDelete(addr.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

function OrdersTab() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(null);

  useEffect(() => subscribeMyOrders(user.uid, setOrders), [user.uid]);

  if (orders === null) return <div className="cart-summary account-panel"><p>Loading orders…</p></div>;

  if (orders.length === 0) {
    return (
      <div className="cart-summary account-panel">
        <p className="account-panel-eyebrow">PURCHASES</p>
        <h2>Order history</h2>
        <div className="account-empty">
          <div className="account-empty-icon">{TAB_ICONS.orders}</div>
          <p>No orders yet - once you place one, it'll show up here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-summary account-panel">
      <p className="account-panel-eyebrow">PURCHASES</p>
      <h2>Order history</h2>
      <div className="account-orders-list">
        {orders.map((order) => (
          <div className="account-order-card" key={order.id}>
            <div className="account-order-head">
              <div>
                <strong>Order #{order.id.slice(0, 8).toUpperCase()}</strong>
                <span className="account-order-date">Placed {order.createdAt?.toDate?.().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) ?? '—'}</span>
              </div>
              <span className={`admin-status-pill ${STATUS_CLASS[order.status] ?? ''}`}>{order.status}</span>
            </div>
            <div className="account-order-items">
              {order.items.map((it) => (
                <div className="account-order-item" key={it.productId}>
                  <img src={it.image} alt="" />
                  <div>
                    <span>{it.name}</span>
                    <p>Qty {it.qty} × ₹{it.price}</p>
                  </div>
                  <strong>₹{it.subtotal}</strong>
                </div>
              ))}
            </div>
            <div className="account-order-foot">
              <span>Total</span>
              <strong>₹{order.total}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Account() {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') ?? 'profile';
  const name = profile?.name ?? user.displayName ?? 'Customer';
  const initial = name.trim().charAt(0).toUpperCase() || 'C';

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  const TABS = [
    { key: 'profile', label: 'Profile' },
    { key: 'addresses', label: 'Addresses' },
    { key: 'orders', label: 'Orders' },
  ];

  return (
    <div className="cart-page account-page">
      <p className="eyebrow">MY ACCOUNT</p>
      <h1>Hi, {name.split(' ')[0]}</h1>

      <div className="account-layout">
        <aside className="account-sidebar">
          <div className="account-sidebar-user">
            <span className="account-avatar">{initial}</span>
            <div>
              <strong>{name}</strong>
              <p>{user.email}</p>
            </div>
          </div>

          <nav className="account-nav">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`account-nav-link${tab === t.key ? ' active' : ''}`}
                onClick={() => setSearchParams({ tab: t.key })}
              >
                {TAB_ICONS[t.key]}
                {t.label}
              </button>
            ))}
          </nav>

          <button type="button" className="account-nav-link account-logout" onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" />
            </svg>
            Log out
          </button>
        </aside>

        <div className="account-content">
          {tab === 'profile' && <ProfileTab />}
          {tab === 'addresses' && <AddressesTab />}
          {tab === 'orders' && <OrdersTab />}
        </div>
      </div>
    </div>
  );
}

export default Account;
