import { useMemo } from 'react';
import { useAdminData } from '../AdminDataContext';

function AdminReports() {
  const { products, orders } = useAdminData();

  const byCategory = useMemo(() => {
    const counts = new Map();
    products.forEach((p) => counts.set(p.categoryLabel, (counts.get(p.categoryLabel) ?? 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [products]);

  const priceBands = useMemo(() => {
    const bands = [
      { label: 'Under ₹200', min: 0, max: 200 },
      { label: '₹200 – ₹500', min: 200, max: 500 },
      { label: '₹500 – ₹1,000', min: 500, max: 1000 },
      { label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
      { label: 'Above ₹2,000', min: 2000, max: Infinity },
    ];
    return bands.map((b) => ({ ...b, count: products.filter((p) => p.price >= b.min && p.price < b.max).length }));
  }, [products]);

  const outOfStockPct = products.length ? Math.round((products.filter((p) => p.availability === 'Out of Stock').length / products.length) * 100) : 0;

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Reports</h1>
          <p className="admin-page-sub">Catalogue analytics computed from real product data.</p>
        </div>
      </div>

      <div className="admin-mock-banner">
        Catalogue breakdowns below are real, computed from your actual product data. Sales/revenue trend reports
        need real order history first - see the Orders page for why that's sample data right now.
      </div>

      <div className="admin-panel">
        <p className="admin-panel-title">Products by category (top 10)</p>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Category</th><th>Products</th><th></th></tr></thead>
            <tbody>
              {byCategory.map(([label, count]) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td>{count}</td>
                  <td style={{ width: '40%' }}>
                    <div style={{ background: 'var(--admin-border)', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                      <div style={{ width: `${(count / byCategory[0][1]) * 100}%`, background: 'var(--admin-primary)', height: '100%' }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-panel">
        <p className="admin-panel-title">Price distribution</p>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Range</th><th>Products</th></tr></thead>
            <tbody>
              {priceBands.map((b) => (
                <tr key={b.label}><td>{b.label}</td><td>{b.count}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <p className="admin-stat-label">Out of stock rate</p>
          <p className={`admin-stat-value${outOfStockPct > 10 ? ' warn' : ''}`}>{outOfStockPct}%</p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-stat-label">Sample orders logged</p>
          <p className="admin-stat-value">{orders.length}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminReports;
