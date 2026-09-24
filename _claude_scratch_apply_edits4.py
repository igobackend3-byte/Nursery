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


# ---------- Home.jsx : GiftingBand() render-wiring ----------
apply(f"{ROOT}/src/pages/Home.jsx", [
(
"""function GiftingBand() {
  const { t } = useLanguage();
  const [ref, visible] = useScrollReveal(0.15);
  const { giftingBand: gb } = useSiteContent();

  if (gb && gb.visible === false) return null;

  const heading = gb?.heading || t('home.giftingHeading');
  const description = gb?.description || t('home.giftingDesc');
  const highlightEnabled = gb?.highlightEnabled !== false;
  const highlight = gb?.highlight || t('home.giftingHighlight');
  const image = gb?.image || GIFTING_IMAGE;
  const imageAlt = gb?.imageAlt || heading;
  const defaultFeatures = [
    { id: 1, icon: 'gift', text: t('home.giftingPointHampers'), visible: true, order: 1 },
    { id: 2, icon: 'clipboard', text: t('home.giftingPointBulk'), visible: true, order: 2 },
    { id: 3, icon: 'tag', text: t('home.giftingPointCustom'), visible: true, order: 3 },
  ];
  const features = (gb?.features?.length ? gb.features : defaultFeatures)
    .filter((f) => f.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const defaultButtons = [
    { id: 1, icon: 'gift', text: t('home.giftingExploreBtn'), url: '/gifting', target: '_self', style: 'primary', visible: true, order: 1 },
    { id: 2, icon: 'chat', text: t('home.giftingQuoteBtn'), url: '/corporate-gifts', target: '_self', style: 'secondary', visible: true, order: 2 },
  ];
  const buttons = (gb?.buttons?.length ? gb.buttons : defaultButtons)
    .filter((b) => b.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const sectionStyle = gb?.backgroundColor ? { backgroundColor: gb.backgroundColor } : undefined;

  return (
    <section ref={ref} className={`gifting-band reveal-section${visible ? ' is-visible' : ''}`} style={sectionStyle}>
      <div className="gifting-band-copy">
        <h2 style={gb?.headingColor ? { color: gb.headingColor } : undefined}>{heading}</h2>
        <p style={gb?.descriptionColor ? { color: gb.descriptionColor } : undefined}>{description}</p>
        {highlightEnabled && (
          <p className="gifting-band-highlight" style={gb?.highlightColor ? { color: gb.highlightColor } : undefined}>{highlight}</p>
        )}

        <div className="gifting-band-points">
          {features.map((f, i) => (
            <span key={f.id} style={{ display: 'contents' }}>
              {i > 0 && <span className="gifting-band-divider" aria-hidden="true" />}
              <span className="gifting-band-point">
                <span className="gifting-band-point-icon">{GIFTING_ICONS[f.icon] || <GiftIcon />}</span>
                {f.text}
              </span>
            </span>
          ))}
        </div>

        <div className="gifting-band-buttons">
          {buttons.map((b) => {
            const btnStyle = {};
            if (b.bgColor) btnStyle['--gb-btn-bg'] = b.bgColor;
            if (b.textColor) btnStyle['--gb-btn-text'] = b.textColor;
            if (b.borderColor) btnStyle['--gb-btn-border'] = b.borderColor;
            if (b.hoverBgColor) btnStyle['--gb-btn-hover-bg'] = b.hoverBgColor;
            if (b.hoverTextColor) btnStyle['--gb-btn-hover-text'] = b.hoverTextColor;
            return (
              <Link
                key={b.id}
                to={b.url}
                target={b.target === '_blank' ? '_blank' : undefined}
                rel={b.target === '_blank' ? 'noopener noreferrer' : undefined}
                className={b.style === 'secondary' ? 'btn-gift-secondary' : 'btn-gift-primary'}
                style={btnStyle}
              >
                {GIFTING_ICONS[b.icon] || <GiftIcon />} {b.text}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="gifting-band-media">
        {image ? <img src={image} alt={imageAlt} loading="lazy" /> : <span className="gifting-band-media-fallback" aria-hidden="true"><LeafGlyph /></span>}
      </div>
    </section>
  );
}""",
"""function GiftingBand() {
  const { t } = useLanguage();
  const [ref, visible] = useScrollReveal(0.15);
  const { giftingBand: gb } = useSiteContent();
  // Only used so a hidden highlight line stays visible/editable in the
  // admin preview (outside the editor, useVisualEditor() safely returns
  // the isEditorMode: false mock - see VisualEditorContext.jsx).
  const { isEditorMode } = useVisualEditor();

  if (gb && gb.visible === false) return null;

  const heading = gb?.heading || t('home.giftingHeading');
  const description = gb?.description || t('home.giftingDesc');
  const highlightEnabled = gb?.highlightEnabled !== false;
  const highlight = gb?.highlight || t('home.giftingHighlight');
  const image = gb?.image || GIFTING_IMAGE;
  const imageAlt = gb?.imageAlt || heading;
  const defaultFeatures = [
    { id: 1, icon: 'gift', text: t('home.giftingPointHampers'), visible: true, order: 1 },
    { id: 2, icon: 'clipboard', text: t('home.giftingPointBulk'), visible: true, order: 2 },
    { id: 3, icon: 'tag', text: t('home.giftingPointCustom'), visible: true, order: 3 },
  ];
  const features = (gb?.features?.length ? gb.features : defaultFeatures)
    .filter((f) => f.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  // Raw (unfiltered/unsorted) array so hover controls can target the real
  // feature/button by id, same pattern as GardenJournal's rawPosts.
  const rawFeatures = gb?.features?.length ? gb.features : null;
  const defaultButtons = [
    { id: 1, icon: 'gift', text: t('home.giftingExploreBtn'), url: '/gifting', target: '_self', style: 'primary', visible: true, order: 1 },
    { id: 2, icon: 'chat', text: t('home.giftingQuoteBtn'), url: '/corporate-gifts', target: '_self', style: 'secondary', visible: true, order: 2 },
  ];
  const buttons = (gb?.buttons?.length ? gb.buttons : defaultButtons)
    .filter((b) => b.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const rawButtons = gb?.buttons?.length ? gb.buttons : null;

  const sectionStyle = {};
  if (gb?.backgroundColor) sectionStyle.backgroundColor = gb.backgroundColor;
  if (gb?.backgroundImage) {
    sectionStyle.backgroundImage = `url(${gb.backgroundImage})`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
  }

  return (
    <section ref={ref} className={`gifting-band reveal-section${visible ? ' is-visible' : ''}`} style={sectionStyle}>
      <div className="gifting-band-copy">
        <EditableElement sectionKey="giftingBand" field="heading" type="text" label="Heading">
          <h2 style={gb?.headingColor ? { color: gb.headingColor } : undefined}>{heading}</h2>
        </EditableElement>
        <EditableElement sectionKey="giftingBand" field="description" type="text" label="Description">
          <p style={gb?.descriptionColor ? { color: gb.descriptionColor } : undefined}>{description}</p>
        </EditableElement>
        {(highlightEnabled || isEditorMode) && (
          <EditableElement
            sectionKey="giftingBand"
            field="__highlight__"
            type="text_fields"
            label="Highlight Text"
            hideDelete
            fields={[
              { field: 'highlight', label: 'Text' },
              { field: 'highlightEnabled', label: 'Visible on live site', type: 'checkbox' },
            ]}
          >
            <p className="gifting-band-highlight" style={gb?.highlightColor ? { color: gb.highlightColor } : undefined}>{highlight}</p>
          </EditableElement>
        )}

        <div className="gifting-band-points">
          {features.map((f, i) => {
            const rawIndex = rawFeatures ? rawFeatures.findIndex((rf) => rf.id === f.id) : -1;
            const pointEl = (
              <span key={f.id} style={{ display: 'contents' }}>
                {i > 0 && <span className="gifting-band-divider" aria-hidden="true" />}
                <span className="gifting-band-point">
                  <span className="gifting-band-point-icon">{GIFTING_ICONS[f.icon] || <GiftIcon />}</span>
                  {f.text}
                </span>
              </span>
            );
            if (rawIndex === -1) return pointEl;
            return (
              <CardHoverControls key={f.id} sectionKey="giftingBand" arrayField="features" index={rawIndex} itemLabel="Feature">
                {pointEl}
              </CardHoverControls>
            );
          })}
        </div>

        <div className="gifting-band-buttons">
          {buttons.map((b) => {
            const btnStyle = {};
            if (b.bgColor) btnStyle['--gb-btn-bg'] = b.bgColor;
            if (b.textColor) btnStyle['--gb-btn-text'] = b.textColor;
            if (b.borderColor) btnStyle['--gb-btn-border'] = b.borderColor;
            if (b.hoverBgColor) btnStyle['--gb-btn-hover-bg'] = b.hoverBgColor;
            if (b.hoverTextColor) btnStyle['--gb-btn-hover-text'] = b.hoverTextColor;
            const rawIndex = rawButtons ? rawButtons.findIndex((rb) => rb.id === b.id) : -1;
            const btnEl = (
              <Link
                key={b.id}
                to={b.url}
                target={b.target === '_blank' ? '_blank' : undefined}
                rel={b.target === '_blank' ? 'noopener noreferrer' : undefined}
                className={b.style === 'secondary' ? 'btn-gift-secondary' : 'btn-gift-primary'}
                style={btnStyle}
              >
                {GIFTING_ICONS[b.icon] || <GiftIcon />} {b.text}
              </Link>
            );
            if (rawIndex === -1) return btnEl;
            return (
              <CardHoverControls key={b.id} sectionKey="giftingBand" arrayField="buttons" index={rawIndex} itemLabel="Button">
                {btnEl}
              </CardHoverControls>
            );
          })}
        </div>
      </div>

      <div className="gifting-band-media">
        <EditableElement sectionKey="giftingBand" field="image" type="image" label="Main Image" fill>
          {image ? <img src={image} alt={imageAlt} loading="lazy" /> : <span className="gifting-band-media-fallback" aria-hidden="true"><LeafGlyph /></span>}
        </EditableElement>
      </div>
    </section>
  );
}"""
),
])

# ---------- site.css : .gifting-band-media needs to be a positioned
# ancestor so the `fill`-wrapped image (position:absolute;inset:0) lands
# back in the exact same box it occupied before - purely an editor-
# mechanics fix, no visual change (the box already has an explicit height
# and overflow:hidden, same pattern as the existing `.os-media` rule). ----
apply(f"{ROOT}/src/styles/site.css", [
(
""".gifting-band-media {
  border-radius: 20px;
  overflow: hidden;
  height: 420px;
  box-shadow: 0 16px 40px rgba(27, 75, 54, 0.14);
}""",
""".gifting-band-media {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  height: 420px;
  box-shadow: 0 16px 40px rgba(27, 75, 54, 0.14);
}"""
),
])

print("ALL EDITS APPLIED (batch 2 of 2 - Home.jsx GiftingBand wiring + CSS fix)")
