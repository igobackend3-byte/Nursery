import { useMemo, useState } from 'react';
import { useAdminData } from '../AdminDataContext';

function AdminInventory() {
  const { products, updateProduct } = useAdminData();
  const [query, setQuery] = useState('');
  const [onlyLow, setOnlyLow] = useState(false);

  const rows = useMemo(() => {
    let list = products;
    if (onlyLow) list = list.filter((p) => p.availability === 'Out of Stock');
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q));
    return list;
  }, [products, query, onlyLow]);

  const outOfStockCount = products.filter((p) => p.availability === 'Out of Stock').length;

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Inventory</h1>
          <p className="admin-page-sub">{outOfStockCount} of {products.length} products are currently out of stock.</p>
        </div>
      </div>

      <div className="admin-mock-banner">
        Stock is tracked on the product's own <code>availability</code> field for now. Once Firestore is connected,
        this moves to its own <code>inventory</code> collection with real stock counts and a low-stock threshold, as in the build plan.
      </div>

      <div className="admin-toolbar">
        <input className="admin-search" placeholder="Search products…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}>
          <input type="checkbox" checked={onlyLow} onChange={(e) => setOnlyLow(e.target.checked)} />
          Out of stock only
        </label>
      </div>

      <div className="admin-panel" style={{ padding: 0 }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Product</th><th>Category</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {rows.slice(0, 200).map((p) => {
                const outOfStock = p.availability === 'Out of Stock';
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="admin-cell-name">
                        <img src={p.image} alt="" className="admin-thumb" />
                        {p.name}
                      </div>
                    </td>
                    <td>{p.categoryLabel}</td>
                    <td>
                      <span className={`admin-pill ${outOfStock ? 'out-stock' : 'in-stock'}`}>
                        {p.availability ?? 'In Stock'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        onClick={() => updateProduct(p.id, { availability: outOfStock ? 'In Stock' : 'Out of Stock' })}
                      >
                        Mark {outOfStock ? 'in stock' : 'out of stock'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <div className="admin-empty"><strong>Nothing matches</strong></div>}
      </div>
    </div>
  );
}

export default AdminInventory;
