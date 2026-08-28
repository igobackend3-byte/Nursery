import { useState } from 'react';
import { useAdminData } from '../AdminDataContext';

function AdminSettings() {
  const { settings, setSettings } = useAdminData();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSettings(form);
    setSaved(true);
  }

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Settings</h1>
          <p className="admin-page-sub">Site-wide contact details and links.</p>
        </div>
      </div>

      <form className="admin-panel" onSubmit={handleSubmit}>
        <p className="admin-panel-title">Contact information</p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="s-email">Contact email</label>
            <input id="s-email" type="email" value={form.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} />
          </div>
          <div className="admin-field">
            <label htmlFor="s-phone">Contact phone</label>
            <input id="s-phone" value={form.contactPhone} onChange={(e) => set('contactPhone', e.target.value)} />
          </div>
          <div className="admin-field span-2">
            <label htmlFor="s-address">Address</label>
            <input id="s-address" value={form.address} onChange={(e) => set('address', e.target.value)} />
          </div>
          <div className="admin-field">
            <label htmlFor="s-insta">Instagram URL</label>
            <input id="s-insta" value={form.instagram} onChange={(e) => set('instagram', e.target.value)} placeholder="https://instagram.com/…" />
          </div>
          <div className="admin-field">
            <label htmlFor="s-fb">Facebook URL</label>
            <input id="s-fb" value={form.facebook} onChange={(e) => set('facebook', e.target.value)} placeholder="https://facebook.com/…" />
          </div>
        </div>
        <div className="admin-modal-actions" style={{ justifyContent: 'flex-start', border: 'none', paddingTop: '8px' }}>
          <button type="submit" className="admin-btn admin-btn-primary" style={{ width: 'auto' }}>Save settings</button>
          {saved && <span style={{ fontSize: '0.82rem', color: 'var(--admin-primary)' }}>Saved for this session.</span>}
        </div>
      </form>
    </div>
  );
}

export default AdminSettings;
