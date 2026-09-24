import io

ROOT = "/sessions/rcw-013juftdpvoovh6j5geqfaq3/mnt/Nursery project/igo-nursery-website/nursery-store"

def apply(path, replacements):
    with io.open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    for old, new in replacements:
        count = content.count(old)
        if count != 1:
            raise SystemExit(f"FAIL: {path}: expected 1 occurrence, found {count}\n---OLD---\n{old[:300]}")
        content = content.replace(old, new, 1)
    with io.open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"OK: {path} ({len(replacements)} edits)")


# ---------- siteContent.js ----------
apply(f"{ROOT}/src/data/siteContent.js", [
(
"""  giftingBand: {
    visible: true,
    heading: 'Thoughtful gifts, beautifully packaged.',
    description: 'From festive surprises to corporate gifting, we make every gesture memorable with curated hampers and personalized touches.',
    highlightEnabled: true,
    highlight: 'Perfect for every occasion.',
    backgroundColor: '',
    headingColor: '',
    descriptionColor: '',
    highlightColor: '',
    image: '/images/gifting-hero.jpg',
    imageAlt: 'Thoughtful gifts, beautifully packaged.',
    displayOrder: 15,
    features: [
      { id: 1, icon: 'gift', text: 'Curated Hampers', visible: true, order: 1 },
      { id: 2, icon: 'clipboard', text: 'Bulk Gifting', visible: true, order: 2 },
      { id: 3, icon: 'tag', text: 'Custom Options', visible: true, order: 3 },
    ],
    buttons: [
      { id: 1, icon: 'gift', text: 'Explore Hampers', url: '/gifting', target: '_self', style: 'primary', bgColor: '', textColor: '', borderColor: '', hoverBgColor: '', hoverTextColor: '', visible: true, order: 1 },
      { id: 2, icon: 'chat', text: 'Request a Quote', url: '/corporate-gifts', target: '_self', style: 'secondary', bgColor: '', textColor: '', borderColor: '', hoverBgColor: '', hoverTextColor: '', visible: true, order: 2 },
    ],
  },""",
"""  giftingBand: {
    visible: true,
    heading: 'Thoughtful gifts, beautifully packaged.',
    description: 'From festive surprises to corporate gifting, we make every gesture memorable with curated hampers and personalized touches.',
    highlightEnabled: true,
    highlight: 'Perfect for every occasion.',
    backgroundColor: '',
    backgroundImage: '',
    headingColor: '',
    descriptionColor: '',
    highlightColor: '',
    image: '/images/gifting-hero.jpg',
    imageAlt: 'Thoughtful gifts, beautifully packaged.',
    displayOrder: 15,
    features: [
      { id: 1, icon: 'gift', text: 'Curated Hampers', link: '', visible: true, order: 1 },
      { id: 2, icon: 'clipboard', text: 'Bulk Gifting', link: '', visible: true, order: 2 },
      { id: 3, icon: 'tag', text: 'Custom Options', link: '', visible: true, order: 3 },
    ],
    buttons: [
      { id: 1, icon: 'gift', text: 'Explore Hampers', url: '/gifting', target: '_self', style: 'primary', bgColor: '', textColor: '', borderColor: '', hoverBgColor: '', hoverTextColor: '', visible: true, order: 1 },
      { id: 2, icon: 'chat', text: 'Request a Quote', url: '/corporate-gifts', target: '_self', style: 'secondary', bgColor: '', textColor: '', borderColor: '', hoverBgColor: '', hoverTextColor: '', visible: true, order: 2 },
    ],
  },"""
),
])

# ---------- sectionSchemas.js ----------
apply(f"{ROOT}/src/admin/editor/sectionSchemas.js", [
(
"""  giftingBand: {
    images: [{ field: 'image', label: 'Main Image' }],
    text: [
      { field: 'heading', label: 'Heading' },
      { field: 'description', label: 'Description' },
      { field: 'highlight', label: 'Highlight Text' },
    ],
    cards: {
      field: 'features',
      label: 'Feature Chips',
      itemLabel: 'Feature',
      itemTitleFields: ['text'],
      itemFields: [
        { field: 'text', label: 'Text', type: 'text' },
      ],
    },""",
"""  giftingBand: {
    images: [{ field: 'image', label: 'Main Image' }],
    // Background image is offered separately as a Solid/Image choice
    // inside Section Settings (same reusable pattern as plantFinder /
    // gardenJournal) - this is the section's own backdrop, distinct from
    // the hero photo above (`images`).
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    text: [
      { field: 'heading', label: 'Heading' },
      { field: 'description', label: 'Description' },
    ],
    // Multiple independently-manageable card arrays on one section (feature
    // chips + CTA buttons) - `cards` stays the primary/first group for
    // backward compatibility, `cardGroups` (see EditableSection.jsx) adds
    // any further ones with their own Manage/Add Quick Actions.
    cards: {
      field: 'features',
      label: 'Feature Chips',
      itemLabel: 'Feature',
      itemTitleFields: ['text'],
      itemFields: [
        { field: 'icon', label: 'Icon', type: 'select', options: ['gift', 'clipboard', 'tag', 'chat'] },
        { field: 'text', label: 'Text', type: 'text' },
        { field: 'link', label: 'Link URL (optional)', type: 'text' },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    cardGroups: [
      {
        field: 'buttons',
        label: 'Buttons',
        itemLabel: 'Button',
        itemTitleFields: ['text'],
        itemFields: [
          { field: 'text', label: 'Button Text', type: 'text' },
          { field: 'url', label: 'Button URL', type: 'text' },
          { field: 'icon', label: 'Icon', type: 'select', options: ['gift', 'clipboard', 'tag', 'chat'] },
          { field: 'style', label: 'Style', type: 'select', options: ['primary', 'secondary'] },
          { field: 'order', label: 'Display Order', type: 'number' },
          { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
        ],
      },
    ],""",
),
])

# ---------- EditableSection.jsx ----------
apply(f"{ROOT}/src/admin/editor/EditableSection.jsx", [
(
"""          {schema.cards && (
            <>
              <button className="quick-action-btn" onClick={() => {
                setActiveElement({ sectionKey, field: schema.cards.field, type: 'cards_manager', label: schema.cards.label, cardsSchema: schema.cards });
              }}>
                <IconGrid />
                Manage {schema.cards.label}
              </button>
              <button className="quick-action-btn" onClick={() => {
                addArrayItem(sectionKey, schema.cards.field, blankItemFromSchema(schema.cards));
              }}>
                <IconPlus />
                Add {schema.cards.itemLabel || 'Item'}
              </button>
            </>
          )}""",
"""          {schema.cards && (
            <>
              <button className="quick-action-btn" onClick={() => {
                setActiveElement({ sectionKey, field: schema.cards.field, type: 'cards_manager', label: schema.cards.label, cardsSchema: schema.cards });
              }}>
                <IconGrid />
                Manage {schema.cards.label}
              </button>
              <button className="quick-action-btn" onClick={() => {
                addArrayItem(sectionKey, schema.cards.field, blankItemFromSchema(schema.cards));
              }}>
                <IconPlus />
                Add {schema.cards.itemLabel || 'Item'}
              </button>
            </>
          )}

          {/* A second (third, ...) independently-manageable repeatable list
              on the same section - e.g. Gifting's CTA buttons alongside its
              feature chips. Each gets its own Manage/Add pair, same as
              schema.cards above, driven purely by schema data. */}
          {(schema.cardGroups || []).map((group) => (
            <React.Fragment key={group.field}>
              <button className="quick-action-btn" onClick={() => {
                setActiveElement({ sectionKey, field: group.field, type: 'cards_manager', label: group.label, cardsSchema: group });
              }}>
                <IconGrid />
                Manage {group.label}
              </button>
              <button className="quick-action-btn" onClick={() => {
                addArrayItem(sectionKey, group.field, blankItemFromSchema(group));
              }}>
                <IconPlus />
                Add {group.itemLabel || 'Item'}
              </button>
            </React.Fragment>
          ))}"""
),
])

# ---------- CardHoverControls.jsx ----------
apply(f"{ROOT}/src/admin/editor/CardHoverControls.jsx", [
(
"""  if (!isEditorMode) return <>{children}</>;

  const cardsSchema = getSectionSchema(sectionKey).cards;""",
"""  if (!isEditorMode) return <>{children}</>;

  // Resolve which repeatable-list schema this card belongs to: the
  // section's primary `cards` array, or (for a section with more than one
  // independently-managed array, e.g. Gifting's features + buttons) the
  // matching entry in `cardGroups`.
  const schema = getSectionSchema(sectionKey);
  const cardsSchema = (schema.cards && schema.cards.field === arrayField)
    ? schema.cards
    : (schema.cardGroups || []).find((g) => g.field === arrayField);"""
),
])

print("ALL EDITS APPLIED (batch 1 of 2)")
