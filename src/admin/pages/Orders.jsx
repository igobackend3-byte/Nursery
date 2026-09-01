import { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ORDER_STATUSES, STATUS_CLASS, subscribeAllOrders, updateOrderStatus, resendConfirmationEmail } from '../../lib/orders';
import OrderTimeline from '../../components/OrderTimeline';

const EMAIL_STATUS_LABEL = { sent: 'Sent', failed: 'Failed', pending: 'Pending' };
const EMAIL_STATUS_CLASS = { sent: 'delivered', failed: 'cancelled', pending: 'confirmed' };

function EmailStatusPill({ order }) {
  const status = order.emailStatus ?? 'pending';
  return (
    <span className={`admin-status-pill ${EMAIL_STATUS_CLASS[status] ?? ''}`} title={order.emailLastError || ''}>
      {EMAIL_STATUS_LABEL[status] ?? status}
    </span>
  );
}

function AdminOrders() {
  const [orders, setOrders] = useState(null); // null = loading
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [resending, setResending] = useState(false);
  const [resendError, setResendError] = useState('');
  const statusFilter = searchParams.get('status') ?? '';

  useEffect(() => { setResendError(''); }, [selected?.id]);

  async function handleResend(order) {
    setResending(true);
    setResendError('');
    try {
      await resendConfirmationEmail(order);
      setSelected((prev) => (prev ? { ...prev, emailStatus: 'sent', emailLastError: null } : prev));
    } catch (err) {
      setResendError(err.message || 'Failed to resend the email.');
      setSelected((prev) => (prev ? { ...prev, emailStatus: 'failed', emailLastError: err.message } : prev));
    } finally {
      setResending(false);
    }
  }

  useEffect(() => subscribeAllOrders(setOrders), []);

  const statusCounts = useMemo(() => {
    const counts = new Map(ORDER_STATUSES.map((s) => [s, 0]));
    (orders ?? []).forEach((o) => counts.set(o.status, (counts.get(o.status) ?? 0) + 1));
    return counts;
  }, [orders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (orders ?? []).filter((o) => {
      if (statusFilter && o.status !== statusFilter) return false;
      if (q && !(
        o.id.toLowerCase().includes(q) ||
        (o.customerName ?? '').toLowerCase().includes(q) ||
        (o.customerPhone ?? '').toLowerCase().includes(q) ||
        (o.customerEmail ?? '').toLowerCase().includes(q)
      )) return false;
      return true;
    });
  }, [orders, statusFilter, query]);

  // Arriving from a Dashboard row click opens that order's detail directly.
  useEffect(() => {
    const openId = location.state?.openOrderId;
    if (openId && orders) {
      const match = orders.find((o) => o.id === openId);
      if (match) setSelected(match);
    }
  }, [location.state, orders]);

  function setStatusFilter(status) {
    const next = new URLSearchParams(searchParams);
    if (status) next.set('status', status); else next.delete('status');
    setSearchParams(next);
  }

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Order Management ({orders?.length ?? 0} total)</h1>
        </div>
        <input
          className="admin-search"
          style={{ maxWidth: 280 }}
          placeholder="Search ID, phone, name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="admin-mock-banner">
        Live data from Firestore - every order here was placed by a real signed-in customer at checkout.
      </div>

      <div className="admin-filter-pills">
        <button
          type="button"
          className={`admin-filter-pill neutral${statusFilter === '' ? ' active' : ''}`}
          onClick={() => setStatusFilter('')}
        >
          All: {orders?.length ?? 0}
        </button>
        {ORDER_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            className={`admin-filter-pill ${STATUS_CLASS[s] ?? ''}${statusFilter === s ? ' active' : ''}`}
            onClick={() => setStatusFilter(statusFilter === s ? '' : s)}
          >
            {s}: {statusCounts.get(s) ?? 0}
          </button>
        ))}
      </div>

      <div className="admin-panel" style={{ padding: 0, marginTop: 20 }}>
        {orders === null ? (
          <div className="admin-empty"><strong>Loading orders…</strong></div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Email</th><th>Update</th></tr></thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="admin-row-clickable" onClick={() => setSelected(o)}>
                    <td><strong>{o.id.slice(0, 8).toUpperCase()}</strong></td>
                    <td>{o.customerName ?? '—'}</td>
                    <td>₹{o.total}</td>
                    <td>
                      <span className={`admin-status-pill ${STATUS_CLASS[o.status] ?? ''}`}>{o.status}</span>
                    </td>
                    <td><EmailStatusPill order={o} /></td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select
                        className="admin-status-select"
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                      >
                        {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {orders !== null && filtered.length === 0 && (
          <div className="admin-empty"><strong>No orders match the current filters.</strong></div>
        )}
      </div>

      {selected && (
        <div className="admin-modal-overlay" onClick={() => setSelected(null)}>
          <div className="admin-modal admin-modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>Order {selected.id.slice(0, 8).toUpperCase()}</h3>
              <button type="button" className="admin-modal-close" onClick={() => setSelected(null)} aria-label="Close">✕</button>
            </div>

            <p className="admin-order-detail-section-title">Customer</p>
            <div className="admin-form-grid">
              <div className="admin-field">
                <label>Name</label>
                <p>{selected.customerName ?? '—'}</p>
              </div>
              <div className="admin-field">
                <label>Email</label>
                <p>{selected.customerEmail ?? '—'}</p>
              </div>
              <div className="admin-field">
                <label>Phone</label>
                <p>{selected.customerPhone ?? '—'}</p>
              </div>
              <div className="admin-field">
                <label>Payment method</label>
                <p>{selected.paymentMethod ?? '—'}</p>
              </div>
              <div className="admin-field">
                <label>Payment status</label>
                <p>{selected.paymentStatus ?? '—'}</p>
              </div>
              <div className="admin-field">
                <label>Expected delivery</label>
                <p>{selected.expectedDeliveryDate?.toDate?.().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) ?? '—'}</p>
              </div>
              <div className="admin-field span-2">
                <label>Shipping address</label>
                <p>
                  {selected.address
                    ? `${selected.address.line1}${selected.address.line2 ? `, ${selected.address.line2}` : ''}, ${selected.address.city}, ${selected.address.state} ${selected.address.pincode}`
                    : '—'}
                </p>
              </div>
            </div>

            <p className="admin-order-detail-section-title">Items ordered</p>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
                <tbody>
                  {(selected.items ?? []).map((it) => (
                    <tr key={it.productId}>
                      <td><div className="admin-cell-name"><img src={it.image} alt="" className="admin-thumb" />{it.name}</div></td>
                      <td>{it.qty}</td>
                      <td>₹{it.price}</td>
                      <td>₹{it.subtotal}</td>
                    </tr>
                  ))}
                  {(!selected.items || selected.items.length === 0) && (
                    <tr><td colSpan={4}>No item details recorded for this order.</td></tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'right' }}>Subtotal</td>
                    <td>₹{selected.subtotal ?? selected.total}</td>
                  </tr>
                  {selected.discount > 0 && (
                    <tr>
                      <td colSpan={3} style={{ textAlign: 'right' }}>Discount</td>
                      <td>-₹{selected.discount}</td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'right' }}>Delivery charge</td>
                    <td>{selected.deliveryCharge ? `₹${selected.deliveryCharge}` : 'Free'}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'right', fontWeight: 700 }}>Order total</td>
                    <td style={{ fontWeight: 700 }}>₹{selected.total}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <p className="admin-order-detail-section-title">Status</p>
            <div className="admin-form-grid">
              <div className="admin-field">
                <label>Placed on</label>
                <p>{selected.createdAt?.toDate?.().toLocaleString() ?? '—'}</p>
              </div>
              <div className="admin-field">
                <label>Current status</label>
                <span className={`admin-status-pill ${STATUS_CLASS[selected.status] ?? ''}`}>{selected.status}</span>
              </div>
              <div className="admin-field span-2">
                <label htmlFor="order-detail-status">Update status</label>
                <select
                  id="order-detail-status"
                  className="admin-status-select"
                  value={selected.status}
                  onChange={(e) => {
                    updateOrderStatus(selected.id, e.target.value);
                    setSelected((prev) => ({ ...prev, status: e.target.value }));
                  }}
                >
                  {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <p className="admin-order-detail-section-title">Confirmation email</p>
            <div className="admin-form-grid">
              <div className="admin-field">
                <label>Delivery status</label>
                <EmailStatusPill order={selected} />
              </div>
              <div className="admin-field">
                <label>Last sent</label>
                <p>{selected.emailSentAt?.toDate?.().toLocaleString() ?? '—'}</p>
              </div>
              <div className="admin-field span-2">
                <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => handleResend(selected)} disabled={resending}>
                  {resending ? 'Sending…' : 'Resend Confirmation Email'}
                </button>
                {resendError && <p className="acc-error" style={{ marginTop: 8 }}>{resendError}</p>}
              </div>
            </div>

            <OrderTimeline order={selected} />

            <div className="admin-modal-actions">
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
