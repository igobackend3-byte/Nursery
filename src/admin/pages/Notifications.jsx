import { useEffect, useMemo, useState } from 'react';
import {
  subscribeAllAnnouncements, addAnnouncement, updateAnnouncement,
  deleteAnnouncement, toggleAnnouncementEnabled, PRIORITIES,
} from '../../lib/announcements';
import { NOTIFICATION_CATEGORIES, NOTIFICATION_CATEGORY_ICONS } from '../../lib/notifications';
import { EditIcon, TrashIcon, PlusIcon } from '../adminIcons';

const BLANK = {
  category: 'offers', title: '', message: '', icon: '', actionUrl: '', actionLabel: '',
  priority: 'normal', enabled: true, scheduledAt: '', expiresAt: '',
};

function toInputDateTime(ts) {
  const date = ts?.toDate?.();
  if (!date) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function AnnouncementForm({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      setError('Title and message are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave(form);
    } catch (err) {
      setError('Could not save this notification. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <form className="admin-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="admin-modal-head">
          <h3>{initial.id ? 'Edit notification' : 'New notification'}</h3>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="nf-category">Category</label>
            <select id="nf-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {NOTIFICATION_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="nf-priority">Priority</label>
            <select id="nf-priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
          </div>

          <div className="admin-field span-2">
            <label htmlFor="nf-title">Title</label>
            <input id="nf-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. New Offer Available" required />
          </div>

          <div className="admin-field span-2">
            <label htmlFor="nf-message">Message</label>
            <textarea id="nf-message" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="e.g. Get 20% off on selected fresh vegetables. Shop now." required />
          </div>

          <div className="admin-field">
            <label htmlFor="nf-icon">Icon (emoji, optional)</label>
            <input id="nf-icon" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder={NOTIFICATION_CATEGORY_ICONS[form.category]} maxLength={4} />
          </div>
          <div className="admin-field">
            <label htmlFor="nf-action-label">CTA button label (optional)</label>
            <input id="nf-action-label" value={form.actionLabel} onChange={(e) => setForm({ ...form, actionLabel: e.target.value })} placeholder="Shop Now" />
          </div>

          <div className="admin-field span-2">
            <label htmlFor="nf-action-url">CTA link (optional, e.g. /category/indoor-plants or /offers)</label>
            <input id="nf-action-url" value={form.actionUrl} onChange={(e) => setForm({ ...form, actionUrl: e.target.value })} placeholder="/offers" />
          </div>

          <div className="admin-field">
            <label htmlFor="nf-scheduled">Send at (blank = immediately)</label>
            <input id="nf-scheduled" type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
          </div>
          <div className="admin-field">
            <label htmlFor="nf-expires">Expires at (optional)</label>
            <input id="nf-expires" type="datetime-local" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
          </div>

          <div className="admin-field span-2">
            <label className="admin-checkbox-label">
              <input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} />
              Enabled (visible to customers immediately once its send time passes)
            </label>
          </div>
        </div>

        {error && <p className="acc-error">{error}</p>}

        <div className="admin-modal-actions">
          <button type="button" className="admin-btn admin-btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save notification'}</button>
        </div>
      </form>
    </div>
  );
}

function AdminNotifications() {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null); // null | 'new' | announcement

  useEffect(() => subscribeAllAnnouncements(setItems), []);

  const stats = useMemo(() => {
    const list = items ?? [];
    const now = Date.now();
    const expired = list.filter((a) => a.expiresAt?.toMillis?.() && a.expiresAt.toMillis() < now).length;
    const active = list.filter((a) => {
      if (!a.enabled) return false;
      const scheduledMs = a.scheduledAt?.toMillis?.() ?? 0;
      const expiresMs = a.expiresAt?.toMillis?.();
      return scheduledMs <= now && (!expiresMs || expiresMs >= now);
    }).length;
    return { total: list.length, active, expired, disabled: list.filter((a) => !a.enabled).length };
  }, [items]);

  async function handleSave(form) {
    const payload = {
      ...form,
      scheduledAt: form.scheduledAt || null,
      expiresAt: form.expiresAt || null,
    };
    if (editing?.id) {
      await updateAnnouncement(editing.id, payload);
    } else {
      await addAnnouncement(payload);
    }
    setEditing(null);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this notification permanently?')) return;
    await deleteAnnouncement(id);
  }

  function startEdit(item) {
    setEditing(item ?? 'new');
  }

  const formInitial = editing && editing !== 'new'
    ? { ...editing, scheduledAt: toInputDateTime(editing.scheduledAt), expiresAt: toInputDateTime(editing.expiresAt) }
    : BLANK;

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Notifications</h1>
          <p className="admin-page-sub">Broadcast notifications shown to every signed-in customer's notification bell.</p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" style={{ width: 'auto' }} onClick={() => startEdit(null)}>
          <PlusIcon width="14" height="14" /> New notification
        </button>
      </div>

      <div className="admin-stat-grid-color">
        <div className="admin-stat-card-color blue"><div className="admin-stat-color-head"><span>Total</span></div><p className="admin-stat-color-value">{stats.total}</p></div>
        <div className="admin-stat-card-color green"><div className="admin-stat-color-head"><span>Active</span></div><p className="admin-stat-color-value">{stats.active}</p></div>
        <div className="admin-stat-card-color purple"><div className="admin-stat-color-head"><span>Disabled</span></div><p className="admin-stat-color-value">{stats.disabled}</p></div>
        <div className="admin-stat-card-color green"><div className="admin-stat-color-head"><span>Expired</span></div><p className="admin-stat-color-value">{stats.expired}</p></div>
      </div>

      <div className="admin-panel" style={{ padding: 0, marginTop: 20 }}>
        {items === null ? (
          <div className="admin-empty"><strong>Loading notifications…</strong></div>
        ) : items.length === 0 ? (
          <div className="admin-empty"><strong>No notifications created yet.</strong></div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Notification</th><th>Category</th><th>Priority</th><th>Status</th><th>Send at</th><th></th></tr></thead>
              <tbody>
                {items.map((a) => {
                  const now = Date.now();
                  const scheduledMs = a.scheduledAt?.toMillis?.() ?? 0;
                  const expiresMs = a.expiresAt?.toMillis?.();
                  const isExpired = expiresMs && expiresMs < now;
                  const isPending = scheduledMs > now;
                  const statusLabel = !a.enabled ? 'Disabled' : isExpired ? 'Expired' : isPending ? 'Scheduled' : 'Active';
                  return (
                    <tr key={a.id}>
                      <td>
                        <div className="admin-cell-name">
                          <span style={{ fontSize: '1.2rem' }}>{a.icon}</span>
                          <div>
                            <strong>{a.title}</strong>
                            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--admin-muted)' }}>{a.message}</p>
                          </div>
                        </div>
                      </td>
                      <td>{a.category}</td>
                      <td>{a.priority}</td>
                      <td>
                        <span className={`admin-status-pill ${statusLabel === 'Active' ? 'delivered' : statusLabel === 'Expired' ? 'cancelled' : statusLabel === 'Disabled' ? '' : 'confirmed'}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td>{a.scheduledAt?.toDate?.().toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) ?? 'Immediately'}</td>
                      <td onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: 8 }}>
                        <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => toggleAnnouncementEnabled(a.id, !a.enabled)}>
                          {a.enabled ? 'Disable' : 'Enable'}
                        </button>
                        <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => startEdit(a)}>
                          <EditIcon width="14" height="14" />
                        </button>
                        <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => handleDelete(a.id)}>
                          <TrashIcon width="14" height="14" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && <AnnouncementForm initial={formInitial} onClose={() => setEditing(null)} onSave={handleSave} />}
    </div>
  );
}

export default AdminNotifications;
