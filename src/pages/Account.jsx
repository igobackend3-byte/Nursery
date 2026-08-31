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

function ProfileTab() {
  const { user, profile } = useAuth();
  return (
    <div className="cart-summary">
      <h2>Profile</h2>
      <div className="account-profile-row"><span>Name</span><strong>{profile?.name ?? user.displayName ?? '—'}</strong></div>
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

  useEffect(() => subscribeAddresses(user.uid, setAddresses), [user.uid]);

  function startEdit(addr) {
    setEditing(addr ?? 'new');
    setForm(addr ? { ...addr } : BLANK_ADDRESS);
  }

  const [saveError, setSaveError] = useState('');

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
    <div className="cart-summary">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ marginBottom: 0 }}>Saved addresses</h2>
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
          <p>No saved addresses yet.</p>
        ) : (
          <div className="checkout-address-list">
            {addresses?.map((addr) => (
              <div className="checkout-address-option" key={addr.id} style={{ justifyContent: 'space-between', display: 'flex' }}>
                <span>
                  <strong>{addr.label}</strong> — {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} {addr.pincode} · {addr.phone}
                </span>
                <span style={{ display: 'flex', gap: 10, flexShrink: 0, marginLeft: 12 }}>
                  <button type="button" className="checkout-add-address-btn" onClick={() => startEdit(addr)}>Edit</button>
                  <button type="button" className="cart-remove" onClick={() => handleDelete(addr.id)}>Remove</button>
                </span>
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

  if (orders === null) return <div className="cart-summary"><p>Loading orders…</p></div>;

  if (orders.length === 0) {
    return (
      <div className="cart-summary">
        <h2>Order history</h2>
        <p>No orders yet - once you place one, it'll show up here.</p>
      </div>
    );
  }

  return (
    <div className="cart-summary">
      <h2>Order history</h2>
      <div className="checkout-address-list">
        {orders.map((order) => (
          <div className="account-order-card" key={order.id}>
            <div className="account-order-head">
              <strong>Order #{order.id.slice(0, 8).toUpperCase()}</strong>
              <span className={`admin-status-pill ${STATUS_CLASS[order.status] ?? ''}`}>{order.status}</span>
            </div>
            <p className="account-profile-row"><span>Placed</span><strong>{order.createdAt?.toDate?.().toLocaleDateString() ?? '—'}</strong></p>
            <ul className="account-order-items">
              {order.items.map((it) => (
                <li key={it.productId}>{it.name} × {it.qty} — ₹{it.subtotal}</li>
              ))}
            </ul>
            <p className="account-profile-row"><span>Total</span><strong>₹{order.total}</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Account() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') ?? 'profile';

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div className="cart-page">
      <div className="account-header">
        <h1>My Account</h1>
        <button type="button" className="checkout-add-address-btn" onClick={handleLogout}>Log out</button>
      </div>

      <div className="account-tabs">
        {[
          { key: 'profile', label: 'Profile' },
          { key: 'addresses', label: 'Addresses' },
          { key: 'orders', label: 'Orders' },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            className={`account-tab${tab === t.key ? ' active' : ''}`}
            onClick={() => setSearchParams({ tab: t.key })}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && <ProfileTab />}
      {tab === 'addresses' && <AddressesTab />}
      {tab === 'orders' && <OrdersTab />}
    </div>
  );
}

export default Account;
