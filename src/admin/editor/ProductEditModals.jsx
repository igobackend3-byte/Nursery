import React, { useState } from 'react';
import ImageField from '../ImageField';

// Small, focused modal for the "Replace Image" hover/list action on a real
// catalogue product - lighter than opening the full Edit Product form when
// all the admin wants to change is the photo. Reuses the same ImageField
// (upload-from-computer -> data: URL) as the Products admin page and every
// other image control in this app - no second file picker.
export function ProductImageModal({ product, onClose, onSave }) {
  const [value, setValue] = useState(product?.image || '');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className="ve-modal-overlay" onClick={onClose}>
      <div className="ve-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ve-modal-header">
          <h3>Replace Image - {product?.name}</h3>
          <button type="button" className="ve-modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="ve-modal-body">
          {!confirmingDelete ? (
            <>
              <ImageField id={`pim-${product?.id}`} value={value} onChange={setValue} />
              {value && (
                <button
                  type="button"
                  className="ve-btn-sm"
                  style={{ marginTop: '10px', color: '#b91c1c', borderColor: '#fecaca' }}
                  onClick={() => setConfirmingDelete(true)}
                >
                  Delete Image
                </button>
              )}
            </>
          ) : (
            <div>
              <p style={{ margin: '0 0 12px' }}>Delete this image? The card will fall back to a clean placeholder image - it will never show a broken image.</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="ve-btn" onClick={() => setConfirmingDelete(false)}>Cancel</button>
                <button
                  type="button"
                  className="ve-btn ve-btn-primary"
                  style={{ background: '#dc2626', borderColor: '#dc2626' }}
                  onClick={() => { setValue(''); setConfirmingDelete(false); }}
                >
                  Delete &amp; Use Default
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="ve-modal-footer">
          <button type="button" className="ve-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="ve-btn ve-btn-primary" onClick={() => onSave(value)}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

// Confirms removing a product from THIS homepage section only - never
// deletes the product itself from the catalogue (that's a much bigger,
// site-wide action that belongs on the dedicated Products admin page).
export function ProductRemoveConfirmModal({ product, onClose, onConfirm }) {
  return (
    <div className="ve-modal-overlay" onClick={onClose}>
      <div className="ve-modal" style={{ maxWidth: '380px' }} onClick={(e) => e.stopPropagation()}>
        <div className="ve-modal-header">
          <h3>Remove from Section</h3>
          <button type="button" className="ve-modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="ve-modal-body">
          {product?.image && (
            <img
              src={product.image}
              alt=""
              style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }}
            />
          )}
          <p style={{ margin: 0 }}>
            Remove <strong>{product?.name}</strong> from this section? It stays in your product catalogue and on every
            other page (category, search, cart) - this only takes it out of this homepage row.
          </p>
        </div>
        <div className="ve-modal-footer">
          <button type="button" className="ve-btn" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="ve-btn ve-btn-primary"
            style={{ background: '#dc2626', borderColor: '#dc2626' }}
            onClick={onConfirm}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
