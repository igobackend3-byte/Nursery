import React from 'react';
import { useVisualEditor } from './VisualEditorContext';
import { getSectionSchema } from './sectionSchemas';
import './editor.css';

// Wraps one card/tile in a live section preview with a small hover
// toolbar (Edit / Delete) so individual cards - category tiles, corner
// cards, journey steps, journal posts, etc - are editable right where
// they're rendered, not just through the "Manage X" list modal.
// Outside the editor (the real public site) this renders `children` as-is.
export default function CardHoverControls({ sectionKey, arrayField, index, itemLabel, children }) {
  const { isEditorMode, setActiveElement, deleteArrayItem, duplicateArrayItem } = useVisualEditor();

  if (!isEditorMode) return <>{children}</>;

  // Resolve which repeatable-list schema this card belongs to: the
  // section's primary `cards` array, or (for a section with more than one
  // independently-managed array, e.g. Gifting's features + buttons) the
  // matching entry in `cardGroups`.
  const schema = getSectionSchema(sectionKey);
  const cardsSchema = (schema.cards && schema.cards.field === arrayField)
    ? schema.cards
    : (schema.cardGroups || []).find((g) => g.field === arrayField);

  return (
    <div className="card-hover-wrap" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
      {children}
      <div className="card-hover-toolbar">
        <button
          type="button"
          className="card-hover-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setActiveElement({
              sectionKey,
              field: `${arrayField}.${index}`,
              type: 'card_editor',
              label: itemLabel || 'Card',
              cardsSchema,
            });
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          Edit
        </button>
        <button
          type="button"
          className="card-hover-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            duplicateArrayItem(sectionKey, arrayField, index);
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Duplicate
        </button>
        <button
          type="button"
          className="card-hover-btn card-hover-btn-danger"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (window.confirm(`Delete this ${(itemLabel || 'item').toLowerCase()}?`)) {
              deleteArrayItem(sectionKey, arrayField, index);
            }
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          Delete
        </button>
      </div>
    </div>
  );
}
