import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getDraftContent, saveDraftContent, publishDraftContent, clearDraftContent } from '../../lib/contentStore';
import { DEFAULT_SITE_CONTENT } from '../../data/siteContent';

export const VisualEditorContext = createContext(null);

export function VisualEditorProvider({ children }) {
  const [draftContent, setDraftContent] = useState(getDraftContent());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeElement, setActiveElement] = useState(null); // Which element is being edited
  const [deviceMode, setDeviceMode] = useState('desktop'); // desktop, tablet, mobile
  const [activeSection, setActiveSection] = useState(null);
  const [pageSections, setPageSections] = useState([]); // [{ key, label }]

  // Save draft locally
  useEffect(() => {
    saveDraftContent(draftContent);
  }, [draftContent]);

  const updateContent = useCallback((sectionKey, field, value) => {
    setDraftContent(prev => {
      const newSection = { ...prev[sectionKey] };
      if (field.includes('.')) {
        const parts = field.split('.');
        const lastPart = parts.pop();
        let target = newSection;
        for (const p of parts) {
          if (!target[p]) target[p] = {};
          // Ensure we don't mutate original array/object by shallow cloning
          target[p] = Array.isArray(target[p]) ? [...target[p]] : { ...target[p] };
          target = target[p];
        }
        target[lastPart] = value;
      } else {
        newSection[field] = value;
      }
      return { ...prev, [sectionKey]: newSection };
    });
    setHasUnsavedChanges(true);
  }, []);

  const addArrayItem = useCallback((sectionKey, arrayField, newItem) => {
    setDraftContent(prev => {
      const arr = prev[sectionKey]?.[arrayField] || [];
      const newSection = { ...prev[sectionKey], [arrayField]: [...arr, { id: Date.now().toString(), ...newItem }] };
      return { ...prev, [sectionKey]: newSection };
    });
    setHasUnsavedChanges(true);
  }, []);

  const updateArrayItem = useCallback((sectionKey, arrayField, index, field, value) => {
    setDraftContent(prev => {
      const arr = prev[sectionKey]?.[arrayField] || [];
      const newArr = [...arr];
      newArr[index] = { ...newArr[index], [field]: value };
      const newSection = { ...prev[sectionKey], [arrayField]: newArr };
      return { ...prev, [sectionKey]: newSection };
    });
    setHasUnsavedChanges(true);
  }, []);

  const deleteArrayItem = useCallback((sectionKey, arrayField, index) => {
    setDraftContent(prev => {
      const arr = prev[sectionKey]?.[arrayField] || [];
      const newArr = [...arr];
      newArr.splice(index, 1);
      const newSection = { ...prev[sectionKey], [arrayField]: newArr };
      return { ...prev, [sectionKey]: newSection };
    });
    setHasUnsavedChanges(true);
  }, []);

  // Inserts an exact copy of one array item (new id, same field values)
  // directly after the original - used by CardHoverControls' "Duplicate"
  // action so an admin can clone a card/row/item and then edit the copy.
  const duplicateArrayItem = useCallback((sectionKey, arrayField, index) => {
    setDraftContent(prev => {
      const arr = prev[sectionKey]?.[arrayField] || [];
      const source = arr[index];
      if (!source) return prev;
      const copy = { ...source, id: Date.now().toString() };
      const newArr = [...arr];
      newArr.splice(index + 1, 0, copy);
      const newSection = { ...prev[sectionKey], [arrayField]: newArr };
      return { ...prev, [sectionKey]: newSection };
    });
    setHasUnsavedChanges(true);
  }, []);

  const deleteContent = useCallback((sectionKey, field) => {
    // Fallback to recommended/default
    let recommendedValue = DEFAULT_SITE_CONTENT[sectionKey];
    if (recommendedValue && field.includes('.')) {
      const parts = field.split('.');
      for (const p of parts) {
        recommendedValue = recommendedValue?.[p];
      }
    } else {
      recommendedValue = recommendedValue?.[field];
    }
    updateContent(sectionKey, field, recommendedValue);
  }, [updateContent]);

  const publish = useCallback(() => {
    publishDraftContent();
    setHasUnsavedChanges(false);
  }, []);

  const restoreDefault = useCallback((sectionKey) => {
    setDraftContent(prev => {
      return { ...prev, [sectionKey]: { ...DEFAULT_SITE_CONTENT[sectionKey] } };
    });
    setHasUnsavedChanges(true);
  }, []);

  const moveSectionUp = useCallback((sectionKey) => {
    setDraftContent(prev => {
      const currentOrder = prev[sectionKey]?.displayOrder || 0;
      return {
        ...prev,
        [sectionKey]: { ...prev[sectionKey], displayOrder: Math.max(0, currentOrder - 1) }
      };
    });
    setHasUnsavedChanges(true);
  }, []);

  const moveSectionDown = useCallback((sectionKey) => {
    setDraftContent(prev => {
      const currentOrder = prev[sectionKey]?.displayOrder || 0;
      return {
        ...prev,
        [sectionKey]: { ...prev[sectionKey], displayOrder: currentOrder + 1 }
      };
    });
    setHasUnsavedChanges(true);
  }, []);

  const duplicateSection = useCallback((sectionKey) => {
    setDraftContent(prev => {
      const newKey = `${sectionKey}_copy_${Date.now()}`;
      return {
        ...prev,
        [newKey]: { ...prev[sectionKey], displayOrder: (prev[sectionKey]?.displayOrder || 0) + 1 }
      };
    });
    setHasUnsavedChanges(true);
  }, []);

  const deleteSection = useCallback((sectionKey) => {
    if (window.confirm('Delete this section? It will be removed from the view.')) {
      setDraftContent(prev => {
        const next = { ...prev };
        next[sectionKey] = { ...next[sectionKey], visible: false };
        return next;
      });
      setHasUnsavedChanges(true);
      if (activeSection === sectionKey) setActiveSection(null);
    }
  }, [activeSection]);

  const registerSection = useCallback((sectionKey, label) => {
    setPageSections(prev => {
      if (!prev.find(s => s.key === sectionKey)) {
        return [...prev, { key: sectionKey, label }];
      }
      return prev;
    });
  }, []);

  return (
    <VisualEditorContext.Provider
      value={{
        isEditorMode: true,
        draftContent,
        hasUnsavedChanges,
        updateContent,
        addArrayItem,
        updateArrayItem,
        deleteArrayItem,
        duplicateArrayItem,
        deleteContent,
        publish,
        restoreDefault,
        activeElement,
        setActiveElement,
        moveSectionUp,
        moveSectionDown,
        duplicateSection,
        deleteSection,
        deviceMode,
        setDeviceMode,
        activeSection,
        setActiveSection,
        pageSections,
        registerSection
      }}
    >
      {children}
    </VisualEditorContext.Provider>
  );
}

export function useVisualEditor() {
  const ctx = useContext(VisualEditorContext);
  // Returns context if inside editor, or mock object if outside
  return ctx || {
    isEditorMode: false,
    draftContent: null,
    hasUnsavedChanges: false,
    updateContent: () => {},
    addArrayItem: () => {},
    updateArrayItem: () => {},
    deleteArrayItem: () => {},
    duplicateArrayItem: () => {},
    deleteContent: () => {},
    publish: () => {},
    restoreDefault: () => {},
    activeElement: null,
    setActiveElement: () => {},
    moveSectionUp: () => {},
    moveSectionDown: () => {},
    duplicateSection: () => {},
    deleteSection: () => {},
    deviceMode: 'desktop',
    setDeviceMode: () => {},
    activeSection: null,
    setActiveSection: () => {},
    pageSections: [],
    registerSection: () => {}
  };
}
