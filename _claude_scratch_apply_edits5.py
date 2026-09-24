import io

ROOT = "/sessions/rcw-013juftdpvoovh6j5geqfaq3/mnt/Nursery project/igo-nursery-website/nursery-store"

def apply(path, replacements):
    with io.open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    for old, new in replacements:
        count = content.count(old)
        if count != 1:
            raise SystemExit(f"FAIL: {path}: expected 1 occurrence, found {count}\n---OLD---\n{old[:400]}")
        content = content.replace(old, new, 1)
    with io.open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"OK: {path} ({len(replacements)} edits)")


# ---------- siteContent.js : newsletter defaults ----------
apply(f"{ROOT}/src/data/siteContent.js", [
(
"""  newsletter: {
    visible: true,
    heading: 'Get growing tips in your inbox.',
    headingColor: '',
    placeholder: 'you@example.com',
    buttonEnabled: true,
    buttonText: 'SUBSCRIBE',
    backgroundColor: '',
    inputBgColor: '',
    inputTextColor: '',
    inputPlaceholderColor: '',
    inputBorderColor: '',
    inputFocusBorderColor: '',
    buttonBgColor: '',
    buttonTextColor: '',
    buttonHoverBgColor: '',
    buttonHoverTextColor: '',
    successMessage: 'Thanks for subscribing!',
    errorMessage: 'Please enter a valid email address.',
    paddingY: '',
    displayOrder: 16,
  },""",
"""  newsletter: {
    visible: true,
    heading: 'Get growing tips in your inbox.',
    headingVisible: true,
    headingColor: '',
    backgroundImage: '',
    placeholder: 'you@example.com',
    inputRequired: true,
    inputVisible: true,
    buttonEnabled: true,
    buttonText: 'SUBSCRIBE',
    buttonAction: 'Newsletter Subscribe',
    buttonIcon: 'none',
    backgroundColor: '',
    inputBgColor: '',
    inputTextColor: '',
    inputPlaceholderColor: '',
    inputBorderColor: '',
    inputFocusBorderColor: '',
    buttonBgColor: '',
    buttonTextColor: '',
    buttonHoverBgColor: '',
    buttonHoverTextColor: '',
    successMessage: 'Thanks for subscribing!',
    errorMessage: 'Please enter a valid email address.',
    paddingY: '',
    displayOrder: 16,
  },"""
),
])

# ---------- sectionSchemas.js : newsletter schema ----------
apply(f"{ROOT}/src/admin/editor/sectionSchemas.js", [
(
"""  newsletter: {
    text: [
      { field: 'heading', label: 'Heading' },
      { field: 'placeholder', label: 'Input Placeholder' },
      { field: 'buttonText', label: 'Button Text' },
      { field: 'successMessage', label: 'Success Message' },
      { field: 'errorMessage', label: 'Error Message' },
    ],
    settings: true,
    reset: true,
  },""",
"""  newsletter: {
    // Section backdrop, same reusable Solid/Image toggle as plantFinder,
    // gardenJournal and giftingBand.
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    text: [
      { field: 'successMessage', label: 'Success Message' },
      { field: 'errorMessage', label: 'Error Message' },
    ],
    // Named groups of scalar fields beyond the single primary `button` -
    // same "second (third, ...) independently-managed group" idea as
    // giftingBand's `cardGroups`, but for plain field groups rather than
    // repeatable arrays. Each renders its own "Edit <label>" Quick Action
    // and opens the same text_fields modal used by `button`.
    fieldGroups: [
      {
        key: 'heading',
        label: 'Heading',
        fields: [
          { field: 'heading', label: 'Heading Text' },
          { field: 'headingVisible', label: 'Show on live site', type: 'checkbox' },
        ],
      },
      {
        key: 'input',
        label: 'Email Input',
        fields: [
          { field: 'placeholder', label: 'Placeholder Text' },
          { field: 'inputRequired', label: 'Required', type: 'checkbox' },
          { field: 'inputVisible', label: 'Show input on live site', type: 'checkbox' },
        ],
      },
    ],
    button: {
      label: 'Subscribe Button',
      fields: [
        { field: 'buttonText', label: 'Button Text' },
        { field: 'buttonAction', label: 'Action Label (informational - the form always submits the subscribe request)' },
        { field: 'buttonIcon', label: 'Icon', type: 'select', options: ['none', 'gift', 'clipboard', 'tag', 'chat'] },
        { field: 'buttonEnabled', label: 'Show button on live site', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },"""
),
])

# ---------- EditableSection.jsx : fieldGroups Quick Actions ----------
apply(f"{ROOT}/src/admin/editor/EditableSection.jsx", [
(
"""          {schema.button && (
            <button className="quick-action-btn" onClick={() => {
              setActiveElement({ sectionKey, field: '__button__', type: 'text_fields', label: schema.button.label || 'Button', fields: schema.button.fields });
            }}>
              <IconEdit />
              Edit {schema.button.label || 'Button'}
            </button>
          )}""",
"""          {schema.button && (
            <button className="quick-action-btn" onClick={() => {
              setActiveElement({ sectionKey, field: '__button__', type: 'text_fields', label: schema.button.label || 'Button', fields: schema.button.fields });
            }}>
              <IconEdit />
              Edit {schema.button.label || 'Button'}
            </button>
          )}

          {/* Named groups of plain scalar fields beyond the single primary
              `button` (e.g. Newsletter's Heading / Email Input) - each gets
              its own "Edit <label>" action, same text_fields modal as
              `button` above, driven purely by schema data. */}
          {(schema.fieldGroups || []).map((group) => (
            <button key={group.key} className="quick-action-btn" onClick={() => {
              setActiveElement({ sectionKey, field: `__${group.key}__`, type: 'text_fields', label: group.label, fields: group.fields });
            }}>
              <IconEdit />
              Edit {group.label}
            </button>
          ))}"""
),
])

# ---------- InlineEditorModal.jsx : 'select' support in text_fields ----------
apply(f"{ROOT}/src/admin/editor/InlineEditorModal.jsx", [
(
"""                const val = textFieldValues[f.field] ?? '';
                const long = typeof val === 'string' && val.length > 50;
                return (
                  <div key={f.field} style={{ marginBottom: '14px' }}>
                    <label>{f.label}</label>
                    {long ? (
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
                );""",
"""                const val = textFieldValues[f.field] ?? '';
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
                );"""
),
])

# ---------- Home.jsx : Newsletter() render-wiring ----------
apply(f"{ROOT}/src/pages/Home.jsx", [
(
"""function Newsletter() {
  const { t } = useLanguage();
  const [ref, visible] = useScrollReveal(0.2);
  const { newsletter: nl } = useSiteContent();
  const [status, setStatus] = useState(null);

  if (nl && nl.visible === false) return null;

  const heading = nl?.heading || t('home.newsletterHeading');
  const placeholder = nl?.placeholder || t('home.newsletterPlaceholder');
  const buttonEnabled = nl?.buttonEnabled !== false;
  const buttonText = nl?.buttonText || t('home.subscribe');
  const successMessage = nl?.successMessage || 'Thanks for subscribing!';
  const errorMessage = nl?.errorMessage || 'Please enter a valid email address.';

  const sectionStyle = {};
  if (nl?.backgroundColor) sectionStyle.backgroundColor = nl.backgroundColor;
  if (nl?.paddingY) sectionStyle.paddingTop = sectionStyle.paddingBottom = nl.paddingY;
  if (nl?.inputBgColor) sectionStyle['--nl-input-bg'] = nl.inputBgColor;
  if (nl?.inputTextColor) sectionStyle['--nl-input-text'] = nl.inputTextColor;
  if (nl?.inputPlaceholderColor) sectionStyle['--nl-input-placeholder'] = nl.inputPlaceholderColor;
  if (nl?.inputBorderColor) sectionStyle['--nl-input-border'] = nl.inputBorderColor;
  if (nl?.inputFocusBorderColor) sectionStyle['--nl-input-focus-border'] = nl.inputFocusBorderColor;
  if (nl?.buttonBgColor) sectionStyle['--nl-btn-bg'] = nl.buttonBgColor;
  if (nl?.buttonTextColor) sectionStyle['--nl-btn-text'] = nl.buttonTextColor;
  if (nl?.buttonHoverBgColor) sectionStyle['--nl-btn-hover-bg'] = nl.buttonHoverBgColor;
  if (nl?.buttonHoverTextColor) sectionStyle['--nl-btn-hover-text'] = nl.buttonHoverTextColor;

  function handleSubmit(e) {
    e.preventDefault();
    const email = e.target.elements.email.value.trim();
    const isValid = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
    setStatus(isValid ? 'success' : 'error');
    if (isValid) e.target.reset();
  }

  return (
    <section ref={ref} className={`newsletter-section reveal-section${visible ? ' is-visible' : ''}`} style={sectionStyle}>
      <h2 style={nl?.headingColor ? { color: nl.headingColor } : undefined}>{heading}</h2>
      <form onSubmit={handleSubmit} className="newsletter-form">
        <input name="email" type="email" placeholder={placeholder} required />
        {buttonEnabled && <button type="submit">{buttonText}</button>}
      </form>
      {status && (
        <p className={`newsletter-message newsletter-message-${status}`}>
          {status === 'success' ? successMessage : errorMessage}
        </p>
      )}
    </section>
  );
}""",
"""function Newsletter() {
  const { t } = useLanguage();
  const [ref, visible] = useScrollReveal(0.2);
  const { newsletter: nl } = useSiteContent();
  const [status, setStatus] = useState(null);
  // Only used so a hidden heading/input/button stays visible/editable in
  // the admin preview (outside the editor, useVisualEditor() safely
  // returns the isEditorMode: false mock - see VisualEditorContext.jsx).
  const { isEditorMode } = useVisualEditor();

  if (nl && nl.visible === false) return null;

  const heading = nl?.heading || t('home.newsletterHeading');
  const headingVisible = nl?.headingVisible !== false;
  const placeholder = nl?.placeholder || t('home.newsletterPlaceholder');
  const inputRequired = nl?.inputRequired !== false;
  const inputVisible = nl?.inputVisible !== false;
  const buttonEnabled = nl?.buttonEnabled !== false;
  const buttonText = nl?.buttonText || t('home.subscribe');
  const buttonIcon = nl?.buttonIcon && nl.buttonIcon !== 'none' ? GIFTING_ICONS[nl.buttonIcon] : null;
  const successMessage = nl?.successMessage || 'Thanks for subscribing!';
  const errorMessage = nl?.errorMessage || 'Please enter a valid email address.';

  const sectionStyle = {};
  if (nl?.backgroundColor) sectionStyle.backgroundColor = nl.backgroundColor;
  if (nl?.backgroundImage) {
    sectionStyle.backgroundImage = `url(${nl.backgroundImage})`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
  }
  if (nl?.paddingY) sectionStyle.paddingTop = sectionStyle.paddingBottom = nl.paddingY;
  if (nl?.inputBgColor) sectionStyle['--nl-input-bg'] = nl.inputBgColor;
  if (nl?.inputTextColor) sectionStyle['--nl-input-text'] = nl.inputTextColor;
  if (nl?.inputPlaceholderColor) sectionStyle['--nl-input-placeholder'] = nl.inputPlaceholderColor;
  if (nl?.inputBorderColor) sectionStyle['--nl-input-border'] = nl.inputBorderColor;
  if (nl?.inputFocusBorderColor) sectionStyle['--nl-input-focus-border'] = nl.inputFocusBorderColor;
  if (nl?.buttonBgColor) sectionStyle['--nl-btn-bg'] = nl.buttonBgColor;
  if (nl?.buttonTextColor) sectionStyle['--nl-btn-text'] = nl.buttonTextColor;
  if (nl?.buttonHoverBgColor) sectionStyle['--nl-btn-hover-bg'] = nl.buttonHoverBgColor;
  if (nl?.buttonHoverTextColor) sectionStyle['--nl-btn-hover-text'] = nl.buttonHoverTextColor;

  function handleSubmit(e) {
    e.preventDefault();
    const emailEl = e.target.elements.email;
    const email = emailEl ? emailEl.value.trim() : '';
    const isValid = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
    setStatus(isValid ? 'success' : 'error');
    if (isValid) e.target.reset();
  }

  const headingFields = getSectionSchema('newsletter').fieldGroups?.find((g) => g.key === 'heading')?.fields;
  const inputFields = getSectionSchema('newsletter').fieldGroups?.find((g) => g.key === 'input')?.fields;
  const buttonFields = getSectionSchema('newsletter').button?.fields;

  return (
    <section ref={ref} className={`newsletter-section reveal-section${visible ? ' is-visible' : ''}`} style={sectionStyle}>
      {(headingVisible || isEditorMode) && (
        <EditableElement sectionKey="newsletter" field="__heading__" type="text_fields" label="Heading" hideDelete fields={headingFields}>
          <h2 style={nl?.headingColor ? { color: nl.headingColor } : undefined}>{heading}</h2>
        </EditableElement>
      )}
      <form onSubmit={handleSubmit} className="newsletter-form">
        {(inputVisible || isEditorMode) && (
          <EditableElement sectionKey="newsletter" field="__input__" type="text_fields" label="Email Input" hideDelete fields={inputFields}>
            <input name="email" type="email" placeholder={placeholder} required={inputRequired} />
          </EditableElement>
        )}
        {(buttonEnabled || isEditorMode) && (
          <EditableElement sectionKey="newsletter" field="__button__" type="text_fields" label="Subscribe Button" hideDelete fields={buttonFields}>
            <button type="submit">{buttonIcon}{buttonIcon ? ' ' : ''}{buttonText}</button>
          </EditableElement>
        )}
      </form>
      {status && (
        <p className={`newsletter-message newsletter-message-${status}`}>
          {status === 'success' ? successMessage : errorMessage}
        </p>
      )}
    </section>
  );
}"""
),
])

# ---------- site.css : button icon layout (no-op visually when no icon is
# set - default state stays a single centered text label, same box model
# as before) + position:relative parity note not needed here since the
# newsletter background image is applied as a plain CSS background on the
# section itself (same pattern as gardenJournal/giftingBand), not via an
# <img> that needs `fill`. ----
apply(f"{ROOT}/src/styles/site.css", [
(
""".newsletter-form button {
  background: var(--nl-btn-bg, var(--color-primary-lime));
  color: var(--nl-btn-text, #1a1a1a);
  font-weight: 700;
  padding: 14px 22px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}""",
""".newsletter-form button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--nl-btn-bg, var(--color-primary-lime));
  color: var(--nl-btn-text, #1a1a1a);
  font-weight: 700;
  padding: 14px 22px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}"""
),
])

print("ALL EDITS APPLIED (Newsletter section)")
