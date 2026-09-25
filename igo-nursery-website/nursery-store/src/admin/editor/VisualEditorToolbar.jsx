import React from 'react';
import { useVisualEditor } from './VisualEditorContext';
import { Link } from 'react-router-dom';

export default function VisualEditorToolbar() {
  const { hasUnsavedChanges, publish, deviceMode, setDeviceMode } = useVisualEditor();

  return (
    <div className="visual-editor-toolbar">
      <div className="ve-brand">
        <img src="/images/logo.png" alt="Nursery Green" className="ve-brand-logo" />
      </div>
      
      <div className="ve-toolbar-center">
        <Link to="/" className="ve-btn-view-site" target="_blank">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
          View Website
        </Link>

        <div className="ve-device-toggles">
          <button 
            className={`ve-device-btn ${deviceMode === 'desktop' ? 'active' : ''}`}
            onClick={() => setDeviceMode('desktop')}
            title="Desktop"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          </button>
          <button 
            className={`ve-device-btn ${deviceMode === 'tablet' ? 'active' : ''}`}
            onClick={() => setDeviceMode('tablet')}
            title="Tablet"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
          </button>
          <button 
            className={`ve-device-btn ${deviceMode === 'mobile' ? 'active' : ''}`}
            onClick={() => setDeviceMode('mobile')}
            title="Mobile"
          >
            <svg width="14" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
          </button>
        </div>
      </div>

      <div className="ve-toolbar-right">
        {hasUnsavedChanges ? (
          <div className="ve-status" style={{ color: '#ef4444' }}>
            ● Unsaved Changes
          </div>
        ) : (
          <div className="ve-status">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            Saved
          </div>
        )}
        
        <button 
          className="ve-btn-publish" 
          onClick={() => {
            publish();
            alert('Changes published successfully!');
          }}
          disabled={!hasUnsavedChanges}
          style={{ opacity: !hasUnsavedChanges ? 0.7 : 1 }}
        >
          Publish Changes
        </button>

        <div className="ve-admin-profile">
          <div className="ve-admin-avatar">A</div>
          Admin
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
        </div>
      </div>
    </div>
  );
}
