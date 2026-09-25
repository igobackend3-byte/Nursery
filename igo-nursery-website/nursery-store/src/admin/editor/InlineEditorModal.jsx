import React, { useState, useEffect } from 'react';
import { useVisualEditor } from './VisualEditorContext';
import ImageField, { VideoField } from '../ImageField';
import { DEFAULT_SITE_CONTENT } from '../../data/siteContent';

// Reads a possibly-nested/array path like "items.2.value" off an object.
function getAtPath(obj, path) {
  if (!path) return undefined;
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

function cardTitle(card, idx, itemTitleFields, itemLabel) {
  for (const f of itemTitleFields || []) {
    if (card && card[f]) return String(card[f]);
  }
  return `${itemLabel || 'Item'} ${idx + 1}`;
}

export default function InlineEditorModal() {
  const { isEditorMode, activeElement, setActiveElement, draftContent, updateContent, deleteArrayItem } = useVisualEditor();
  const [localValue, setLocalValue] = useState('');
  const [textFieldValues, setTextFieldValues] = useState({});
  // Solid Color vs Background Image toggle inside the generic Settings
  // modal - only relevant when activeElement.backgroundImageField is set
  // (i.e. this section's schema declares a backgroundImage field).
  const [bgType, setBgType] = useState('solid');

  // Sync local value when active element changes
  useEffect(() => {
    if (!activeElement || !draftContent) return;

    if (activeElement.type === 'settings' && activeElement.backgroundImageField) {
      const hasImage = !!draftContent[activeElement.sectionKey]?.[activeElement.backgroundImageField];
      setBgType(hasImage ? 'image' : 'solid');
    }

    if (activeElement.type === 'text_fields') {
      const section = draftContent[activeElement.sectionKey] || {};
      const initial = {};
      (activeElement.fields || []).forEach((f) => {
        initial[f.field] = f.type === 'checkbox' ? (section[f.field] !== false) : (section[f.field] ?? '');
      });
      setTextFieldValues(initial);
      return;
    }

    const val = getAtPath(draftContent[activeElement.sectionKey], activeElement.field);
    setLocalValue(val ?? '');
  }, [activeElement, draftContent]);

  if (!isEditorMode || !activeElement) return null;

  const handleSave = () => {
    if (activeElement.type === 'text_fields') {
      Object.entries(textFieldValues).forEach(([field, value]) => {
        updateContent(activeElement.sectionKey, field, value);
      });
      setActiveElement(null);
      return;
    }
    updateContent(activeElement.sectionKey, activeElement.field, localValue);
    setActiveElement(null);
  };

  const isTextarea = localValue && typeof localValue === 'string' && localValue.length > 50;

  // Default (fallback) value for image/video fields, so admins can see what
  // the live site will show if they delete the current one.
  const defaultVal = (activeElement.type === 'image' || activeElement.type === 'video')
    ? getAtPath(DEFAULT_SITE_CONTENT[activeElement.sectionKey], activeElement.field)
    : null;

  return (
    <div className="ve-modal-overlay" onClick={() => setActiveElement(null)}>
      <div className="ve-modal" onClick={e => e.stopPropagation()}>
        <div className="ve-modal-header">
          <h3>Edit {activeElement.label}</h3>
          <button className="ve-modal-close" onClick={() => setActiveElement(null)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="ve-modal-body">
          {activeElement.type === 'settings' ? (
            <div className="ve-form-group">
              {activeElement.backgroundImageField ? (
                <>
                  <label>Background Type</label>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'none' }}>
                      <input
                        type="radio"
                        name="pf-bg-type"
                        checked={bgType === 'solid'}
                        onChange={() => {
                          setBgType('solid');
                          updateContent(activeElement.sectionKey, activeElement.backgroundImageField, '');
                        }}
                      />
                      Solid Color
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'none' }}>
                      <input
                        type="radio"
                        name="pf-bg-type"
                        checked={bgType === 'image'}
                        onChange={() => setBgType('image')}
                      />
                      Background Image
                    </label>
                  </div>

                  {bgType === 'image' ? (
                    <>
                      <ImageField
                        id="settings-bg-image"
                        label="Background Image"
                        value={draftContent[activeElement.sectionKey]?.[activeElement.backgroundImageField] || ''}
                        onChange={(v) => updateContent(activeElement.sectionKey, activeElement.backgroundImageField, v)}
                      />
                      {draftContent[activeElement.sectionKey]?.[activeElement.backgroundImageField] && (
                        <button
                          type="button"
                          className="ve-btn-sm ve-btn-cancel"
                          style={{ marginTop: '8px' }}
                          onClick={() => {
                            updateContent(activeElement.sectionKey, activeElement.backgroundImageField, '');
                            setBgType('solid');
                          }}
                        >
                          Remove Background
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <label>Background Color</label>
                      <input
                        type="text"
                        className="ve-input"
                        value={draftContent[activeElement.sectionKey]?.backgroundColor || ''}
                        onChange={(e) => updateContent(activeElement.sectionKey, 'backgroundColor', e.target.value)}
                        placeholder="e.g. #ffffff or var(--color-background)"
                      />
                    </>
                  )}
                </>
              ) : (
                <>
                  <label>Background Color</label>
                  <input
                    type="text"
                    className="ve-input"
                    value={draftContent[activeElement.sectionKey]?.backgroundColor || ''}
                    onChange={(e) => updateContent(activeElement.sectionKey, 'backgroundColor', e.target.value)}
                    placeholder="e.g. #ffffff or var(--color-background)"
                  />
                </>
              )}
              <label style={{ marginTop: '12px' }}>Section Spacing (Padding Y)</label>
              <input
                type="text"
                className="ve-input"
                value={draftContent[activeElement.sectionKey]?.paddingY || ''}
                onChange={(e) => updateContent(activeElement.sectionKey, 'paddingY', e.target.value)}
                placeholder="e.g. 40px 0 or 80px 0"
              />
              <label style={{ marginTop: '12px' }}>Visibility</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'none' }}>
                <input
                  type="checkbox"
                  checked={draftContent[activeElement.sectionKey]?.visible !== false}
                  onChange={(e) => updateContent(activeElement.sectionKey, 'visible', e.target.checked)}
                /> Show section on live site
              </label>
            </div>
          ) : activeElement.type === 'text_fields' ? (
            <div className="ve-form-group">
              {(activeElement.fields || []).map((f) => {
                if (f.type === 'checkbox') {
                  const checked = textFieldValues[f.field] !== false;
                  return (
                    <div key={f.field} style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'none' }}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => setTextFieldValues((p) => ({ ...p, [f.field]: e.target.checked }))}
                        />
                        {f.label}
                      </label>
                    </div>
                  );
                }
                const val = textFieldValues[f.field] ?? '';
                const long = typeof val === 'string' && val.length > 50;
                return (
                  <div key={f.field} style={{ marginBottom: '14px' }}>
                    <label>{f.label}</label>
                    {f.type === 'select' ? (
                      <select
                        className="ve-input"
                        value={val}
                        onChange={(e) => setTextFieldValues((p) => ({ ...p, [f.field]: e.target.value }))}
                      >
                        {(f.options || []).map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : long ? (
                      <textarea
                        className="ve-input"
                        rows={3}
                        value={val}
                        onChange={(e) => setTextFieldValues((p) => ({ ...p, [f.field]: e.target.value }))}
                      />
                    ) : (
                      <input
                        type="text"
                        className="ve-input"
                        value={val}
                        onChange={(e) => setTextFieldValues((p) => ({ ...p, [f.field]: e.target.value }))}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : activeElement.type === 'cards_manager' ? (
            <div className="ve-form-group">
              <label>Manage {activeElement.label}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                {(draftContent[activeElement.sectionKey]?.[activeElement.field] || []).map((card, idx) => (
                  <div key={card.id || idx} style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {cardTitle(card, idx, activeElement.cardsSchema?.itemTitleFields, activeElement.cardsSchema?.itemLabel)}
                      </strong>
                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        <button
                          className="ve-btn-sm"
                          onClick={() => setActiveElement({
                            sectionKey: activeElement.sectionKey,
                            field: `${activeElement.field}.${idx}`,
                            type: 'card_editor',
                            label: cardTitle(card, idx, activeElement.cardsSchema?.itemTitleFields, activeElement.cardsSchema?.itemLabel),
                            cardsSchema: activeElement.cardsSchema,
                          })}
                        >
                          Edit
                        </button>
                        <button
                          className="ve-btn-sm ve-btn-cancel"
                          onClick={() => {
                            if (window.confirm('Delete this item?')) {
                              deleteArrayItem(activeElement.sectionKey, activeElement.field, idx);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {(draftContent[activeElement.sectionKey]?.[activeElement.field] || []).length === 0 && (
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Nothing here yet - use "Add {activeElement.cardsSchema?.itemLabel || 'Item'}" in Quick Actions.</p>
                )}
              </div>
            </div>
          ) : activeElement.type === 'card_editor' ? (
            <div className="ve-form-group">
              {(activeElement.cardsSchema?.itemFields || []).map((f) => {
                const obj = (localValue && typeof localValue === 'object') ? localValue : {};
                const val = obj[f.field] ?? '';

                if (f.type === 'checkbox') {
                  const checked = obj[f.field] !== false;
                  return (
                    <div key={f.field} style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'none' }}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => setLocalValue((p) => ({ ...(typeof p === 'object' ? p : {}), [f.field]: e.target.checked }))}
                        />
                        {f.label}
                      </label>
                    </div>
                  );
                }

                return (
                  <div key={f.field} style={{ marginBottom: '14px' }}>
                    {f.type === 'image' ? (
                      <ImageField
                        id={`card-field-${f.field}`}
                        label={f.label}
                        value={val}
                        onChange={(v) => setLocalValue((p) => ({ ...(typeof p === 'object' ? p : {}), [f.field]: v }))}
                      />
                    ) : (
                      <>
                        <label>{f.label}</label>
                        {f.type === 'textarea' ? (
                          <textarea
                            className="ve-input"
                            rows={3}
                            value={val}
                            onChange={(e) => setLocalValue((p) => ({ ...(typeof p === 'object' ? p : {}), [f.field]: e.target.value }))}
                          />
                        ) : f.type === 'select' ? (
                          <select
                            className="ve-input"
                            value={val}
                            onChange={(e) => setLocalValue((p) => ({ ...(typeof p === 'object' ? p : {}), [f.field]: e.target.value }))}
                          >
                            {(f.options || []).map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : f.type === 'number' ? (
                          <input
                            type="number"
                            className="ve-input"
                            value={val}
                            onChange={(e) => setLocalValue((p) => ({ ...(typeof p === 'object' ? p : {}), [f.field]: e.target.value === '' ? '' : Number(e.target.value) }))}
                          />
                        ) : (
                          <input
                            type="text"
                            className="ve-input"
                            value={val}
                            onChange={(e) => setLocalValue((p) => ({ ...(typeof p === 'object' ? p : {}), [f.field]: e.target.value }))}
                          />
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="ve-form-group">
              <label>{activeElement.label}</label>
              {isTextarea ? (
                <textarea
                  className="ve-input"
                  rows={4}
                  value={localValue}
                  onChange={(e) => setLocalValue(e.target.value)}
                />
              ) : activeElement.type === 'video' ? (
                <VideoField
                  id="inline-video"
                  value={localValue}
                  onChange={(val) => setLocalValue(val)}
                />
              ) : activeElement.type === 'image' ? (
                <ImageField
                  id="inline-image"
                  value={localValue}
                  onChange={(val) => setLocalValue(val)}
                />
              ) : (
                <input
                  type="text"
                  className="ve-input"
                  value={localValue}
                  onChange={(e) => setLocalValue(e.target.value)}
                />
              )}

              {(activeElement.type === 'video' || activeElement.type === 'image') && (
                <div style={{ marginTop: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                  {localValue ? (
                    <>Current {activeElement.type}: set.{defaultVal ? ' Deleting it will fall back to the default shown below.' : ''}</>
                  ) : (
                    <>No {activeElement.type} set{defaultVal ? ' - the default below is currently shown on the live site.' : '.'}</>
                  )}
                  {defaultVal && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ marginBottom: '4px' }}>Default / Recommended:</div>
                      {activeElement.type === 'video' ? (
                        <video src={defaultVal} muted controls style={{ maxWidth: '100%', maxHeight: '120px', borderRadius: '4px' }} />
                      ) : (
                        <img src={defaultVal} alt="Default" style={{ maxWidth: '100%', maxHeight: '120px', borderRadius: '4px' }} />
                      )}
                      <div>
                        <button
                          type="button"
                          className="ve-btn-sm"
                          style={{ marginTop: '6px' }}
                          onClick={() => setLocalValue(defaultVal)}
                        >
                          Use Default
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeElement.type === 'video' && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                    Video Settings
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', textTransform: 'none' }}>
                    <input
                      type="checkbox"
                      checked={draftContent[activeElement.sectionKey]?.videoAutoplay !== false}
                      onChange={(e) => updateContent(activeElement.sectionKey, 'videoAutoplay', e.target.checked)}
                    /> Autoplay
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', textTransform: 'none' }}>
                    <input
                      type="checkbox"
                      checked={draftContent[activeElement.sectionKey]?.videoLoop !== false}
                      onChange={(e) => updateContent(activeElement.sectionKey, 'videoLoop', e.target.checked)}
                    /> Loop
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', textTransform: 'none' }}>
                    <input
                      type="checkbox"
                      checked={draftContent[activeElement.sectionKey]?.videoMuted !== false}
                      onChange={(e) => updateContent(activeElement.sectionKey, 'videoMuted', e.target.checked)}
                    /> Muted
                  </label>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="ve-modal-footer">
          <button className="ve-btn" onClick={() => setActiveElement(null)}>Cancel</button>
          <button className="ve-btn ve-btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
