import { useMemo, useState } from 'react';
import { useAdminData } from '../AdminDataContext';
import { EditIcon } from '../adminIcons';
import ImageField from '../ImageField';

const BLANK_CATEGORY = { label: '', tagline: '', image: '' };

function CategoryAddModal({ onClose, onSave }) {
  const [form, setForm] = useState(BLANK_CATEGORY);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.label.trim()) { setError('Category name is required.'); return; }
    try {
      await onSave(form);
    } catch (err) {
      setError(err.message || 'Could not add category.');
    }
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <form className="admin-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="admin-modal-head">
          <h3>Add category</h3>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="admin-form-grid">
          <div className="admin-field span-2">
            <label htmlFor="cf-new-label">Label</label>
            <input id="cf-new-label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
          </div>
          <div className="admin-field span-2">
            <label htmlFor="cf-new-tagline">Tagline</label>
            <input id="cf-new-tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          </div>
          <ImageField id="cf-new-image" label="Image / banner" value={form.image} onChange={(v) => setForm({ ...form, image: v })} spanTwo />
        </div>
        {error && <p className="auth-error">{error}</p>}
        <div className="admin-modal-actions">
          <button type="button" className="admin-btn admin-btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="admin-btn admin-btn-primary" style={{ width: 'auto' }}>Add category</button>
        </div>
      </form>
    </div>
  );
}

function CategoryEditModal({ category, onClose, onSave }) {
  const [form, setForm] = useState({ label: category.label, tagline: category.tagline, image: category.image });

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <form className="admin-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="admin-modal-head">
          <h3>Edit category</h3>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="admin-form-grid">
          <div className="admin-field span-2">
            <label htmlFor="cf-label">Label</label>
            <input id="cf-label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
          </div>
          <div className="admin-field span-2">
            <label htmlFor="cf-tagline">Tagline</label>
            <input id="cf-tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          </div>
          <ImageField id="cf-image" label="Image / banner" value={form.image} onChange={(v) => setForm({ ...form, image: v })} spanTwo />
        </div>
        <div className="admin-modal-actions">
          <button type="button" className="admin-btn admin-btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="admin-btn admin-btn-primary" style={{ width: 'auto' }}>Save changes</button>
        </div>
      </form>
    </div>
  );
}

function AdminCategories() {
  const { categories, updateCategory, addCategory, deleteCategory, products } = useAdminData();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);

  const countByCategory = useMemo(() => {
    const counts = new Map();
    products.forEach((p) => counts.set(p.category, (counts.get(p.category) ?? 0) + 1));
    return counts;
  }, [products]);

  const filtered = query.trim()
    ? categories.filter((c) => c.label.toLowerCase().includes(query.trim().toLowerCase()))
    : categories;

  async function handleDelete(c) {
    const count = countByCategory.get(c.slug) ?? 0;
    if (count > 0) {
      alert(`Can't remove "${c.label}" - ${count} product(s) still use it. Reassign or delete those products first.`);
      return;
    }
    if (!confirm(`Remove category "${c.label}"? This can't be undone.`)) return;
    await deleteCategory(c.slug);
  }

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Categories</h1>
          <p className="admin-page-sub">{categories.length} categories and subcategories.</p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" style={{ width: 'auto' }} onClick={() => setAdding(true)}>
          + Add category
        </button>
      </div>

      <div className="admin-toolbar">
        <input className="admin-search" placeholder="Search categories…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="admin-panel" style={{ padding: 0 }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Category</th><th>Slug</th><th>Products</th><th></th></tr></thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.slug} className="admin-row-clickable" onClick={() => setEditing(c)}>
                  <td>
                    <div className="admin-cell-name">
                      <img src={c.image} alt="" className="admin-thumb" />
                      {c.label}
                    </div>
                  </td>
                  <td><code style={{ fontSize: '0.78rem' }}>{c.slug}</code></td>
                  <td>{countByCategory.get(c.slug) ?? 0}</td>
                  <td onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: 8 }}>
                    <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setEditing(c)}>
                      <EditIcon width="14" height="14" /> Edit
                    </button>
                    <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => handleDelete(c)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4}>No categories match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <CategoryEditModal
          category={editing}
          onClose={() => setEditing(null)}
          onSave={(patch) => { updateCategory(editing.slug, patch); setEditing(null); }}
        />
      )}

      {adding && (
        <CategoryAddModal
          onClose={() => setAdding(false)}
          onSave={async (form) => { await addCategory(form); setAdding(false); }}
        />
      )}
    </div>
  );
}

export default AdminCategories;
