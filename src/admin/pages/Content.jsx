import { useState } from 'react';
import { getSiteContent, saveSiteContent, resetSiteContent } from '../../lib/contentStore';
import { PlusIcon, TrashIcon } from '../adminIcons';
import ImageField from '../ImageField';

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

function AdminContent() {
  const [content, setContent] = useState(getSiteContent);
  const [saved, setSaved] = useState(false);

  function setHero(field, value) {
    setContent((prev) => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
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

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Content</h1>
          <p className="admin-page-sub">Edits homepage sections that aren't tied to a single product - hero, offers, journal, services.</p>
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
        <p className="admin-panel-title">Hero section</p>
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
          <div className="admin-field span-2">
            <label htmlFor="h-video">Background video URL</label>
            <input id="h-video" value={content.hero.videoUrl} onChange={(e) => setHero('videoUrl', e.target.value)} />
          </div>
        </div>
      </div>

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

      <ListEditor
        title="Garden Journal"
        hint="Blog cards shown on the homepage, with their images."
        items={content.journal}
        onChange={(items) => setSection('journal', items)}
        newItem={{ title: 'New post', to: '/blog', image: '' }}
        itemFields={[
          { key: 'title', label: 'Title', span2: true },
          { key: 'to', label: 'Link' },
          { key: 'image', label: 'Image', type: 'image', span2: true },
        ]}
      />

      <ListEditor
        title="Garden Services"
        hint="Service tiles shown on the homepage."
        items={content.gardenServices}
        onChange={(items) => setSection('gardenServices', items)}
        newItem={{ title: 'New service', to: '/garden-services' }}
        itemFields={[
          { key: 'title', label: 'Title' },
          { key: 'to', label: 'Link' },
        ]}
      />
    </div>
  );
}

export default AdminContent;
