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


# ---------- siteContent.js : promote About Hero to its own top-level key,
# same convention as every Home Page section (hero, giftingBand, ...) -
# remove it from the nested aboutPage object it used to share with the
# other (not-yet-migrated) About sections, and add the new flat key with
# the extra show/hide + icon fields the new CMS wiring needs. ----
apply(f"{ROOT}/src/data/siteContent.js", [
(
"""  aboutPage: {
    hero: {
      visible: true, order: 1,
      breadcrumbHome: 'Home', breadcrumbCurrent: 'About Us',
      titleLine1: 'About', titleLine2: 'IGO Nursery',
      subtitle: "More Than Just Plants — We're a Part of Your Green Journey.",
      description: "At IGO Nursery, we believe in the power of plants to bring beauty, wellness and connection. We're passionate about helping you create greener spaces — at home, at work and in the community.",
      buttonText: 'Explore Our Plants', buttonUrl: '/category/indoor-plants',
      image: '/images/about-us/01_hero_nursery_greenhouse.jpg', imageAlt: 'Lush greenhouse full of nursery plants - Green Spaces, Happier Lives',
    },
    story: {""",
"""  // About - Hero lives on its own now (see aboutHero below), promoted to
  // a flat top-level key so it can be independently reset/deleted/settings-
  // managed by the Visual Editor, exactly like every Home Page section.
  aboutPage: {
    story: {"""
),
])

apply(f"{ROOT}/src/data/siteContent.js", [
(
"""  // The /about page's 9 sections, each independently visible/reorderable.
  // `order` controls render order on the page; sections aren't tied to a
  // fixed list of "types" - these are the real sections that exist today.""",
"""  // About - Hero - flat top-level key (Visual Editor convention: one real
  // siteContent key per independently manageable section).
  aboutHero: {
    visible: true,
    order: 1,
    backgroundColor: '',
    backgroundImage: '',
    paddingY: '',
    breadcrumbHomeText: 'Home',
    breadcrumbHomeUrl: '/',
    breadcrumbHomeVisible: true,
    breadcrumbCurrentText: 'About Us',
    breadcrumbCurrentUrl: '',
    breadcrumbCurrentVisible: true,
    headingVisible: true,
    heading: 'About\\nIGO Nursery',
    subtitleVisible: true,
    subtitle: "More Than Just Plants — We're a Part of Your Green Journey.",
    descriptionVisible: true,
    description: "At IGO Nursery, we believe in the power of plants to bring beauty, wellness and connection. We're passionate about helping you create greener spaces — at home, at work and in the community.",
    decorativeIconVisible: true,
    decorativeIcon: 'Leaf',
    buttonVisible: true,
    buttonText: 'Explore Our Plants',
    buttonUrl: '/category/indoor-plants',
    buttonIcon: 'Arrow',
    image: '/images/about-us/01_hero_nursery_greenhouse.jpg',
    imageAlt: 'Lush greenhouse full of nursery plants - Green Spaces, Happier Lives',
  },
  // The /about page's remaining 8 sections (Hero moved out, above), each
  // independently visible/reorderable. `order` controls render order on
  // the page; sections aren't tied to a fixed list of "types" - these are
  // the real sections that exist today."""
),
])

# ---------- sectionSchemas.js : new ABOUT_ICON_OPTIONS + aboutHero schema ----------
apply(f"{ROOT}/src/admin/editor/sectionSchemas.js", [
(
"""export const CAT_ICON_FIELD_OPTIONS = [
  'pottedPlant', 'tree', 'flower', 'fruit', 'vegetable', 'seed', 'pot',
  'wateringCan', 'landscape', 'decor', 'box', 'gift', 'care', 'tools',
  'support', 'stones', 'bulb',
];""",
"""export const CAT_ICON_FIELD_OPTIONS = [
  'pottedPlant', 'tree', 'flower', 'fruit', 'vegetable', 'seed', 'pot',
  'wateringCan', 'landscape', 'decor', 'box', 'gift', 'care', 'tools',
  'support', 'stones', 'bulb',
];

// Matches the keys of the `Icon` object defined in src/pages/About.jsx -
// kept as plain strings here (same reasoning as CAT_ICON_FIELD_OPTIONS
// above) so this schema module never has to import a page component.
export const ABOUT_ICON_OPTIONS = [
  'Leaf', 'Pot', 'Sprout', 'Users', 'Eye', 'Target', 'Watering',
  'Landscape', 'Gift', 'Diamond', 'Recycle', 'Shield', 'Person', 'Truck', 'Arrow',
];"""
),
(
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
  },
};""",
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
  },
  aboutHero: {
    images: [{ field: 'image', label: 'Hero Image' }],
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    fieldGroups: [
      {
        key: 'breadcrumb',
        label: 'Breadcrumb',
        fields: [
          { field: 'breadcrumbHomeText', label: 'Home Text' },
          { field: 'breadcrumbHomeUrl', label: 'Home Link' },
          { field: 'breadcrumbHomeVisible', label: 'Show "Home" crumb', type: 'checkbox' },
          { field: 'breadcrumbCurrentText', label: '"About Us" Text' },
          { field: 'breadcrumbCurrentUrl', label: '"About Us" Link (optional - leave blank for plain text)' },
          { field: 'breadcrumbCurrentVisible', label: 'Show "About Us" crumb', type: 'checkbox' },
        ],
      },
      {
        key: 'heading',
        label: 'Main Heading',
        fields: [
          { field: 'heading', label: 'Heading (start a new line for a line break)' },
          { field: 'headingVisible', label: 'Show heading', type: 'checkbox' },
        ],
      },
      {
        key: 'subtitle',
        label: 'Subheading',
        fields: [
          { field: 'subtitle', label: 'Subheading Text' },
          { field: 'subtitleVisible', label: 'Show subheading', type: 'checkbox' },
        ],
      },
      {
        key: 'description',
        label: 'Description',
        fields: [
          { field: 'description', label: 'Description Text' },
          { field: 'descriptionVisible', label: 'Show description', type: 'checkbox' },
        ],
      },
      {
        key: 'decorativeIcon',
        label: 'Decorative Icon',
        fields: [
          { field: 'decorativeIcon', label: 'Icon', type: 'select', options: ABOUT_ICON_OPTIONS },
          { field: 'decorativeIconVisible', label: 'Show icon', type: 'checkbox' },
        ],
      },
    ],
    button: {
      label: 'Primary Button',
      fields: [
        { field: 'buttonText', label: 'Button Text' },
        { field: 'buttonUrl', label: 'Button URL' },
        { field: 'buttonIcon', label: 'Icon', type: 'select', options: ABOUT_ICON_OPTIONS },
        { field: 'buttonVisible', label: 'Show button on live site', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
};"""
),
])

# ---------- EditableElement.jsx : optional wrapperStyle prop, for a wrap
# around content that is ITSELF absolutely positioned by the design (e.g.
# a small decorative icon placed by percentage top/left over a section)
# rather than sized to fill its parent (that's what `fill` is for) - lets
# the wrapper take over that exact position/size so nothing shifts when
# the hover-edit chrome is added, instead of the wrapper's own default
# inline-block box changing the icon's positioning context. ----
apply(f"{ROOT}/src/admin/editor/EditableElement.jsx", [
(
"""export default function EditableElement({ sectionKey, field, type = 'text', label = 'Content', fields, hideDelete = false, fill = false, children }) {""",
"""export default function EditableElement({ sectionKey, field, type = 'text', label = 'Content', fields, hideDelete = false, fill = false, wrapperStyle, children }) {"""
),
(
"""  return (
    <div
      className={`editable-element-wrap${fill ? ' editable-element-fill' : ''}`}
      onMouseEnter={() => setIsHovered(true)}""",
"""  return (
    <div
      className={`editable-element-wrap${fill ? ' editable-element-fill' : ''}`}
      style={wrapperStyle}
      onMouseEnter={() => setIsHovered(true)}"""
),
])

print("ALL EDITS APPLIED (batch 1 of 2 - data + schema + EditableElement)")
