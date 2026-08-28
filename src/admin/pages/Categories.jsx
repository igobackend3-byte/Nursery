import { useMemo, useState } from 'react';
import { useAdminData } from '../AdminDataContext';
import { EditIcon } from '../adminIcons';
import ImageField from '../ImageField';

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
  const { categories, updateCategory, products } = useAdminData();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);

  const countByCategory = useMemo(() => {
    const counts = new Map();
    products.forEach((p) => counts.set(p.category, (counts.get(p.category) ?? 0) + 1));
    return counts;
  }, [products]);

  const filtered = query.trim()
    ? categories.filter((c) => c.label.toLowerCase().includes(query.trim().toLowerCase()))
    : categories;

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Categories</h1>
          <p className="admin-page-sub">{categories.length} categories and subcategories.</p>
        </div>
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
                  <td onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setEditing(c)}>
                      <EditIcon width="14" height="14" /> Edit
                    </button>
                  </td>
                </tr>
              ))}
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
    </div>
  );
}

export default AdminCategories;
