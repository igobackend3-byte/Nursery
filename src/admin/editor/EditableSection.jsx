import React, { useEffect } from 'react';
import { useVisualEditor } from './VisualEditorContext';
import './editor.css';
import { getSectionSchema } from './sectionSchemas';
import CategoryManagementList from './CategoryManagementList';
import ProductSectionManager from './ProductSectionManager';

const IconEdit = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
);
const IconImage = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
);
const IconVideo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
);
const IconGrid = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
);
const IconPlus = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const IconReset = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
);
const IconSettings = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
);
const IconShoppingBag = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
);

// Empty-array-safe template used by "+ Add <item>" so a brand new card has
// every field the card editor expects, instead of an object missing keys.
function blankItemFromSchema(cardsSchema) {
  const item = { id: Date.now().toString() };
  (cardsSchema.itemFields || []).forEach((f) => {
    if (f.type === 'checkbox') item[f.field] = false;
    else if (f.type === 'number') item[f.field] = '';
    else item[f.field] = '';
  });
  item.visible = true;
  return item;
}

export default function EditableSection({ sectionKey, label, children, products, linkedSectionKeys = [], extraAddActions = [] }) {
  const { isEditorMode, activeSection, registerSection, deleteSection, restoreDefault, draftContent, setActiveElement, addArrayItem } = useVisualEditor();

  useEffect(() => {
    if (isEditorMode) {
      registerSection(sectionKey, label || sectionKey);
    }
  }, [isEditorMode, sectionKey, label, registerSection]);

  if (!isEditorMode) {
    // If we're not in editor mode, respect visibility toggle
    if (draftContent && draftContent[sectionKey] && draftContent[sectionKey].visible === false) {
      return null;
    }
    return <>{children}</>;
  }

  // If we are in editor mode, only show if it's the active section
  if (activeSection !== sectionKey) {
    return null;
  }

  const schema = getSectionSchema(sectionKey);
  // Normalize legacy single-`image` schemas into the `images` array shape.
  const images = schema.images || (schema.image ? [schema.image] : []);

  // Scoped strictly to the sections that asked for this fuller list-style
  // management view - every other section's layout/behavior is unchanged.
  const hasProductManager = !!schema.products && !!products;
  // Complete Garden's pills and Garden Services' cards get the same
  // list-style manager as Shop by Category's tiles - same underlying
  // CategoryManagementList component, driven entirely by schema.cards,
  // no section-specific code needed.
  const hasCardManager = ['shopByCategory', 'completeGarden', 'gardenServices', 'nurseryJourney', 'whyIgo'].includes(sectionKey);

  return (
    <div className="active-section-editor">
      {(hasCardManager || hasProductManager) && <p className="ve-preview-label">Website Preview</p>}
      <div
        className="editable-section-preview"
        onClick={(e) => {
          if (e.target.closest('a') || e.target.tagName.toLowerCase() === 'a') {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        {children}
      </div>

      {hasCardManager && schema.cards && <CategoryManagementList sectionKey={sectionKey} schema={schema} />}
      {hasProductManager && <ProductSectionManager sectionKey={sectionKey} products={products} label={schema.cards?.label || label} />}

      <div className="quick-actions-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="quick-actions-title" style={{ marginBottom: 0 }}>Quick Actions: {label || sectionKey}</h3>
          <button
            className="btn-delete-section"
            onClick={() => {
              if (window.confirm(`Delete "${label || sectionKey}" section?\n\nThis will remove the section from the Home Page. You can bring it back with Reset to Default.`)) {
                deleteSection(sectionKey);
                // Some sections are two independently-stored siteContent
                // keys presented as one visual block on the Home Page (e.g.
                // "How We Compare" is comparisonSection + trustBenefits) -
                // linkedSectionKeys keeps Delete/Reset acting on the whole
                // visible block instead of leaving half of it behind.
                linkedSectionKeys.forEach((k) => deleteSection(k));
              }
            }}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            Delete Section
          </button>
        </div>
        <div className="quick-actions-grid">
          {schema.text && schema.text.length > 0 && (
            <button className="quick-action-btn" onClick={() => {
              setActiveElement({ sectionKey, field: '__text_fields__', type: 'text_fields', label: 'Text', fields: schema.text });
            }}>
              <IconEdit />
              Edit Text
            </button>
          )}

          {images.map((img) => (
            <button key={img.field} className="quick-action-btn" onClick={() => {
              setActiveElement({ sectionKey, field: img.field, type: 'image', label: img.label });
            }}>
              <IconImage />
              Replace {img.label}
            </button>
          ))}

          {schema.video && (
            <button className="quick-action-btn" onClick={() => {
              setActiveElement({ sectionKey, field: schema.video.field, type: 'video', label: schema.video.label });
            }}>
              <IconVideo />
              Replace Video
            </button>
          )}

          {schema.button && (
            <button className="quick-action-btn" onClick={() => {
              setActiveElement({ sectionKey, field: '__button__', type: 'text_fields', label: schema.button.label || 'Button', fields: schema.button.fields });
            }}>
              <IconEdit />
              Edit {schema.button.label || 'Button'}
            </button>
          )}

          {/* Named groups of plain scalar fields beyond the single primary
              `button` (e.g. Newsletter's Heading / Email Input) - each gets
              its own "Edit <label>" action, same text_fields modal as
              `button` above, driven purely by schema data. */}
          {(schema.fieldGroups || []).map((group) => (
            <button key={group.key} className="quick-action-btn" onClick={() => {
              setActiveElement({ sectionKey, field: `__${group.key}__`, type: 'text_fields', label: group.label, fields: group.fields });
            }}>
              <IconEdit />
              Edit {group.label}
            </button>
          ))}

          {schema.cards && (
            <>
              <button className="quick-action-btn" onClick={() => {
                setActiveElement({ sectionKey, field: schema.cards.field, type: 'cards_manager', label: schema.cards.label, cardsSchema: schema.cards });
              }}>
                <IconGrid />
                Manage {schema.cards.label}
              </button>
              <button className="quick-action-btn" onClick={() => {
                addArrayItem(sectionKey, schema.cards.field, blankItemFromSchema(schema.cards));
              }}>
                <IconPlus />
                Add {schema.cards.itemLabel || 'Item'}
              </button>
            </>
          )}

          {/* A second (third, ...) independently-manageable repeatable list
              on the same section - e.g. Gifting's CTA buttons alongside its
              feature chips. Each gets its own Manage/Add pair, same as
              schema.cards above, driven purely by schema data. */}
          {(schema.cardGroups || []).map((group) => (
            <React.Fragment key={group.field}>
              <button className="quick-action-btn" onClick={() => {
                setActiveElement({ sectionKey, field: group.field, type: 'cards_manager', label: group.label, cardsSchema: group });
              }}>
                <IconGrid />
                Manage {group.label}
              </button>
              <button className="quick-action-btn" onClick={() => {
                addArrayItem(sectionKey, group.field, blankItemFromSchema(group));
              }}>
                <IconPlus />
                Add {group.itemLabel || 'Item'}
              </button>
            </React.Fragment>
          ))}

          {schema.products && (
            <>
              <button className="quick-action-btn" onClick={() => {
                document.querySelector('.cat-mgmt-panel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }}>
                <IconShoppingBag />
                Manage Products
              </button>
              <button className="quick-action-btn" onClick={() => {
                window.dispatchEvent(new CustomEvent('ve-add-product', { detail: { sectionKey } }));
              }}>
                <IconPlus />
                Add Product
              </button>
            </>
          )}

          {/* For a linked siteContent key that isn't this EditableSection's
              own sectionKey (e.g. Trust Benefits, stored separately from
              comparisonSection but shown as one "How We Compare" block) -
              gives it a Quick Action of its own without a second sidebar
              entry or a second Quick Actions panel. */}
          {extraAddActions.map((ec) => (
            <button
              key={ec.sectionKey}
              className="quick-action-btn"
              onClick={() => {
                addArrayItem(ec.sectionKey, ec.schema.cards.field, blankItemFromSchema(ec.schema.cards));
              }}
            >
              <IconPlus />
              Add {ec.schema.cards.itemLabel || 'Item'}
            </button>
          ))}

          {schema.reset && (
            <button className="quick-action-btn" onClick={() => {
              if (window.confirm('Reset this section to its default content? This discards your unpublished changes for this section only - other sections are not affected.')) {
                restoreDefault(sectionKey);
                linkedSectionKeys.forEach((k) => restoreDefault(k));
              }
            }}>
              <IconReset />
              Reset to Default
            </button>
          )}

          {schema.settings && (
            <button className="quick-action-btn" onClick={() => {
              setActiveElement({
                sectionKey,
                field: 'settings',
                type: 'settings',
                label: 'Section Settings',
                // Lets the generic Settings modal offer a Solid/Image
                // background choice only for sections that actually
                // support a background image (see sectionSchemas.js).
                backgroundImageField: schema.backgroundImage?.field,
              });
            }}>
              <IconSettings />
              Section Settings
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
