import { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useAdminData } from '../AdminDataContext';

const STATUS_CLASS = {
  Delivered: 'delivered',
  Shipped: 'shipped',
  Packed: 'packed',
  Confirmed: 'confirmed',
  Placed: 'placed',
  Cancelled: 'cancelled',
};

function AdminOrders() {
  const { orders, updateOrderStatus, orderStatuses, deliverySlots } = useAdminData();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const statusFilter = searchParams.get('status') ?? '';
  const slotFilter = searchParams.get('slot') ?? '';

  const statusCounts = useMemo(() => {
    const counts = new Map(orderStatuses.map((s) => [s, 0]));
    orders.forEach((o) => counts.set(o.status, (counts.get(o.status) ?? 0) + 1));
    return counts;
  }, [orders, orderStatuses]);

  const slotCounts = useMemo(() => {
    const counts = new Map(deliverySlots.map((s) => [s, 0]));
    orders.forEach((o) => counts.set(o.deliverySlot, (counts.get(o.deliverySlot) ?? 0) + 1));
    return counts;
  }, [orders, deliverySlots]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter && o.status !== statusFilter) return false;
      if (slotFilter && o.deliverySlot !== slotFilter) return false;
      if (q && !(o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || (o.phone ?? '').toLowerCase().includes(q))) return false;
      return true;
    });
  }, [orders, statusFilter, slotFilter, query]);

  // Arriving from a Dashboard row click opens that order's detail directly.
  useEffect(() => {
    const openId = location.state?.openOrderId;
    if (openId) {
      const match = orders.find((o) => o.id === openId);
      if (match) setSelected(match);
    }
  }, [location.state, orders]);

  function setStatusFilter(status) {
    const next = new URLSearchParams(searchParams);
    if (status) next.set('status', status); else next.delete('status');
    setSearchParams(next);
  }

  function setSlotFilter(slot) {
    const next = new URLSearchParams(searchParams);
    if (slot) next.set('slot', slot); else next.delete('slot');
    setSearchParams(next);
  }

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Order Management ({orders.length} total)</h1>
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
        Sample data so you can try the status-update flow - the storefront's cart doesn't write real orders anywhere
        yet. This becomes live once checkout is connected to Firestore (build plan Phase 5).
      </div>

      <div className="admin-filter-pills">
        <button
          type="button"
          className={`admin-filter-pill neutral${statusFilter === '' ? ' active' : ''}`}
          onClick={() => setStatusFilter('')}
        >
          All: {orders.length}
        </button>
        {orderStatuses.map((s) => (
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

      <div className="admin-filter-pills">
        <span className="admin-filter-pills-label">Filter by delivery slot:</span>
        <button
          type="button"
          className={`admin-filter-pill slot${slotFilter === '' ? ' active' : ''}`}
          onClick={() => setSlotFilter('')}
        >
          All: {orders.length}
        </button>
        {deliverySlots.map((s) => (
          <button
            key={s}
            type="button"
            className={`admin-filter-pill slot${slotFilter === s ? ' active' : ''}`}
            onClick={() => setSlotFilter(slotFilter === s ? '' : s)}
          >
            {s}: {slotCounts.get(s) ?? 0}
          </button>
        ))}
      </div>

      <div className="admin-panel" style={{ padding: 0, marginTop: 20 }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Update</th></tr></thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="admin-row-clickable" onClick={() => setSelected(o)}>
                  <td><strong>{o.id}</strong></td>
                  <td>{o.customer}</td>
                  <td>₹{o.amount}</td>
                  <td>
                    <span className={`admin-status-pill ${STATUS_CLASS[o.status] ?? ''}`}>{o.status}</span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <select
                      className="admin-status-select"
                      value={o.status}
                      onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                    >
                      {orderStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="admin-empty"><strong>No orders match the current filters.</strong></div>
        )}
      </div>

      {selected && (
        <div className="admin-modal-overlay" onClick={() => setSelected(null)}>
          <div className="admin-modal admin-modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>Order {selected.id}</h3>
              <button type="button" className="admin-modal-close" onClick={() => setSelected(null)} aria-label="Close">✕</button>
            </div>

            <p className="admin-order-detail-section-title">Customer</p>
            <div className="admin-form-grid">
              <div className="admin-field">
                <label>Name</label>
                <p>{selected.customer}</p>
              </div>
              <div className="admin-field">
                <label>Email</label>
                <p>{selected.email ?? '—'}</p>
              </div>
              <div className="admin-field">
                <label>Phone</label>
                <p>{selected.phone ?? '—'}</p>
              </div>
              <div className="admin-field">
                <label>Payment method</label>
                <p>{selected.paymentMethod ?? '—'}</p>
              </div>
              <div className="admin-field span-2">
                <label>Shipping address</label>
                <p>{selected.address ?? '—'}</p>
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
                    <td colSpan={3} style={{ textAlign: 'right', fontWeight: 700 }}>Order total</td>
                    <td style={{ fontWeight: 700 }}>₹{selected.amount}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <p className="admin-order-detail-section-title">Status</p>
            <div className="admin-form-grid">
              <div className="admin-field">
                <label>Placed on</label>
                <p>{selected.placedOn ?? '—'}</p>
              </div>
              <div className="admin-field">
                <label>Delivery slot</label>
                <p>{selected.deliverySlot ?? '—'}</p>
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
                  {orderStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

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
