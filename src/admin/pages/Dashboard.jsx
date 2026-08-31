import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminData } from '../AdminDataContext';
import { ORDER_STATUSES, STATUS_CLASS, subscribeAllOrders, updateOrderStatus } from '../../lib/orders';
import { DollarIcon, CartIcon, BoxIcon, CheckCircleIcon } from '../adminIcons';

function AdminDashboard() {
  const { products } = useAdminData();
  const [orders, setOrders] = useState(null);
  const navigate = useNavigate();

  useEffect(() => subscribeAllOrders(setOrders), []);
  const ordersList = orders ?? [];

  const outOfStock = products.filter((p) => p.availability === 'Out of Stock');
  const bestSellers = [...products].sort((a, b) => b.rating - a.rating).slice(0, 5);

  const nonCancelled = ordersList.filter((o) => o.status !== 'Cancelled');
  const revenue = nonCancelled.reduce((sum, o) => sum + o.total, 0);
  const pending = ordersList.filter((o) => !['Delivered', 'Cancelled'].includes(o.status)).length;
  const delivered = ordersList.filter((o) => o.status === 'Delivered').length;
  const inTransit = ordersList.filter((o) => o.status === 'Shipped').length;

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-sub">Overview of the catalogue and orders as they stand right now.</p>
        </div>
      </div>

      <div className="admin-mock-banner">
        Orders, products and categories are all live from Firestore. The public storefront still reads the
        built-in catalogue file, not these edits, for now.
      </div>

      <div className="admin-stat-grid-color">
        <Link to="/admin/orders" className="admin-stat-card-color green" title="View all orders">
          <div className="admin-stat-color-head">
            <DollarIcon width="18" height="18" />
            <span>Total Revenue</span>
          </div>
          <p className="admin-stat-color-value">₹{revenue.toLocaleString('en-IN')}</p>
          <p className="admin-stat-color-sub">All-time non-cancelled</p>
        </Link>
        <Link to="/admin/orders" className="admin-stat-card-color blue" title="View all orders">
          <div className="admin-stat-color-head">
            <CartIcon width="18" height="18" />
            <span>Total Orders</span>
          </div>
          <p className="admin-stat-color-value">{ordersList.length}</p>
          <p className="admin-stat-color-sub">{pending} pending</p>
        </Link>
        <Link to="/admin/products" className="admin-stat-card-color purple" title="View all products">
          <div className="admin-stat-color-head">
            <BoxIcon width="18" height="18" />
            <span>Products</span>
          </div>
          <p className="admin-stat-color-value">{products.length}</p>
          <p className="admin-stat-color-sub">{outOfStock.length} out of stock</p>
        </Link>
        <Link to="/admin/orders?status=Delivered" className="admin-stat-card-color green" title="View delivered orders">
          <div className="admin-stat-color-head">
            <CheckCircleIcon width="18" height="18" />
            <span>Delivered</span>
          </div>
          <p className="admin-stat-color-value">{delivered}</p>
          <p className="admin-stat-color-sub">{inTransit} in transit</p>
        </Link>
      </div>

      <div className="admin-panel">
        <p className="admin-panel-title">Orders by status</p>
        <div className="admin-filter-pills">
          <Link to="/admin/orders" className="admin-filter-pill neutral">All: {ordersList.length}</Link>
          {ORDER_STATUSES.map((s) => (
            <Link
              key={s}
              to={`/admin/orders?status=${encodeURIComponent(s)}`}
              className={`admin-filter-pill ${STATUS_CLASS[s] ?? ''}`}
            >
              {s}: {ordersList.filter((o) => o.status === s).length}
            </Link>
          ))}
        </div>
      </div>

      <div className="admin-panel" style={{ padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px 8px' }}>
          <p className="admin-panel-title" style={{ marginBottom: 0 }}>Recent Orders</p>
          <Link to="/admin/orders" style={{ fontSize: '0.82rem', fontWeight: 600 }}>View all</Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Update</th></tr></thead>
            <tbody>
              {orders === null && (
                <tr><td colSpan={5}>Loading orders…</td></tr>
              )}
              {orders !== null && ordersList.length === 0 && (
                <tr><td colSpan={5}>No orders yet.</td></tr>
              )}
              {ordersList.slice(0, 6).map((o) => (
                <tr key={o.id} className="admin-row-clickable" onClick={() => navigate('/admin/orders', { state: { openOrderId: o.id } })}>
                  <td><strong>{o.id.slice(0, 8).toUpperCase()}</strong></td>
                  <td>{o.customerName ?? '—'}</td>
                  <td>₹{o.total}</td>
                  <td><span className={`admin-status-pill ${STATUS_CLASS[o.status] ?? ''}`}>{o.status}</span></td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <select className="admin-status-select" value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)}>
                      {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-panel">
        <p className="admin-panel-title">Top rated products</p>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Product</th><th>Category</th><th>Rating</th><th>Price</th></tr></thead>
            <tbody>
              {bestSellers.map((p) => (
                <tr key={p.id} className="admin-row-clickable" onClick={() => navigate('/admin/products', { state: { openProductId: p.id } })}>
                  <td><div className="admin-cell-name"><img src={p.image} alt="" className="admin-thumb" />{p.name}</div></td>
                  <td>{p.categoryLabel}</td>
                  <td>{p.rating.toFixed(1)}</td>
                  <td>₹{p.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {outOfStock.length > 0 && (
        <div className="admin-panel">
          <p className="admin-panel-title">Out of stock ({outOfStock.length})</p>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Product</th><th>Category</th><th></th></tr></thead>
              <tbody>
                {outOfStock.slice(0, 8).map((p) => (
                  <tr key={p.id} className="admin-row-clickable" onClick={() => navigate('/admin/products', { state: { openProductId: p.id } })}>
                    <td><div className="admin-cell-name"><img src={p.image} alt="" className="admin-thumb" />{p.name}</div></td>
                    <td>{p.categoryLabel}</td>
                    <td onClick={(e) => e.stopPropagation()}><Link to="/admin/inventory" className="admin-btn admin-btn-ghost admin-btn-sm">Restock</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
