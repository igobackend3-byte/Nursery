import { useState } from 'react';
import { useAdminData } from '../AdminDataContext';

const ROLES = [
  { value: 'super_admin', label: 'Super Admin', desc: 'Full access, can manage staff' },
  { value: 'order_manager', label: 'Order Manager', desc: 'Orders + Inventory only' },
  { value: 'content_editor', label: 'Content Editor', desc: 'Content + Categories only' },
];

function AdminStaff() {
  const { staff, setStaff } = useAdminData();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('content_editor');

  function handleAdd(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setStaff((prev) => [...prev, { id: Date.now(), name, email, role }]);
    setName(''); setEmail('');
  }

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Staff &amp; Roles</h1>
          <p className="admin-page-sub">Who can access this dashboard, and what they can touch.</p>
        </div>
      </div>

      <div className="admin-mock-banner">
        This list is local-only right now. Once Firebase Auth is connected, adding someone here will actually create
        their sign-in (build plan Phase 2/4) - for now it's a preview of the screen.
      </div>

      <div className="admin-panel">
        <p className="admin-panel-title">Current staff</p>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>
                    <span className={`admin-pill ${s.role === 'super_admin' ? 'role-super' : 'role-editor'}`}>
                      {ROLES.find((r) => r.value === s.role)?.label ?? s.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-panel">
        <p className="admin-panel-title">Invite staff</p>
        <form onSubmit={handleAdd} className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="st-name">Name</label>
            <input id="st-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="admin-field">
            <label htmlFor="st-email">Email</label>
            <input id="st-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="admin-field span-2">
            <label htmlFor="st-role">Role</label>
            <select id="st-role" value={role} onChange={(e) => setRole(e.target.value)}>
              {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label} — {r.desc}</option>)}
            </select>
          </div>
          <div className="admin-field span-2">
            <button type="submit" className="admin-btn admin-btn-primary" style={{ width: 'auto' }}>Add staff member</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminStaff;
