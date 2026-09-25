import React, { useEffect, useState } from 'react';
import { useVisualEditor } from './VisualEditorContext';
import { useAdminData } from '../AdminDataContext';
import { ProductFormModal } from '../pages/Products';
import { ProductImageModal, ProductRemoveConfirmModal } from './ProductEditModals';

// The "Manage Products" list view for a real-catalogue-backed section
// (Plants People Love, Just In) - rendered below the live "Website
// Preview" exactly like CategoryManagementList is for Shop by Category.
// Every row is a real product from the same Firestore-backed catalogue
// the storefront and the Products admin page use (see useAdminData) -
// nothing here is section-local/hard-coded data.
export default function ProductSectionManager({ sectionKey, products, label }) {
  const { draftContent, updateContent } = useVisualEditor();
  const { products: allProducts, categories, updateProduct, addProduct } = useAdminData();
  const [rowModal, setRowModal] = useState(null); // { id, type }
  const [showPicker, setShowPicker] = useState(false);
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);

  const curatedField = 'productIds';
  const displayedIds = products.map((p) => p.id);

  useEffect(() => {
    function onOpenAdd(e) {
      if (e.detail?.sectionKey === sectionKey) setShowPicker(true);
    }
    window.addEventListener('ve-add-product', onOpenAdd);
    return () => window.removeEventListener('ve-add-product', onOpenAdd);
  }, [sectionKey]);

  function currentIds() {
    const saved = draftContent?.[sectionKey]?.[curatedField];
    return saved?.length ? saved : displayedIds;
  }

  function removeProduct(id) {
    updateContent(sectionKey, curatedField, currentIds().filter((pid) => pid !== id));
  }

  function addProductToSection(id) {
    const ids = currentIds();
    if (ids.includes(id)) return;
    updateContent(sectionKey, curatedField, [...ids, id]);
  }

  const rowProduct = rowModal ? allProducts.find((p) => p.id === rowModal.id) : null;
  const availableToAdd = allProducts.filter((p) => (
    !displayedIds.includes(p.id) && p.name.toLowerCase().includes(query.trim().toLowerCase())
  ));

  return (
    <div className="cat-mgmt-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 className="quick-actions-title" style={{ marginBottom: 0 }}>Manage {label || 'Products'}</h3>
        <button type="button" className="ve-btn-sm" onClick={() => setShowPicker(true)}>+ Add Product</button>
      </div>

      <div className="cat-mgmt-list">
        {products.map((p) => (
          <div key={p.id} className="cat-mgmt-row">
            <div className="cat-mgmt-thumb">
              {p.image ? <img src={p.image} alt="" /> : <div className="cat-mgmt-thumb-empty">No image</div>}
            </div>
            <div>
              <div className="cat-mgmt-name">{p.name}</div>
              <span className="cat-mgmt-name-sub">
                {p.categoryLabel || p.category}
                {' · '}₹{p.price}
                {p.isBestSeller ? ' · Bestseller' : ''}
                {' · '}{p.rating ?? '-'}/5
              </span>
            </div>
            <div className="cat-mgmt-status is-active">Active</div>
            <div className="cat-mgmt-order">#{displayedIds.indexOf(p.id) + 1}</div>
            <div className="cat-mgmt-actions">
              <button type="button" className="ve-btn-sm" onClick={() => setRowModal({ id: p.id, type: 'image' })}>Replace Image</button>
              <button type="button" className="ve-btn-sm" onClick={() => setRowModal({ id: p.id, type: 'edit' })}>Edit</button>
              <button type="button" className="ve-btn-sm ve-btn-cancel" onClick={() => setRowModal({ id: p.id, type: 'remove' })}>Delete</button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p style={{ opacity: 0.7, fontSize: '13px', margin: 0 }}>No products in this section yet - use &quot;+ Add Product&quot; above.</p>
        )}
      </div>

      {rowModal?.type === 'edit' && rowProduct && (
        <ProductFormModal
          product={rowProduct}
          categories={categories}
          onClose={() => setRowModal(null)}
          onSave={(patch) => { updateProduct(rowProduct.id, patch); setRowModal(null); }}
        />
      )}
      {rowModal?.type === 'image' && rowProduct && (
        <ProductImageModal
          product={rowProduct}
          onClose={() => setRowModal(null)}
          onSave={(image) => { updateProduct(rowProduct.id, { image }); setRowModal(null); }}
        />
      )}
      {rowModal?.type === 'remove' && rowProduct && (
        <ProductRemoveConfirmModal
          product={rowProduct}
          onClose={() => setRowModal(null)}
          onConfirm={() => { removeProduct(rowProduct.id); setRowModal(null); }}
        />
      )}

      {showPicker && (
        <div className="ve-modal-overlay" onClick={() => setShowPicker(false)}>
          <div className="ve-modal" style={{ maxWidth: '460px' }} onClick={(e) => e.stopPropagation()}>
            <div className="ve-modal-header">
              <h3>Add Product to {label || 'Section'}</h3>
              <button type="button" className="ve-modal-close" onClick={() => setShowPicker(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="ve-modal-body">
              <input
                type="text"
                className="ve-input"
                placeholder="Search your product catalogue..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ marginBottom: '12px' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '320px', overflowY: 'auto' }}>
                {availableToAdd.slice(0, 40).map((p) => (
                  <div key={p.id} className="cat-mgmt-row" style={{ gridTemplateColumns: '40px 1fr auto' }}>
                    <div className="cat-mgmt-thumb" style={{ width: '36px', height: '36px' }}>
                      {p.image ? <img src={p.image} alt="" /> : <div className="cat-mgmt-thumb-empty">No image</div>}
                    </div>
                    <div className="cat-mgmt-name">{p.name} <span className="cat-mgmt-name-sub" style={{ display: 'inline' }}>· ₹{p.price}</span></div>
                    <button type="button" className="ve-btn-sm" onClick={() => addProductToSection(p.id)}>+ Add</button>
                  </div>
                ))}
                {availableToAdd.length === 0 && (
                  <p style={{ opacity: 0.7, fontSize: '13px' }}>No matching products, or every product is already in this section.</p>
                )}
              </div>
            </div>
            <div className="ve-modal-footer" style={{ justifyContent: 'space-between' }}>
              <button
                type="button"
                className="ve-btn-sm"
                disabled={adding}
                onClick={() => { setShowPicker(false); setAdding(true); }}
              >
                + Create a brand-new product instead
              </button>
              <button type="button" className="ve-btn" onClick={() => setShowPicker(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {adding && (
        <ProductFormModal
          product={null}
          categories={categories}
          onClose={() => setAdding(false)}
          onSave={async (newProduct) => {
            const id = await addProduct(newProduct);
            if (id) addProductToSection(id);
            setAdding(false);
          }}
        />
      )}
    </div>
  );
}
