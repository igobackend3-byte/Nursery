import React, { useState } from 'react';
import { useVisualEditor } from './VisualEditorContext';

// A dedicated list-style management view for a section's repeatable cards,
// rendered *below* the live "Website Preview" so admins can scan every item
// (image, name, active status) and act on it without hunting through the
// visual preview. Currently wired in only for Shop by Category - reuses the
// exact same schema/context calls as CardHoverControls and the
// cards_manager modal, so no new data plumbing was needed.
export default function CategoryManagementList({ sectionKey, schema }) {
  const { draftContent, setActiveElement, deleteArrayItem } = useVisualEditor();
  const [pendingDelete, setPendingDelete] = useState(null); // { idx, name, img }

  const cardsSchema = schema?.cards;
  if (!cardsSchema) return null;

  const arrayField = cardsSchema.field;
  const items = draftContent?.[sectionKey]?.[arrayField] || [];
  const imageFieldDef = (cardsSchema.itemFields || []).find((f) => f.type === 'image');

  return (
    <div className="cat-mgmt-panel">
      <h3 className="quick-actions-title" style={{ marginBottom: '12px' }}>Manage {schema?.cards?.label || 'Items'}</h3>
      <div className="cat-mgmt-list">
        {items.map((item, idx) => {
          const img = imageFieldDef ? item[imageFieldDef.field] : null;
          const name = item.label || item.title || item.name || `Item ${idx + 1}`;
          const active = item.visible !== false;
          return (
            <div key={item.id || item.slug || idx} className={`cat-mgmt-row${active ? '' : ' is-inactive-row'}`}>
              <div className="cat-mgmt-thumb">
                {img ? <img src={img} alt="" /> : <div className="cat-mgmt-thumb-empty">No image</div>}
              </div>
              <div className="cat-mgmt-name">{name}</div>
              <div className={`cat-mgmt-status ${active ? 'is-active' : 'is-inactive'}`}>
                {active ? 'Active' : 'Inactive'}
              </div>
              <div className="cat-mgmt-order">#{item.order ?? idx + 1}</div>
              <div className="cat-mgmt-actions">
                <button
                  type="button"
                  className="ve-btn-sm"
                  onClick={() => setActiveElement({
                    sectionKey,
                    field: `${arrayField}.${idx}`,
                    type: 'card_editor',
                    label: name,
                    cardsSchema,
                  })}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="ve-btn-sm ve-btn-cancel"
                  onClick={() => setPendingDelete({ idx, name, img })}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <p style={{ opacity: 0.7, fontSize: '13px', margin: 0 }}>
            No categories yet - use &quot;Add {cardsSchema.itemLabel || 'Item'}&quot; in Quick Actions above.
          </p>
        )}
      </div>

      {pendingDelete && (
        <div className="ve-modal-overlay" onClick={() => setPendingDelete(null)}>
          <div className="ve-modal" style={{ maxWidth: '380px' }} onClick={(e) => e.stopPropagation()}>
            <div className="ve-modal-header">
              <h3>Delete Category</h3>
              <button type="button" className="ve-modal-close" onClick={() => setPendingDelete(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="ve-modal-body">
              {pendingDelete.img && (
                <img
                  src={pendingDelete.img}
                  alt=""
                  style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }}
                />
              )}
              <p style={{ margin: 0 }}>
                Delete <strong>{pendingDelete.name}</strong>? This removes it from the admin panel and from the live website. This cannot be undone here.
              </p>
            </div>
            <div className="ve-modal-footer">
              <button type="button" className="ve-btn" onClick={() => setPendingDelete(null)}>Cancel</button>
              <button
                type="button"
                className="ve-btn ve-btn-primary"
                style={{ background: '#dc2626' }}
                onClick={() => {
                  deleteArrayItem(sectionKey, arrayField, pendingDelete.idx);
                  setPendingDelete(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
