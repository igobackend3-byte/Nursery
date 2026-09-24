import io

ROOT = "/sessions/rcw-013juftdpvoovh6j5geqfaq3/mnt/Nursery project/igo-nursery-website/nursery-store"

def apply(path, replacements):
    with io.open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    for old, new in replacements:
        count = content.count(old)
        if count != 1:
            raise SystemExit(f"FAIL: {path}: expected 1 occurrence, found {count}\n---OLD---\n{old[:200]}")
        content = content.replace(old, new, 1)
    with io.open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"OK: {path} ({len(replacements)} edits)")


# ---------- sectionSchemas.js ----------
apply(f"{ROOT}/src/admin/editor/sectionSchemas.js", [
(
"""  faq: {
    text: [
      { field: 'eyebrow', label: 'Eyebrow' },
      { field: 'heading', label: 'Heading' },
    ],
    cards: {
      field: 'items',
      label: 'Questions',
      itemLabel: 'Question',
      itemTitleFields: ['question'],
      itemFields: [
        { field: 'question', label: 'Question', type: 'text' },
        { field: 'answer', label: 'Answer', type: 'textarea' },
      ],
    },
    settings: true,
    reset: true,
  },""",
"""  faq: {
    text: [
      { field: 'eyebrow', label: 'Section Label' },
      { field: 'heading', label: 'Heading' },
    ],
    cards: {
      field: 'items',
      label: 'FAQs',
      itemLabel: 'FAQ',
      itemTitleFields: ['question'],
      itemFields: [
        { field: 'question', label: 'Question', type: 'text' },
        { field: 'answer', label: 'Answer', type: 'textarea' },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },"""
),
(
"""  plantFinder: {
    images: [{ field: 'backgroundImage', label: 'Background Image' }],
    text: [
      { field: 'eyebrow', label: 'Eyebrow' },
      { field: 'heading', label: 'Heading' },
      { field: 'description', label: 'Description' },
      { field: 'buttonText', label: 'Button Text' },
      { field: 'buttonUrl', label: 'Button Link' },
    ],
    settings: true,
    reset: true,
  },""",
"""  plantFinder: {
    // No standalone "Replace Background Image" quick action - this section
    // uses a solid color by default. Background image is offered as a
    // Solid/Image choice inside Section Settings instead (see
    // `backgroundImage` below, read by EditableSection/InlineEditorModal).
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    text: [
      { field: 'eyebrow', label: 'Section Label' },
      { field: 'heading', label: 'Heading' },
      { field: 'description', label: 'Description' },
    ],
    // Rendered as its own "Edit Button" Quick Action (see EditableSection.jsx)
    // rather than folded into schema.text, since the CTA has its own
    // link/new-tab/visibility fields distinct from plain section copy.
    button: {
      label: 'Button',
      fields: [
        { field: 'buttonText', label: 'Button Text' },
        { field: 'buttonUrl', label: 'Button Link' },
        { field: 'buttonNewTab', label: 'Open link in a new tab', type: 'checkbox' },
        { field: 'buttonEnabled', label: 'Show button on live site', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },"""
),
])

# ---------- Home.jsx ----------
apply(f"{ROOT}/src/pages/Home.jsx", [
(
"import { useEffect, useMemo, useRef, useState } from 'react';",
"import { Fragment, useEffect, useMemo, useRef, useState } from 'react';"
),
(
"""function Faq() {
  const { t } = useLanguage();
  const { faq } = useSiteContent();
  const defaultItems = useMemo(() => FAQS.map((f, i) => ({
    id: i, question: t(`faq.q${f.key}`), answer: t(`faq.a${f.key}`), visible: true, defaultOpen: i === 0, order: i,
  })), [t]);
  const items = (faq?.items?.length ? faq.items : defaultItems)
    .filter((f) => f.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const initialOpen = items.findIndex((f) => f.defaultOpen);
  const [open, setOpen] = useState(initialOpen);
  const [ref, visible] = useScrollReveal(0.15);

  if (faq && faq.visible === false) return null;
  if (items.length === 0) return null;

  const eyebrow = faq?.eyebrow || t('home.supportEyebrow');
  const heading = faq?.heading || t('home.faqHeading');
  const openIcon = faq?.openIcon || '−';
  const closedIcon = faq?.closedIcon || '+';

  const sectionStyle = {};
  if (faq?.backgroundColor) sectionStyle.backgroundColor = faq.backgroundColor;
  if (faq?.dividerColor) sectionStyle['--faq-divider'] = faq.dividerColor;
  if (faq?.iconColor) sectionStyle['--faq-icon'] = faq.iconColor;
  if (faq?.questionColor) sectionStyle['--faq-question'] = faq.questionColor;
  if (faq?.answerColor) sectionStyle['--faq-answer'] = faq.answerColor;

  return (
    <section ref={ref} className={`faq-section reveal-section${visible ? ' is-visible' : ''}`} id="faq" style={sectionStyle}>
      <div className="section-heading center">
        <p className="eyebrow" style={faq?.eyebrowColor ? { color: faq.eyebrowColor } : undefined}>{eyebrow}</p>
        <h2 style={faq?.headingColor ? { color: faq.headingColor } : undefined}>{heading}</h2>
      </div>
      <div className="faq-list">
        {items.map((item, idx) => (
          <div className={`faq-item ${open === idx ? 'open' : ''}`} key={item.id}>
            <button type="button" onClick={() => setOpen(open === idx ? -1 : idx)}>
              <span>{item.question}</span>
              <span className="faq-toggle">{open === idx ? openIcon : closedIcon}</span>
            </button>
            {open === idx && <p>{item.answer}</p>}
          </div>
        ))}
      </div>
    </section>
  );""",
"""function Faq() {
  const { t } = useLanguage();
  const { faq } = useSiteContent();
  const defaultItems = useMemo(() => FAQS.map((f, i) => ({
    id: i, question: t(`faq.q${f.key}`), answer: t(`faq.a${f.key}`), visible: true, defaultOpen: i === 0, order: i,
  })), [t]);
  const items = (faq?.items?.length ? faq.items : defaultItems)
    .filter((f) => f.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  // Raw (unfiltered/unsorted) array from siteContent so hover controls can
  // target the real item by id, same pattern as ComparisonSection/TrustBenefits.
  const rawItems = faq?.items?.length ? faq.items : null;
  const initialOpen = items.findIndex((f) => f.defaultOpen);
  const [open, setOpen] = useState(initialOpen);
  const [ref, visible] = useScrollReveal(0.15);

  if (faq && faq.visible === false) return null;
  if (items.length === 0) return null;

  const eyebrow = faq?.eyebrow || t('home.supportEyebrow');
  const heading = faq?.heading || t('home.faqHeading');
  const openIcon = faq?.openIcon || '−';
  const closedIcon = faq?.closedIcon || '+';

  const sectionStyle = {};
  if (faq?.backgroundColor) sectionStyle.backgroundColor = faq.backgroundColor;
  if (faq?.dividerColor) sectionStyle['--faq-divider'] = faq.dividerColor;
  if (faq?.iconColor) sectionStyle['--faq-icon'] = faq.iconColor;
  if (faq?.questionColor) sectionStyle['--faq-question'] = faq.questionColor;
  if (faq?.answerColor) sectionStyle['--faq-answer'] = faq.answerColor;

  return (
    <section ref={ref} className={`faq-section reveal-section${visible ? ' is-visible' : ''}`} id="faq" style={sectionStyle}>
      <div className="section-heading center">
        <EditableElement sectionKey="faq" field="eyebrow" type="text" label="Section Label">
          <p className="eyebrow" style={faq?.eyebrowColor ? { color: faq.eyebrowColor } : undefined}>{eyebrow}</p>
        </EditableElement>
        <EditableElement sectionKey="faq" field="heading" type="text" label="Heading" hideDelete>
          <h2 style={faq?.headingColor ? { color: faq.headingColor } : undefined}>{heading}</h2>
        </EditableElement>
      </div>
      <div className="faq-list">
        {items.map((item, idx) => {
          const rawIndex = rawItems ? rawItems.findIndex((it) => it.id === item.id) : -1;
          const faqEl = (
            <div className={`faq-item ${open === idx ? 'open' : ''}`}>
              <button type="button" onClick={() => setOpen(open === idx ? -1 : idx)}>
                <span>{item.question}</span>
                <span className="faq-toggle">{open === idx ? openIcon : closedIcon}</span>
              </button>
              {open === idx && <p>{item.answer}</p>}
            </div>
          );
          if (rawIndex === -1) {
            return <Fragment key={item.id}>{faqEl}</Fragment>;
          }
          return (
            <CardHoverControls key={item.id} sectionKey="faq" arrayField="items" index={rawIndex} itemLabel="FAQ">
              {faqEl}
            </CardHoverControls>
          );
        })}
      </div>
    </section>
  );"""
),
(
"""function PlantFinderBand() {
  const { t } = useLanguage();
  const [ref, visible] = useScrollReveal(0.2);
  const { plantFinder: pf } = useSiteContent();

  if (pf && pf.visible === false) return null;

  const eyebrow = pf?.eyebrow || t('home.plantFinderEyebrow');
  const heading = pf?.heading || t('home.plantFinderHeading');
  const description = pf?.description || t('home.plantFinderBandDesc');
  const buttonEnabled = pf?.buttonEnabled !== false;
  const buttonText = pf?.buttonText || t('home.findMyPlant');
  const buttonUrl = pf?.buttonUrl || '/plant-finder';

  const sectionStyle = {};
  if (pf?.backgroundColor) sectionStyle.backgroundColor = pf.backgroundColor;
  if (pf?.backgroundImage) {
    sectionStyle.backgroundImage = `url(${pf.backgroundImage})`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
  }
  if (pf?.paddingY) sectionStyle.paddingTop = sectionStyle.paddingBottom = pf.paddingY;
  if (pf?.buttonBgColor) sectionStyle['--pf-btn-bg'] = pf.buttonBgColor;
  if (pf?.buttonTextColor) sectionStyle['--pf-btn-text'] = pf.buttonTextColor;
  if (pf?.buttonHoverBgColor) sectionStyle['--pf-btn-hover-bg'] = pf.buttonHoverBgColor;
  if (pf?.buttonHoverTextColor) sectionStyle['--pf-btn-hover-text'] = pf.buttonHoverTextColor;

  return (
    <section ref={ref} className={`plant-finder-band reveal-section${visible ? ' is-visible' : ''}`} style={sectionStyle}>
      <div>
        <p className="eyebrow light" style={pf?.labelColor ? { color: pf.labelColor } : undefined}>{eyebrow}</p>
        <h2 style={pf?.headingColor ? { color: pf.headingColor } : undefined}>{heading}</h2>
        <p style={pf?.descriptionColor ? { color: pf.descriptionColor } : undefined}>{description}</p>
      </div>
      {buttonEnabled && (
        <Link to={buttonUrl} target={pf?.buttonNewTab ? '_blank' : undefined} rel={pf?.buttonNewTab ? 'noopener noreferrer' : undefined} className="btn-find-plant">
          {buttonText}
        </Link>
      )}
    </section>
  );
}""",
"""function PlantFinderBand() {
  const { t } = useLanguage();
  const [ref, visible] = useScrollReveal(0.2);
  const { plantFinder: pf } = useSiteContent();

  if (pf && pf.visible === false) return null;

  const eyebrow = pf?.eyebrow || t('home.plantFinderEyebrow');
  const heading = pf?.heading || t('home.plantFinderHeading');
  const description = pf?.description || t('home.plantFinderBandDesc');
  const buttonEnabled = pf?.buttonEnabled !== false;
  const buttonText = pf?.buttonText || t('home.findMyPlant');
  const buttonUrl = pf?.buttonUrl || '/plant-finder';

  const sectionStyle = {};
  if (pf?.backgroundColor) sectionStyle.backgroundColor = pf.backgroundColor;
  if (pf?.backgroundImage) {
    sectionStyle.backgroundImage = `url(${pf.backgroundImage})`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
  }
  if (pf?.paddingY) sectionStyle.paddingTop = sectionStyle.paddingBottom = pf.paddingY;
  if (pf?.buttonBgColor) sectionStyle['--pf-btn-bg'] = pf.buttonBgColor;
  if (pf?.buttonTextColor) sectionStyle['--pf-btn-text'] = pf.buttonTextColor;
  if (pf?.buttonHoverBgColor) sectionStyle['--pf-btn-hover-bg'] = pf.buttonHoverBgColor;
  if (pf?.buttonHoverTextColor) sectionStyle['--pf-btn-hover-text'] = pf.buttonHoverTextColor;

  const plantFinderButtonFields = getSectionSchema('plantFinder').button?.fields;

  return (
    <section ref={ref} className={`plant-finder-band reveal-section${visible ? ' is-visible' : ''}`} style={sectionStyle}>
      <div>
        <EditableElement sectionKey="plantFinder" field="eyebrow" type="text" label="Section Label">
          <p className="eyebrow light" style={pf?.labelColor ? { color: pf.labelColor } : undefined}>{eyebrow}</p>
        </EditableElement>
        <EditableElement sectionKey="plantFinder" field="heading" type="text" label="Heading">
          <h2 style={pf?.headingColor ? { color: pf.headingColor } : undefined}>{heading}</h2>
        </EditableElement>
        <EditableElement sectionKey="plantFinder" field="description" type="text" label="Description">
          <p style={pf?.descriptionColor ? { color: pf.descriptionColor } : undefined}>{description}</p>
        </EditableElement>
      </div>
      {buttonEnabled && (
        <EditableElement sectionKey="plantFinder" field="__button__" type="text_fields" label="Button" hideDelete fields={plantFinderButtonFields}>
          <Link to={buttonUrl} target={pf?.buttonNewTab ? '_blank' : undefined} rel={pf?.buttonNewTab ? 'noopener noreferrer' : undefined} className="btn-find-plant">
            {buttonText}
          </Link>
        </EditableElement>
      )}
    </section>
  );
}"""
),
])

# ---------- EditableSection.jsx ----------
apply(f"{ROOT}/src/admin/editor/EditableSection.jsx", [
(
"""          {schema.video && (
            <button className="quick-action-btn" onClick={() => {
              setActiveElement({ sectionKey, field: schema.video.field, type: 'video', label: schema.video.label });
            }}>
              <IconVideo />
              Replace Video
            </button>
          )}""",
"""          {schema.video && (
            <button className="quick-action-btn" onClick={() => {
              setActiveElement({ sectionKey, field: schema.video.field, type: 'video', label: schema.video.label });
            }}>
              <IconVideo />
              Replace Video
            </button>
          )}

          {schema.button && (
            <button className="quick-action-btn" onClick={() => {
              setActiveElement({ sectionKey, field: '__button__', type: 'text_fields', label: schema.button.label || 'Button', fields: schema.button.fields });
            }}>
              <IconEdit />
              Edit {schema.button.label || 'Button'}
            </button>
          )}"""
),
(
"""          {schema.settings && (
            <button className="quick-action-btn" onClick={() => {
              setActiveElement({ sectionKey, field: 'settings', type: 'settings', label: 'Section Settings' });
            }}>
              <IconSettings />
              Section Settings
            </button>
          )}""",
"""          {schema.settings && (
            <button className="quick-action-btn" onClick={() => {
              setActiveElement({
                sectionKey,
                field: 'settings',
                type: 'settings',
                label: 'Section Settings',
                // Lets the generic Settings modal offer a Solid/Image
                // background choice only for sections that actually
                // support a background image (see sectionSchemas.js).
                backgroundImageField: schema.backgroundImage?.field,
              });
            }}>
              <IconSettings />
              Section Settings
            </button>
          )}"""
),
])

# ---------- InlineEditorModal.jsx ----------
apply(f"{ROOT}/src/admin/editor/InlineEditorModal.jsx", [
(
"""  const { isEditorMode, activeElement, setActiveElement, draftContent, updateContent, deleteArrayItem } = useVisualEditor();
  const [localValue, setLocalValue] = useState('');
  const [textFieldValues, setTextFieldValues] = useState({});

  // Sync local value when active element changes
  useEffect(() => {
    if (!activeElement || !draftContent) return;

    if (activeElement.type === 'text_fields') {""",
"""  const { isEditorMode, activeElement, setActiveElement, draftContent, updateContent, deleteArrayItem } = useVisualEditor();
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

    if (activeElement.type === 'text_fields') {"""
),
(
"""          {activeElement.type === 'settings' ? (
            <div className="ve-form-group">
              <label>Background Color</label>
              <input
                type="text"
                className="ve-input"
                value={draftContent[activeElement.sectionKey]?.backgroundColor || ''}
                onChange={(e) => updateContent(activeElement.sectionKey, 'backgroundColor', e.target.value)}
                placeholder="e.g. #ffffff or var(--color-background)"
              />
              <label style={{ marginTop: '12px' }}>Section Spacing (Padding Y)</label>""",
"""          {activeElement.type === 'settings' ? (
            <div className="ve-form-group">
              {activeElement.backgroundImageField ? (
                <>
                  <label>Background Type</label>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'none', color: '#fff' }}>
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
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'none', color: '#fff' }}>
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
              <label style={{ marginTop: '12px' }}>Section Spacing (Padding Y)</label>"""
),
])

print("ALL EDITS APPLIED")
