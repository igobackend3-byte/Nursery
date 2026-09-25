import VisualEditor from '../editor/VisualEditor';
import { useRef, useState } from 'react';
import { getSiteContent, saveSiteContent, resetSiteContent } from '../../lib/contentStore';
import { DEFAULT_SITE_CONTENT, PLANTS_NAV_CATEGORY_SLUGS } from '../../data/siteContent';
import { SECTION_HUBS } from '../../data/sectionHubs';
import { PLANT_CATEGORY_SLUGS } from '../../data/products';
import { getJustInProducts } from '../../utils/seededShuffle';
import { useAdminData } from '../AdminDataContext';
import { PlusIcon, TrashIcon } from '../adminIcons';
import ImageField, { VideoField } from '../ImageField';

// Real per-product editor: reads and writes the ACTUAL Firestore product
// document via the same updateProduct/deleteProduct/addProduct functions
// the Products admin page uses - so a change here is the same change as
// editing it there (single source of truth), it just happens without
// leaving this section's editor. `discount %` is always shown live-computed
// from price/originalPrice (matches ProductCard's own math), never a
// separately-stored value - there's nothing to "save" for it on its own.
// Hero-specific background video manager: real preview (native <video
// controls>, no autoplay-with-sound), Change/Delete with a confirm before
// delete, an explicit empty state, and a plain-text URL field kept alongside
// for admins who'd rather point at an external/local path than upload a
// file - both paths write to the same `hero.videoUrl` field. Kept local to
// the Hero editor (not merged into the shared VideoField in ImageField.jsx)
// so this doesn't change behavior for other sections that use VideoField.
const MAX_HERO_VIDEO_BYTES = 20 * 1024 * 1024;

function HeroVideoField({ value, onChange }) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');

  function pickFile() {
    setError('');
    inputRef.current?.click();
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const isMp4 = file.type === 'video/mp4' || /\.mp4$/i.test(file.name);
    if (!isMp4) {
      setError('Please choose an MP4 video file.');
      return;
    }
    if (file.size > MAX_HERO_VIDEO_BYTES) {
      setError('That video is larger than 20MB - please choose a smaller file.');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onerror = () => setError('Could not read that file - please try again.');
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  }

  function handleDelete() {
    if (!confirm('Are you sure you want to delete the current background video?')) return;
    onChange('');
  }

  const filename = value ? decodeURIComponent(value.split('/').pop().split('?')[0]) : '';

  return (
    <div className="admin-field span-2">
      <label>Background video</label>
      <div className="admin-image-field">
        {value ? (
          <>
            <video src={value} className="admin-video-field-preview" muted controls preload="metadata" />
            <p className="admin-cell-sub" style={{ marginTop: 6 }}>Current video: {filename || value}</p>
            <div className="admin-image-field-actions">
              <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={pickFile}>
                ✏ Change Video
              </button>
              <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={handleDelete}>
                🗑 Delete Video
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="admin-page-sub" style={{ margin: '4px 0 10px' }}>No background video configured.</p>
            <div className="admin-image-field-actions">
              <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" style={{ width: 'auto' }} onClick={pickFile}>
                <PlusIcon width="14" height="14" /> Add Video
              </button>
            </div>
          </>
        )}
        <input ref={inputRef} type="file" accept="video/mp4,.mp4" onChange={handleFile} style={{ display: 'none' }} />
      </div>
      {error && <p className="admin-image-field-error">{error}</p>}
      <div className="admin-field" style={{ marginTop: 12 }}>
        <label htmlFor="h-video">Or enter a video URL/path</label>
        <input id="h-video" value={value} placeholder="/videos/hero-nursery-video.mp4" onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}

function ProductEditorCard({ product, categories, onSave, onDelete, onDuplicate, onRemove, onMove, showNewBadgeToggle }) {
  const [draft, setDraft] = useState(product);
  const [savedFlash, setSavedFlash] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(product);
  const discountPercent = draft.originalPrice > draft.price
    ? Math.round(((draft.originalPrice - draft.price) / draft.originalPrice) * 100)
    : 0;

  function set(field, value) {
    setDraft((d) => ({ ...d, [field]: value }));
    setSavedFlash(false);
  }

  async function handleSaveProduct() {
    const categoryDoc = categories.find((c) => c.slug === draft.category);
    await onSave(product.id, {
      name: draft.name,
      category: draft.category,
      categoryLabel: categoryDoc?.label || draft.categoryLabel,
      price: Number(draft.price),
      originalPrice: Number(draft.originalPrice),
      rating: Number(draft.rating),
      isBestSeller: !!draft.isBestSeller,
      hideNewBadge: !!draft.hideNewBadge,
      image: draft.image,
    });
    setSavedFlash(true);
  }

  return (
    <div className="admin-cat-card">
      <div className="admin-cat-card-image">
        {draft.image ? <img src={draft.image} alt={draft.name} /> : <span className="admin-cat-card-noimage">No image</span>}
      </div>
      <ImageField id={`ppl-img-${product.id}`} label="Replace image" value={draft.image} onChange={(v) => set('image', v)} />

      <div className="admin-field">
        <label>Product name</label>
        <input value={draft.name} onChange={(e) => set('name', e.target.value)} />
      </div>
      <div className="admin-field">
        <label>Category</label>
        <select value={draft.category} onChange={(e) => set('category', e.target.value)}>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
        </select>
      </div>
      <div className="admin-cat-card-row">
        <div className="admin-field" style={{ flex: 1 }}>
          <label>Current price (₹)</label>
          <input type="number" min="0" value={draft.price} onChange={(e) => set('price', e.target.value)} />
        </div>
        <div className="admin-field" style={{ flex: 1 }}>
          <label>Original price (₹)</label>
          <input type="number" min="0" value={draft.originalPrice} onChange={(e) => set('originalPrice', e.target.value)} />
        </div>
      </div>
      <p className="admin-cell-sub">Discount (auto-calculated): {discountPercent > 0 ? `${discountPercent}% OFF` : 'No discount'}</p>
      <div className="admin-cat-card-row">
        <div className="admin-field" style={{ flex: 1 }}>
          <label>Rating (out of 5)</label>
          <input type="number" min="0" max="5" step="0.1" value={draft.rating} onChange={(e) => set('rating', e.target.value)} />
        </div>
        <div className="admin-field" style={{ flex: 1 }}>
          <label>Bestseller badge</label>
          <select value={draft.isBestSeller ? 'yes' : 'no'} onChange={(e) => set('isBestSeller', e.target.value === 'yes')}>
            <option value="no">Off</option>
            <option value="yes">On</option>
          </select>
        </div>
      </div>
      {showNewBadgeToggle && (
        <div className="admin-field">
          <label>"NEW" badge</label>
          <select value={draft.hideNewBadge ? 'off' : 'on'} onChange={(e) => set('hideNewBadge', e.target.value === 'off')}>
            <option value="on">On</option>
            <option value="off">Off</option>
          </select>
        </div>
      )}

      <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" style={{ width: '100%' }} onClick={handleSaveProduct} disabled={!dirty && !savedFlash}>
        {savedFlash && !dirty ? 'Saved ✓' : 'Save product'}
      </button>

      <div className="admin-cat-card-row" style={{ marginTop: 4 }}>
        <button type="button" className="admin-icon-btn" onClick={() => onMove(-1)} aria-label="Move up">↑</button>
        <button type="button" className="admin-icon-btn" onClick={() => onMove(1)} aria-label="Move down">↓</button>
        <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" style={{ flex: 1 }} onClick={onDuplicate}>Duplicate</button>
      </div>
      <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" style={{ width: '100%' }} onClick={onRemove}>
        Remove from this section
      </button>
      <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" style={{ width: '100%' }} onClick={onDelete}>
        <TrashIcon width="14" height="14" /> Delete product entirely
      </button>
    </div>
  );
}

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Per-section action row: Save writes the whole content object (the store
// is one document today), Publish is the same action under the label the
// spec asks for (there's no separate draft/live state to distinguish),
// Preview opens the live homepage, Reset reverts just this one section back
// to its shipped default, Cancel reloads from the last saved copy so
// in-progress edits on this section are discarded without touching others.
function SectionActions({ onSave, onPublish, onReset, onCancel }) {
  return (
    <div className="admin-section-actions">
      <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={onCancel}>Cancel</button>
      <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={onReset}>Reset section</button>
      <a href="/" target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-ghost admin-btn-sm">Preview site</a>
      <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" style={{ width: 'auto' }} onClick={onSave}>Save changes</button>
      <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" style={{ width: 'auto' }} onClick={onPublish}>Publish</button>
    </div>
  );
}

function ListEditor({ title, hint, items, itemFields, onChange, newItem }) {
  function updateItem(id, field, value) {
    onChange(items.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  }
  function removeItem(id) {
    onChange(items.filter((it) => it.id !== id));
  }
  function addItem() {
    const nextId = Math.max(0, ...items.map((it) => it.id)) + 1;
    onChange([...items, { ...newItem, id: nextId }]);
  }

  return (
    <div className="admin-panel">
      <p className="admin-panel-title">{title} ({items.length})</p>
      {hint && <p className="admin-page-sub" style={{ marginTop: '-10px', marginBottom: '16px' }}>{hint}</p>}
      {items.map((item) => (
        <div key={item.id} style={{ borderBottom: '1px solid var(--admin-border)', padding: '16px 0' }}>
          <div className="admin-form-grid">
            {itemFields.map((f) => (
              f.type === 'image' ? (
                <ImageField
                  key={f.key}
                  id={`${title}-${item.id}-${f.key}`}
                  label={f.label}
                  value={item[f.key] ?? ''}
                  onChange={(v) => updateItem(item.id, f.key, v)}
                  spanTwo={f.span2}
                />
              ) : (
                <div className={`admin-field${f.span2 ? ' span-2' : ''}`} key={f.key}>
                  <label htmlFor={`${title}-${item.id}-${f.key}`}>{f.label}</label>
                  <input
                    id={`${title}-${item.id}-${f.key}`}
                    type={f.type ?? 'text'}
                    value={item[f.key] ?? ''}
                    onChange={(e) => updateItem(item.id, f.key, f.type === 'number' ? Number(e.target.value) : e.target.value)}
                  />
                </div>
              )
            ))}
          </div>
          <div style={{ marginTop: '10px' }}>
            <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => removeItem(item.id)}>
              <TrashIcon width="14" height="14" /> Remove
            </button>
          </div>
        </div>
      ))}
      <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" style={{ marginTop: '14px' }} onClick={addItem}>
        <PlusIcon width="14" height="14" /> Add {title.replace(/s$/, '')}
      </button>
    </div>
  );
}

// Exact homepage section order requested, matching Home.jsx's real
// component order top to bottom. `ready` sections have a real editor below
// driven by contentStore; the rest show a plain "not editable yet" note
// instead of a fake form, until each gets its own real data source.
const SECTIONS = [
  { value: 'hero', label: 'Hero Section', ready: true, live: 'Home page, very top.' },
  { value: 'ourStory', label: 'Our Story', ready: true, live: "Home page, \"Grown with data, delivered with care\" band." },
  { value: 'offers', label: 'Offers For You', ready: true, live: 'Home page bundle offer cards.' },
  { value: 'shopByCategory', label: 'Shop by Category', ready: true, live: 'Home page category circles.' },
  { value: 'homeCorners', label: 'Plants for Every Corner of Your Home', ready: true, live: 'Home page room-corner tiles.' },
  { value: 'plantsPeopleLove', label: 'Plants People Love', ready: true, live: 'Home page product carousel.' },
  { value: 'justIn', label: 'Just In', ready: true, live: 'Home page "Just In" product strip.' },
  { value: 'completeGarden', label: 'Complete Your Garden, Not Just Your Cart', ready: true, live: 'Home page pot/media/nutrition pairing band.' },
  { value: 'gardenServices', label: 'Garden Services', ready: true, live: 'Home page service tiles + /garden-services.' },
  { value: 'nurseryJourney', label: 'From IGO Nursery to Your Home', ready: true, live: 'Home page delivery-process timeline.' },
  { value: 'whyIgo', label: 'Grown with Data, Delivered with Care', ready: true, live: 'Home page "why IGO" feature-card band.' },
  { value: 'ourStorySecondary', label: 'Our Story (Secondary Section)', ready: true, live: 'Home page, lower "Our Story" band.' },
  { value: 'comparison', label: 'How We Compare to Buying Plants Elsewhere', ready: true, live: 'Home page comparison table + trust-benefits strip.' },
  { value: 'plantFinder', label: 'Plant Finder', ready: true, live: 'Home page "not sure where to begin" band.' },
  { value: 'journal', label: 'Garden Journal', ready: true, live: 'Home page blog-post cards.' },
  { value: 'gifting', label: 'Thoughtful Gifts, Beautifully Packaged', ready: true, live: 'Home page gifting band.' },
  { value: 'newsletter', label: 'Get Growing Tips in Your Inbox', ready: true, live: 'Home page newsletter signup band.' },
  { value: 'support', label: 'Support', ready: true, live: 'Home page FAQ / support band.' },
];

// /about page's 9 real sections, top to bottom exactly as they render.
// 'hero' intentionally not listed here any more - About - Hero is now a
// flat top-level siteContent key (aboutHero) managed entirely from the
// new Visual Editor at /admin/pages/about, not from this legacy form.
// 'story' removed - About - Story is now managed entirely by the Visual
// Editor on its own flat `aboutStory` siteContent key (see
// sectionSchemas.js), same as 'hero' before it.
// 'stats', 'visionMission' and 'offer' removed - all are now managed
// entirely by the Visual Editor on their own flat siteContent keys (see
// sectionSchemas.js), same as 'hero' and 'story' before them.
const ABOUT_SECTIONS = [
  { value: 'values', label: 'Our Values' },
  { value: 'whyChoose', label: 'Why Choose Us' },
  { value: 'journey', label: 'Our Journey' },
  { value: 'finalCta', label: 'Final CTA' },
];

const ABOUT_ICON_OPTIONS = ['Leaf', 'Pot', 'Sprout', 'Users', 'Eye', 'Target', 'Watering', 'Landscape', 'Gift', 'Diamond', 'Recycle', 'Shield', 'Person', 'Truck'];

function AdminContent() {
  const { categories, products, updateProduct, deleteProduct, addProduct } = useAdminData();
  const [content, setContent] = useState(getSiteContent);
  const [saved, setSaved] = useState(false);
  const [page, setPage] = useState('home');
  const [selected, setSelected] = useState('');
  const [aboutSelected, setAboutSelected] = useState('');
  const [pplSearch, setPplSearch] = useState('');
  const [jiSearch, setJiSearch] = useState('');
  const [plantsSearch, setPlantsSearch] = useState('');
  const [hubSearch, setHubSearch] = useState('');

  // Generic helpers for the /about page's section objects - every About Us
  // section shares the same {field, items:[{id,order,visible,...}]} shape,
  // so one set of functions (parameterized by section key) covers all 9
  // instead of duplicating add/edit/delete/reorder per section.
  function setAboutSection(sectionKey, field, value) {
    setContent((prev) => ({ ...prev, aboutPage: { ...prev.aboutPage, [sectionKey]: { ...prev.aboutPage[sectionKey], [field]: value } } }));
    setSaved(false);
  }

  function setAboutNested(sectionKey, subKey, field, value) {
    setContent((prev) => ({
      ...prev,
      aboutPage: {
        ...prev.aboutPage,
        [sectionKey]: {
          ...prev.aboutPage[sectionKey],
          [subKey]: { ...prev.aboutPage[sectionKey][subKey], [field]: value },
        },
      },
    }));
    setSaved(false);
  }

  function setAboutItem(sectionKey, listKey, index, field, value) {
    setContent((prev) => {
      const items = [...prev.aboutPage[sectionKey][listKey]];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, aboutPage: { ...prev.aboutPage, [sectionKey]: { ...prev.aboutPage[sectionKey], [listKey]: items } } };
    });
    setSaved(false);
  }

  function addAboutItem(sectionKey, listKey, factory) {
    setContent((prev) => {
      const items = prev.aboutPage[sectionKey][listKey];
      const maxOrder = Math.max(0, ...items.map((i) => i.order ?? 0));
      const maxId = Math.max(0, ...items.map((i) => i.id ?? 0));
      const newItems = [...items, factory(maxId + 1, maxOrder + 1)];
      return { ...prev, aboutPage: { ...prev.aboutPage, [sectionKey]: { ...prev.aboutPage[sectionKey], [listKey]: newItems } } };
    });
    setSaved(false);
  }

  function duplicateAboutItem(sectionKey, listKey, index, labelField) {
    setContent((prev) => {
      const items = [...prev.aboutPage[sectionKey][listKey]];
      const source = items[index];
      const maxOrder = Math.max(0, ...items.map((i) => i.order ?? 0));
      const maxId = Math.max(0, ...items.map((i) => i.id ?? 0));
      items.push({ ...source, id: maxId + 1, [labelField]: `${source[labelField]} (copy)`, order: maxOrder + 1 });
      return { ...prev, aboutPage: { ...prev.aboutPage, [sectionKey]: { ...prev.aboutPage[sectionKey], [listKey]: items } } };
    });
    setSaved(false);
  }

  function removeAboutItem(sectionKey, listKey, index, labelText) {
    if (!confirm(`Are you sure you want to delete this item ("${labelText}")? This removes it from the live site immediately after you save.`)) return;
    setContent((prev) => ({
      ...prev,
      aboutPage: { ...prev.aboutPage, [sectionKey]: { ...prev.aboutPage[sectionKey], [listKey]: prev.aboutPage[sectionKey][listKey].filter((_, i) => i !== index) } },
    }));
    setSaved(false);
  }

  function moveAboutItem(sectionKey, listKey, sortedIndex, dir) {
    setContent((prev) => {
      const sorted = [...prev.aboutPage[sectionKey][listKey]].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const target = sortedIndex + dir;
      if (target < 0 || target >= sorted.length) return prev;
      [sorted[sortedIndex].order, sorted[target].order] = [sorted[target].order, sorted[sortedIndex].order];
      return { ...prev, aboutPage: { ...prev.aboutPage, [sectionKey]: { ...prev.aboutPage[sectionKey], [listKey]: sorted } } };
    });
    setSaved(false);
  }

  function moveAboutSection(sortedIndex, dir) {
    setContent((prev) => {
      const keys = ABOUT_SECTIONS.map((s) => s.value);
      const sorted = [...keys].sort((a, b) => (prev.aboutPage[a].order ?? 0) - (prev.aboutPage[b].order ?? 0));
      const target = sortedIndex + dir;
      if (target < 0 || target >= sorted.length) return prev;
      const aKey = sorted[sortedIndex];
      const bKey = sorted[target];
      const aboutPage = { ...prev.aboutPage };
      const aOrder = aboutPage[aKey].order;
      const bOrder = aboutPage[bKey].order;
      aboutPage[aKey] = { ...aboutPage[aKey], order: bOrder };
      aboutPage[bKey] = { ...aboutPage[bKey], order: aOrder };
      return { ...prev, aboutPage };
    });
    setSaved(false);
  }

  function resetAboutSection(sectionKey) {
    if (!confirm('Reset this section back to the site default? This discards your edits to it.')) return;
    setContent((prev) => ({ ...prev, aboutPage: { ...prev.aboutPage, [sectionKey]: DEFAULT_SITE_CONTENT.aboutPage[sectionKey] } }));
    setSaved(false);
  }

  function setHero(field, value) {
    setContent((prev) => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
    setSaved(false);
  }

  function setOurStory(field, value) {
    setContent((prev) => ({ ...prev, ourStory: { ...prev.ourStory, [field]: value } }));
    setSaved(false);
  }

  function setShopByCategory(field, value) {
    setContent((prev) => ({ ...prev, shopByCategory: { ...prev.shopByCategory, [field]: value } }));
    setSaved(false);
  }

  function setTile(index, field, value) {
    setContent((prev) => {
      const tiles = [...prev.shopByCategory.tiles];
      tiles[index] = { ...tiles[index], [field]: value };
      return { ...prev, shopByCategory: { ...prev.shopByCategory, tiles } };
    });
    setSaved(false);
  }

  function addTile() {
    const name = window.prompt('New category name:');
    if (!name || !name.trim()) return;
    const slug = slugify(name);
    setContent((prev) => {
      if (prev.shopByCategory.tiles.some((t) => t.slug === slug)) {
        window.alert('A category with that name (or a very similar one) already exists.');
        return prev;
      }
      const maxOrder = Math.max(0, ...prev.shopByCategory.tiles.map((t) => t.order));
      const tiles = [...prev.shopByCategory.tiles, { slug, label: name.trim(), visible: true, order: maxOrder + 1, image: '', exploreText: '' }];
      return { ...prev, shopByCategory: { ...prev.shopByCategory, tiles } };
    });
    setSaved(false);
  }

  function removeTile(slug, label) {
    if (!confirm(`Delete "${label}"? This removes it from the live site immediately after you save.`)) return;
    setContent((prev) => ({
      ...prev,
      shopByCategory: { ...prev.shopByCategory, tiles: prev.shopByCategory.tiles.filter((t) => t.slug !== slug) },
    }));
    setSaved(false);
  }

  function moveTile(index, dir) {
    setContent((prev) => {
      const tiles = [...prev.shopByCategory.tiles];
      const target = index + dir;
      if (target < 0 || target >= tiles.length) return prev;
      const sorted = [...tiles].sort((a, b) => a.order - b.order);
      [sorted[index].order, sorted[target].order] = [sorted[target].order, sorted[index].order];
      return { ...prev, shopByCategory: { ...prev.shopByCategory, tiles: sorted } };
    });
    setSaved(false);
  }

  function setPlantsPeopleLove(field, value) {
    setContent((prev) => ({ ...prev, plantsPeopleLove: { ...prev.plantsPeopleLove, [field]: value } }));
    setSaved(false);
  }

  function addPplProduct(id) {
    setContent((prev) => {
      if (prev.plantsPeopleLove.productIds.includes(id)) return prev;
      return { ...prev, plantsPeopleLove: { ...prev.plantsPeopleLove, productIds: [...prev.plantsPeopleLove.productIds, id] } };
    });
    setSaved(false);
  }

  function removePplProduct(id) {
    setContent((prev) => ({ ...prev, plantsPeopleLove: { ...prev.plantsPeopleLove, productIds: prev.plantsPeopleLove.productIds.filter((x) => x !== id) } }));
    setSaved(false);
  }

  function movePplProduct(index, dir) {
    setContent((prev) => {
      const ids = [...prev.plantsPeopleLove.productIds];
      const target = index + dir;
      if (target < 0 || target >= ids.length) return prev;
      [ids[index], ids[target]] = [ids[target], ids[index]];
      return { ...prev, plantsPeopleLove: { ...prev.plantsPeopleLove, productIds: ids } };
    });
    setSaved(false);
  }

  // Real products currently shown in "Plants People Love" on the live site,
  // whether curated (an explicit productIds list) or automatic (empty list =
  // the 8 highest-rated plants among the real plant categories) - mirrors
  // getBestSellers()'s own filter+sort exactly so this always matches live.
  function getDisplayedPplProducts() {
    const ids = content.plantsPeopleLove.productIds;
    if (ids.length > 0) {
      return ids.map((id) => products.find((p) => p.id === id)).filter(Boolean);
    }
    return products
      .filter((p) => PLANT_CATEGORY_SLUGS.includes(p.category))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0))
      .slice(0, 8);
  }

  async function handleDuplicatePplProduct(product) {
    const { id, ...rest } = product;
    const newId = await addProduct({ ...rest, name: `${product.name} (copy)` });
    if (newId) {
      setContent((prev) => ({ ...prev, plantsPeopleLove: { ...prev.plantsPeopleLove, productIds: [...prev.plantsPeopleLove.productIds, newId] } }));
    }
  }

  async function handleDeletePplProduct(product) {
    if (!confirm(`Permanently delete "${product.name}"? This removes it from the ENTIRE website - every page it appears on, not just this section. This cannot be undone.`)) return;
    await deleteProduct(product.id);
    removePplProduct(product.id);
  }

  function setJustIn(field, value) {
    setContent((prev) => ({ ...prev, justIn: { ...prev.justIn, [field]: value } }));
    setSaved(false);
  }

  function removeJiProduct(id) {
    setContent((prev) => ({ ...prev, justIn: { ...prev.justIn, productIds: prev.justIn.productIds.filter((x) => x !== id) } }));
    setSaved(false);
  }

  function moveJiProduct(index, dir) {
    setContent((prev) => {
      const ids = [...prev.justIn.productIds];
      const target = index + dir;
      if (target < 0 || target >= ids.length) return prev;
      [ids[index], ids[target]] = [ids[target], ids[index]];
      return { ...prev, justIn: { ...prev.justIn, productIds: ids } };
    });
    setSaved(false);
  }

  // Real products currently shown in "Just In" on the live site - the same
  // seeded pick used by Home.jsx's JustIn() unless an admin curated list
  // overrides it, so this always matches what's actually live.
  function getDisplayedJiProducts() {
    const ids = content.justIn.productIds;
    if (ids.length > 0) {
      return ids.map((id) => products.find((p) => p.id === id)).filter(Boolean);
    }
    return getJustInProducts(products, 5);
  }

  async function handleDuplicateJiProduct(product) {
    const { id, ...rest } = product;
    const newId = await addProduct({ ...rest, name: `${product.name} (copy)` });
    if (newId) {
      setContent((prev) => ({ ...prev, justIn: { ...prev.justIn, productIds: [...prev.justIn.productIds, newId] } }));
    }
  }

  async function handleDeleteJiProduct(product) {
    if (!confirm(`Permanently delete "${product.name}"? This removes it from the ENTIRE website - every page it appears on, not just this section. This cannot be undone.`)) return;
    await deleteProduct(product.id);
    removeJiProduct(product.id);
  }

  function setGardenServicesSection(field, value) {
    setContent((prev) => ({ ...prev, gardenServices: { ...prev.gardenServices, [field]: value } }));
    setSaved(false);
  }

  function setGsItem(index, field, value) {
    setContent((prev) => {
      const items = [...prev.gardenServices.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, gardenServices: { ...prev.gardenServices, items } };
    });
    setSaved(false);
  }

  function addGsItem() {
    const name = window.prompt('New service title (e.g. Vertical Garden):');
    if (!name || !name.trim()) return;
    setContent((prev) => {
      const maxOrder = Math.max(0, ...prev.gardenServices.items.map((i) => i.order ?? 0));
      const maxId = Math.max(0, ...prev.gardenServices.items.map((i) => i.id ?? 0));
      const items = [...prev.gardenServices.items, {
        id: maxId + 1, title: name.trim(), description: '', image: '', buttonText: 'Learn more →',
        buttonLink: '/garden-services', visible: true, order: maxOrder + 1,
      }];
      return { ...prev, gardenServices: { ...prev.gardenServices, items } };
    });
    setSaved(false);
  }

  function duplicateGsItem(id) {
    setContent((prev) => {
      const source = prev.gardenServices.items.find((i) => i.id === id);
      if (!source) return prev;
      const maxOrder = Math.max(0, ...prev.gardenServices.items.map((i) => i.order ?? 0));
      const maxId = Math.max(0, ...prev.gardenServices.items.map((i) => i.id ?? 0));
      const copy = { ...source, id: maxId + 1, title: `${source.title} (copy)`, order: maxOrder + 1 };
      return { ...prev, gardenServices: { ...prev.gardenServices, items: [...prev.gardenServices.items, copy] } };
    });
    setSaved(false);
  }

  function removeGsItem(id, title) {
    if (!confirm(`Delete "${title}"? This removes it from the live site immediately after you save.`)) return;
    setContent((prev) => ({ ...prev, gardenServices: { ...prev.gardenServices, items: prev.gardenServices.items.filter((i) => i.id !== id) } }));
    setSaved(false);
  }

  function moveGsItem(sortedIndex, dir) {
    setContent((prev) => {
      const sorted = [...prev.gardenServices.items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const target = sortedIndex + dir;
      if (target < 0 || target >= sorted.length) return prev;
      [sorted[sortedIndex].order, sorted[target].order] = [sorted[target].order, sorted[sortedIndex].order];
      return { ...prev, gardenServices: { ...prev.gardenServices, items: sorted } };
    });
    setSaved(false);
  }

  function setNurseryJourney(field, value) {
    setContent((prev) => ({ ...prev, nurseryJourney: { ...prev.nurseryJourney, [field]: value } }));
    setSaved(false);
  }

  function setJourneyStep(index, field, value) {
    setContent((prev) => {
      const steps = [...prev.nurseryJourney.steps];
      steps[index] = { ...steps[index], [field]: value };
      return { ...prev, nurseryJourney: { ...prev.nurseryJourney, steps } };
    });
    setSaved(false);
  }

  function addJourneyStep() {
    const title = window.prompt('New step title (e.g. Packed With Care):');
    if (!title || !title.trim()) return;
    setContent((prev) => {
      const maxOrder = Math.max(0, ...prev.nurseryJourney.steps.map((s) => s.order ?? 0));
      const maxId = Math.max(0, ...prev.nurseryJourney.steps.map((s) => s.id ?? 0));
      const steps = [...prev.nurseryJourney.steps, {
        id: maxId + 1, title: title.trim(), description: '', image: '', icon: 'sprout', visible: true, order: maxOrder + 1,
      }];
      return { ...prev, nurseryJourney: { ...prev.nurseryJourney, steps } };
    });
    setSaved(false);
  }

  function removeJourneyStep(id, title) {
    if (!confirm(`Are you sure you want to delete this process step ("${title}")? This removes it from the live site immediately after you save.`)) return;
    setContent((prev) => ({ ...prev, nurseryJourney: { ...prev.nurseryJourney, steps: prev.nurseryJourney.steps.filter((s) => s.id !== id) } }));
    setSaved(false);
  }

  function moveJourneyStep(sortedIndex, dir) {
    setContent((prev) => {
      const sorted = [...prev.nurseryJourney.steps].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const target = sortedIndex + dir;
      if (target < 0 || target >= sorted.length) return prev;
      [sorted[sortedIndex].order, sorted[target].order] = [sorted[target].order, sorted[sortedIndex].order];
      return { ...prev, nurseryJourney: { ...prev.nurseryJourney, steps: sorted } };
    });
    setSaved(false);
  }

  function setHomeCorners(field, value) {
    setContent((prev) => ({ ...prev, homeCorners: { ...prev.homeCorners, [field]: value } }));
    setSaved(false);
  }

  function setCornerCard(index, field, value) {
    setContent((prev) => {
      const cards = [...prev.homeCorners.cards];
      cards[index] = { ...cards[index], [field]: value };
      return { ...prev, homeCorners: { ...prev.homeCorners, cards } };
    });
    setSaved(false);
  }

  function addCornerCard() {
    const name = window.prompt('New card title (e.g. Kitchen):');
    if (!name || !name.trim()) return;
    setContent((prev) => {
      const maxOrder = Math.max(0, ...prev.homeCorners.cards.map((c) => c.order));
      const maxId = Math.max(0, ...prev.homeCorners.cards.map((c) => c.id));
      const cards = [...prev.homeCorners.cards, {
        id: maxId + 1, title: name.trim(), image: '', icon: 'sofa', buttonText: 'SHOP NOW →',
        buttonLink: `/category/indoor-plants?location=${encodeURIComponent(name.trim())}`, visible: true, order: maxOrder + 1,
      }];
      return { ...prev, homeCorners: { ...prev.homeCorners, cards } };
    });
    setSaved(false);
  }

  function duplicateCornerCard(id) {
    setContent((prev) => {
      const source = prev.homeCorners.cards.find((c) => c.id === id);
      if (!source) return prev;
      const maxOrder = Math.max(0, ...prev.homeCorners.cards.map((c) => c.order));
      const maxId = Math.max(0, ...prev.homeCorners.cards.map((c) => c.id));
      const copy = { ...source, id: maxId + 1, title: `${source.title} (copy)`, order: maxOrder + 1 };
      return { ...prev, homeCorners: { ...prev.homeCorners, cards: [...prev.homeCorners.cards, copy] } };
    });
    setSaved(false);
  }

  function removeCornerCard(id, title) {
    if (!confirm(`Delete "${title}"? This removes it from the live site immediately after you save.`)) return;
    setContent((prev) => ({ ...prev, homeCorners: { ...prev.homeCorners, cards: prev.homeCorners.cards.filter((c) => c.id !== id) } }));
    setSaved(false);
  }

  function moveCornerCard(sortedIndex, dir) {
    setContent((prev) => {
      const sorted = [...prev.homeCorners.cards].sort((a, b) => a.order - b.order);
      const target = sortedIndex + dir;
      if (target < 0 || target >= sorted.length) return prev;
      [sorted[sortedIndex].order, sorted[target].order] = [sorted[target].order, sorted[sortedIndex].order];
      return { ...prev, homeCorners: { ...prev.homeCorners, cards: sorted } };
    });
    setSaved(false);
  }

  function setCompleteGarden(field, value) {
    setContent((prev) => ({ ...prev, completeGarden: { ...prev.completeGarden, [field]: value } }));
    setSaved(false);
  }

  // Pills used to be plain strings ('🌱 Your plant') - normalize to the
  // richer {id, icon, text, visible, order} shape the editor now needs, so
  // an older saved list still opens cleanly here instead of erroring.
  function normalizedPills(pills) {
    return pills.map((p, i) => (typeof p === 'string' ? { id: i + 1, icon: '', text: p, visible: true, order: i } : p));
  }

  function setPill(index, field, value) {
    setContent((prev) => {
      const pills = normalizedPills(prev.completeGarden.pills);
      pills[index] = { ...pills[index], [field]: value };
      return { ...prev, completeGarden: { ...prev.completeGarden, pills } };
    });
    setSaved(false);
  }

  function addPill() {
    setContent((prev) => {
      const pills = normalizedPills(prev.completeGarden.pills);
      const maxOrder = Math.max(0, ...pills.map((p) => p.order ?? 0));
      const maxId = Math.max(0, ...pills.map((p) => p.id ?? 0));
      pills.push({ id: maxId + 1, icon: '🌿', text: 'New pill', visible: true, order: maxOrder + 1 });
      return { ...prev, completeGarden: { ...prev.completeGarden, pills } };
    });
    setSaved(false);
  }

  function duplicatePill(index) {
    setContent((prev) => {
      const pills = normalizedPills(prev.completeGarden.pills);
      const source = pills[index];
      const maxOrder = Math.max(0, ...pills.map((p) => p.order ?? 0));
      const maxId = Math.max(0, ...pills.map((p) => p.id ?? 0));
      pills.push({ ...source, id: maxId + 1, text: `${source.text} (copy)`, order: maxOrder + 1 });
      return { ...prev, completeGarden: { ...prev.completeGarden, pills } };
    });
    setSaved(false);
  }

  function removePill(index) {
    setContent((prev) => ({ ...prev, completeGarden: { ...prev.completeGarden, pills: normalizedPills(prev.completeGarden.pills).filter((_, i) => i !== index) } }));
    setSaved(false);
  }

  function movePill(index, dir) {
    setContent((prev) => {
      const pills = normalizedPills(prev.completeGarden.pills);
      const target = index + dir;
      if (target < 0 || target >= pills.length) return prev;
      const sorted = [...pills].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      [sorted[index].order, sorted[target].order] = [sorted[target].order, sorted[index].order];
      return { ...prev, completeGarden: { ...prev.completeGarden, pills: sorted } };
    });
    setSaved(false);
  }

  function setOurStoryBand(field, value) {
    setContent((prev) => ({ ...prev, ourStoryBand: { ...prev.ourStoryBand, [field]: value } }));
    setSaved(false);
  }

  function setOsbParagraph(index, field, value) {
    setContent((prev) => {
      const paragraphs = [...prev.ourStoryBand.paragraphs];
      paragraphs[index] = { ...paragraphs[index], [field]: value };
      return { ...prev, ourStoryBand: { ...prev.ourStoryBand, paragraphs } };
    });
    setSaved(false);
  }

  function addOsbParagraph() {
    setContent((prev) => {
      const maxOrder = Math.max(0, ...prev.ourStoryBand.paragraphs.map((p) => p.order ?? 0));
      const maxId = Math.max(0, ...prev.ourStoryBand.paragraphs.map((p) => p.id ?? 0));
      const paragraphs = [...prev.ourStoryBand.paragraphs, { id: maxId + 1, before: 'New paragraph', strong: '', after: '', visible: true, order: maxOrder + 1 }];
      return { ...prev, ourStoryBand: { ...prev.ourStoryBand, paragraphs } };
    });
    setSaved(false);
  }

  function removeOsbParagraph(index) {
    if (!confirm('Are you sure you want to delete this content? This removes it from the live site immediately after you save.')) return;
    setContent((prev) => ({ ...prev, ourStoryBand: { ...prev.ourStoryBand, paragraphs: prev.ourStoryBand.paragraphs.filter((_, i) => i !== index) } }));
    setSaved(false);
  }

  function moveOsbParagraph(sortedIndex, dir) {
    setContent((prev) => {
      const sorted = [...prev.ourStoryBand.paragraphs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const target = sortedIndex + dir;
      if (target < 0 || target >= sorted.length) return prev;
      [sorted[sortedIndex].order, sorted[target].order] = [sorted[target].order, sorted[sortedIndex].order];
      return { ...prev, ourStoryBand: { ...prev.ourStoryBand, paragraphs: sorted } };
    });
    setSaved(false);
  }

  function setComparisonSection(field, value) {
    setContent((prev) => ({ ...prev, comparisonSection: { ...prev.comparisonSection, [field]: value } }));
    setSaved(false);
  }

  function setComparisonRow(index, field, value) {
    setContent((prev) => {
      const rows = [...prev.comparisonSection.rows];
      rows[index] = { ...rows[index], [field]: value };
      return { ...prev, comparisonSection: { ...prev.comparisonSection, rows } };
    });
    setSaved(false);
  }

  function addComparisonRow() {
    const criterion = window.prompt('New comparison row - criterion name (e.g. Delivery Speed):');
    if (!criterion || !criterion.trim()) return;
    setContent((prev) => {
      const maxOrder = Math.max(0, ...prev.comparisonSection.rows.map((r) => r.order ?? 0));
      const maxId = Math.max(0, ...prev.comparisonSection.rows.map((r) => r.id ?? 0));
      const rows = [...prev.comparisonSection.rows, {
        id: maxId + 1, icon: 'leaf', criterion: criterion.trim(), local: '', igo: '', igoHighlight: '', others: '', visible: true, order: maxOrder + 1,
      }];
      return { ...prev, comparisonSection: { ...prev.comparisonSection, rows } };
    });
    setSaved(false);
  }

  function removeComparisonRow(index, criterion) {
    if (!confirm(`Are you sure you want to delete this comparison row ("${criterion}")? This removes it from the live site immediately after you save.`)) return;
    setContent((prev) => ({ ...prev, comparisonSection: { ...prev.comparisonSection, rows: prev.comparisonSection.rows.filter((_, i) => i !== index) } }));
    setSaved(false);
  }

  function moveComparisonRow(sortedIndex, dir) {
    setContent((prev) => {
      const sorted = [...prev.comparisonSection.rows].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const target = sortedIndex + dir;
      if (target < 0 || target >= sorted.length) return prev;
      [sorted[sortedIndex].order, sorted[target].order] = [sorted[target].order, sorted[sortedIndex].order];
      return { ...prev, comparisonSection: { ...prev.comparisonSection, rows: sorted } };
    });
    setSaved(false);
  }

  function setTrustBenefits(field, value) {
    setContent((prev) => ({ ...prev, trustBenefits: { ...prev.trustBenefits, [field]: value } }));
    setSaved(false);
  }

  function setTrustBenefitItem(index, field, value) {
    setContent((prev) => {
      const items = [...prev.trustBenefits.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, trustBenefits: { ...prev.trustBenefits, items } };
    });
    setSaved(false);
  }

  function addTrustBenefit() {
    const title = window.prompt('New feature title (e.g. Free Replacement):');
    if (!title || !title.trim()) return;
    setContent((prev) => {
      const maxOrder = Math.max(0, ...prev.trustBenefits.items.map((b) => b.order ?? 0));
      const maxId = Math.max(0, ...prev.trustBenefits.items.map((b) => b.id ?? 0));
      const items = [...prev.trustBenefits.items, { id: maxId + 1, icon: 'shield', title: title.trim(), description: '', visible: true, order: maxOrder + 1 }];
      return { ...prev, trustBenefits: { ...prev.trustBenefits, items } };
    });
    setSaved(false);
  }

  function removeTrustBenefit(index, title) {
    if (!confirm(`Are you sure you want to delete this feature ("${title}")? This removes it from the live site immediately after you save.`)) return;
    setContent((prev) => ({ ...prev, trustBenefits: { ...prev.trustBenefits, items: prev.trustBenefits.items.filter((_, i) => i !== index) } }));
    setSaved(false);
  }

  function moveTrustBenefit(sortedIndex, dir) {
    setContent((prev) => {
      const sorted = [...prev.trustBenefits.items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const target = sortedIndex + dir;
      if (target < 0 || target >= sorted.length) return prev;
      [sorted[sortedIndex].order, sorted[target].order] = [sorted[target].order, sorted[sortedIndex].order];
      return { ...prev, trustBenefits: { ...prev.trustBenefits, items: sorted } };
    });
    setSaved(false);
  }

  function setGardenJournal(field, value) {
    setContent((prev) => ({ ...prev, gardenJournal: { ...prev.gardenJournal, [field]: value } }));
    setSaved(false);
  }

  function setJournalPost(index, field, value) {
    setContent((prev) => {
      const posts = [...prev.gardenJournal.posts];
      posts[index] = { ...posts[index], [field]: value };
      return { ...prev, gardenJournal: { ...prev.gardenJournal, posts } };
    });
    setSaved(false);
  }

  function addJournalPost() {
    const title = window.prompt('New journal card title:');
    if (!title || !title.trim()) return;
    setContent((prev) => {
      const maxOrder = Math.max(0, ...prev.gardenJournal.posts.map((p) => p.order ?? 0));
      const maxId = Math.max(0, ...prev.gardenJournal.posts.map((p) => p.id ?? 0));
      const posts = [...prev.gardenJournal.posts, {
        id: maxId + 1, title: title.trim(), imageAlt: title.trim(), image: '', linkUrl: '/blog', linkTarget: '_self', visible: true, order: maxOrder + 1,
      }];
      return { ...prev, gardenJournal: { ...prev.gardenJournal, posts } };
    });
    setSaved(false);
  }

  function duplicateJournalPost(index) {
    setContent((prev) => {
      const source = prev.gardenJournal.posts[index];
      const maxOrder = Math.max(0, ...prev.gardenJournal.posts.map((p) => p.order ?? 0));
      const maxId = Math.max(0, ...prev.gardenJournal.posts.map((p) => p.id ?? 0));
      const copy = { ...source, id: maxId + 1, title: `${source.title} (copy)`, order: maxOrder + 1 };
      return { ...prev, gardenJournal: { ...prev.gardenJournal, posts: [...prev.gardenJournal.posts, copy] } };
    });
    setSaved(false);
  }

  function removeJournalPost(index, title) {
    if (!confirm(`Are you sure you want to delete this journal card ("${title}")? This removes it from the live site immediately after you save.`)) return;
    setContent((prev) => ({ ...prev, gardenJournal: { ...prev.gardenJournal, posts: prev.gardenJournal.posts.filter((_, i) => i !== index) } }));
    setSaved(false);
  }

  function moveJournalPost(sortedIndex, dir) {
    setContent((prev) => {
      const sorted = [...prev.gardenJournal.posts].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const target = sortedIndex + dir;
      if (target < 0 || target >= sorted.length) return prev;
      [sorted[sortedIndex].order, sorted[target].order] = [sorted[target].order, sorted[sortedIndex].order];
      return { ...prev, gardenJournal: { ...prev.gardenJournal, posts: sorted } };
    });
    setSaved(false);
  }

  function setGiftingBand(field, value) {
    setContent((prev) => ({ ...prev, giftingBand: { ...prev.giftingBand, [field]: value } }));
    setSaved(false);
  }

  function setGiftingFeature(index, field, value) {
    setContent((prev) => {
      const features = [...prev.giftingBand.features];
      features[index] = { ...features[index], [field]: value };
      return { ...prev, giftingBand: { ...prev.giftingBand, features } };
    });
    setSaved(false);
  }

  function addGiftingFeature() {
    setContent((prev) => {
      const maxOrder = Math.max(0, ...prev.giftingBand.features.map((f) => f.order ?? 0));
      const maxId = Math.max(0, ...prev.giftingBand.features.map((f) => f.id ?? 0));
      const features = [...prev.giftingBand.features, { id: maxId + 1, icon: 'gift', text: 'New feature', visible: true, order: maxOrder + 1 }];
      return { ...prev, giftingBand: { ...prev.giftingBand, features } };
    });
    setSaved(false);
  }

  function duplicateGiftingFeature(index) {
    setContent((prev) => {
      const features = [...prev.giftingBand.features];
      const source = features[index];
      const maxOrder = Math.max(0, ...features.map((f) => f.order ?? 0));
      const maxId = Math.max(0, ...features.map((f) => f.id ?? 0));
      features.push({ ...source, id: maxId + 1, text: `${source.text} (copy)`, order: maxOrder + 1 });
      return { ...prev, giftingBand: { ...prev.giftingBand, features } };
    });
    setSaved(false);
  }

  function removeGiftingFeature(index, text) {
    if (!confirm(`Are you sure you want to delete this feature ("${text}")?`)) return;
    setContent((prev) => ({ ...prev, giftingBand: { ...prev.giftingBand, features: prev.giftingBand.features.filter((_, i) => i !== index) } }));
    setSaved(false);
  }

  function moveGiftingFeature(sortedIndex, dir) {
    setContent((prev) => {
      const sorted = [...prev.giftingBand.features].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const target = sortedIndex + dir;
      if (target < 0 || target >= sorted.length) return prev;
      [sorted[sortedIndex].order, sorted[target].order] = [sorted[target].order, sorted[sortedIndex].order];
      return { ...prev, giftingBand: { ...prev.giftingBand, features: sorted } };
    });
    setSaved(false);
  }

  function setGiftingButton(index, field, value) {
    setContent((prev) => {
      const buttons = [...prev.giftingBand.buttons];
      buttons[index] = { ...buttons[index], [field]: value };
      return { ...prev, giftingBand: { ...prev.giftingBand, buttons } };
    });
    setSaved(false);
  }

  function addGiftingButton() {
    setContent((prev) => {
      const maxOrder = Math.max(0, ...prev.giftingBand.buttons.map((b) => b.order ?? 0));
      const maxId = Math.max(0, ...prev.giftingBand.buttons.map((b) => b.id ?? 0));
      const buttons = [...prev.giftingBand.buttons, {
        id: maxId + 1, icon: 'gift', text: 'New button', url: '/gifting', target: '_self', style: 'secondary',
        bgColor: '', textColor: '', borderColor: '', hoverBgColor: '', hoverTextColor: '', visible: true, order: maxOrder + 1,
      }];
      return { ...prev, giftingBand: { ...prev.giftingBand, buttons } };
    });
    setSaved(false);
  }

  function duplicateGiftingButton(index) {
    setContent((prev) => {
      const buttons = [...prev.giftingBand.buttons];
      const source = buttons[index];
      const maxOrder = Math.max(0, ...buttons.map((b) => b.order ?? 0));
      const maxId = Math.max(0, ...buttons.map((b) => b.id ?? 0));
      buttons.push({ ...source, id: maxId + 1, text: `${source.text} (copy)`, order: maxOrder + 1 });
      return { ...prev, giftingBand: { ...prev.giftingBand, buttons } };
    });
    setSaved(false);
  }

  function removeGiftingButton(index, text) {
    if (!confirm(`Are you sure you want to delete this button ("${text}")?`)) return;
    setContent((prev) => ({ ...prev, giftingBand: { ...prev.giftingBand, buttons: prev.giftingBand.buttons.filter((_, i) => i !== index) } }));
    setSaved(false);
  }

  function moveGiftingButton(sortedIndex, dir) {
    setContent((prev) => {
      const sorted = [...prev.giftingBand.buttons].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const target = sortedIndex + dir;
      if (target < 0 || target >= sorted.length) return prev;
      [sorted[sortedIndex].order, sorted[target].order] = [sorted[target].order, sorted[sortedIndex].order];
      return { ...prev, giftingBand: { ...prev.giftingBand, buttons: sorted } };
    });
    setSaved(false);
  }

  function setFaq(field, value) {
    setContent((prev) => ({ ...prev, faq: { ...prev.faq, [field]: value } }));
    setSaved(false);
  }

  function setFaqItem(index, field, value) {
    setContent((prev) => {
      const items = [...prev.faq.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, faq: { ...prev.faq, items } };
    });
    setSaved(false);
  }

  function setFaqDefaultOpen(index) {
    setContent((prev) => ({
      ...prev,
      faq: { ...prev.faq, items: prev.faq.items.map((it, i) => ({ ...it, defaultOpen: i === index })) },
    }));
    setSaved(false);
  }

  function addFaqItem() {
    setContent((prev) => {
      const maxOrder = Math.max(0, ...prev.faq.items.map((f) => f.order ?? 0));
      const maxId = Math.max(0, ...prev.faq.items.map((f) => f.id ?? 0));
      const items = [...prev.faq.items, { id: maxId + 1, question: 'New question?', answer: 'New answer.', visible: true, defaultOpen: false, order: maxOrder + 1 }];
      return { ...prev, faq: { ...prev.faq, items } };
    });
    setSaved(false);
  }

  function duplicateFaqItem(index) {
    setContent((prev) => {
      const items = [...prev.faq.items];
      const source = items[index];
      const maxOrder = Math.max(0, ...items.map((f) => f.order ?? 0));
      const maxId = Math.max(0, ...items.map((f) => f.id ?? 0));
      items.push({ ...source, id: maxId + 1, question: `${source.question} (copy)`, defaultOpen: false, order: maxOrder + 1 });
      return { ...prev, faq: { ...prev.faq, items } };
    });
    setSaved(false);
  }

  function removeFaqItem(index, question) {
    if (!confirm(`Are you sure you want to delete this FAQ ("${question}")? This removes it from the live site immediately after you save.`)) return;
    setContent((prev) => ({ ...prev, faq: { ...prev.faq, items: prev.faq.items.filter((_, i) => i !== index) } }));
    setSaved(false);
  }

  function moveFaqItem(sortedIndex, dir) {
    setContent((prev) => {
      const sorted = [...prev.faq.items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const target = sortedIndex + dir;
      if (target < 0 || target >= sorted.length) return prev;
      [sorted[sortedIndex].order, sorted[target].order] = [sorted[target].order, sorted[sortedIndex].order];
      return { ...prev, faq: { ...prev.faq, items: sorted } };
    });
    setSaved(false);
  }

  function setNewsletter(field, value) {
    setContent((prev) => ({ ...prev, newsletter: { ...prev.newsletter, [field]: value } }));
    setSaved(false);
  }

  // Generic version of the Plants hub admin controls below, reused for
  // Seeds / Pots & Planters / Plant Care (see SECTION_HUBS) so those 3
  // pages don't need their own copy-pasted set of handlers. Plants itself
  // keeps its original hardcoded handlers above untouched.
  function setHubField(contentKey, field, value) {
    setContent((prev) => ({ ...prev, [contentKey]: { ...prev[contentKey], [field]: value } }));
    setSaved(false);
  }

  function toggleHubLandingCategory(contentKey, slug) {
    setContent((prev) => {
      const current = prev[contentKey].landingCategorySlugs;
      const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
      return { ...prev, [contentKey]: { ...prev[contentKey], landingCategorySlugs: next } };
    });
    setSaved(false);
  }

  function moveHubLandingCategory(contentKey, index, dir) {
    setContent((prev) => {
      const list = [...prev[contentKey].landingCategorySlugs];
      const target = index + dir;
      if (target < 0 || target >= list.length) return prev;
      [list[index], list[target]] = [list[target], list[index]];
      return { ...prev, [contentKey]: { ...prev[contentKey], landingCategorySlugs: list } };
    });
    setSaved(false);
  }

  function addHubFeaturedProduct(contentKey, id) {
    setContent((prev) => {
      if (prev[contentKey].featuredProductIds.includes(id)) return prev;
      return { ...prev, [contentKey]: { ...prev[contentKey], featuredProductIds: [...prev[contentKey].featuredProductIds, id] } };
    });
    setSaved(false);
  }

  function removeHubFeaturedProduct(contentKey, id) {
    setContent((prev) => ({ ...prev, [contentKey]: { ...prev[contentKey], featuredProductIds: prev[contentKey].featuredProductIds.filter((x) => x !== id) } }));
    setSaved(false);
  }

  function moveHubFeaturedProduct(contentKey, index, dir) {
    setContent((prev) => {
      const list = [...prev[contentKey].featuredProductIds];
      const target = index + dir;
      if (target < 0 || target >= list.length) return prev;
      [list[index], list[target]] = [list[target], list[index]];
      return { ...prev, [contentKey]: { ...prev[contentKey], featuredProductIds: list } };
    });
    setSaved(false);
  }

  function setPlantsHub(field, value) {
    setContent((prev) => ({ ...prev, plantsHub: { ...prev.plantsHub, [field]: value } }));
    setSaved(false);
  }

  function toggleNavbarCategory(slug) {
    setContent((prev) => {
      const current = prev.plantsHub.navbarCategorySlugs;
      let next;
      if (current.includes(slug)) {
        next = current.filter((s) => s !== slug);
      } else {
        if (current.length >= 5) {
          window.alert('The navbar dropdown can only show 5 categories - remove one first.');
          return prev;
        }
        next = [...current, slug];
      }
      return { ...prev, plantsHub: { ...prev.plantsHub, navbarCategorySlugs: next } };
    });
    setSaved(false);
  }

  function moveNavbarCategory(index, dir) {
    setContent((prev) => {
      const list = [...prev.plantsHub.navbarCategorySlugs];
      const target = index + dir;
      if (target < 0 || target >= list.length) return prev;
      [list[index], list[target]] = [list[target], list[index]];
      return { ...prev, plantsHub: { ...prev.plantsHub, navbarCategorySlugs: list } };
    });
    setSaved(false);
  }

  function toggleLandingCategory(slug) {
    setContent((prev) => {
      const current = prev.plantsHub.landingCategorySlugs;
      const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
      return { ...prev, plantsHub: { ...prev.plantsHub, landingCategorySlugs: next } };
    });
    setSaved(false);
  }

  function moveLandingCategory(index, dir) {
    setContent((prev) => {
      const list = [...prev.plantsHub.landingCategorySlugs];
      const target = index + dir;
      if (target < 0 || target >= list.length) return prev;
      [list[index], list[target]] = [list[target], list[index]];
      return { ...prev, plantsHub: { ...prev.plantsHub, landingCategorySlugs: list } };
    });
    setSaved(false);
  }

  function addFeaturedPlant(id) {
    setContent((prev) => {
      if (prev.plantsHub.featuredProductIds.includes(id)) return prev;
      return { ...prev, plantsHub: { ...prev.plantsHub, featuredProductIds: [...prev.plantsHub.featuredProductIds, id] } };
    });
    setSaved(false);
  }

  function removeFeaturedPlant(id) {
    setContent((prev) => ({ ...prev, plantsHub: { ...prev.plantsHub, featuredProductIds: prev.plantsHub.featuredProductIds.filter((x) => x !== id) } }));
    setSaved(false);
  }

  function moveFeaturedPlant(index, dir) {
    setContent((prev) => {
      const list = [...prev.plantsHub.featuredProductIds];
      const target = index + dir;
      if (target < 0 || target >= list.length) return prev;
      [list[index], list[target]] = [list[target], list[index]];
      return { ...prev, plantsHub: { ...prev.plantsHub, featuredProductIds: list } };
    });
    setSaved(false);
  }

  function setPlantFinder(field, value) {
    setContent((prev) => ({ ...prev, plantFinder: { ...prev.plantFinder, [field]: value } }));
    setSaved(false);
  }

  function setWhyIgo(field, value) {
    setContent((prev) => ({ ...prev, whyIgo: { ...prev.whyIgo, [field]: value } }));
    setSaved(false);
  }

  // Older saved cards used a plain 'featured' boolean (sometimes even the
  // string 'true'/'false' from the old text-based editor) - normalize to
  // the current {badgeEnabled, badgeText, visible, order} shape so an
  // older save still opens cleanly here.
  function normalizedWhyIgoCards(cards) {
    return cards.map((c, i) => ({
      visible: true,
      order: i,
      badgeEnabled: c.featured === true || c.featured === 'true',
      badgeText: 'VERIFIED',
      ...c,
    }));
  }

  function setWhyIgoCard(index, field, value) {
    setContent((prev) => {
      const cards = normalizedWhyIgoCards(prev.whyIgo.cards);
      cards[index] = { ...cards[index], [field]: value };
      return { ...prev, whyIgo: { ...prev.whyIgo, cards } };
    });
    setSaved(false);
  }

  function addWhyIgoCard() {
    const title = window.prompt('New card title (e.g. Certified Organic):');
    if (!title || !title.trim()) return;
    setContent((prev) => {
      const cards = normalizedWhyIgoCards(prev.whyIgo.cards);
      const maxOrder = Math.max(0, ...cards.map((c) => c.order ?? 0));
      const maxId = Math.max(0, ...cards.map((c) => c.id ?? 0));
      cards.push({
        id: maxId + 1, icon: 'wifi', title: title.trim(), description: '', image: '', stat: '',
        badgeEnabled: false, badgeText: 'VERIFIED', visible: true, order: maxOrder + 1,
      });
      return { ...prev, whyIgo: { ...prev.whyIgo, cards } };
    });
    setSaved(false);
  }

  function duplicateWhyIgoCard(index) {
    setContent((prev) => {
      const cards = normalizedWhyIgoCards(prev.whyIgo.cards);
      const source = cards[index];
      const maxOrder = Math.max(0, ...cards.map((c) => c.order ?? 0));
      const maxId = Math.max(0, ...cards.map((c) => c.id ?? 0));
      cards.push({ ...source, id: maxId + 1, title: `${source.title} (copy)`, order: maxOrder + 1 });
      return { ...prev, whyIgo: { ...prev.whyIgo, cards } };
    });
    setSaved(false);
  }

  function removeWhyIgoCard(index, title) {
    if (!confirm(`Are you sure you want to delete this feature card ("${title}")? This removes it from the live site immediately after you save.`)) return;
    setContent((prev) => ({ ...prev, whyIgo: { ...prev.whyIgo, cards: normalizedWhyIgoCards(prev.whyIgo.cards).filter((_, i) => i !== index) } }));
    setSaved(false);
  }

  function moveWhyIgoCard(sortedIndex, dir) {
    setContent((prev) => {
      const cards = normalizedWhyIgoCards(prev.whyIgo.cards);
      const target = sortedIndex + dir;
      if (target < 0 || target >= cards.length) return prev;
      const sorted = [...cards].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      [sorted[sortedIndex].order, sorted[target].order] = [sorted[target].order, sorted[sortedIndex].order];
      return { ...prev, whyIgo: { ...prev.whyIgo, cards: sorted } };
    });
    setSaved(false);
  }

  function resetOneSection(key) {
    if (!confirm('Reset this section back to the site default? This discards your edits to it.')) return;
    setContent((prev) => ({ ...prev, [key]: DEFAULT_SITE_CONTENT[key] }));
    setSaved(false);
  }

  function cancelSectionEdits() {
    setContent(getSiteContent());
    setSaved(false);
  }

  function setSection(section, items) {
    setContent((prev) => ({ ...prev, [section]: items }));
    setSaved(false);
  }

  function handleSave() {
    saveSiteContent(content);
    setSaved(true);
  }

  function handleReset() {
    if (!confirm('Reset all homepage content back to the site defaults? This discards your edits.')) return;
    resetSiteContent();
    setContent(getSiteContent());
    setSaved(false);
  }

  const activeMeta = SECTIONS.find((s) => s.value === selected);

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Content</h1>
          <p className="admin-page-sub">Pick a section below to edit its text, images or cards. Changes go live after you click Save.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="admin-btn admin-btn-ghost" onClick={handleReset}>Reset to defaults</button>
          <button type="button" className="admin-btn admin-btn-primary" style={{ width: 'auto' }} onClick={handleSave}>Save changes</button>
        </div>
      </div>

      <div className="admin-mock-banner">
        {saved
          ? 'Saved. Open the homepage in another tab and refresh it - your changes are live there now.'
          : 'This is the real content shown on the homepage right now. Changes save to this browser and take effect immediately - no Firebase needed for this part.'}
      </div>

      <div className="admin-panel">
        <p className="admin-panel-title">Page</p>
        <div className="admin-field span-2" style={{ marginBottom: 0 }}>
          <label htmlFor="page-picker">Page</label>
          <select id="page-picker" value={page} onChange={(e) => setPage(e.target.value)}>
            <option value="home">Home</option>
            <option value="about">About Us</option>
            <option value="plants">Plants</option>
            <option value="seeds">Seeds</option>
            <option value="pots">Pots &amp; Planters</option>
            <option value="plantcare">Plant Care</option>
          </select>
        </div>
      </div>

      {page === 'home' && (
        <VisualEditor />
      )}

      {page === 'about' && (
        <div className="admin-panel">
          <p className="admin-panel-title">About Us sections</p>
          <div className="admin-field span-2" style={{ marginBottom: 0 }}>
            <label htmlFor="about-section-picker">Section</label>
            <select id="about-section-picker" value={aboutSelected} onChange={(e) => setAboutSelected(e.target.value)}>
              <option value="">-- Choose a section --</option>
              {[...ABOUT_SECTIONS].sort((a, b) => (content.aboutPage[a.value].order ?? 0) - (content.aboutPage[b.value].order ?? 0)).map((s) => (
                <option key={s.value} value={s.value}>
                  {content.aboutPage[s.value].visible === false ? `${s.label} (hidden)` : s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {page === 'about' && aboutSelected && (() => {
        const sortedKeys = ABOUT_SECTIONS.map((s) => s.value).sort((a, b) => (content.aboutPage[a].order ?? 0) - (content.aboutPage[b].order ?? 0));
        const sortedIndex = sortedKeys.indexOf(aboutSelected);
        const sec = content.aboutPage[aboutSelected];
        return (
          <div className="admin-panel">
            <div className="admin-cat-cards-head">
              <p className="admin-panel-title" style={{ marginBottom: 0 }}>{ABOUT_SECTIONS.find((s) => s.value === aboutSelected).label}</p>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button type="button" className="admin-icon-btn" onClick={() => moveAboutSection(sortedIndex, -1)} aria-label="Move section up">↑</button>
                <button type="button" className="admin-icon-btn" onClick={() => moveAboutSection(sortedIndex, 1)} aria-label="Move section down">↓</button>
                <select value={sec.visible !== false ? 'active' : 'inactive'} onChange={(e) => setAboutSection(aboutSelected, 'visible', e.target.value === 'active')}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {aboutSelected === 'hero' && (
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label>Breadcrumb "Home" text</label>
                  <input value={sec.breadcrumbHome} onChange={(e) => setAboutSection('hero', 'breadcrumbHome', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label>Breadcrumb current text</label>
                  <input value={sec.breadcrumbCurrent} onChange={(e) => setAboutSection('hero', 'breadcrumbCurrent', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label>Title line 1</label>
                  <input value={sec.titleLine1} onChange={(e) => setAboutSection('hero', 'titleLine1', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label>Title line 2</label>
                  <input value={sec.titleLine2} onChange={(e) => setAboutSection('hero', 'titleLine2', e.target.value)} />
                </div>
                <div className="admin-field span-2">
                  <label>Subtitle</label>
                  <input value={sec.subtitle} onChange={(e) => setAboutSection('hero', 'subtitle', e.target.value)} />
                </div>
                <div className="admin-field span-2">
                  <label>Description</label>
                  <textarea rows="3" value={sec.description} onChange={(e) => setAboutSection('hero', 'description', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label>Button text</label>
                  <input value={sec.buttonText} onChange={(e) => setAboutSection('hero', 'buttonText', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label>Button URL</label>
                  <input value={sec.buttonUrl} onChange={(e) => setAboutSection('hero', 'buttonUrl', e.target.value)} />
                </div>
                <ImageField id="abt-hero-image" label="Hero image" value={sec.image} onChange={(v) => setAboutSection('hero', 'image', v)} spanTwo />
                <div className="admin-field span-2">
                  <label>Image alt text</label>
                  <input value={sec.imageAlt} onChange={(e) => setAboutSection('hero', 'imageAlt', e.target.value)} />
                </div>
              </div>
            )}

            {aboutSelected === 'story' && (
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label>Eyebrow</label>
                  <input value={sec.eyebrow} onChange={(e) => setAboutSection('story', 'eyebrow', e.target.value)} />
                </div>
                <div className="admin-field" />
                <div className="admin-field">
                  <label>Title line 1</label>
                  <input value={sec.titleLine1} onChange={(e) => setAboutSection('story', 'titleLine1', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label>Title line 2</label>
                  <input value={sec.titleLine2} onChange={(e) => setAboutSection('story', 'titleLine2', e.target.value)} />
                </div>
                <div className="admin-field span-2">
                  <label>Text</label>
                  <textarea rows="4" value={sec.text} onChange={(e) => setAboutSection('story', 'text', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label>Button text</label>
                  <input value={sec.buttonText} onChange={(e) => setAboutSection('story', 'buttonText', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label>Button URL</label>
                  <input value={sec.buttonUrl} onChange={(e) => setAboutSection('story', 'buttonUrl', e.target.value)} />
                </div>
                <ImageField id="abt-story-image" label="Image" value={sec.image} onChange={(v) => setAboutSection('story', 'image', v)} spanTwo />
                <div className="admin-field span-2">
                  <label>Image alt text</label>
                  <input value={sec.imageAlt} onChange={(e) => setAboutSection('story', 'imageAlt', e.target.value)} />
                </div>
              </div>
            )}

            {aboutSelected === 'stats' && (
              <>
                <div className="admin-cat-cards-head">
                  <p className="admin-page-sub" style={{ margin: 0 }}>{sec.items.filter((i) => i.visible !== false).length} of {sec.items.length} active</p>
                  <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" style={{ width: 'auto' }} onClick={() => addAboutItem('stats', 'items', (id, order) => ({ id, icon: 'Leaf', value: 0, suffix: '+', label: 'New stat', visible: true, order }))}>
                    <PlusIcon width="14" height="14" /> Add Statistic
                  </button>
                </div>
                {[...sec.items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((item, sortedIdx) => {
                  const index = sec.items.findIndex((i) => i.id === item.id);
                  return (
                    <div key={item.id} className="admin-content-item" style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1, flexWrap: 'wrap' }}>
                        <select value={item.icon} onChange={(e) => setAboutItem('stats', 'items', index, 'icon', e.target.value)} style={{ width: 110 }}>
                          {ABOUT_ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                        </select>
                        <input type="number" value={item.value} onChange={(e) => setAboutItem('stats', 'items', index, 'value', Number(e.target.value))} style={{ width: 90 }} aria-label="Value" />
                        <input value={item.suffix} onChange={(e) => setAboutItem('stats', 'items', index, 'suffix', e.target.value)} style={{ width: 50 }} aria-label="Suffix" />
                        <input value={item.label} onChange={(e) => setAboutItem('stats', 'items', index, 'label', e.target.value)} style={{ flex: 1, minWidth: 140 }} aria-label="Label" />
                        <select value={item.visible !== false ? 'show' : 'hide'} onChange={(e) => setAboutItem('stats', 'items', index, 'visible', e.target.value === 'show')}>
                          <option value="show">Show</option>
                          <option value="hide">Hide</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button type="button" className="admin-icon-btn" onClick={() => moveAboutItem('stats', 'items', sortedIdx, -1)} aria-label="Move up">↑</button>
                        <button type="button" className="admin-icon-btn" onClick={() => moveAboutItem('stats', 'items', sortedIdx, 1)} aria-label="Move down">↓</button>
                        <button type="button" className="admin-icon-btn danger" onClick={() => removeAboutItem('stats', 'items', index, item.label)} aria-label="Delete"><TrashIcon width="14" height="14" /></button>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {aboutSelected === 'visionMission' && (
              <>
                {['vision', 'mission'].map((subKey) => {
                  const sub = sec[subKey];
                  const iconField = subKey === 'vision' ? 'Eye' : 'Target';
                  return (
                    <div key={subKey}>
                      <p className="admin-panel-title" style={{ marginTop: 18, textTransform: 'capitalize' }}>{subKey}</p>
                      <div className="admin-form-grid">
                        <div className="admin-field">
                          <label>Eyebrow</label>
                          <input value={sub.eyebrow} onChange={(e) => setAboutNested('visionMission', subKey, 'eyebrow', e.target.value)} />
                        </div>
                        <div className="admin-field">
                          <label>Icon</label>
                          <select value={sub.icon || iconField} onChange={(e) => setAboutNested('visionMission', subKey, 'icon', e.target.value)}>
                            {ABOUT_ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                          </select>
                        </div>
                        <div className="admin-field span-2">
                          <label>Title</label>
                          <input value={sub.title} onChange={(e) => setAboutNested('visionMission', subKey, 'title', e.target.value)} />
                        </div>
                        <div className="admin-field span-2">
                          <label>Text</label>
                          <textarea rows="3" value={sub.text} onChange={(e) => setAboutNested('visionMission', subKey, 'text', e.target.value)} />
                        </div>
                        <ImageField id={`abt-${subKey}-image`} label="Image" value={sub.image} onChange={(v) => setAboutNested('visionMission', subKey, 'image', v)} spanTwo />
                        <div className="admin-field span-2">
                          <label>Image alt text</label>
                          <input value={sub.imageAlt} onChange={(e) => setAboutNested('visionMission', subKey, 'imageAlt', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {aboutSelected === 'offer' && (
              <>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label>Eyebrow</label>
                    <input value={sec.eyebrow} onChange={(e) => setAboutSection('offer', 'eyebrow', e.target.value)} />
                  </div>
                  <div className="admin-field" />
                  <div className="admin-field span-2">
                    <label>Heading</label>
                    <input value={sec.heading} onChange={(e) => setAboutSection('offer', 'heading', e.target.value)} />
                  </div>
                  <div className="admin-field span-2">
                    <label>Subtitle</label>
                    <input value={sec.subtitle} onChange={(e) => setAboutSection('offer', 'subtitle', e.target.value)} />
                  </div>
                  <div className="admin-field">
                    <label>Script line 1</label>
                    <input value={sec.scriptLine1} onChange={(e) => setAboutSection('offer', 'scriptLine1', e.target.value)} />
                  </div>
                  <div className="admin-field">
                    <label>Script line 2</label>
                    <input value={sec.scriptLine2} onChange={(e) => setAboutSection('offer', 'scriptLine2', e.target.value)} />
                  </div>
                  <div className="admin-field">
                    <label>Script line 3</label>
                    <input value={sec.scriptLine3} onChange={(e) => setAboutSection('offer', 'scriptLine3', e.target.value)} />
                  </div>
                </div>

                <div className="admin-cat-cards-head" style={{ marginTop: 18 }}>
                  <p className="admin-page-sub" style={{ margin: 0 }}>{sec.cards.filter((c) => c.visible !== false).length} of {sec.cards.length} active</p>
                  <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" style={{ width: 'auto' }} onClick={() => addAboutItem('offer', 'cards', (id, order) => ({ id, title: 'New card', description: '', icon: 'Leaf', image: '', linkUrl: '/', visible: true, order }))}>
                    <PlusIcon width="14" height="14" /> Add Card
                  </button>
                </div>
                <div className="admin-cat-cards">
                  {[...sec.cards].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((card, sortedIdx) => {
                    const index = sec.cards.findIndex((c) => c.id === card.id);
                    return (
                      <div key={card.id} className="admin-cat-card">
                        <div className="admin-cat-card-image">
                          {card.image ? <img src={card.image} alt={card.title} /> : <span className="admin-cat-card-noimage">No image yet</span>}
                        </div>
                        <ImageField id={`abt-offer-card-${card.id}`} label="Replace image" value={card.image} onChange={(v) => setAboutItem('offer', 'cards', index, 'image', v)} />
                        <div className="admin-field">
                          <label>Icon</label>
                          <select value={card.icon} onChange={(e) => setAboutItem('offer', 'cards', index, 'icon', e.target.value)}>
                            {ABOUT_ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                          </select>
                        </div>
                        <div className="admin-field">
                          <label>Title</label>
                          <input value={card.title} onChange={(e) => setAboutItem('offer', 'cards', index, 'title', e.target.value)} />
                        </div>
                        <div className="admin-field">
                          <label>Description</label>
                          <textarea rows="2" value={card.description} onChange={(e) => setAboutItem('offer', 'cards', index, 'description', e.target.value)} />
                        </div>
                        <div className="admin-field">
                          <label>Link URL</label>
                          <input value={card.linkUrl} onChange={(e) => setAboutItem('offer', 'cards', index, 'linkUrl', e.target.value)} />
                        </div>
                        <div className="admin-cat-card-row">
                          <div className="admin-field" style={{ flex: 1 }}>
                            <label>Visibility</label>
                            <select value={card.visible !== false ? 'show' : 'hide'} onChange={(e) => setAboutItem('offer', 'cards', index, 'visible', e.target.value === 'show')}>
                              <option value="show">Show</option>
                              <option value="hide">Hide</option>
                            </select>
                          </div>
                          <div className="admin-field" style={{ flex: 1 }}>
                            <label>Order</label>
                            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                              <button type="button" className="admin-icon-btn" onClick={() => moveAboutItem('offer', 'cards', sortedIdx, -1)} aria-label="Move up">↑</button>
                              <span>{sortedIdx + 1}</span>
                              <button type="button" className="admin-icon-btn" onClick={() => moveAboutItem('offer', 'cards', sortedIdx, 1)} aria-label="Move down">↓</button>
                            </div>
                          </div>
                        </div>
                        <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" style={{ width: '100%' }} onClick={() => duplicateAboutItem('offer', 'cards', index, 'title')}>Duplicate Card</button>
                        <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" style={{ width: '100%' }} onClick={() => removeAboutItem('offer', 'cards', index, card.title)}>
                          <TrashIcon width="14" height="14" /> Delete Card
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {aboutSelected === 'values' && (
              <>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label>Eyebrow</label>
                    <input value={sec.eyebrow} onChange={(e) => setAboutSection('values', 'eyebrow', e.target.value)} />
                  </div>
                  <div className="admin-field" />
                  <div className="admin-field span-2">
                    <label>Heading</label>
                    <input value={sec.heading} onChange={(e) => setAboutSection('values', 'heading', e.target.value)} />
                  </div>
                  <div className="admin-field span-2">
                    <label>Subtitle</label>
                    <input value={sec.subtitle} onChange={(e) => setAboutSection('values', 'subtitle', e.target.value)} />
                  </div>
                  <ImageField id="abt-values-image" label="Image" value={sec.image} onChange={(v) => setAboutSection('values', 'image', v)} spanTwo />
                  <div className="admin-field span-2">
                    <label>Image alt text</label>
                    <input value={sec.imageAlt} onChange={(e) => setAboutSection('values', 'imageAlt', e.target.value)} />
                  </div>
                  <div className="admin-field">
                    <label>Script line 1</label>
                    <input value={sec.scriptLine1} onChange={(e) => setAboutSection('values', 'scriptLine1', e.target.value)} />
                  </div>
                  <div className="admin-field">
                    <label>Script line 2</label>
                    <input value={sec.scriptLine2} onChange={(e) => setAboutSection('values', 'scriptLine2', e.target.value)} />
                  </div>
                  <div className="admin-field">
                    <label>Script line 3</label>
                    <input value={sec.scriptLine3} onChange={(e) => setAboutSection('values', 'scriptLine3', e.target.value)} />
                  </div>
                  <div className="admin-field">
                    <label>Script line 4</label>
                    <input value={sec.scriptLine4} onChange={(e) => setAboutSection('values', 'scriptLine4', e.target.value)} />
                  </div>
                </div>

                <div className="admin-cat-cards-head" style={{ marginTop: 18 }}>
                  <p className="admin-page-sub" style={{ margin: 0 }}>Value items ({sec.items.filter((i) => i.visible !== false).length} of {sec.items.length} active)</p>
                  <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" style={{ width: 'auto' }} onClick={() => addAboutItem('values', 'items', (id, order) => ({ id, icon: 'Diamond', label: 'New value', visible: true, order }))}>
                    <PlusIcon width="14" height="14" /> Add Value
                  </button>
                </div>
                {[...sec.items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((item, sortedIdx) => {
                  const index = sec.items.findIndex((i) => i.id === item.id);
                  return (
                    <div key={item.id} className="admin-content-item" style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1, flexWrap: 'wrap' }}>
                        <select value={item.icon} onChange={(e) => setAboutItem('values', 'items', index, 'icon', e.target.value)} style={{ width: 110 }}>
                          {ABOUT_ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                        </select>
                        <input value={item.label} onChange={(e) => setAboutItem('values', 'items', index, 'label', e.target.value)} style={{ flex: 1, minWidth: 140 }} aria-label="Label" />
                        <select value={item.visible !== false ? 'show' : 'hide'} onChange={(e) => setAboutItem('values', 'items', index, 'visible', e.target.value === 'show')}>
                          <option value="show">Show</option>
                          <option value="hide">Hide</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button type="button" className="admin-icon-btn" onClick={() => moveAboutItem('values', 'items', sortedIdx, -1)} aria-label="Move up">↑</button>
                        <button type="button" className="admin-icon-btn" onClick={() => moveAboutItem('values', 'items', sortedIdx, 1)} aria-label="Move down">↓</button>
                        <button type="button" className="admin-icon-btn danger" onClick={() => removeAboutItem('values', 'items', index, item.label)} aria-label="Delete"><TrashIcon width="14" height="14" /></button>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {aboutSelected === 'whyChoose' && (
              <>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label>Eyebrow</label>
                    <input value={sec.eyebrow} onChange={(e) => setAboutSection('whyChoose', 'eyebrow', e.target.value)} />
                  </div>
                  <div className="admin-field" />
                  <div className="admin-field span-2">
                    <label>Heading</label>
                    <input value={sec.heading} onChange={(e) => setAboutSection('whyChoose', 'heading', e.target.value)} />
                  </div>
                  <div className="admin-field span-2">
                    <label>Subtitle</label>
                    <input value={sec.subtitle} onChange={(e) => setAboutSection('whyChoose', 'subtitle', e.target.value)} />
                  </div>
                </div>

                <div className="admin-cat-cards-head" style={{ marginTop: 18 }}>
                  <p className="admin-page-sub" style={{ margin: 0 }}>{sec.items.filter((i) => i.visible !== false).length} of {sec.items.length} active</p>
                  <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" style={{ width: 'auto' }} onClick={() => addAboutItem('whyChoose', 'items', (id, order) => ({ id, icon: 'Leaf', title: 'New reason', text: '', visible: true, order }))}>
                    <PlusIcon width="14" height="14" /> Add Item
                  </button>
                </div>
                {[...sec.items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((item, sortedIdx) => {
                  const index = sec.items.findIndex((i) => i.id === item.id);
                  return (
                    <div key={item.id} className="admin-panel" style={{ background: 'var(--admin-bg)', marginBottom: 12, padding: 16 }}>
                      <div className="admin-cat-card-row">
                        <div className="admin-field" style={{ flex: 1 }}>
                          <label>Icon</label>
                          <select value={item.icon} onChange={(e) => setAboutItem('whyChoose', 'items', index, 'icon', e.target.value)}>
                            {ABOUT_ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                          </select>
                        </div>
                        <div className="admin-field" style={{ flex: 2 }}>
                          <label>Title</label>
                          <input value={item.title} onChange={(e) => setAboutItem('whyChoose', 'items', index, 'title', e.target.value)} />
                        </div>
                      </div>
                      <div className="admin-field">
                        <label>Text</label>
                        <textarea rows="2" value={item.text} onChange={(e) => setAboutItem('whyChoose', 'items', index, 'text', e.target.value)} />
                      </div>
                      <div className="admin-cat-card-row">
                        <div className="admin-field" style={{ flex: 1 }}>
                          <label>Status</label>
                          <select value={item.visible !== false ? 'active' : 'inactive'} onChange={(e) => setAboutItem('whyChoose', 'items', index, 'visible', e.target.value === 'active')}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                        <div className="admin-field" style={{ flex: 1 }}>
                          <label>Order</label>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <button type="button" className="admin-icon-btn" onClick={() => moveAboutItem('whyChoose', 'items', sortedIdx, -1)} aria-label="Move up">↑</button>
                            <span>{sortedIdx + 1}</span>
                            <button type="button" className="admin-icon-btn" onClick={() => moveAboutItem('whyChoose', 'items', sortedIdx, 1)} aria-label="Move down">↓</button>
                          </div>
                        </div>
                      </div>
                      <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" style={{ width: '100%' }} onClick={() => removeAboutItem('whyChoose', 'items', index, item.title)}>
                        <TrashIcon width="14" height="14" /> Delete
                      </button>
                    </div>
                  );
                })}
              </>
            )}

            {aboutSelected === 'journey' && (
              <>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label>Eyebrow</label>
                    <input value={sec.eyebrow} onChange={(e) => setAboutSection('journey', 'eyebrow', e.target.value)} />
                  </div>
                  <div className="admin-field" />
                  <div className="admin-field span-2">
                    <label>Heading</label>
                    <input value={sec.heading} onChange={(e) => setAboutSection('journey', 'heading', e.target.value)} />
                  </div>
                  <div className="admin-field span-2">
                    <label>Subtitle</label>
                    <input value={sec.subtitle} onChange={(e) => setAboutSection('journey', 'subtitle', e.target.value)} />
                  </div>
                </div>

                <div className="admin-cat-cards-head" style={{ marginTop: 18 }}>
                  <p className="admin-page-sub" style={{ margin: 0 }}>Milestones ({sec.items.filter((i) => i.visible !== false).length} of {sec.items.length} active)</p>
                  <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" style={{ width: 'auto' }} onClick={() => addAboutItem('journey', 'items', (id, order) => ({ id, year: String(new Date().getFullYear()), label: 'New milestone', image: '', visible: true, order }))}>
                    <PlusIcon width="14" height="14" /> Add Milestone
                  </button>
                </div>
                <div className="admin-cat-cards">
                  {[...sec.items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((item, sortedIdx) => {
                    const index = sec.items.findIndex((i) => i.id === item.id);
                    return (
                      <div key={item.id} className="admin-cat-card">
                        <div className="admin-cat-card-image">
                          {item.image ? <img src={item.image} alt={item.label} /> : <span className="admin-cat-card-noimage">No image yet</span>}
                        </div>
                        <ImageField id={`abt-journey-${item.id}`} label="Replace image" value={item.image} onChange={(v) => setAboutItem('journey', 'items', index, 'image', v)} />
                        <div className="admin-field">
                          <label>Year</label>
                          <input value={item.year} onChange={(e) => setAboutItem('journey', 'items', index, 'year', e.target.value)} />
                        </div>
                        <div className="admin-field">
                          <label>Label</label>
                          <input value={item.label} onChange={(e) => setAboutItem('journey', 'items', index, 'label', e.target.value)} />
                        </div>
                        <div className="admin-cat-card-row">
                          <div className="admin-field" style={{ flex: 1 }}>
                            <label>Visibility</label>
                            <select value={item.visible !== false ? 'show' : 'hide'} onChange={(e) => setAboutItem('journey', 'items', index, 'visible', e.target.value === 'show')}>
                              <option value="show">Show</option>
                              <option value="hide">Hide</option>
                            </select>
                          </div>
                          <div className="admin-field" style={{ flex: 1 }}>
                            <label>Order</label>
                            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                              <button type="button" className="admin-icon-btn" onClick={() => moveAboutItem('journey', 'items', sortedIdx, -1)} aria-label="Move up">↑</button>
                              <span>{sortedIdx + 1}</span>
                              <button type="button" className="admin-icon-btn" onClick={() => moveAboutItem('journey', 'items', sortedIdx, 1)} aria-label="Move down">↓</button>
                            </div>
                          </div>
                        </div>
                        <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" style={{ width: '100%' }} onClick={() => removeAboutItem('journey', 'items', index, item.label)}>
                          <TrashIcon width="14" height="14" /> Delete Milestone
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {aboutSelected === 'finalCta' && (
              <div className="admin-form-grid">
                <div className="admin-field span-2">
                  <label>Title</label>
                  <input value={sec.title} onChange={(e) => setAboutSection('finalCta', 'title', e.target.value)} />
                </div>
                <div className="admin-field span-2">
                  <label>Text</label>
                  <textarea rows="2" value={sec.text} onChange={(e) => setAboutSection('finalCta', 'text', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label>Button text</label>
                  <input value={sec.buttonText} onChange={(e) => setAboutSection('finalCta', 'buttonText', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label>Button URL</label>
                  <input value={sec.buttonUrl} onChange={(e) => setAboutSection('finalCta', 'buttonUrl', e.target.value)} />
                </div>
                <ImageField id="abt-cta-bg" label="Background image" value={sec.backgroundImage} onChange={(v) => setAboutSection('finalCta', 'backgroundImage', v)} spanTwo />
              </div>
            )}

            <SectionActions onSave={handleSave} onPublish={handleSave} onReset={() => resetAboutSection(aboutSelected)} onCancel={cancelSectionEdits} />
          </div>
        );
      })()}

      {page === 'plants' && (() => {
        const hub = content.plantsHub;
        const allPlantCategories = PLANTS_NAV_CATEGORY_SLUGS.map((slug) => categories.find((c) => c.slug === slug)).filter(Boolean);
        return (
          <div className="admin-panel">
            <p className="admin-panel-title">Plants Page &amp; Navbar</p>
            <div className="admin-mock-banner" style={{ marginBottom: 18 }}>
              The Plants page's hero banner, "Explore Plant Categories" row and "Popular Plants" grid are now fully
              editable - including per-card image and text - from the Visual Editor (Admin → Pages → Plants). This
              panel now only controls the "Plants ▾" navbar dropdown, which isn't part of that page.
            </div>

            <p className="admin-panel-title" style={{ marginTop: 4 }}>
              Navbar "Plants" dropdown ({hub.navbarCategorySlugs.length} of 5 selected)
            </p>
            <p className="admin-page-sub" style={{ marginTop: -10, marginBottom: 14 }}>
              Pick exactly the categories shown in the Plants navbar dropdown. Order here is the order shown.
            </p>
            {hub.navbarCategorySlugs.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                {hub.navbarCategorySlugs.map((slug, i) => {
                  const cat = categories.find((c) => c.slug === slug);
                  if (!cat) return null;
                  return (
                    <div key={slug} className="admin-content-item">
                      <span style={{ fontSize: '0.86rem' }}>{cat.label}</span>
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        <button type="button" className="admin-icon-btn" onClick={() => moveNavbarCategory(i, -1)} aria-label="Move up">↑</button>
                        <button type="button" className="admin-icon-btn" onClick={() => moveNavbarCategory(i, 1)} aria-label="Move down">↓</button>
                        <button type="button" className="admin-icon-btn danger" onClick={() => toggleNavbarCategory(slug)} aria-label="Remove">
                          <TrashIcon width="14" height="14" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ maxHeight: 220, overflowY: 'auto', border: '1px solid var(--admin-border)', borderRadius: 8, padding: 8 }}>
              {allPlantCategories.filter((c) => !hub.navbarCategorySlugs.includes(c.slug)).map((c) => (
                <label key={c.slug} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 6px', fontSize: '0.86rem' }}>
                  <input type="checkbox" checked={false} onChange={() => toggleNavbarCategory(c.slug)} />
                  {c.label}
                </label>
              ))}
            </div>

            <SectionActions
              onSave={handleSave}
              onPublish={handleSave}
              onReset={() => {
                if (!confirm('Reset the Plants navbar dropdown back to the site default? This discards your edits.')) return;
                setContent((prev) => ({ ...prev, plantsHub: DEFAULT_SITE_CONTENT.plantsHub }));
                setSaved(false);
              }}
              onCancel={cancelSectionEdits}
            />
          </div>
        );
      })()}

      {['seeds', 'pots', 'plantcare'].includes(page) && (() => {
        const config = { seeds: SECTION_HUBS.seeds, pots: SECTION_HUBS.potsPlanters, plantcare: SECTION_HUBS.plantCare }[page];
        return (
          <div className="admin-panel">
            <p className="admin-panel-title">{config.navLabel} Page</p>
            <div className="admin-mock-banner">
              The {config.navLabel} page (hero, categories and popular products) is now fully editable from the
              Visual Editor - go to Admin → Pages → {config.navLabel} to edit its hero text/background, each
              category card's image and name, and the curated product list, with the exact same live preview as the
              real page.
            </div>
          </div>
        );
      })()}

      {page === 'home' && activeMeta && (
        <>
          <p className="admin-cell-sub" style={{ margin: '-10px 0 10px 2px' }}>Appears on: {activeMeta.live}</p>

          {selected === 'hero' && (
            <div className="admin-panel">
              <p className="admin-panel-title">Hero Banner</p>
              <div className="admin-form-grid">
                <div className="admin-field span-2">
                  <label htmlFor="h-tag">Tag text</label>
                  <input id="h-tag" value={content.hero.tag} onChange={(e) => setHero('tag', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="h-line1">Title, line 1</label>
                  <input id="h-line1" value={content.hero.titleLine1} onChange={(e) => setHero('titleLine1', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="h-line2">Title, line 2 (highlighted)</label>
                  <input id="h-line2" value={content.hero.titleLine2} onChange={(e) => setHero('titleLine2', e.target.value)} />
                </div>
                <div className="admin-field span-2">
                  <label htmlFor="h-desc">Description</label>
                  <textarea id="h-desc" rows="3" value={content.hero.description} onChange={(e) => setHero('description', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="h-btn1">Primary button text</label>
                  <input id="h-btn1" value={content.hero.primaryButtonText} onChange={(e) => setHero('primaryButtonText', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="h-btn2">Secondary button text</label>
                  <input id="h-btn2" value={content.hero.secondaryButtonText} onChange={(e) => setHero('secondaryButtonText', e.target.value)} />
                </div>
                <HeroVideoField value={content.hero.videoUrl} onChange={(v) => setHero('videoUrl', v)} />
              </div>
              <SectionActions onSave={handleSave} onPublish={handleSave} onReset={() => resetOneSection('hero')} onCancel={cancelSectionEdits} />
            </div>
          )}

          {selected === 'ourStory' && (
            <div className="admin-panel">
              <p className="admin-panel-title">Our Story</p>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="os-visible">Section visibility</label>
                  <select id="os-visible" value={content.ourStory.visible ? 'show' : 'hide'} onChange={(e) => setOurStory('visible', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label htmlFor="os-order">Display order</label>
                  <input id="os-order" type="number" value={content.ourStory.displayOrder} onChange={(e) => setOurStory('displayOrder', Number(e.target.value))} />
                </div>

                <div className="admin-field">
                  <label htmlFor="os-small">Small heading (eyebrow)</label>
                  <input id="os-small" value={content.ourStory.smallHeading} onChange={(e) => setOurStory('smallHeading', e.target.value)} />
                </div>
                <div className="admin-field" />
                <div className="admin-field">
                  <label htmlFor="os-h1">Main heading, part 1</label>
                  <input id="os-h1" value={content.ourStory.mainHeadingPart1} onChange={(e) => setOurStory('mainHeadingPart1', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="os-h2">Main heading, part 2 (accent color)</label>
                  <input id="os-h2" value={content.ourStory.mainHeadingPart2} onChange={(e) => setOurStory('mainHeadingPart2', e.target.value)} />
                </div>

                <div className="admin-field span-2">
                  <label htmlFor="os-desc">Description</label>
                  <textarea id="os-desc" rows="3" value={content.ourStory.description} onChange={(e) => setOurStory('description', e.target.value)} />
                </div>

                <div className="admin-field">
                  <label htmlFor="os-btn-text">Button text</label>
                  <input id="os-btn-text" value={content.ourStory.buttonText} onChange={(e) => setOurStory('buttonText', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="os-btn-url">Button URL</label>
                  <input id="os-btn-url" value={content.ourStory.buttonUrl} onChange={(e) => setOurStory('buttonUrl', e.target.value)} />
                </div>

                <ImageField
                  id="os-bg"
                  label="Background image (optional - leave empty for the plain background)"
                  value={content.ourStory.backgroundImage}
                  onChange={(v) => setOurStory('backgroundImage', v)}
                  spanTwo
                />
                <div className="admin-field">
                  <label htmlFor="os-overlay">Background overlay opacity (0-1)</label>
                  <input id="os-overlay" type="number" min="0" max="1" step="0.05" value={content.ourStory.overlayOpacity} onChange={(e) => setOurStory('overlayOpacity', Number(e.target.value))} />
                </div>
                <div className="admin-field">
                  <label htmlFor="os-bg-color">Background color (leave empty for default)</label>
                  <input id="os-bg-color" type="color" value={content.ourStory.backgroundColor || '#ffffff'} onChange={(e) => setOurStory('backgroundColor', e.target.value)} />
                </div>

                <div className="admin-field">
                  <label htmlFor="os-text-color">Heading text color (part 1)</label>
                  <input id="os-text-color" type="color" value={content.ourStory.textColor || '#16241c'} onChange={(e) => setOurStory('textColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="os-accent-color">Heading accent color (part 2)</label>
                  <input id="os-accent-color" type="color" value={content.ourStory.accentColor || '#1b4b36'} onChange={(e) => setOurStory('accentColor', e.target.value)} />
                </div>

                <div className="admin-field">
                  <label htmlFor="os-font-size">Heading font size (e.g. 2.4rem)</label>
                  <input id="os-font-size" placeholder="2.4rem" value={content.ourStory.fontSize} onChange={(e) => setOurStory('fontSize', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="os-padding">Section padding, top &amp; bottom (e.g. 72px)</label>
                  <input id="os-padding" placeholder="72px" value={content.ourStory.paddingY} onChange={(e) => setOurStory('paddingY', e.target.value)} />
                </div>

                <div className="admin-field">
                  <label htmlFor="os-animation">Fade-in animation on scroll</label>
                  <select id="os-animation" value={content.ourStory.animation ? 'on' : 'off'} onChange={(e) => setOurStory('animation', e.target.value === 'on')}>
                    <option value="on">On</option>
                    <option value="off">Off</option>
                  </select>
                </div>
              </div>
              <p className="admin-page-sub" style={{ marginTop: 4 }}>
                This section has no cards - it's a single heading/description/button block, so no card manager applies here.
              </p>
              <SectionActions onSave={handleSave} onPublish={handleSave} onReset={() => resetOneSection('ourStory')} onCancel={cancelSectionEdits} />
            </div>
          )}

          {selected === 'plantsPeopleLove' && (
            <div className="admin-panel">
              <p className="admin-panel-title">Plants People Love</p>
              <div className="admin-mock-banner" style={{ marginBottom: 18 }}>
                Every card below is loaded live from the real product catalogue - the same data shown on the
                homepage right now. Editing a field here and clicking <strong>Save product</strong> updates that
                product everywhere on the site (this section, category pages, search...), because it writes to the
                same record the <strong>Products</strong> page uses. "DETAILS" button text/link, and the
                wishlist/cart icons, are shared site-wide chrome on every product card and aren't editable per
                product here - editing them would change every product on every page, not just this section.
                Discount % is always calculated automatically from current price vs. original price.
              </div>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="ppl-visible">Section visibility</label>
                  <select id="ppl-visible" value={content.plantsPeopleLove.visible ? 'show' : 'hide'} onChange={(e) => setPlantsPeopleLove('visible', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
                <div className="admin-field" />
                <div className="admin-field">
                  <label htmlFor="ppl-eyebrow">Small heading</label>
                  <input id="ppl-eyebrow" value={content.plantsPeopleLove.eyebrow} onChange={(e) => setPlantsPeopleLove('eyebrow', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="ppl-heading">Main heading</label>
                  <input id="ppl-heading" value={content.plantsPeopleLove.heading} onChange={(e) => setPlantsPeopleLove('heading', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="ppl-see-text">"See all" text</label>
                  <input id="ppl-see-text" value={content.plantsPeopleLove.seeAllText} onChange={(e) => setPlantsPeopleLove('seeAllText', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="ppl-see-link">"See all" link</label>
                  <input id="ppl-see-link" value={content.plantsPeopleLove.seeAllLink} onChange={(e) => setPlantsPeopleLove('seeAllLink', e.target.value)} />
                </div>
              </div>

              <p className="admin-panel-title" style={{ marginTop: 18 }}>
                Products shown here {content.plantsPeopleLove.productIds.length === 0 ? '(automatic: 8 highest-rated plants)' : '(curated list)'}
              </p>
              <p className="admin-page-sub" style={{ marginTop: -10, marginBottom: 14 }}>
                These are the exact products currently on the homepage, fully editable below. Reordering, removing,
                duplicating or adding a product here also switches this section to a curated list (leave the list
                empty and save to go back to automatic mode).
              </p>

              <div className="admin-cat-cards" style={{ marginBottom: 20 }}>
                {getDisplayedPplProducts().map((p, i) => (
                  <ProductEditorCard
                    key={p.id}
                    product={p}
                    categories={categories}
                    onSave={updateProduct}
                    onDuplicate={() => handleDuplicatePplProduct(p)}
                    onDelete={() => handleDeletePplProduct(p)}
                    onRemove={() => removePplProduct(p.id)}
                    onMove={(dir) => movePplProduct(i, dir)}
                  />
                ))}
              </div>

              <div className="admin-field">
                <label htmlFor="ppl-search">Add another product to this section</label>
                <input id="ppl-search" value={pplSearch} onChange={(e) => setPplSearch(e.target.value)} placeholder="Type a plant name..." />
              </div>
              {pplSearch.trim() && (
                <div style={{ maxHeight: 260, overflowY: 'auto', border: '1px solid var(--admin-border)', borderRadius: 8 }}>
                  {products
                    .filter((p) => p.name.toLowerCase().includes(pplSearch.trim().toLowerCase()) && !getDisplayedPplProducts().some((x) => x.id === p.id))
                    .slice(0, 20)
                    .map((p) => (
                      <div key={p.id} className="admin-content-item">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {p.image && <img src={p.image} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />}
                          <span style={{ fontSize: '0.86rem' }}>{p.name}</span>
                        </div>
                        <button
                          type="button"
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() => {
                            setContent((prev) => {
                              const currentIds = prev.plantsPeopleLove.productIds.length > 0
                                ? prev.plantsPeopleLove.productIds
                                : getDisplayedPplProducts().map((x) => x.id);
                              return { ...prev, plantsPeopleLove: { ...prev.plantsPeopleLove, productIds: [...currentIds, p.id] } };
                            });
                            setSaved(false);
                            setPplSearch('');
                          }}
                        >
                          <PlusIcon width="12" height="12" /> Add
                        </button>
                      </div>
                    ))}
                </div>
              )}

              <SectionActions onSave={handleSave} onPublish={handleSave} onReset={() => resetOneSection('plantsPeopleLove')} onCancel={cancelSectionEdits} />
            </div>
          )}

          {selected === 'justIn' && (
            <div className="admin-panel">
              <p className="admin-panel-title">Just In</p>
              <div className="admin-mock-banner" style={{ marginBottom: 18 }}>
                Every card below is loaded live from the real product catalogue - the same 5 products shown on the
                homepage right now. Editing a field here and clicking <strong>Save product</strong> updates that
                product everywhere on the site, because it writes to the same record the <strong>Products</strong>{' '}
                page uses. "DETAILS" button text/link, and the wishlist/cart icons, are shared site-wide chrome on
                every product card and aren't editable per product here - editing them would change every product on
                every page, not just this section. Discount % is always calculated automatically from current price
                vs. original price.
              </div>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="ji-visible">Section visibility</label>
                  <select id="ji-visible" value={content.justIn.visible ? 'show' : 'hide'} onChange={(e) => setJustIn('visible', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
                <div className="admin-field" />
                <div className="admin-field">
                  <label htmlFor="ji-title">Section title</label>
                  <input id="ji-title" value={content.justIn.title} onChange={(e) => setJustIn('title', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="ji-subtitle">Subtitle</label>
                  <input id="ji-subtitle" value={content.justIn.subtitle} onChange={(e) => setJustIn('subtitle', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="ji-view-text">"View All" text</label>
                  <input id="ji-view-text" value={content.justIn.viewAllText} onChange={(e) => setJustIn('viewAllText', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="ji-view-link">"View All" link</label>
                  <input id="ji-view-link" value={content.justIn.viewAllLink} onChange={(e) => setJustIn('viewAllLink', e.target.value)} />
                </div>
              </div>

              <p className="admin-panel-title" style={{ marginTop: 18 }}>
                Products shown here {content.justIn.productIds.length === 0 ? '(automatic: today\'s live "Just In" pick)' : '(curated list)'}
              </p>
              <p className="admin-page-sub" style={{ marginTop: -10, marginBottom: 14 }}>
                These are the exact products currently in this section, fully editable below. Reordering, removing,
                duplicating or adding a product here also switches this section to a curated list (leave the list
                empty and save to go back to automatic mode).
              </p>

              <div className="admin-cat-cards" style={{ marginBottom: 20 }}>
                {getDisplayedJiProducts().map((p, i) => (
                  <ProductEditorCard
                    key={p.id}
                    product={p}
                    categories={categories}
                    onSave={updateProduct}
                    onDuplicate={() => handleDuplicateJiProduct(p)}
                    onDelete={() => handleDeleteJiProduct(p)}
                    onRemove={() => removeJiProduct(p.id)}
                    onMove={(dir) => moveJiProduct(i, dir)}
                    showNewBadgeToggle
                  />
                ))}
              </div>

              <div className="admin-field">
                <label htmlFor="ji-search">Add another product to this section</label>
                <input id="ji-search" value={jiSearch} onChange={(e) => setJiSearch(e.target.value)} placeholder="Type a plant name..." />
              </div>
              {jiSearch.trim() && (
                <div style={{ maxHeight: 260, overflowY: 'auto', border: '1px solid var(--admin-border)', borderRadius: 8 }}>
                  {products
                    .filter((p) => p.name.toLowerCase().includes(jiSearch.trim().toLowerCase()) && !getDisplayedJiProducts().some((x) => x.id === p.id))
                    .slice(0, 20)
                    .map((p) => (
                      <div key={p.id} className="admin-content-item">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {p.image && <img src={p.image} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />}
                          <span style={{ fontSize: '0.86rem' }}>{p.name}</span>
                        </div>
                        <button
                          type="button"
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() => {
                            setContent((prev) => {
                              const currentIds = prev.justIn.productIds.length > 0
                                ? prev.justIn.productIds
                                : getDisplayedJiProducts().map((x) => x.id);
                              return { ...prev, justIn: { ...prev.justIn, productIds: [...currentIds, p.id] } };
                            });
                            setSaved(false);
                            setJiSearch('');
                          }}
                        >
                          <PlusIcon width="12" height="12" /> Add
                        </button>
                      </div>
                    ))}
                </div>
              )}

              <SectionActions onSave={handleSave} onPublish={handleSave} onReset={() => resetOneSection('justIn')} onCancel={cancelSectionEdits} />
            </div>
          )}

          {selected === 'homeCorners' && (
            <div className="admin-panel">
              <p className="admin-panel-title">Plants for Every Corner of Your Home</p>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="hc-visible">Section visibility</label>
                  <select id="hc-visible" value={content.homeCorners.visible ? 'show' : 'hide'} onChange={(e) => setHomeCorners('visible', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
                <div className="admin-field" />
                <div className="admin-field">
                  <label htmlFor="hc-title">Section title</label>
                  <input id="hc-title" value={content.homeCorners.title} onChange={(e) => setHomeCorners('title', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="hc-subtitle">Subtitle (optional)</label>
                  <input id="hc-subtitle" value={content.homeCorners.subtitle} placeholder="Leave empty for no subtitle" onChange={(e) => setHomeCorners('subtitle', e.target.value)} />
                </div>
                <ImageField
                  id="hc-bg"
                  label="Background image (optional - leave empty for the plain background)"
                  value={content.homeCorners.backgroundImage}
                  onChange={(v) => setHomeCorners('backgroundImage', v)}
                  spanTwo
                />
              </div>

              <div className="admin-cat-cards-head">
                <p className="admin-panel-title" style={{ marginBottom: 0 }}>
                  Cards ({content.homeCorners.cards.filter((c) => c.visible !== false).length} of {content.homeCorners.cards.length} visible)
                </p>
                <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" style={{ width: 'auto' }} onClick={addCornerCard}>
                  <PlusIcon width="14" height="14" /> Add New Card
                </button>
              </div>

              <div className="admin-cat-cards">
                {[...content.homeCorners.cards].sort((a, b) => a.order - b.order).map((card, sortedIndex) => {
                  const index = content.homeCorners.cards.findIndex((c) => c.id === card.id);
                  return (
                    <div key={card.id} className="admin-cat-card">
                      <div className="admin-cat-card-image">
                        {card.image ? <img src={card.image} alt={card.title} /> : <span className="admin-cat-card-noimage">No image yet</span>}
                      </div>
                      <ImageField
                        id={`hc-card-${card.id}`}
                        label="Replace image"
                        value={card.image}
                        onChange={(v) => setCornerCard(index, 'image', v)}
                      />
                      <div className="admin-field">
                        <label>Card title</label>
                        <input value={card.title} onChange={(e) => setCornerCard(index, 'title', e.target.value)} />
                      </div>
                      <div className="admin-field">
                        <label>Icon</label>
                        <select value={card.icon} onChange={(e) => setCornerCard(index, 'icon', e.target.value)}>
                          <option value="sofa">Sofa (living room)</option>
                          <option value="bed">Bed (bedroom)</option>
                          <option value="balcony">Balcony</option>
                          <option value="officeChair">Office chair</option>
                        </select>
                      </div>
                      <div className="admin-field">
                        <label>Button text</label>
                        <input value={card.buttonText} onChange={(e) => setCornerCard(index, 'buttonText', e.target.value)} />
                      </div>
                      <div className="admin-field">
                        <label>Button link</label>
                        <input value={card.buttonLink} onChange={(e) => setCornerCard(index, 'buttonLink', e.target.value)} />
                      </div>
                      <div className="admin-cat-card-row">
                        <div className="admin-field" style={{ flex: 1 }}>
                          <label>Visibility</label>
                          <select value={card.visible !== false ? 'show' : 'hide'} onChange={(e) => setCornerCard(index, 'visible', e.target.value === 'show')}>
                            <option value="show">Show</option>
                            <option value="hide">Hide</option>
                          </select>
                        </div>
                        <div className="admin-field" style={{ flex: 1 }}>
                          <label>Display order</label>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <button type="button" className="admin-icon-btn" onClick={() => moveCornerCard(sortedIndex, -1)} aria-label="Move up">↑</button>
                            <span>{card.order}</span>
                            <button type="button" className="admin-icon-btn" onClick={() => moveCornerCard(sortedIndex, 1)} aria-label="Move down">↓</button>
                          </div>
                        </div>
                      </div>
                      <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" style={{ width: '100%' }} onClick={() => duplicateCornerCard(card.id)}>
                        Duplicate Card
                      </button>
                      <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" style={{ width: '100%' }} onClick={() => removeCornerCard(card.id, card.title)}>
                        <TrashIcon width="14" height="14" /> Delete Card
                      </button>
                    </div>
                  );
                })}
              </div>

              <SectionActions onSave={handleSave} onPublish={handleSave} onReset={() => resetOneSection('homeCorners')} onCancel={cancelSectionEdits} />
            </div>
          )}

          {selected === 'shopByCategory' && (
            <div className="admin-panel">
              <p className="admin-panel-title">Shop by Category</p>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="sbc-visible">Section visibility</label>
                  <select id="sbc-visible" value={content.shopByCategory.visible ? 'show' : 'hide'} onChange={(e) => setShopByCategory('visible', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
                <div className="admin-field" />
                <div className="admin-field">
                  <label htmlFor="sbc-title">Section title</label>
                  <input id="sbc-title" value={content.shopByCategory.title} onChange={(e) => setShopByCategory('title', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="sbc-subtitle">Subtitle</label>
                  <input id="sbc-subtitle" value={content.shopByCategory.subtitle} onChange={(e) => setShopByCategory('subtitle', e.target.value)} />
                </div>
              </div>

              <div className="admin-cat-cards-head">
                <p className="admin-panel-title" style={{ marginBottom: 0 }}>
                  Categories ({content.shopByCategory.tiles.filter((t) => t.visible !== false).length} of {content.shopByCategory.tiles.length} visible)
                </p>
                <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" style={{ width: 'auto' }} onClick={addTile}>
                  <PlusIcon width="14" height="14" /> Add New Category
                </button>
              </div>

              <div className="admin-cat-cards">
                {[...content.shopByCategory.tiles].sort((a, b) => a.order - b.order).map((tile, sortedIndex) => {
                  const index = content.shopByCategory.tiles.findIndex((x) => x.slug === tile.slug);
                  const liveCategoryImage = categories.find((c) => c.slug === tile.slug)?.image;
                  const currentImage = tile.image || liveCategoryImage;
                  return (
                    <div key={tile.slug} className="admin-cat-card">
                      <div className="admin-cat-card-image">
                        {currentImage ? (
                          <img src={currentImage} alt={tile.label} />
                        ) : (
                          <span className="admin-cat-card-noimage">No image yet</span>
                        )}
                      </div>
                      <ImageField
                        id={`sbc-tile-${tile.slug}`}
                        label="Replace image"
                        value={tile.image}
                        onChange={(v) => setTile(index, 'image', v)}
                      />
                      <div className="admin-field">
                        <label>Category name</label>
                        <input value={tile.label} onChange={(e) => setTile(index, 'label', e.target.value)} />
                      </div>
                      <div className="admin-field">
                        <label>Explore button text</label>
                        <input value={tile.exploreText} placeholder="Explore →" onChange={(e) => setTile(index, 'exploreText', e.target.value)} />
                      </div>
                      <div className="admin-cat-card-row">
                        <div className="admin-field" style={{ flex: 1 }}>
                          <label>Visibility</label>
                          <select value={tile.visible !== false ? 'show' : 'hide'} onChange={(e) => setTile(index, 'visible', e.target.value === 'show')}>
                            <option value="show">Show</option>
                            <option value="hide">Hide</option>
                          </select>
                        </div>
                        <div className="admin-field" style={{ flex: 1 }}>
                          <label>Display order</label>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <button type="button" className="admin-icon-btn" onClick={() => moveTile(sortedIndex, -1)} aria-label="Move up">↑</button>
                            <span>{tile.order}</span>
                            <button type="button" className="admin-icon-btn" onClick={() => moveTile(sortedIndex, 1)} aria-label="Move down">↓</button>
                          </div>
                        </div>
                      </div>
                      <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" style={{ width: '100%' }} onClick={() => removeTile(tile.slug, tile.label)}>
                        <TrashIcon width="14" height="14" /> Delete Category
                      </button>
                    </div>
                  );
                })}
              </div>

              <SectionActions onSave={handleSave} onPublish={handleSave} onReset={() => resetOneSection('shopByCategory')} onCancel={cancelSectionEdits} />
            </div>
          )}

          {selected === 'completeGarden' && (
            <div className="admin-panel">
              <p className="admin-panel-title">Complete Your Garden, Not Just Your Cart</p>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="cg-visible">Section visibility</label>
                  <select id="cg-visible" value={content.completeGarden.visible ? 'show' : 'hide'} onChange={(e) => setCompleteGarden('visible', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label htmlFor="cg-order">Display order</label>
                  <input id="cg-order" type="number" value={content.completeGarden.displayOrder} onChange={(e) => setCompleteGarden('displayOrder', Number(e.target.value))} />
                </div>
                <div className="admin-field span-2">
                  <label htmlFor="cg-heading">Heading</label>
                  <input id="cg-heading" value={content.completeGarden.heading} onChange={(e) => setCompleteGarden('heading', e.target.value)} />
                </div>
                <div className="admin-field span-2">
                  <label htmlFor="cg-desc">Description</label>
                  <textarea id="cg-desc" rows="2" value={content.completeGarden.description} onChange={(e) => setCompleteGarden('description', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="cg-btn-text">Button text</label>
                  <input id="cg-btn-text" value={content.completeGarden.buttonText} onChange={(e) => setCompleteGarden('buttonText', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="cg-btn-url">Button URL</label>
                  <input id="cg-btn-url" value={content.completeGarden.buttonUrl} onChange={(e) => setCompleteGarden('buttonUrl', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="cg-btn-visible">Button visibility</label>
                  <select id="cg-btn-visible" value={content.completeGarden.buttonVisible !== false ? 'show' : 'hide'} onChange={(e) => setCompleteGarden('buttonVisible', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
                <div className="admin-field" />
                <div className="admin-field">
                  <label htmlFor="cg-bg-color">Background color</label>
                  <input id="cg-bg-color" type="color" value={content.completeGarden.backgroundColor || '#ffffff'} onChange={(e) => setCompleteGarden('backgroundColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="cg-text-color">Heading text color</label>
                  <input id="cg-text-color" type="color" value={content.completeGarden.textColor || '#16241c'} onChange={(e) => setCompleteGarden('textColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="cg-font-size">Heading font size (e.g. 2rem)</label>
                  <input id="cg-font-size" placeholder="2rem" value={content.completeGarden.fontSize} onChange={(e) => setCompleteGarden('fontSize', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="cg-padding">Section padding (e.g. 64px)</label>
                  <input id="cg-padding" placeholder="64px" value={content.completeGarden.paddingY} onChange={(e) => setCompleteGarden('paddingY', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="cg-animation">Fade-in animation</label>
                  <select id="cg-animation" value={content.completeGarden.animation ? 'on' : 'off'} onChange={(e) => setCompleteGarden('animation', e.target.value === 'on')}>
                    <option value="on">On</option>
                    <option value="off">Off</option>
                  </select>
                </div>
              </div>

              <p className="admin-panel-title" style={{ marginTop: 18 }}>Video</p>
              <div className="admin-form-grid">
                <VideoField id="cg-video" label="Section video" value={content.completeGarden.videoUrl} onChange={(v) => setCompleteGarden('videoUrl', v)} />
                <ImageField id="cg-video-poster" label="Video poster image (shown before it loads)" value={content.completeGarden.videoPoster} onChange={(v) => setCompleteGarden('videoPoster', v)} />
                <div className="admin-field">
                  <label htmlFor="cg-video-autoplay">Autoplay</label>
                  <select id="cg-video-autoplay" value={content.completeGarden.videoAutoplay !== false ? 'on' : 'off'} onChange={(e) => setCompleteGarden('videoAutoplay', e.target.value === 'on')}>
                    <option value="on">On</option>
                    <option value="off">Off</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label htmlFor="cg-video-loop">Loop</label>
                  <select id="cg-video-loop" value={content.completeGarden.videoLoop !== false ? 'on' : 'off'} onChange={(e) => setCompleteGarden('videoLoop', e.target.value === 'on')}>
                    <option value="on">On</option>
                    <option value="off">Off</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label htmlFor="cg-video-mute">Mute</label>
                  <select id="cg-video-mute" value={content.completeGarden.videoMuted !== false ? 'on' : 'off'} onChange={(e) => setCompleteGarden('videoMuted', e.target.value === 'on')}>
                    <option value="on">On</option>
                    <option value="off">Off</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label htmlFor="cg-video-toggle">Play/pause button</label>
                  <select id="cg-video-toggle" value={content.completeGarden.videoShowToggle !== false ? 'show' : 'hide'} onChange={(e) => setCompleteGarden('videoShowToggle', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
              </div>

              <p className="admin-panel-title" style={{ marginTop: 18 }}>Feature tags</p>
              {normalizedPills(content.completeGarden.pills)
                .map((pill, i) => ({ pill, i }))
                .sort((a, b) => (a.pill.order ?? 0) - (b.pill.order ?? 0))
                .map(({ pill, i }) => (
                  <div key={pill.id ?? i} className="admin-content-item" style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1 }}>
                      <input
                        value={pill.icon}
                        onChange={(e) => setPill(i, 'icon', e.target.value)}
                        placeholder="🌱"
                        style={{ width: 52, textAlign: 'center' }}
                        aria-label="Tag icon (emoji)"
                      />
                      <input value={pill.text} onChange={(e) => setPill(i, 'text', e.target.value)} style={{ flex: 1 }} aria-label="Tag text" />
                      <select value={pill.visible !== false ? 'show' : 'hide'} onChange={(e) => setPill(i, 'visible', e.target.value === 'show')} aria-label="Tag visibility">
                        <option value="show">Show</option>
                        <option value="hide">Hide</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <button type="button" className="admin-icon-btn" onClick={() => movePill(i, -1)} aria-label="Move up">↑</button>
                      <button type="button" className="admin-icon-btn" onClick={() => movePill(i, 1)} aria-label="Move down">↓</button>
                      <button type="button" className="admin-icon-btn" onClick={() => duplicatePill(i)} aria-label="Duplicate tag">⧉</button>
                      <button type="button" className="admin-icon-btn danger" onClick={() => removePill(i)} aria-label="Delete tag">
                        <TrashIcon width="14" height="14" />
                      </button>
                    </div>
                  </div>
                ))}
              <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={addPill}>
                <PlusIcon width="14" height="14" /> Add tag
              </button>

              <SectionActions onSave={handleSave} onPublish={handleSave} onReset={() => resetOneSection('completeGarden')} onCancel={cancelSectionEdits} />
            </div>
          )}

          {selected === 'whyIgo' && (
            <div className="admin-panel">
              <p className="admin-panel-title">Grown with Data, Delivered with Care</p>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="wi-visible">Section visibility</label>
                  <select id="wi-visible" value={content.whyIgo.visible ? 'show' : 'hide'} onChange={(e) => setWhyIgo('visible', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label htmlFor="wi-order">Display order</label>
                  <input id="wi-order" type="number" value={content.whyIgo.displayOrder} onChange={(e) => setWhyIgo('displayOrder', Number(e.target.value))} />
                </div>
                <div className="admin-field">
                  <label htmlFor="wi-eyebrow">Small heading (eyebrow)</label>
                  <input id="wi-eyebrow" value={content.whyIgo.eyebrow} onChange={(e) => setWhyIgo('eyebrow', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="wi-heading">Main heading</label>
                  <input id="wi-heading" value={content.whyIgo.heading} onChange={(e) => setWhyIgo('heading', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="wi-btn-text">Button text</label>
                  <input id="wi-btn-text" value={content.whyIgo.buttonText} onChange={(e) => setWhyIgo('buttonText', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="wi-btn-url">Button URL</label>
                  <input id="wi-btn-url" value={content.whyIgo.buttonUrl} onChange={(e) => setWhyIgo('buttonUrl', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="wi-btn-visible">"Discover More" button</label>
                  <select id="wi-btn-visible" value={content.whyIgo.buttonVisible !== false ? 'show' : 'hide'} onChange={(e) => setWhyIgo('buttonVisible', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
                <div className="admin-field" />
                <div className="admin-field">
                  <label htmlFor="wi-bg-color">Background color</label>
                  <input id="wi-bg-color" type="color" value={content.whyIgo.backgroundColor || '#ffffff'} onChange={(e) => setWhyIgo('backgroundColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="wi-text-color">Heading text color</label>
                  <input id="wi-text-color" type="color" value={content.whyIgo.textColor || '#16241c'} onChange={(e) => setWhyIgo('textColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="wi-font-size">Heading font size (e.g. 2rem)</label>
                  <input id="wi-font-size" placeholder="2rem" value={content.whyIgo.fontSize} onChange={(e) => setWhyIgo('fontSize', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="wi-padding">Section padding (e.g. 64px)</label>
                  <input id="wi-padding" placeholder="64px" value={content.whyIgo.paddingY} onChange={(e) => setWhyIgo('paddingY', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="wi-animation">Fade-in animation</label>
                  <select id="wi-animation" value={content.whyIgo.animation ? 'on' : 'off'} onChange={(e) => setWhyIgo('animation', e.target.value === 'on')}>
                    <option value="on">On</option>
                    <option value="off">Off</option>
                  </select>
                </div>
              </div>

              <div className="admin-cat-cards-head">
                <p className="admin-panel-title" style={{ marginBottom: 0 }}>
                  Feature cards ({normalizedWhyIgoCards(content.whyIgo.cards).filter((c) => c.visible !== false).length} of {content.whyIgo.cards.length} active)
                </p>
                <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" style={{ width: 'auto' }} onClick={addWhyIgoCard}>
                  <PlusIcon width="14" height="14" /> Add Feature Card
                </button>
              </div>

              <div className="admin-cat-cards">
                {normalizedWhyIgoCards(content.whyIgo.cards)
                  .map((card, i) => ({ card, i }))
                  .sort((a, b) => (a.card.order ?? 0) - (b.card.order ?? 0))
                  .map(({ card, i }, sortedIndex) => (
                    <div key={card.id ?? i} className="admin-cat-card">
                      <div className="admin-cat-card-image">
                        {card.image ? <img src={card.image} alt={card.title} /> : <span className="admin-cat-card-noimage">No image - showing icon instead</span>}
                      </div>
                      <ImageField
                        id={`wi-card-${card.id ?? i}`}
                        label="Replace image (optional - falls back to the icon below when empty)"
                        value={card.image}
                        onChange={(v) => setWhyIgoCard(i, 'image', v)}
                      />
                      <div className="admin-field">
                        <label>Icon (used when there's no image)</label>
                        <select value={card.icon} onChange={(e) => setWhyIgoCard(i, 'icon', e.target.value)}>
                          <option value="wifi">Wifi (IoT)</option>
                          <option value="flask">Flask (trials)</option>
                          <option value="shield">Shield (guarantee)</option>
                          <option value="headset">Headset (support)</option>
                        </select>
                      </div>
                      <div className="admin-field">
                        <label>Title</label>
                        <input value={card.title} onChange={(e) => setWhyIgoCard(i, 'title', e.target.value)} />
                      </div>
                      <div className="admin-field">
                        <label>Description</label>
                        <textarea rows="3" value={card.description} onChange={(e) => setWhyIgoCard(i, 'description', e.target.value)} />
                      </div>
                      <div className="admin-field">
                        <label>Highlight value (e.g. 99.2% - optional)</label>
                        <input value={card.stat} placeholder="Leave empty for no highlight value" onChange={(e) => setWhyIgoCard(i, 'stat', e.target.value)} />
                      </div>
                      <div className="admin-cat-card-row">
                        <div className="admin-field" style={{ flex: 1 }}>
                          <label>Badge</label>
                          <select value={card.badgeEnabled ? 'on' : 'off'} onChange={(e) => setWhyIgoCard(i, 'badgeEnabled', e.target.value === 'on')}>
                            <option value="off">Off</option>
                            <option value="on">On</option>
                          </select>
                        </div>
                        <div className="admin-field" style={{ flex: 1 }}>
                          <label>Badge text</label>
                          <input value={card.badgeText} disabled={!card.badgeEnabled} onChange={(e) => setWhyIgoCard(i, 'badgeText', e.target.value)} />
                        </div>
                      </div>
                      <div className="admin-cat-card-row">
                        <div className="admin-field" style={{ flex: 1 }}>
                          <label>Status</label>
                          <select value={card.visible !== false ? 'active' : 'inactive'} onChange={(e) => setWhyIgoCard(i, 'visible', e.target.value === 'active')}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                        <div className="admin-field" style={{ flex: 1 }}>
                          <label>Order</label>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <button type="button" className="admin-icon-btn" onClick={() => moveWhyIgoCard(sortedIndex, -1)} aria-label="Move up">↑</button>
                            <span>{sortedIndex + 1}</span>
                            <button type="button" className="admin-icon-btn" onClick={() => moveWhyIgoCard(sortedIndex, 1)} aria-label="Move down">↓</button>
                          </div>
                        </div>
                      </div>
                      <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" style={{ width: '100%' }} onClick={() => duplicateWhyIgoCard(i)}>
                        Duplicate Card
                      </button>
                      <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" style={{ width: '100%' }} onClick={() => removeWhyIgoCard(i, card.title)}>
                        <TrashIcon width="14" height="14" /> Delete Card
                      </button>
                    </div>
                  ))}
              </div>

              <SectionActions onSave={handleSave} onPublish={handleSave} onReset={() => resetOneSection('whyIgo')} onCancel={cancelSectionEdits} />
            </div>
          )}

          {selected === 'offers' && (
            <ListEditor
              title="Offers"
              hint="The 'Offers For You' bundle cards, with their images."
              items={content.offers}
              onChange={(items) => setSection('offers', items)}
              newItem={{ qty: 4, price: 0, note: 'NEW OFFER', image: '' }}
              itemFields={[
                { key: 'qty', label: 'Quantity', type: 'number' },
                { key: 'price', label: 'Price (₹)', type: 'number' },
                { key: 'note', label: 'Note' },
                { key: 'image', label: 'Image', type: 'image', span2: true },
              ]}
            />
          )}

          {selected === 'journal' && (
            <div className="admin-panel">
              <p className="admin-panel-title">Garden Journal</p>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="gj-visible">Section visibility</label>
                  <select id="gj-visible" value={content.gardenJournal.visible !== false ? 'show' : 'hide'} onChange={(e) => setGardenJournal('visible', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
                <div className="admin-field" />
                <div className="admin-field">
                  <label htmlFor="gj-eyebrow">Section label</label>
                  <input id="gj-eyebrow" value={content.gardenJournal.eyebrow} onChange={(e) => setGardenJournal('eyebrow', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="gj-heading">Main heading</label>
                  <input id="gj-heading" value={content.gardenJournal.heading} onChange={(e) => setGardenJournal('heading', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="gj-seeall-enabled">"See all" link</label>
                  <select id="gj-seeall-enabled" value={content.gardenJournal.seeAllEnabled !== false ? 'show' : 'hide'} onChange={(e) => setGardenJournal('seeAllEnabled', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
                <div className="admin-field" />
                <div className="admin-field">
                  <label htmlFor="gj-seeall-text">"See all" text</label>
                  <input id="gj-seeall-text" disabled={content.gardenJournal.seeAllEnabled === false} value={content.gardenJournal.seeAllText} onChange={(e) => setGardenJournal('seeAllText', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="gj-seeall-link">"See all" URL</label>
                  <input id="gj-seeall-link" disabled={content.gardenJournal.seeAllEnabled === false} value={content.gardenJournal.seeAllLink} onChange={(e) => setGardenJournal('seeAllLink', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="gj-readguide-text">"Read guide" text (used on every card)</label>
                  <input id="gj-readguide-text" value={content.gardenJournal.readGuideText} onChange={(e) => setGardenJournal('readGuideText', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="gj-bg-color">Background color</label>
                  <input id="gj-bg-color" type="color" value={content.gardenJournal.backgroundColor || '#f0e8da'} onChange={(e) => setGardenJournal('backgroundColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="gj-text-color">Heading text color</label>
                  <input id="gj-text-color" type="color" value={content.gardenJournal.textColor || '#16241c'} onChange={(e) => setGardenJournal('textColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="gj-padding">Section padding (e.g. 64px)</label>
                  <input id="gj-padding" placeholder="64px" value={content.gardenJournal.paddingY} onChange={(e) => setGardenJournal('paddingY', e.target.value)} />
                </div>
              </div>

              <div className="admin-cat-cards-head">
                <p className="admin-panel-title" style={{ marginBottom: 0 }}>
                  Journal cards ({content.gardenJournal.posts.filter((p) => p.visible !== false).length} of {content.gardenJournal.posts.length} active)
                </p>
                <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" style={{ width: 'auto' }} onClick={addJournalPost}>
                  <PlusIcon width="14" height="14" /> Add Journal Card
                </button>
              </div>

              <div className="admin-cat-cards">
                {[...content.gardenJournal.posts].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((post, sortedIndex) => {
                  const index = content.gardenJournal.posts.findIndex((p) => p.id === post.id);
                  return (
                    <div key={post.id} className="admin-cat-card">
                      <div className="admin-cat-card-image">
                        {post.image ? <img src={post.image} alt={post.title} /> : <span className="admin-cat-card-noimage">No image yet</span>}
                      </div>
                      <ImageField
                        id={`gj-post-${post.id}`}
                        label="Replace image"
                        value={post.image}
                        onChange={(v) => setJournalPost(index, 'image', v)}
                      />
                      <div className="admin-field">
                        <label>Image alt text</label>
                        <input value={post.imageAlt} onChange={(e) => setJournalPost(index, 'imageAlt', e.target.value)} />
                      </div>
                      <div className="admin-field">
                        <label>Title</label>
                        <input value={post.title} onChange={(e) => setJournalPost(index, 'title', e.target.value)} />
                      </div>
                      <div className="admin-cat-card-row">
                        <div className="admin-field" style={{ flex: 1 }}>
                          <label>Link URL</label>
                          <input value={post.linkUrl} onChange={(e) => setJournalPost(index, 'linkUrl', e.target.value)} />
                        </div>
                        <div className="admin-field" style={{ flex: 1 }}>
                          <label>Open link in</label>
                          <select value={post.linkTarget === '_blank' ? 'new' : 'same'} onChange={(e) => setJournalPost(index, 'linkTarget', e.target.value === 'new' ? '_blank' : '_self')}>
                            <option value="same">Same tab</option>
                            <option value="new">New tab</option>
                          </select>
                        </div>
                      </div>
                      <div className="admin-cat-card-row">
                        <div className="admin-field" style={{ flex: 1 }}>
                          <label>Status</label>
                          <select value={post.visible !== false ? 'active' : 'inactive'} onChange={(e) => setJournalPost(index, 'visible', e.target.value === 'active')}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                        <div className="admin-field" style={{ flex: 1 }}>
                          <label>Order</label>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <button type="button" className="admin-icon-btn" onClick={() => moveJournalPost(sortedIndex, -1)} aria-label="Move up">↑</button>
                            <span>{sortedIndex + 1}</span>
                            <button type="button" className="admin-icon-btn" onClick={() => moveJournalPost(sortedIndex, 1)} aria-label="Move down">↓</button>
                          </div>
                        </div>
                      </div>
                      <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" style={{ width: '100%' }} onClick={() => duplicateJournalPost(index)}>
                        Duplicate Card
                      </button>
                      <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" style={{ width: '100%' }} onClick={() => removeJournalPost(index, post.title)}>
                        <TrashIcon width="14" height="14" /> Delete Card
                      </button>
                    </div>
                  );
                })}
              </div>

              <SectionActions onSave={handleSave} onPublish={handleSave} onReset={() => resetOneSection('gardenJournal')} onCancel={cancelSectionEdits} />
            </div>
          )}

          {selected === 'nurseryJourney' && (
            <div className="admin-panel">
              <p className="admin-panel-title">From IGO Nursery to Your Home</p>
              <div className="admin-mock-banner" style={{ marginBottom: 18 }}>
                The delivery-bike graphic between steps is a hand-drawn vector illustration built directly into the
                page (not an image file), so it can't be replaced with an upload - but you can show or hide it below.
                Each step's small circular icon badge is chosen from the site's existing icon set to match the design.
              </div>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="nj-visible">Section visibility</label>
                  <select id="nj-visible" value={content.nurseryJourney.visible !== false ? 'show' : 'hide'} onChange={(e) => setNurseryJourney('visible', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label htmlFor="nj-rider">Delivery-bike graphic</label>
                  <select id="nj-rider" value={content.nurseryJourney.showRider !== false ? 'show' : 'hide'} onChange={(e) => setNurseryJourney('showRider', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label htmlFor="nj-eyebrow">Section label</label>
                  <input id="nj-eyebrow" value={content.nurseryJourney.eyebrow} onChange={(e) => setNurseryJourney('eyebrow', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="nj-heading">Main heading</label>
                  <input id="nj-heading" value={content.nurseryJourney.heading} onChange={(e) => setNurseryJourney('heading', e.target.value)} />
                </div>
                <div className="admin-field span-2">
                  <label htmlFor="nj-subtitle">Subtitle</label>
                  <input id="nj-subtitle" value={content.nurseryJourney.subtitle} onChange={(e) => setNurseryJourney('subtitle', e.target.value)} />
                </div>
              </div>

              <div className="admin-cat-cards-head">
                <p className="admin-panel-title" style={{ marginBottom: 0 }}>
                  Process steps ({content.nurseryJourney.steps.filter((s) => s.visible !== false).length} of {content.nurseryJourney.steps.length} active - numbered automatically by order)
                </p>
                <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" style={{ width: 'auto' }} onClick={addJourneyStep}>
                  <PlusIcon width="14" height="14" /> Add Process Step
                </button>
              </div>

              <div className="admin-cat-cards">
                {[...content.nurseryJourney.steps].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((step, sortedIndex) => {
                  const index = content.nurseryJourney.steps.findIndex((s) => s.id === step.id);
                  return (
                    <div key={step.id} className="admin-cat-card">
                      <div className="admin-cat-card-image">
                        {step.image ? <img src={step.image} alt={step.title} /> : <span className="admin-cat-card-noimage">No image yet</span>}
                      </div>
                      <ImageField
                        id={`nj-step-${step.id}`}
                        label="Replace image (square photos work best)"
                        value={step.image}
                        onChange={(v) => setJourneyStep(index, 'image', v)}
                      />
                      <div className="admin-field">
                        <label>Step number</label>
                        <input value={String(sortedIndex + 1).padStart(2, '0')} disabled />
                      </div>
                      <div className="admin-field">
                        <label>Step title</label>
                        <input value={step.title} onChange={(e) => setJourneyStep(index, 'title', e.target.value)} />
                      </div>
                      <div className="admin-field">
                        <label>Description</label>
                        <textarea rows="3" value={step.description} onChange={(e) => setJourneyStep(index, 'description', e.target.value)} />
                      </div>
                      <div className="admin-field">
                        <label>Icon badge</label>
                        <select value={step.icon} onChange={(e) => setJourneyStep(index, 'icon', e.target.value)}>
                          <option value="sprout">Sprout (growing)</option>
                          <option value="qualityCheck">Checkmark (quality)</option>
                          <option value="prepared">Box (prepared)</option>
                          <option value="homeReady">Home (delivered)</option>
                        </select>
                      </div>
                      <div className="admin-cat-card-row">
                        <div className="admin-field" style={{ flex: 1 }}>
                          <label>Status</label>
                          <select value={step.visible !== false ? 'active' : 'inactive'} onChange={(e) => setJourneyStep(index, 'visible', e.target.value === 'active')}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                        <div className="admin-field" style={{ flex: 1 }}>
                          <label>Order</label>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <button type="button" className="admin-icon-btn" onClick={() => moveJourneyStep(sortedIndex, -1)} aria-label="Move up">↑</button>
                            <span>{sortedIndex + 1}</span>
                            <button type="button" className="admin-icon-btn" onClick={() => moveJourneyStep(sortedIndex, 1)} aria-label="Move down">↓</button>
                          </div>
                        </div>
                      </div>
                      <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" style={{ width: '100%' }} onClick={() => removeJourneyStep(step.id, step.title)}>
                        <TrashIcon width="14" height="14" /> Delete Step
                      </button>
                    </div>
                  );
                })}
              </div>

              <SectionActions onSave={handleSave} onPublish={handleSave} onReset={() => resetOneSection('nurseryJourney')} onCancel={cancelSectionEdits} />
            </div>
          )}

          {selected === 'ourStorySecondary' && (
            <div className="admin-panel">
              <p className="admin-panel-title">Our Story (Secondary Section)</p>
              <div className="admin-mock-banner" style={{ marginBottom: 18 }}>
                A highlighted portion of any paragraph (like "it stays with you") is a separate field rather than a
                rich-text editor - this keeps formatting safe and consistent with the rest of the site instead of
                allowing arbitrary HTML. Leave "Highlighted part" empty for a plain paragraph.
              </div>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="osb-visible">Section visibility</label>
                  <select id="osb-visible" value={content.ourStoryBand.visible !== false ? 'show' : 'hide'} onChange={(e) => setOurStoryBand('visible', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
                <div className="admin-field" />
                <div className="admin-field">
                  <label htmlFor="osb-badge-enabled">Badge</label>
                  <select id="osb-badge-enabled" value={content.ourStoryBand.badgeEnabled !== false ? 'show' : 'hide'} onChange={(e) => setOurStoryBand('badgeEnabled', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label htmlFor="osb-badge-text">Badge text</label>
                  <input id="osb-badge-text" disabled={content.ourStoryBand.badgeEnabled === false} value={content.ourStoryBand.badgeText} onChange={(e) => setOurStoryBand('badgeText', e.target.value)} />
                </div>
                <div className="admin-field span-2">
                  <label htmlFor="osb-heading">Main heading</label>
                  <input id="osb-heading" value={content.ourStoryBand.heading} onChange={(e) => setOurStoryBand('heading', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="osb-tagline">Tagline</label>
                  <input id="osb-tagline" value={content.ourStoryBand.taglinePlain} onChange={(e) => setOurStoryBand('taglinePlain', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="osb-tagline-highlight">Highlighted tagline</label>
                  <input id="osb-tagline-highlight" value={content.ourStoryBand.taglineHighlight} onChange={(e) => setOurStoryBand('taglineHighlight', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="osb-tagline-icon">Tagline leaf icon</label>
                  <select id="osb-tagline-icon" value={content.ourStoryBand.showTaglineIcon !== false ? 'show' : 'hide'} onChange={(e) => setOurStoryBand('showTaglineIcon', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
              </div>

              <p className="admin-panel-title" style={{ marginTop: 18 }}>Founder</p>
              <div className="admin-form-grid">
                <ImageField
                  id="osb-founder-image"
                  label="Founder image"
                  value={content.ourStoryBand.founderImage}
                  onChange={(v) => setOurStoryBand('founderImage', v)}
                  spanTwo
                />
                <div className="admin-field">
                  <label htmlFor="osb-founder-name">Founder name</label>
                  <input id="osb-founder-name" value={content.ourStoryBand.founderName} onChange={(e) => setOurStoryBand('founderName', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="osb-founder-title">Designation</label>
                  <input id="osb-founder-title" value={content.ourStoryBand.founderDesignation} onChange={(e) => setOurStoryBand('founderDesignation', e.target.value)} />
                </div>
              </div>

              <div className="admin-cat-cards-head">
                <p className="admin-panel-title" style={{ marginBottom: 0 }}>
                  Story content ({content.ourStoryBand.paragraphs.filter((p) => p.visible !== false).length} of {content.ourStoryBand.paragraphs.length} active)
                </p>
                <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" style={{ width: 'auto' }} onClick={addOsbParagraph}>
                  <PlusIcon width="14" height="14" /> Add Story Content
                </button>
              </div>

              {[...content.ourStoryBand.paragraphs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((p, sortedIndex) => {
                const index = content.ourStoryBand.paragraphs.findIndex((x) => x.id === p.id);
                return (
                  <div key={p.id} className="admin-panel" style={{ background: 'var(--admin-bg)', marginBottom: 12, padding: 16 }}>
                    <div className="admin-field">
                      <label>Content {String(sortedIndex + 1).padStart(2, '0')}</label>
                      <textarea rows="3" value={p.before} onChange={(e) => setOsbParagraph(index, 'before', e.target.value)} />
                    </div>
                    <div className="admin-cat-card-row">
                      <div className="admin-field" style={{ flex: 1 }}>
                        <label>Highlighted part (optional, shown bold)</label>
                        <input value={p.strong} placeholder="Leave empty for a plain paragraph" onChange={(e) => setOsbParagraph(index, 'strong', e.target.value)} />
                      </div>
                      <div className="admin-field" style={{ flex: 1 }}>
                        <label>Text after highlighted part</label>
                        <input value={p.after} disabled={!p.strong} onChange={(e) => setOsbParagraph(index, 'after', e.target.value)} />
                      </div>
                    </div>
                    <div className="admin-cat-card-row">
                      <div className="admin-field" style={{ flex: 1 }}>
                        <label>Status</label>
                        <select value={p.visible !== false ? 'active' : 'inactive'} onChange={(e) => setOsbParagraph(index, 'visible', e.target.value === 'active')}>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      <div className="admin-field" style={{ flex: 1 }}>
                        <label>Order</label>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <button type="button" className="admin-icon-btn" onClick={() => moveOsbParagraph(sortedIndex, -1)} aria-label="Move up">↑</button>
                          <span>{sortedIndex + 1}</span>
                          <button type="button" className="admin-icon-btn" onClick={() => moveOsbParagraph(sortedIndex, 1)} aria-label="Move down">↓</button>
                        </div>
                      </div>
                    </div>
                    <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" style={{ width: '100%' }} onClick={() => removeOsbParagraph(index)}>
                      <TrashIcon width="14" height="14" /> Delete
                    </button>
                  </div>
                );
              })}

              <SectionActions onSave={handleSave} onPublish={handleSave} onReset={() => resetOneSection('ourStoryBand')} onCancel={cancelSectionEdits} />
            </div>
          )}

          {selected === 'comparison' && (
            <div className="admin-panel">
              <p className="admin-panel-title">How We Compare to Buying Plants Elsewhere</p>
              <div className="admin-mock-banner" style={{ marginBottom: 18 }}>
                This page also controls the "Quality Assured / Grown with Care / Safe &amp; Secure Delivery / We're
                Here for You" strip directly below the comparison table - they're edited together below since they
                always appear together. The check/✕/minus status icons are the table's fixed visual language (like a
                traffic-light system) and aren't replaced per row; each criterion's own icon is editable.
              </div>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="cs-visible">Section visibility</label>
                  <select id="cs-visible" value={content.comparisonSection.visible !== false ? 'show' : 'hide'} onChange={(e) => setComparisonSection('visible', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label htmlFor="cs-eyebrow">Section label</label>
                  <input id="cs-eyebrow" value={content.comparisonSection.eyebrow} onChange={(e) => setComparisonSection('eyebrow', e.target.value)} />
                </div>
                <div className="admin-field span-2">
                  <label htmlFor="cs-heading">Main heading</label>
                  <input id="cs-heading" value={content.comparisonSection.heading} onChange={(e) => setComparisonSection('heading', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="cs-highlight">Highlighted heading text</label>
                  <input id="cs-highlight" value={content.comparisonSection.headingHighlight} onChange={(e) => setComparisonSection('headingHighlight', e.target.value)} />
                  <p className="admin-cell-sub">Must match a portion of the heading above exactly to be highlighted.</p>
                </div>
                <div className="admin-field">
                  <label htmlFor="cs-subtitle">Subtitle</label>
                  <input id="cs-subtitle" value={content.comparisonSection.subtitle} onChange={(e) => setComparisonSection('subtitle', e.target.value)} />
                </div>
                <ImageField
                  id="cs-bg"
                  label="Background image (optional - leave empty for the default)"
                  value={content.comparisonSection.backgroundImage}
                  onChange={(v) => setComparisonSection('backgroundImage', v)}
                  spanTwo
                />
              </div>

              <p className="admin-panel-title" style={{ marginTop: 18 }}>Columns</p>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="cs-local-title">"Local Nurseries" column title</label>
                  <input id="cs-local-title" value={content.comparisonSection.localTitle} onChange={(e) => setComparisonSection('localTitle', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="cs-others-title">"Others (Online)" column title</label>
                  <input id="cs-others-title" value={content.comparisonSection.othersTitle} onChange={(e) => setComparisonSection('othersTitle', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="cs-igo-title">IGO Nursery column title</label>
                  <input id="cs-igo-title" value={content.comparisonSection.igoTitle} onChange={(e) => setComparisonSection('igoTitle', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="cs-igo-subtitle">IGO Nursery column subtitle</label>
                  <input id="cs-igo-subtitle" value={content.comparisonSection.igoSubtitle} onChange={(e) => setComparisonSection('igoSubtitle', e.target.value)} />
                </div>
                <ImageField
                  id="cs-igo-header-img"
                  label="IGO Nursery column header image"
                  value={content.comparisonSection.igoHeaderImage}
                  onChange={(v) => setComparisonSection('igoHeaderImage', v)}
                  spanTwo
                />
                <div className="admin-field">
                  <label htmlFor="cs-badge-enabled">"BEST CHOICE" badge</label>
                  <select id="cs-badge-enabled" value={content.comparisonSection.badgeEnabled !== false ? 'show' : 'hide'} onChange={(e) => setComparisonSection('badgeEnabled', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label htmlFor="cs-badge-text">Badge text</label>
                  <input id="cs-badge-text" disabled={content.comparisonSection.badgeEnabled === false} value={content.comparisonSection.badgeText} onChange={(e) => setComparisonSection('badgeText', e.target.value)} />
                </div>
              </div>

              <div className="admin-cat-cards-head">
                <p className="admin-panel-title" style={{ marginBottom: 0 }}>
                  Comparison rows ({content.comparisonSection.rows.filter((r) => r.visible !== false).length} of {content.comparisonSection.rows.length} active)
                </p>
                <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" style={{ width: 'auto' }} onClick={addComparisonRow}>
                  <PlusIcon width="14" height="14" /> Add Comparison Row
                </button>
              </div>

              {[...content.comparisonSection.rows].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((row, sortedIndex) => {
                const index = content.comparisonSection.rows.findIndex((r) => r.id === row.id);
                return (
                  <div key={row.id} className="admin-panel" style={{ background: 'var(--admin-bg)', marginBottom: 12, padding: 16 }}>
                    <div className="admin-cat-card-row">
                      <div className="admin-field" style={{ flex: 2 }}>
                        <label>Criterion {String(sortedIndex + 1).padStart(2, '0')}</label>
                        <input value={row.criterion} onChange={(e) => setComparisonRow(index, 'criterion', e.target.value)} />
                      </div>
                      <div className="admin-field" style={{ flex: 1 }}>
                        <label>Icon</label>
                        <select value={row.icon} onChange={(e) => setComparisonRow(index, 'icon', e.target.value)}>
                          <option value="leaf">Leaf</option>
                          <option value="pest">Pest control</option>
                          <option value="repot">Repotting</option>
                          <option value="soil">Soil</option>
                          <option value="growing">Growing conditions</option>
                          <option value="health">Health</option>
                          <option value="packaging">Packaging</option>
                          <option value="support">Support</option>
                        </select>
                      </div>
                    </div>
                    <div className="admin-field">
                      <label>Local Nurseries content</label>
                      <input value={row.local} onChange={(e) => setComparisonRow(index, 'local', e.target.value)} />
                    </div>
                    <div className="admin-cat-card-row">
                      <div className="admin-field" style={{ flex: 1 }}>
                        <label>IGO Nursery content</label>
                        <input value={row.igo} onChange={(e) => setComparisonRow(index, 'igo', e.target.value)} />
                      </div>
                      <div className="admin-field" style={{ flex: 1 }}>
                        <label>Highlighted part (optional, shown bold)</label>
                        <input value={row.igoHighlight} placeholder="Leave empty for no highlight" onChange={(e) => setComparisonRow(index, 'igoHighlight', e.target.value)} />
                      </div>
                    </div>
                    <div className="admin-field">
                      <label>Others (Online) content</label>
                      <input value={row.others} onChange={(e) => setComparisonRow(index, 'others', e.target.value)} />
                    </div>
                    <div className="admin-cat-card-row">
                      <div className="admin-field" style={{ flex: 1 }}>
                        <label>Status</label>
                        <select value={row.visible !== false ? 'active' : 'inactive'} onChange={(e) => setComparisonRow(index, 'visible', e.target.value === 'active')}>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      <div className="admin-field" style={{ flex: 1 }}>
                        <label>Order</label>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <button type="button" className="admin-icon-btn" onClick={() => moveComparisonRow(sortedIndex, -1)} aria-label="Move up">↑</button>
                          <span>{sortedIndex + 1}</span>
                          <button type="button" className="admin-icon-btn" onClick={() => moveComparisonRow(sortedIndex, 1)} aria-label="Move down">↓</button>
                        </div>
                      </div>
                    </div>
                    <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" style={{ width: '100%' }} onClick={() => removeComparisonRow(index, row.criterion)}>
                      <TrashIcon width="14" height="14" /> Delete Row
                    </button>
                  </div>
                );
              })}

              <p className="admin-panel-title" style={{ marginTop: 18 }}>Bottom feature strip</p>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="tb-visible">Feature strip visibility</label>
                  <select id="tb-visible" value={content.trustBenefits.visible !== false ? 'show' : 'hide'} onChange={(e) => setTrustBenefits('visible', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
              </div>

              <div className="admin-cat-cards-head">
                <p className="admin-panel-title" style={{ marginBottom: 0 }}>
                  Features ({content.trustBenefits.items.filter((b) => b.visible !== false).length} of {content.trustBenefits.items.length} active)
                </p>
                <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" style={{ width: 'auto' }} onClick={addTrustBenefit}>
                  <PlusIcon width="14" height="14" /> Add Feature
                </button>
              </div>

              <div className="admin-cat-cards">
                {[...content.trustBenefits.items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((item, sortedIndex) => {
                  const index = content.trustBenefits.items.findIndex((b) => b.id === item.id);
                  return (
                    <div key={item.id} className="admin-cat-card">
                      <div className="admin-field">
                        <label>Icon</label>
                        <select value={item.icon} onChange={(e) => setTrustBenefitItem(index, 'icon', e.target.value)}>
                          <option value="shield">Shield</option>
                          <option value="sprout">Sprout</option>
                          <option value="truck">Truck</option>
                          <option value="headset">Headset</option>
                        </select>
                      </div>
                      <div className="admin-field">
                        <label>Title</label>
                        <input value={item.title} onChange={(e) => setTrustBenefitItem(index, 'title', e.target.value)} />
                      </div>
                      <div className="admin-field">
                        <label>Description</label>
                        <input value={item.description} onChange={(e) => setTrustBenefitItem(index, 'description', e.target.value)} />
                      </div>
                      <div className="admin-cat-card-row">
                        <div className="admin-field" style={{ flex: 1 }}>
                          <label>Status</label>
                          <select value={item.visible !== false ? 'active' : 'inactive'} onChange={(e) => setTrustBenefitItem(index, 'visible', e.target.value === 'active')}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                        <div className="admin-field" style={{ flex: 1 }}>
                          <label>Order</label>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <button type="button" className="admin-icon-btn" onClick={() => moveTrustBenefit(sortedIndex, -1)} aria-label="Move up">↑</button>
                            <span>{sortedIndex + 1}</span>
                            <button type="button" className="admin-icon-btn" onClick={() => moveTrustBenefit(sortedIndex, 1)} aria-label="Move down">↓</button>
                          </div>
                        </div>
                      </div>
                      <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" style={{ width: '100%' }} onClick={() => removeTrustBenefit(index, item.title)}>
                        <TrashIcon width="14" height="14" /> Delete Feature
                      </button>
                    </div>
                  );
                })}
              </div>

              <SectionActions
                onSave={handleSave}
                onPublish={handleSave}
                onReset={() => {
                  if (!confirm('Reset this section back to the site default? This discards your edits to it.')) return;
                  setContent((prev) => ({ ...prev, comparisonSection: DEFAULT_SITE_CONTENT.comparisonSection, trustBenefits: DEFAULT_SITE_CONTENT.trustBenefits }));
                  setSaved(false);
                }}
                onCancel={cancelSectionEdits}
              />
            </div>
          )}

          {selected === 'plantFinder' && (
            <div className="admin-panel">
              <p className="admin-panel-title">Plant Finder</p>
              <div className="admin-mock-banner" style={{ marginBottom: 18 }}>
                This band has no images or icons on the live site today (just text and a button), so there's nothing
                to replace there - background image below is a new option, not something being migrated. Button hover
                colors need JavaScript-driven preview to see live (they only show on mouse-hover on the real site).
              </div>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="pf-visible">Section visibility</label>
                  <select id="pf-visible" value={content.plantFinder.visible !== false ? 'show' : 'hide'} onChange={(e) => setPlantFinder('visible', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
                <div className="admin-field" />
                <div className="admin-field">
                  <label htmlFor="pf-eyebrow">Small label</label>
                  <input id="pf-eyebrow" value={content.plantFinder.eyebrow} onChange={(e) => setPlantFinder('eyebrow', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="pf-heading">Main heading</label>
                  <input id="pf-heading" value={content.plantFinder.heading} onChange={(e) => setPlantFinder('heading', e.target.value)} />
                </div>
                <div className="admin-field span-2">
                  <label htmlFor="pf-desc">Description</label>
                  <textarea id="pf-desc" rows="2" value={content.plantFinder.description} onChange={(e) => setPlantFinder('description', e.target.value)} />
                </div>
              </div>

              <p className="admin-panel-title" style={{ marginTop: 18 }}>Button</p>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="pf-btn-enabled">Button</label>
                  <select id="pf-btn-enabled" value={content.plantFinder.buttonEnabled !== false ? 'show' : 'hide'} onChange={(e) => setPlantFinder('buttonEnabled', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
                <div className="admin-field" />
                <div className="admin-field">
                  <label htmlFor="pf-btn-text">Button text</label>
                  <input id="pf-btn-text" disabled={content.plantFinder.buttonEnabled === false} value={content.plantFinder.buttonText} onChange={(e) => setPlantFinder('buttonText', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="pf-btn-url">Button link</label>
                  <input id="pf-btn-url" disabled={content.plantFinder.buttonEnabled === false} value={content.plantFinder.buttonUrl} onChange={(e) => setPlantFinder('buttonUrl', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="pf-btn-newtab">Open link in</label>
                  <select id="pf-btn-newtab" disabled={content.plantFinder.buttonEnabled === false} value={content.plantFinder.buttonNewTab ? 'new' : 'same'} onChange={(e) => setPlantFinder('buttonNewTab', e.target.value === 'new')}>
                    <option value="same">Same tab</option>
                    <option value="new">New tab</option>
                  </select>
                </div>
              </div>

              <p className="admin-panel-title" style={{ marginTop: 18 }}>Background</p>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="pf-bg-color">Background color</label>
                  <input id="pf-bg-color" type="color" value={content.plantFinder.backgroundColor || '#f0dcc9'} onChange={(e) => setPlantFinder('backgroundColor', e.target.value)} />
                </div>
                <ImageField
                  id="pf-bg-image"
                  label="Background image (optional - overrides the color above when set)"
                  value={content.plantFinder.backgroundImage}
                  onChange={(v) => setPlantFinder('backgroundImage', v)}
                  spanTwo
                />
                <div className="admin-field">
                  <label htmlFor="pf-padding">Section padding (e.g. 56px)</label>
                  <input id="pf-padding" placeholder="56px" value={content.plantFinder.paddingY} onChange={(e) => setPlantFinder('paddingY', e.target.value)} />
                </div>
              </div>

              <p className="admin-panel-title" style={{ marginTop: 18 }}>Text colors</p>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="pf-label-color">Label color</label>
                  <input id="pf-label-color" type="color" value={content.plantFinder.labelColor || '#2f6b3f'} onChange={(e) => setPlantFinder('labelColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="pf-heading-color">Heading color</label>
                  <input id="pf-heading-color" type="color" value={content.plantFinder.headingColor || '#16241c'} onChange={(e) => setPlantFinder('headingColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="pf-desc-color">Description color</label>
                  <input id="pf-desc-color" type="color" value={content.plantFinder.descriptionColor || '#5b6b60'} onChange={(e) => setPlantFinder('descriptionColor', e.target.value)} />
                </div>
              </div>

              <p className="admin-panel-title" style={{ marginTop: 18 }}>Button styling</p>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="pf-btn-bg">Button background</label>
                  <input id="pf-btn-bg" type="color" value={content.plantFinder.buttonBgColor || '#1f4d31'} onChange={(e) => setPlantFinder('buttonBgColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="pf-btn-text-color">Button text color</label>
                  <input id="pf-btn-text-color" type="color" value={content.plantFinder.buttonTextColor || '#ffffff'} onChange={(e) => setPlantFinder('buttonTextColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="pf-btn-hover-bg">Button hover background</label>
                  <input id="pf-btn-hover-bg" type="color" value={content.plantFinder.buttonHoverBgColor || '#1f4d31'} onChange={(e) => setPlantFinder('buttonHoverBgColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="pf-btn-hover-text">Button hover text color</label>
                  <input id="pf-btn-hover-text" type="color" value={content.plantFinder.buttonHoverTextColor || '#ffffff'} onChange={(e) => setPlantFinder('buttonHoverTextColor', e.target.value)} />
                </div>
              </div>

              <SectionActions onSave={handleSave} onPublish={handleSave} onReset={() => resetOneSection('plantFinder')} onCancel={cancelSectionEdits} />
            </div>
          )}

          {selected === 'gifting' && (
            <div className="admin-panel">
              <p className="admin-panel-title">Thoughtful Gifts, Beautifully Packaged</p>
              <div className="admin-mock-banner" style={{ marginBottom: 18 }}>
                Feature and button icons are chosen from the section's existing line-icon set (Gift, Bulk/Clipboard,
                Tag, Chat) to match the site's design system, rather than accepting arbitrary uploaded icons.
              </div>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="gb-visible">Section visibility</label>
                  <select id="gb-visible" value={content.giftingBand.visible !== false ? 'show' : 'hide'} onChange={(e) => setGiftingBand('visible', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
                <div className="admin-field" />
                <div className="admin-field span-2">
                  <label htmlFor="gb-heading">Heading</label>
                  <input id="gb-heading" value={content.giftingBand.heading} onChange={(e) => setGiftingBand('heading', e.target.value)} />
                </div>
                <div className="admin-field span-2">
                  <label htmlFor="gb-desc">Description</label>
                  <textarea id="gb-desc" rows="2" value={content.giftingBand.description} onChange={(e) => setGiftingBand('description', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="gb-highlight-enabled">Subheading</label>
                  <select id="gb-highlight-enabled" value={content.giftingBand.highlightEnabled !== false ? 'show' : 'hide'} onChange={(e) => setGiftingBand('highlightEnabled', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label htmlFor="gb-highlight">Subheading text</label>
                  <input id="gb-highlight" disabled={content.giftingBand.highlightEnabled === false} value={content.giftingBand.highlight} onChange={(e) => setGiftingBand('highlight', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="gb-bg-color">Background color</label>
                  <input id="gb-bg-color" type="color" value={content.giftingBand.backgroundColor || '#f4ece0'} onChange={(e) => setGiftingBand('backgroundColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="gb-heading-color">Heading color</label>
                  <input id="gb-heading-color" type="color" value={content.giftingBand.headingColor || '#16241c'} onChange={(e) => setGiftingBand('headingColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="gb-desc-color">Description color</label>
                  <input id="gb-desc-color" type="color" value={content.giftingBand.descriptionColor || '#5b6b60'} onChange={(e) => setGiftingBand('descriptionColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="gb-highlight-color">Subheading color</label>
                  <input id="gb-highlight-color" type="color" value={content.giftingBand.highlightColor || '#1f4d31'} onChange={(e) => setGiftingBand('highlightColor', e.target.value)} />
                </div>
                <ImageField
                  id="gb-image"
                  label="Right-side image"
                  value={content.giftingBand.image}
                  onChange={(v) => setGiftingBand('image', v)}
                  spanTwo
                />
                <div className="admin-field span-2">
                  <label htmlFor="gb-image-alt">Image alt text</label>
                  <input id="gb-image-alt" value={content.giftingBand.imageAlt} onChange={(e) => setGiftingBand('imageAlt', e.target.value)} />
                </div>
              </div>

              <div className="admin-cat-cards-head">
                <p className="admin-panel-title" style={{ marginBottom: 0 }}>Feature items</p>
                <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" style={{ width: 'auto' }} onClick={addGiftingFeature}>
                  <PlusIcon width="14" height="14" /> Add Feature
                </button>
              </div>
              {[...content.giftingBand.features].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((f, sortedIndex) => {
                const index = content.giftingBand.features.findIndex((x) => x.id === f.id);
                return (
                  <div key={f.id} className="admin-content-item" style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1 }}>
                      <select value={f.icon} onChange={(e) => setGiftingFeature(index, 'icon', e.target.value)} style={{ width: 110 }}>
                        <option value="gift">Gift</option>
                        <option value="clipboard">Clipboard</option>
                        <option value="tag">Tag</option>
                        <option value="chat">Chat</option>
                      </select>
                      <input value={f.text} onChange={(e) => setGiftingFeature(index, 'text', e.target.value)} style={{ flex: 1 }} />
                      <select value={f.visible !== false ? 'show' : 'hide'} onChange={(e) => setGiftingFeature(index, 'visible', e.target.value === 'show')}>
                        <option value="show">Show</option>
                        <option value="hide">Hide</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <button type="button" className="admin-icon-btn" onClick={() => moveGiftingFeature(sortedIndex, -1)} aria-label="Move up">↑</button>
                      <button type="button" className="admin-icon-btn" onClick={() => moveGiftingFeature(sortedIndex, 1)} aria-label="Move down">↓</button>
                      <button type="button" className="admin-icon-btn" onClick={() => duplicateGiftingFeature(index)} aria-label="Duplicate">⧉</button>
                      <button type="button" className="admin-icon-btn danger" onClick={() => removeGiftingFeature(index, f.text)} aria-label="Delete">
                        <TrashIcon width="14" height="14" />
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="admin-cat-cards-head" style={{ marginTop: 18 }}>
                <p className="admin-panel-title" style={{ marginBottom: 0 }}>CTA buttons</p>
                <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" style={{ width: 'auto' }} onClick={addGiftingButton}>
                  <PlusIcon width="14" height="14" /> Add CTA Button
                </button>
              </div>
              {[...content.giftingBand.buttons].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((b, sortedIndex) => {
                const index = content.giftingBand.buttons.findIndex((x) => x.id === b.id);
                return (
                  <div key={b.id} className="admin-panel" style={{ background: 'var(--admin-bg)', marginBottom: 12, padding: 16 }}>
                    <div className="admin-cat-card-row">
                      <div className="admin-field" style={{ flex: 1 }}>
                        <label>Icon</label>
                        <select value={b.icon} onChange={(e) => setGiftingButton(index, 'icon', e.target.value)}>
                          <option value="gift">Gift</option>
                          <option value="clipboard">Clipboard</option>
                          <option value="tag">Tag</option>
                          <option value="chat">Chat</option>
                        </select>
                      </div>
                      <div className="admin-field" style={{ flex: 2 }}>
                        <label>Button text</label>
                        <input value={b.text} onChange={(e) => setGiftingButton(index, 'text', e.target.value)} />
                      </div>
                      <div className="admin-field" style={{ flex: 1 }}>
                        <label>Style</label>
                        <select value={b.style} onChange={(e) => setGiftingButton(index, 'style', e.target.value)}>
                          <option value="primary">Filled</option>
                          <option value="secondary">Outline</option>
                        </select>
                      </div>
                    </div>
                    <div className="admin-cat-card-row">
                      <div className="admin-field" style={{ flex: 1 }}>
                        <label>URL</label>
                        <input value={b.url} onChange={(e) => setGiftingButton(index, 'url', e.target.value)} />
                      </div>
                      <div className="admin-field" style={{ flex: 1 }}>
                        <label>Open in</label>
                        <select value={b.target === '_blank' ? 'new' : 'same'} onChange={(e) => setGiftingButton(index, 'target', e.target.value === 'new' ? '_blank' : '_self')}>
                          <option value="same">Same tab</option>
                          <option value="new">New tab</option>
                        </select>
                      </div>
                    </div>
                    <div className="admin-cat-card-row">
                      <div className="admin-field" style={{ flex: 1 }}>
                        <label>Background (optional)</label>
                        <input type="color" value={b.bgColor || '#ffffff'} onChange={(e) => setGiftingButton(index, 'bgColor', e.target.value)} />
                      </div>
                      <div className="admin-field" style={{ flex: 1 }}>
                        <label>Text color (optional)</label>
                        <input type="color" value={b.textColor || '#1f4d31'} onChange={(e) => setGiftingButton(index, 'textColor', e.target.value)} />
                      </div>
                      <div className="admin-field" style={{ flex: 1 }}>
                        <label>Border color (optional)</label>
                        <input type="color" value={b.borderColor || '#1f4d31'} onChange={(e) => setGiftingButton(index, 'borderColor', e.target.value)} />
                      </div>
                    </div>
                    <div className="admin-cat-card-row">
                      <div className="admin-field" style={{ flex: 1 }}>
                        <label>Hover background (optional)</label>
                        <input type="color" value={b.hoverBgColor || '#143d2c'} onChange={(e) => setGiftingButton(index, 'hoverBgColor', e.target.value)} />
                      </div>
                      <div className="admin-field" style={{ flex: 1 }}>
                        <label>Hover text color (optional)</label>
                        <input type="color" value={b.hoverTextColor || '#ffffff'} onChange={(e) => setGiftingButton(index, 'hoverTextColor', e.target.value)} />
                      </div>
                      <div className="admin-field" style={{ flex: 1 }}>
                        <label>Visibility</label>
                        <select value={b.visible !== false ? 'show' : 'hide'} onChange={(e) => setGiftingButton(index, 'visible', e.target.value === 'show')}>
                          <option value="show">Show</option>
                          <option value="hide">Hide</option>
                        </select>
                      </div>
                    </div>
                    <div className="admin-cat-card-row">
                      <div className="admin-field" style={{ flex: 1 }}>
                        <label>Order</label>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <button type="button" className="admin-icon-btn" onClick={() => moveGiftingButton(sortedIndex, -1)} aria-label="Move up">↑</button>
                          <span>{sortedIndex + 1}</span>
                          <button type="button" className="admin-icon-btn" onClick={() => moveGiftingButton(sortedIndex, 1)} aria-label="Move down">↓</button>
                        </div>
                      </div>
                    </div>
                    <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" style={{ width: '100%' }} onClick={() => duplicateGiftingButton(index)}>
                      Duplicate Button
                    </button>
                    <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" style={{ width: '100%' }} onClick={() => removeGiftingButton(index, b.text)}>
                      <TrashIcon width="14" height="14" /> Delete Button
                    </button>
                  </div>
                );
              })}

              <SectionActions onSave={handleSave} onPublish={handleSave} onReset={() => resetOneSection('giftingBand')} onCancel={cancelSectionEdits} />
            </div>
          )}

          {selected === 'newsletter' && (
            <div className="admin-panel">
              <p className="admin-panel-title">Get Growing Tips in Your Inbox</p>
              <div className="admin-mock-banner" style={{ marginBottom: 18 }}>
                There's no email/subscriber storage anywhere in this project yet - submitting this form only
                validates the email address in the browser and shows the message you configure below; it doesn't
                save the address anywhere. Actually collecting subscribers would need a real backend feature (a new
                Firestore collection, like Products has), which is separate from making this section's text and
                styling editable.
              </div>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="nl-visible">Section visibility</label>
                  <select id="nl-visible" value={content.newsletter.visible !== false ? 'show' : 'hide'} onChange={(e) => setNewsletter('visible', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
                <div className="admin-field" />
                <div className="admin-field span-2">
                  <label htmlFor="nl-heading">Heading</label>
                  <input id="nl-heading" value={content.newsletter.heading} onChange={(e) => setNewsletter('heading', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="nl-heading-color">Heading color</label>
                  <input id="nl-heading-color" type="color" value={content.newsletter.headingColor || '#ffffff'} onChange={(e) => setNewsletter('headingColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="nl-bg-color">Background color</label>
                  <input id="nl-bg-color" type="color" value={content.newsletter.backgroundColor || '#0f2e21'} onChange={(e) => setNewsletter('backgroundColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="nl-padding">Section padding (e.g. 56px)</label>
                  <input id="nl-padding" placeholder="56px" value={content.newsletter.paddingY} onChange={(e) => setNewsletter('paddingY', e.target.value)} />
                </div>
              </div>

              <p className="admin-panel-title" style={{ marginTop: 18 }}>Email input</p>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="nl-placeholder">Placeholder text</label>
                  <input id="nl-placeholder" value={content.newsletter.placeholder} onChange={(e) => setNewsletter('placeholder', e.target.value)} />
                </div>
                <div className="admin-field" />
                <div className="admin-field">
                  <label htmlFor="nl-input-bg">Input background</label>
                  <input id="nl-input-bg" type="color" value={content.newsletter.inputBgColor || '#1c4433'} onChange={(e) => setNewsletter('inputBgColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="nl-input-text">Input text color</label>
                  <input id="nl-input-text" type="color" value={content.newsletter.inputTextColor || '#ffffff'} onChange={(e) => setNewsletter('inputTextColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="nl-input-placeholder">Placeholder color</label>
                  <input id="nl-input-placeholder" type="color" value={content.newsletter.inputPlaceholderColor || '#cfe0d6'} onChange={(e) => setNewsletter('inputPlaceholderColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="nl-input-border">Border color</label>
                  <input id="nl-input-border" type="color" value={content.newsletter.inputBorderColor || '#3c6b53'} onChange={(e) => setNewsletter('inputBorderColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="nl-input-focus-border">Focus border color</label>
                  <input id="nl-input-focus-border" type="color" value={content.newsletter.inputFocusBorderColor || '#9be15d'} onChange={(e) => setNewsletter('inputFocusBorderColor', e.target.value)} />
                </div>
              </div>

              <p className="admin-panel-title" style={{ marginTop: 18 }}>Subscribe button</p>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="nl-btn-enabled">Button</label>
                  <select id="nl-btn-enabled" value={content.newsletter.buttonEnabled !== false ? 'show' : 'hide'} onChange={(e) => setNewsletter('buttonEnabled', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label htmlFor="nl-btn-text">Button text</label>
                  <input id="nl-btn-text" disabled={content.newsletter.buttonEnabled === false} value={content.newsletter.buttonText} onChange={(e) => setNewsletter('buttonText', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="nl-btn-bg">Button background</label>
                  <input id="nl-btn-bg" type="color" value={content.newsletter.buttonBgColor || '#9be15d'} onChange={(e) => setNewsletter('buttonBgColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="nl-btn-text-color">Button text color</label>
                  <input id="nl-btn-text-color" type="color" value={content.newsletter.buttonTextColor || '#1a1a1a'} onChange={(e) => setNewsletter('buttonTextColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="nl-btn-hover-bg">Hover background</label>
                  <input id="nl-btn-hover-bg" type="color" value={content.newsletter.buttonHoverBgColor || '#9be15d'} onChange={(e) => setNewsletter('buttonHoverBgColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="nl-btn-hover-text">Hover text color</label>
                  <input id="nl-btn-hover-text" type="color" value={content.newsletter.buttonHoverTextColor || '#1a1a1a'} onChange={(e) => setNewsletter('buttonHoverTextColor', e.target.value)} />
                </div>
              </div>

              <p className="admin-panel-title" style={{ marginTop: 18 }}>Messages</p>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="nl-success-msg">Success message</label>
                  <input id="nl-success-msg" value={content.newsletter.successMessage} onChange={(e) => setNewsletter('successMessage', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="nl-error-msg">Error message (invalid email)</label>
                  <input id="nl-error-msg" value={content.newsletter.errorMessage} onChange={(e) => setNewsletter('errorMessage', e.target.value)} />
                </div>
              </div>

              <SectionActions onSave={handleSave} onPublish={handleSave} onReset={() => resetOneSection('newsletter')} onCancel={cancelSectionEdits} />
            </div>
          )}

          {selected === 'support' && (
            <div className="admin-panel">
              <p className="admin-panel-title">Support</p>
              <div className="admin-mock-banner" style={{ marginBottom: 18 }}>
                Only one FAQ can be open at a time on the live site (opening one closes any other) - "Default open"
                below controls which one is expanded when the page first loads.
              </div>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="faq-visible">Section visibility</label>
                  <select id="faq-visible" value={content.faq.visible !== false ? 'show' : 'hide'} onChange={(e) => setFaq('visible', e.target.value === 'show')}>
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                </div>
                <div className="admin-field" />
                <div className="admin-field">
                  <label htmlFor="faq-eyebrow">Section label</label>
                  <input id="faq-eyebrow" value={content.faq.eyebrow} onChange={(e) => setFaq('eyebrow', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="faq-heading">Main heading</label>
                  <input id="faq-heading" value={content.faq.heading} onChange={(e) => setFaq('heading', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="faq-open-icon">Open-state icon</label>
                  <input id="faq-open-icon" value={content.faq.openIcon} onChange={(e) => setFaq('openIcon', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="faq-closed-icon">Closed-state icon</label>
                  <input id="faq-closed-icon" value={content.faq.closedIcon} onChange={(e) => setFaq('closedIcon', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="faq-bg-color">Background color</label>
                  <input id="faq-bg-color" type="color" value={content.faq.backgroundColor || '#dde3cd'} onChange={(e) => setFaq('backgroundColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="faq-eyebrow-color">Label color</label>
                  <input id="faq-eyebrow-color" type="color" value={content.faq.eyebrowColor || '#1f4d31'} onChange={(e) => setFaq('eyebrowColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="faq-heading-color">Heading color</label>
                  <input id="faq-heading-color" type="color" value={content.faq.headingColor || '#16241c'} onChange={(e) => setFaq('headingColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="faq-question-color">Question color</label>
                  <input id="faq-question-color" type="color" value={content.faq.questionColor || '#16241c'} onChange={(e) => setFaq('questionColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="faq-answer-color">Answer color</label>
                  <input id="faq-answer-color" type="color" value={content.faq.answerColor || '#7a8a7f'} onChange={(e) => setFaq('answerColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="faq-icon-color">Icon color</label>
                  <input id="faq-icon-color" type="color" value={content.faq.iconColor || '#1f4d31'} onChange={(e) => setFaq('iconColor', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="faq-divider-color">Divider color</label>
                  <input id="faq-divider-color" type="color" value={content.faq.dividerColor || '#e2ddd0'} onChange={(e) => setFaq('dividerColor', e.target.value)} />
                </div>
              </div>

              <div className="admin-cat-cards-head">
                <p className="admin-panel-title" style={{ marginBottom: 0 }}>
                  FAQ items ({content.faq.items.filter((f) => f.visible !== false).length} of {content.faq.items.length} active)
                </p>
                <button type="button" className="admin-btn admin-btn-primary admin-btn-sm" style={{ width: 'auto' }} onClick={addFaqItem}>
                  <PlusIcon width="14" height="14" /> Add FAQ
                </button>
              </div>

              {[...content.faq.items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((item, sortedIndex) => {
                const index = content.faq.items.findIndex((f) => f.id === item.id);
                return (
                  <div key={item.id} className="admin-panel" style={{ background: 'var(--admin-bg)', marginBottom: 12, padding: 16 }}>
                    <div className="admin-field">
                      <label>Question {String(sortedIndex + 1).padStart(2, '0')}</label>
                      <input value={item.question} onChange={(e) => setFaqItem(index, 'question', e.target.value)} />
                    </div>
                    <div className="admin-field">
                      <label>Answer</label>
                      <textarea rows="3" value={item.answer} onChange={(e) => setFaqItem(index, 'answer', e.target.value)} />
                    </div>
                    <div className="admin-cat-card-row">
                      <div className="admin-field" style={{ flex: 1 }}>
                        <label>Status</label>
                        <select value={item.visible !== false ? 'active' : 'inactive'} onChange={(e) => setFaqItem(index, 'visible', e.target.value === 'active')}>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      <div className="admin-field" style={{ flex: 1 }}>
                        <label>Default open</label>
                        <select value={item.defaultOpen ? 'yes' : 'no'} onChange={() => setFaqDefaultOpen(index)}>
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                      <div className="admin-field" style={{ flex: 1 }}>
                        <label>Order</label>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <button type="button" className="admin-icon-btn" onClick={() => moveFaqItem(sortedIndex, -1)} aria-label="Move up">↑</button>
                          <span>{sortedIndex + 1}</span>
                          <button type="button" className="admin-icon-btn" onClick={() => moveFaqItem(sortedIndex, 1)} aria-label="Move down">↓</button>
                        </div>
                      </div>
                    </div>
                    <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" style={{ width: '100%' }} onClick={() => duplicateFaqItem(index)}>
                      Duplicate FAQ
                    </button>
                    <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" style={{ width: '100%' }} onClick={() => removeFaqItem(index, item.question)}>
                      <TrashIcon width="14" height="14" /> Delete FAQ
                    </button>
                  </div>
                );
              })}

              <SectionActions onSave={handleSave} onPublish={handleSave} onReset={() => resetOneSection('faq')} onCancel={cancelSectionEdits} />
            </div>
          )}

          {!activeMeta.ready && (
            <div className="admin-panel">
              <p className="admin-panel-title">{activeMeta.label}</p>
              <p className="admin-page-sub">
                This section isn't wired up to an editor yet - it's next in line for the Content module. For now it
                still shows the storefront's built-in copy and images.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminContent;
