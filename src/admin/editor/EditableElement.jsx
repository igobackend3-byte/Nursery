import React, { useState } from 'react';
import { useVisualEditor } from './VisualEditorContext';
import './editor.css';

export default function EditableElement({ sectionKey, field, type = 'text', label = 'Content', fields, hideDelete = false, fill = false, wrapperStyle, insetBadge = false, compactBadge = false, children }) {
  const { isEditorMode, activeElement, setActiveElement, deleteContent, updateContent, draftContent } = useVisualEditor();
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState('');

  if (!isEditorMode) {
    return <>{children}</>;
  }

  const isActive = activeElement?.sectionKey === sectionKey && activeElement?.field === field;

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Set current value in state for inline editing
    let currentVal = draftContent?.[sectionKey];
    if (currentVal && field.includes('.')) {
      const parts = field.split('.');
      for (const p of parts) {
        currentVal = currentVal?.[p];
      }
    } else {
      currentVal = currentVal?.[field];
    }
    
    setInputValue(currentVal || '');
    
    setActiveElement({ sectionKey, field, type, label, ...(fields ? { fields } : {}) });
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Delete this ${type}?`)) {
      deleteContent(sectionKey, field);
      if (isActive) setActiveElement(null);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateContent(sectionKey, field, inputValue);
    setActiveElement(null);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveElement(null);
  };

  if (isActive && type === 'text') {
    return (
      <div className="editable-element-wrap editable-inline-active">
        {children}
        <div className="editable-inline-input-wrapper">
          <textarea 
            className="editable-inline-textarea"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            rows={Math.max(2, inputValue.split('\n').length)}
            autoFocus
          />
          <div className="editable-inline-controls">
            <button className="ve-btn-sm ve-btn-cancel" onClick={handleCancel}>Cancel</button>
            <button className="ve-btn-sm ve-btn-save" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`editable-element-wrap${fill ? ' editable-element-fill' : ''}${insetBadge ? ' editable-badge-inset' : ''}${compactBadge ? ' editable-badge-compact' : ''}`}
      style={wrapperStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        // Prevent default navigation if clicking links inside the editor
        if (e.target.closest('a')) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      {children}
      
      <div className="editable-element-overlay"></div>
      
      <div className="editable-element-badge">
        <span className="editable-label">{label}</span>
        <div className="editable-element-action" onClick={handleEdit}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          {(type === 'image' || type === 'video') ? 'Replace' : 'Edit'}
        </div>
        {!hideDelete && (
          <div className="editable-element-action delete" onClick={handleDelete}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            Delete
          </div>
        )}
      </div>
    </div>
  );
}
