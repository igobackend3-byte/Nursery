import React from 'react';
import { VisualEditorProvider, VisualEditorContext } from './VisualEditorContext';
import VisualEditorToolbar from './VisualEditorToolbar';
import InlineEditorModal from './InlineEditorModal';
import { SiteContentContext } from '../../hooks/useSiteContent';
import Home from '../../pages/Home';

import { useParams } from 'react-router-dom';
import About from '../../pages/About';
import SectionHub from '../../pages/SectionHub';
import GardenServices from '../../pages/GardenServices';
import Landscaping from '../../pages/Landscaping';
import CategoryPage from '../../pages/CategoryPage';
import { SECTION_HUBS } from '../../data/sectionHubs';
import Blog from '../../pages/Blog';
import Contact from '../../pages/Contact';

import SectionList from './SectionList';

// This acts as a wrapper that injects the draft content into the storefront components
function VisualEditorApp() {
  const { draftContent, deviceMode, activeSection } = React.useContext(VisualEditorContext);
  const { pageId } = useParams();

  let PageComponent = <Home />;
  if (pageId === 'about') {
    PageComponent = <About />;
  } else if (pageId === 'plants') {
    PageComponent = <SectionHub config={SECTION_HUBS.plants} />;
  } else if (pageId === 'seeds') {
    PageComponent = <SectionHub config={SECTION_HUBS.seeds} />;
  } else if (pageId === 'pots-planters') {
    PageComponent = <SectionHub config={SECTION_HUBS.potsPlanters} />;
  } else if (pageId === 'plant-care') {
    PageComponent = <SectionHub config={SECTION_HUBS.plantCare} />;
  } else if (pageId === 'garden-services') {
    PageComponent = <GardenServices />;
  } else if (pageId === 'landscaping') {
    PageComponent = <Landscaping />;
  } else if (pageId === 'gifting') {
    PageComponent = <CategoryPage slugOverride="gifting" />;
  } else if (pageId === 'corporate-gifting') {
    PageComponent = <CategoryPage slugOverride="corporate-gifts" />;
  } else if (pageId === 'blog') {
    PageComponent = <Blog />;
  } else if (pageId === 'contact') {
    PageComponent = <Contact />;
  }

  return (
    <SiteContentContext.Provider value={draftContent}>
      <div className="admin-page-editor">
        <VisualEditorToolbar pageId={pageId} />
        
        <div className="admin-page-editor-main">
          <div className="admin-page-editor-sidebar">
            <SectionList pageId={pageId} />
          </div>
          
          <div className="admin-page-editor-preview">
            <div 
              className={`ve-preview-wrapper ve-mode-${deviceMode}`} 
              style={{ display: activeSection ? 'block' : 'none' }}
            >
              <div className="ve-preview-inner">
                {/* Remove Layout wrapper to avoid site header/footer in isolated section view */}
                {PageComponent}
              </div>
            </div>
            
            {!activeSection && (
              <div className="no-section-selected">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3, marginBottom: 16 }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                <h3>No Section Selected</h3>
                <p>Select a section from the left sidebar to edit its content.</p>
              </div>
            )}
          </div>
        </div>
        
        <InlineEditorModal />
      </div>
    </SiteContentContext.Provider>
  );
}

export default function VisualEditor() {
  return (
    <VisualEditorProvider>
      <VisualEditorApp />
    </VisualEditorProvider>
  );
}
