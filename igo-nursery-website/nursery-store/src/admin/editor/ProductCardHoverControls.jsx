import React, { useState } from 'react';
import { useVisualEditor } from './VisualEditorContext';
import { useAdminDataSafe } from '../AdminDataContext';
import { ProductFormModal } from '../pages/Products';
import { ProductImageModal, ProductRemoveConfirmModal } from './ProductEditModals';

// Wraps one real catalogue product's <ProductCard/> (Plants People Love,
// Just In) with a hover toolbar, same pattern as CardHoverControls for the
// siteContent-driven sections (Shop by Category, Home Corners) - but these
// products are NOT siteContent cards. They're real Firestore product docs,
// the exact same ones the Products admin page and the rest of the
// storefront (category pages, search, cart) read/write - so every edit
// here goes through the same updateProduct()/addProduct() the Products
// page uses. Nothing is duplicated or forked into section-local data.
export default function ProductCardHoverControls({ sectionKey, product, displayedIds, children }) {
  const { isEditorMode, draftContent, updateContent } = useVisualEditor();
  // Safe variant: this component is mounted on every product card on the
  // PUBLIC site too (Plants People Love / Just In), which has no
  // AdminDataProvider - only pull real values out of it once we know
  // we're actually inside the editor, just below.
  const { updateProduct, categories } = useAdminDataSafe() || {};
  const [activeModal, setActiveModal] = useState(null); // null | 'edit' | 'image' | 'remove'

  if (!isEditorMode) return <>{children}</>;

  // The section's curated list, or - if the admin hasn't curated yet and
  // is just seeing the automatic pick (top-rated / seeded "new") - the ids
  // currently on screen, so "Remove" always has a real list to remove from.
  const curatedField = 'productIds';
  function currentIds() {
    const saved = draftContent?.[sectionKey]?.[curatedField];
    return saved?.length ? saved : displayedIds;
  }

  function removeFromSection() {
    const next = currentIds().filter((id) => id !== product.id);
    updateContent(sectionKey, curatedField, next);
    setActiveModal(null);
  }

  return (
    <div className="card-hover-wrap" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
      {children}
      <div className="card-hover-toolbar">
        <button type="button" className="card-hover-btn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveModal('image'); }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          Replace Image
        </button>
        <button type="button" className="card-hover-btn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveModal('edit'); }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          Edit Product
        </button>
        <button type="button" className="card-hover-btn card-hover-btn-danger" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveModal('remove'); }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          Remove
        </button>
      </div>

      {activeModal === 'edit' && (
        <ProductFormModal
          product={product}
          categories={categories}
          onClose={() => setActiveModal(null)}
          onSave={(patch) => { updateProduct(product.id, patch); setActiveModal(null); }}
        />
      )}
      {activeModal === 'image' && (
        <ProductImageModal
          product={product}
          onClose={() => setActiveModal(null)}
          onSave={(image) => { updateProduct(product.id, { image }); setActiveModal(null); }}
        />
      )}
      {activeModal === 'remove' && (
        <ProductRemoveConfirmModal
          product={product}
          onClose={() => setActiveModal(null)}
          onConfirm={removeFromSection}
        />
      )}
    </div>
  );
}
