import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAdminData } from '../AdminDataContext';
import { EditIcon, TrashIcon, PlusIcon } from '../adminIcons';
import ImageField, { MultiImageField, VideoField } from '../ImageField';
import { LANGUAGES } from '../../i18n/translations';

const BLANK_PRODUCT = {
  name: '', category: '', price: '', originalPrice: '', availability: 'In Stock', image: '', images: [], video: '',
};

// Languages the admin can enter real translated content for - every
// language except English, which is always the base `name`/`description`
// field above. See src/utils/localizedContent.js for how the storefront
// reads these (falls back to English whenever a language is left blank).
const TRANSLATABLE_LANGUAGES = LANGUAGES.filter((l) => l.code !== 'en');

function TranslationsFields({ translations, onChange }) {
  const [open, setOpen] = useState(false);

  function setLang(code, field, value) {
    onChange({
      ...translations,
      [code]: { ...translations[code], [field]: value },
    });
  }

  return (
    <div className="admin-field span-2">
      <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setOpen((v) => !v)}>
        {open ? '▾' : '▸'} Translations (optional - shown to customers who select that language; English is the fallback when left blank)
      </button>
      {open && (
        <div className="admin-translations-grid">
          {TRANSLATABLE_LANGUAGES.map((lang) => (
            <div className="admin-translation-row" key={lang.code}>
              <span className="admin-translation-lang">{lang.label}</span>
              <input
                placeholder="Name"
                value={translations[lang.code]?.name ?? ''}
                onChange={(e) => setLang(lang.code, 'name', e.target.value)}
              />
              <input
                placeholder="Description"
                value={translations[lang.code]?.description ?? ''}
                onChange={(e) => setLang(lang.code, 'description', e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Shared by both "Add product" (product === null) and "Edit product". The
// category is a real dropdown tied to categories.slug, not free text - so a
// new product's categoryLabel/category always match a real category and it
// actually shows up filtered correctly on the storefront/Inventory/Categories pages.
function ProductFormModal({ product, categories, onClose, onSave }) {
  const isNew = !product;
  const [form, setForm] = useState({
    name: product?.name ?? BLANK_PRODUCT.name,
    price: product?.price ?? BLANK_PRODUCT.price,
    originalPrice: product?.originalPrice ?? BLANK_PRODUCT.originalPrice,
    category: product?.category ?? categories[0]?.slug ?? '',
    availability: product?.availability ?? BLANK_PRODUCT.availability,
    image: product?.image ?? BLANK_PRODUCT.image,
    images: product?.images ?? BLANK_PRODUCT.images,
    video: product?.video ?? BLANK_PRODUCT.video,
    translations: product?.translations ?? {},
  });

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const category = categories.find((c) => c.slug === form.category);
    onSave({
      ...form,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice) || Number(form.price),
      categoryLabel: category?.label ?? form.category,
    });
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <form className="admin-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="admin-modal-head">
          <h3>{isNew ? 'Add product' : 'Edit product'}</h3>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="admin-form-grid">
          <div className="admin-field span-2">
            <label htmlFor="pf-name">Name</label>
            <input id="pf-name" value={form.name} onChange={(e) => set('name', e.target.value)} required />
          </div>
          <div className="admin-field">
            <label htmlFor="pf-price">Price (₹)</label>
            <input id="pf-price" type="number" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} required />
          </div>
          <div className="admin-field">
            <label htmlFor="pf-original">Original price (₹)</label>
            <input id="pf-original" type="number" min="0" value={form.originalPrice} onChange={(e) => set('originalPrice', e.target.value)} placeholder="Same as price if left blank" />
          </div>
          <div className="admin-field span-2">
            <label htmlFor="pf-category">Category</label>
            <select id="pf-category" value={form.category} onChange={(e) => set('category', e.target.value)} required>
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="pf-availability">Availability</label>
            <select id="pf-availability" value={form.availability} onChange={(e) => set('availability', e.target.value)}>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
          <ImageField id="pf-image" label="Main product image" value={form.image} onChange={(v) => set('image', v)} spanTwo />
          <MultiImageField id="pf-gallery" label="Extra gallery photos" values={form.images} onChange={(v) => set('images', v)} />
          <VideoField id="pf-video" label="Product video (optional)" value={form.video} onChange={(v) => set('video', v)} />
          <TranslationsFields translations={form.translations} onChange={(v) => set('translations', v)} />
        </div>
        <div className="admin-modal-actions">
          <button type="button" className="admin-btn admin-btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="admin-btn admin-btn-primary" style={{ width: 'auto' }}>
            {isNew ? 'Add product' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

// "Frequently bought together" combo-offer control. Any product can be the
// offer product; it's meant to be shown alongside whichever product a
// customer is currently viewing, at a % off the combined price. This panel
// only manages the setting - it doesn't render on the storefront yet (that's
// a separate, storefront-side change).
function ComboOfferPanel({ products, comboOffer, setComboOffer }) {
  const [productId, setProductId] = useState(comboOffer.productId ?? products[0]?.id ?? '');
  const [discountPercent, setDiscountPercent] = useState(comboOffer.discountPercent ?? 10);

  const offerProduct = products.find((p) => p.id === productId);

  function save() {
    setComboOffer({ productId, discountPercent: Number(discountPercent) || 0, active: true });
  }

  function turnOff() {
    setComboOffer((prev) => ({ ...prev, active: false }));
  }

  return (
    <div className="admin-combo-panel">
      <p className="admin-combo-title">✨ Frequently Bought Together — Daily Combo Offer</p>
      <p className="admin-combo-desc">
        Pick one <strong>offer product</strong> and a <strong>discount %</strong>. It shows alongside <strong>every</strong> product
        the customer views - no need to choose a main product. The combo price = (that product's price + offer product's
        price) − your %. Change the % any morning to run a fresh daily deal.
      </p>
      <div className="admin-combo-row">
        <select className="admin-combo-select" value={productId} onChange={(e) => setProductId(e.target.value)}>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name} — ₹{p.price}</option>)}
        </select>
        <div className="admin-combo-percent">
          <input
            type="number" min="0" max="90" value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
          />
          <span>% OFF</span>
        </div>
      </div>
      <div className="admin-combo-actions">
        <button type="button" className="admin-btn admin-btn-primary" style={{ width: 'auto' }} onClick={save}>
          Save / Update Offer
        </button>
        <button type="button" className="admin-combo-turnoff" onClick={turnOff}>Turn Off</button>
        {comboOffer.active && offerProduct && (
          <span className="admin-combo-live">
            Live: any product + {offerProduct.name} at {comboOffer.discountPercent}% off the combined price
          </span>
        )}
        {!comboOffer.active && <span className="admin-combo-off">Offer is currently off</span>}
      </div>
    </div>
  );
}

function AdminProducts() {
  const { products, categories, updateProduct, deleteProduct, addProduct, comboOffer, setComboOffer, syncBuiltInTranslations } = useAdminData();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState('');

  async function handleSyncTranslations() {
    setSyncing(true);
    setSyncResult('');
    try {
      const { matched } = await syncBuiltInTranslations();
      setSyncResult(matched > 0
        ? `Synced Tamil/Hindi/Malayalam/Telugu/Kannada names for ${matched} product${matched === 1 ? '' : 's'}.`
        : 'No matching built-in translations found for the current catalogue.');
    } catch (err) {
      setSyncResult(`Sync failed: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.categoryLabel.toLowerCase().includes(q));
  }, [products, query]);

  // Arriving from a Dashboard row click opens that product's edit modal directly.
  useEffect(() => {
    const openId = location.state?.openProductId;
    if (openId != null) {
      const match = products.find((p) => p.id === openId);
      if (match) setEditing(match);
    }
  }, [location.state, products]);

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Product Catalog ({products.length} items)</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            className="admin-search"
            style={{ maxWidth: 240 }}
            placeholder="Search products…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" className="admin-btn admin-btn-ghost" style={{ width: 'auto' }} onClick={handleSyncTranslations} disabled={syncing}>
            {syncing ? 'Syncing…' : 'Sync Built-in Translations'}
          </button>
          <button type="button" className="admin-btn admin-btn-primary" style={{ width: 'auto' }} onClick={() => setAdding(true)}>
            <PlusIcon width="15" height="15" /> Add Product
          </button>
        </div>
      </div>

      <div className="admin-mock-banner">
        Products &amp; categories are Firestore-backed - edits here save permanently. Product images/gallery/video
        still upload as data URLs (Firebase Storage isn't enabled yet).
      </div>
      <div className="admin-mock-banner">
        <strong>Sync Built-in Translations</strong> fills in the Tamil/Hindi/Malayalam/Telugu/Kannada product
        <em> name</em> for every product that has a matching entry in the codebase's built-in translation list -
        no manual per-product typing needed. It never overwrites a translation you've already entered by hand for
        a product, and never touches price/stock/description/anything else. Safe to click again any time more
        built-in translations are added.
        {syncResult && <div style={{ marginTop: 8, fontWeight: 600 }}>{syncResult}</div>}
      </div>

      <ComboOfferPanel products={products} comboOffer={comboOffer} setComboOffer={setComboOffer} />

      <div className="admin-panel" style={{ padding: 0, marginTop: 20 }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th><th>Product</th><th>Category</th><th>Brand</th><th>Price</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 200).map((p) => (
                <tr key={p.id} className="admin-row-clickable" onClick={() => setEditing(p)}>
                  <td><img src={p.image} alt="" className="admin-thumb" /></td>
                  <td>
                    <div className="admin-cell-stack">
                      <strong>{p.name}</strong>
                      <span className="admin-cell-sub">SKU: {p.id}</span>
                    </div>
                  </td>
                  <td>{p.categoryLabel}</td>
                  <td><span className="admin-brand-tag">IGO Nursery</span></td>
                  <td>
                    <div className="admin-cell-stack">
                      <strong>₹{p.price}</strong>
                      {p.originalPrice > p.price && <span className="admin-cell-strike">₹{p.originalPrice}</span>}
                    </div>
                  </td>
                  <td>
                    <span className={`admin-pill ${p.availability === 'Out of Stock' ? 'out-stock' : 'in-stock'}`}>
                      {p.availability ?? 'In Stock'}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="admin-row-actions">
                      <button type="button" className="admin-icon-btn" title="Edit" onClick={() => setEditing(p)}>
                        <EditIcon width="15" height="15" />
                      </button>
                      <button
                        type="button"
                        className="admin-icon-btn danger"
                        title="Delete"
                        onClick={() => { if (confirm(`Remove "${p.name}"?`)) deleteProduct(p.id); }}
                      >
                        <TrashIcon width="15" height="15" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="admin-empty"><strong>No products match "{query}"</strong></div>
        )}
        {filtered.length > 200 && (
          <p style={{ padding: '12px 16px', fontSize: '0.78rem', color: 'var(--admin-muted)' }}>
            Showing first 200 of {filtered.length} matches - narrow your search to see more.
          </p>
        )}
      </div>

      {editing && (
        <ProductFormModal
          product={editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSave={(patch) => { updateProduct(editing.id, patch); setEditing(null); }}
        />
      )}

      {adding && (
        <ProductFormModal
          product={null}
          categories={categories}
          onClose={() => setAdding(false)}
          onSave={(patch) => { addProduct(patch); setAdding(false); }}
        />
      )}
    </div>
  );
}

export default AdminProducts;
