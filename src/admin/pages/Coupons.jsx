import { useState } from 'react';
import { useAdminData } from '../AdminDataContext';
import { TrashIcon } from '../adminIcons';

function AdminCoupons() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useAdminData();
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState(10);
  const [expiresOn, setExpiresOn] = useState('');

  function handleAdd(e) {
    e.preventDefault();
    if (!code.trim()) return;
    addCoupon({ code: code.trim().toUpperCase(), discountPercent: Number(discount), active: true, expiresOn });
    setCode(''); setDiscount(10); setExpiresOn('');
  }

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Coupons</h1>
          <p className="admin-page-sub">{coupons.length} discount codes.</p>
        </div>
      </div>

      <div className="admin-mock-banner">
        Local preview - a real coupon needs to actually be checked at checkout, which isn't built yet either.
        This screen is ready for that once orders exist.
      </div>

      <div className="admin-panel" style={{ padding: 0 }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Code</th><th>Discount</th><th>Expires</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.code}</strong></td>
                  <td>{c.discountPercent}%</td>
                  <td>{c.expiresOn || '—'}</td>
                  <td>
                    <span className={`admin-pill ${c.active ? 'in-stock' : 'out-stock'}`}>{c.active ? 'Active' : 'Disabled'}</span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => updateCoupon(c.id, { active: !c.active })}>
                        {c.active ? 'Disable' : 'Enable'}
                      </button>
                      <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => deleteCoupon(c.id)}>
                        <TrashIcon width="14" height="14" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-panel">
        <p className="admin-panel-title">Create coupon</p>
        <form onSubmit={handleAdd} className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="cp-code">Code</label>
            <input id="cp-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="WELCOME10" required />
          </div>
          <div className="admin-field">
            <label htmlFor="cp-discount">Discount %</label>
            <input id="cp-discount" type="number" min="1" max="100" value={discount} onChange={(e) => setDiscount(e.target.value)} required />
          </div>
          <div className="admin-field">
            <label htmlFor="cp-expiry">Expires on</label>
            <input id="cp-expiry" type="date" value={expiresOn} onChange={(e) => setExpiresOn(e.target.value)} />
          </div>
          <div className="admin-field span-2">
            <button type="submit" className="admin-btn admin-btn-primary" style={{ width: 'auto' }}>Add coupon</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminCoupons;
