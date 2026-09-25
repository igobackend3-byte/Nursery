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


# ================================================================
# PART 1 - siteContent.js: promote About "What We Offer" out of the
# shared nested aboutPage object into its own flat top-level
# `aboutOffer` key (same convention as Hero/Story/Stats/VisionMission).
# Content and the `cards` array shape are unchanged.
# ================================================================
apply(f"{ROOT}/src/data/siteContent.js", [
(
"""  aboutVisionMission: {""",
"""  // About - What We Offer - flat top-level key (Visual Editor
  // convention: one real siteContent key per independently manageable
  // section).
  aboutOffer: {
    visible: true,
    order: 5,
    backgroundColor: '',
    backgroundImage: '',
    paddingY: '',
    eyebrow: 'WHAT WE OFFER', heading: 'Everything You Need for a Greener Space',
    subtitle: 'From beautiful plants to essential gardening products, we have everything you need to bring your green vision to life.',
    scriptLine1: 'Grow', scriptLine2: 'Your', scriptLine3: 'Way',
    cards: [
      { id: 1, title: 'Indoor & Outdoor Plants', description: 'Beautiful plants for every space, inside and out.', icon: 'Leaf', image: '/images/about-us/05_indoor_outdoor_plants.jpg', linkUrl: '/category/indoor-plants', visible: true, order: 1 },
      { id: 2, title: 'Pots & Planters', description: 'Stylish and durable pots to complement your plants.', icon: 'Pot', image: '/images/about-us/06_pots_and_planters.jpg', linkUrl: '/category/pots-planters', visible: true, order: 2 },
      { id: 3, title: 'Seeds & Gardening', description: 'High-quality seeds for a bountiful garden.', icon: 'Sprout', image: '/images/about-us/07_seeds_and_gardening.jpg', linkUrl: '/category/seeds', visible: true, order: 3 },
      { id: 4, title: 'Plant Care', description: 'Expert tips and products to keep your plants healthy.', icon: 'Watering', image: '/images/about-us/08_plant_care.jpg', linkUrl: '/category/plant-care', visible: true, order: 4 },
      { id: 5, title: 'Landscaping', description: 'Transform your space with beautiful green designs.', icon: 'Landscape', image: '/images/about-us/09_landscaping.jpg', linkUrl: '/landscaping', visible: true, order: 5 },
      { id: 6, title: 'Corporate Gifting', description: 'Thoughtful green gifts for clients and teams.', icon: 'Gift', image: '/images/about-us/10_corporate_gifting.jpg', linkUrl: '/corporate-gifts', visible: true, order: 6 },
    ],
  },
  aboutVisionMission: {"""
),
])

apply(f"{ROOT}/src/data/siteContent.js", [
(
"""    // About - Vision & Mission lives on its own now (see
    // aboutVisionMission above), promoted to a flat top-level key so it
    // can be independently reset/deleted/settings-managed by the Visual
    // Editor, exactly like Hero/Story/Stats.
    offer: {
      visible: true, order: 5,
      eyebrow: 'WHAT WE OFFER', heading: 'Everything You Need for a Greener Space',
      subtitle: 'From beautiful plants to essential gardening products, we have everything you need to bring your green vision to life.',
      scriptLine1: 'Grow', scriptLine2: 'Your', scriptLine3: 'Way',
      cards: [
        { id: 1, title: 'Indoor & Outdoor Plants', description: 'Beautiful plants for every space, inside and out.', icon: 'Leaf', image: '/images/about-us/05_indoor_outdoor_plants.jpg', linkUrl: '/category/indoor-plants', visible: true, order: 1 },
        { id: 2, title: 'Pots & Planters', description: 'Stylish and durable pots to complement your plants.', icon: 'Pot', image: '/images/about-us/06_pots_and_planters.jpg', linkUrl: '/category/pots-planters', visible: true, order: 2 },
        { id: 3, title: 'Seeds & Gardening', description: 'High-quality seeds for a bountiful garden.', icon: 'Sprout', image: '/images/about-us/07_seeds_and_gardening.jpg', linkUrl: '/category/seeds', visible: true, order: 3 },
        { id: 4, title: 'Plant Care', description: 'Expert tips and products to keep your plants healthy.', icon: 'Watering', image: '/images/about-us/08_plant_care.jpg', linkUrl: '/category/plant-care', visible: true, order: 4 },
        { id: 5, title: 'Landscaping', description: 'Transform your space with beautiful green designs.', icon: 'Landscape', image: '/images/about-us/09_landscaping.jpg', linkUrl: '/landscaping', visible: true, order: 5 },
        { id: 6, title: 'Corporate Gifting', description: 'Thoughtful green gifts for clients and teams.', icon: 'Gift', image: '/images/about-us/10_corporate_gifting.jpg', linkUrl: '/corporate-gifts', visible: true, order: 6 },
      ],
    },
    values: {""",
"""    // About - What We Offer lives on its own now (see aboutOffer above),
    // promoted to a flat top-level key so it can be independently
    // reset/deleted/settings-managed by the Visual Editor, exactly like
    // Hero/Story/Stats/VisionMission.
    values: {"""
),
])

# ================================================================
# PART 2 - sectionSchemas.js: add the aboutOffer schema entry, right
# after aboutVisionMission. `text` drives both the individual hover
# edits on the eyebrow/heading/subtitle and the bulk "Edit Text" Quick
# Action; `fieldGroups` covers the small decorative script text as one
# unit; `cards` is the standard mechanism (same as Stats/VisionMission)
# giving each offer card hover Edit/Duplicate/Delete, a "Manage" list
# modal and a "+ Add Card" Quick Action.
# ================================================================
apply(f"{ROOT}/src/admin/editor/sectionSchemas.js", [
(
"""  aboutVisionMission: {
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    cards: {
      field: 'items',
      label: 'Vision & Mission Cards',
      itemLabel: 'Card',
      itemTitleFields: ['title'],
      itemFields: [
        { field: 'icon', label: 'Icon', type: 'select', options: ABOUT_ICON_OPTIONS },
        { field: 'eyebrow', label: 'Label' },
        { field: 'title', label: 'Title' },
        { field: 'text', label: 'Description', type: 'textarea' },
        { field: 'image', label: 'Background Image', type: 'image' },
        { field: 'imageAlt', label: 'Image Alt Text' },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
};""",
"""  aboutVisionMission: {
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    cards: {
      field: 'items',
      label: 'Vision & Mission Cards',
      itemLabel: 'Card',
      itemTitleFields: ['title'],
      itemFields: [
        { field: 'icon', label: 'Icon', type: 'select', options: ABOUT_ICON_OPTIONS },
        { field: 'eyebrow', label: 'Label' },
        { field: 'title', label: 'Title' },
        { field: 'text', label: 'Description', type: 'textarea' },
        { field: 'image', label: 'Background Image', type: 'image' },
        { field: 'imageAlt', label: 'Image Alt Text' },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
  aboutOffer: {
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    text: [
      { field: 'eyebrow', label: 'Section Label' },
      { field: 'heading', label: 'Heading' },
      { field: 'subtitle', label: 'Subtitle', type: 'textarea' },
    ],
    fieldGroups: [
      {
        key: 'script',
        label: 'Decorative Script Text',
        fields: [
          { field: 'scriptLine1', label: 'Line 1' },
          { field: 'scriptLine2', label: 'Line 2' },
          { field: 'scriptLine3', label: 'Line 3' },
        ],
      },
    ],
    cards: {
      field: 'cards',
      label: 'Offer Cards',
      itemLabel: 'Card',
      itemTitleFields: ['title'],
      itemFields: [
        { field: 'image', label: 'Image', type: 'image' },
        { field: 'title', label: 'Title', type: 'text' },
        { field: 'description', label: 'Description', type: 'textarea' },
        { field: 'icon', label: 'Icon', type: 'select', options: ABOUT_ICON_OPTIONS },
        { field: 'linkUrl', label: 'Link URL', type: 'text' },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
};"""
),
])

# ================================================================
# PART 3 - About.jsx: AboutOffer() - individual hover edits on the
# eyebrow/heading/subtitle and the decorative script text, and each
# offer card wrapped in CardHoverControls (same pattern as Stats/
# VisionMission and Home.jsx's Link-based cards, e.g. shopByCategory)
# for hover Edit/Duplicate/Delete. Layout, classes and styling
# unchanged.
# ================================================================
apply(f"{ROOT}/src/pages/About.jsx", [
(
"""function AboutOffer({ data }) {
  const { t } = useLanguage();
  const o = data || {};
  const defaultCards = [
    { id: 1, title: 'Indoor & Outdoor Plants', description: 'Beautiful plants for every space, inside and out.', icon: 'Leaf', image: PHOTO.offerIndoorOutdoor, linkUrl: '/category/indoor-plants', visible: true, order: 1 },
    { id: 2, title: 'Pots & Planters', description: 'Stylish and durable pots to complement your plants.', icon: 'Pot', image: PHOTO.offerPots, linkUrl: '/category/pots-planters', visible: true, order: 2 },
    { id: 3, title: 'Seeds & Gardening', description: 'High-quality seeds for a bountiful garden.', icon: 'Sprout', image: PHOTO.offerSeeds, linkUrl: '/category/seeds', visible: true, order: 3 },
    { id: 4, title: 'Plant Care', description: 'Expert tips and products to keep your plants healthy.', icon: 'Watering', image: PHOTO.plantCare, linkUrl: '/category/plant-care', visible: true, order: 4 },
    { id: 5, title: 'Landscaping', description: 'Transform your space with beautiful green designs.', icon: 'Landscape', image: PHOTO.landscaping, linkUrl: '/landscaping', visible: true, order: 5 },
    { id: 6, title: 'Corporate Gifting', description: 'Thoughtful green gifts for clients and teams.', icon: 'Gift', image: PHOTO.corporateGifting, linkUrl: '/corporate-gifts', visible: true, order: 6 },
  ];
  const cards = (o.cards?.length ? o.cards : defaultCards)
    .filter((c) => c.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  if (cards.length === 0) return null;

  return (
    <section className="abt-offer">
      <Reveal className="abt-offer-heading">
        <p className="eyebrow">{o.eyebrow || t('aboutPage.offerEyebrow')}</p>
        <h2>{o.heading || t('aboutPage.offerTitle')}</h2>
        <p className="abt-offer-sub">{o.subtitle || t('aboutPage.offerSub')}</p>
      </Reveal>
      <p className="abt-hero-script abt-offer-script">
        {o.scriptLine1 || t('aboutPage.offerScriptLine1')}<br />{o.scriptLine2 || t('aboutPage.offerScriptLine2')}<br />{o.scriptLine3 || t('aboutPage.offerScriptLine3')}
      </p>

      <div className="abt-offer-grid">
        {cards.map((c, i) => {
          const CardIcon = Icon[c.icon] || Icon.Leaf;
          return (
            <Reveal as={Link} to={c.linkUrl || '/'} className="abt-offer-card" key={c.id} delay={i * 60}>
              <div className="abt-offer-card-media">
                <img src={c.image} alt={c.title} loading="lazy" />
              </div>
              <div className="abt-offer-card-body">
                <div className="abt-offer-card-text">
                  <h3><span className="abt-offer-card-icon"><CardIcon /></span>{c.title}</h3>
                  <p>{c.description}</p>
                </div>
                <span className="abt-offer-card-arrow" aria-hidden="true"><Icon.Arrow /></span>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}""",
"""function AboutOffer({ data }) {
  const { t } = useLanguage();
  const o = data || {};
  const defaultCards = [
    { id: 1, title: 'Indoor & Outdoor Plants', description: 'Beautiful plants for every space, inside and out.', icon: 'Leaf', image: PHOTO.offerIndoorOutdoor, linkUrl: '/category/indoor-plants', visible: true, order: 1 },
    { id: 2, title: 'Pots & Planters', description: 'Stylish and durable pots to complement your plants.', icon: 'Pot', image: PHOTO.offerPots, linkUrl: '/category/pots-planters', visible: true, order: 2 },
    { id: 3, title: 'Seeds & Gardening', description: 'High-quality seeds for a bountiful garden.', icon: 'Sprout', image: PHOTO.offerSeeds, linkUrl: '/category/seeds', visible: true, order: 3 },
    { id: 4, title: 'Plant Care', description: 'Expert tips and products to keep your plants healthy.', icon: 'Watering', image: PHOTO.plantCare, linkUrl: '/category/plant-care', visible: true, order: 4 },
    { id: 5, title: 'Landscaping', description: 'Transform your space with beautiful green designs.', icon: 'Landscape', image: PHOTO.landscaping, linkUrl: '/landscaping', visible: true, order: 5 },
    { id: 6, title: 'Corporate Gifting', description: 'Thoughtful green gifts for clients and teams.', icon: 'Gift', image: PHOTO.corporateGifting, linkUrl: '/corporate-gifts', visible: true, order: 6 },
  ];
  const rawCards = o.cards?.length ? o.cards : defaultCards;
  const cards = rawCards
    .filter((c) => c.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  if (cards.length === 0) return null;

  const offerSchema = getSectionSchema('aboutOffer');
  const scriptFields = offerSchema.fieldGroups?.find((g) => g.key === 'script')?.fields;

  const sectionStyle = {};
  if (o.backgroundColor) sectionStyle.backgroundColor = o.backgroundColor;
  if (o.backgroundImage) {
    sectionStyle.backgroundImage = `url(${o.backgroundImage})`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
  }
  if (o.paddingY) sectionStyle.paddingTop = sectionStyle.paddingBottom = o.paddingY;

  return (
    <section className="abt-offer" style={sectionStyle}>
      <Reveal className="abt-offer-heading">
        <EditableElement sectionKey="aboutOffer" field="eyebrow" type="text" label="Section Label">
          <p className="eyebrow">{o.eyebrow || t('aboutPage.offerEyebrow')}</p>
        </EditableElement>
        <EditableElement sectionKey="aboutOffer" field="heading" type="text" label="Heading">
          <h2>{o.heading || t('aboutPage.offerTitle')}</h2>
        </EditableElement>
        <EditableElement sectionKey="aboutOffer" field="subtitle" type="text" label="Subtitle">
          <p className="abt-offer-sub">{o.subtitle || t('aboutPage.offerSub')}</p>
        </EditableElement>
      </Reveal>
      <EditableElement sectionKey="aboutOffer" field="__script__" type="text_fields" label="Decorative Script Text" hideDelete fields={scriptFields}>
        <p className="abt-hero-script abt-offer-script">
          {o.scriptLine1 || t('aboutPage.offerScriptLine1')}<br />{o.scriptLine2 || t('aboutPage.offerScriptLine2')}<br />{o.scriptLine3 || t('aboutPage.offerScriptLine3')}
        </p>
      </EditableElement>

      <div className="abt-offer-grid">
        {cards.map((c, i) => {
          const CardIcon = Icon[c.icon] || Icon.Leaf;
          const itemIndex = rawCards.indexOf(c);
          return (
            <CardHoverControls key={c.id} sectionKey="aboutOffer" arrayField="cards" index={itemIndex} itemLabel="Card">
              <Reveal as={Link} to={c.linkUrl || '/'} className="abt-offer-card" delay={i * 60}>
                <div className="abt-offer-card-media">
                  <img src={c.image} alt={c.title} loading="lazy" />
                </div>
                <div className="abt-offer-card-body">
                  <div className="abt-offer-card-text">
                    <h3><span className="abt-offer-card-icon"><CardIcon /></span>{c.title}</h3>
                    <p>{c.description}</p>
                  </div>
                  <span className="abt-offer-card-arrow" aria-hidden="true"><Icon.Arrow /></span>
                </div>
              </Reveal>
            </CardHoverControls>
          );
        })}
      </div>
    </section>
  );
}"""
),
])

# ================================================================
# PART 4 - About.jsx: About() - special-case 'offer' the same way
# 'hero'/'story'/'stats'/'visionMission' already are, reading from the
# new flat `aboutOffer` siteContent key instead of `ap.offer`.
# ================================================================
apply(f"{ROOT}/src/pages/About.jsx", [
(
"""const ABOUT_FLAT_SECTIONS = {
  hero: 'aboutHero',
  story: 'aboutStory',
  stats: 'aboutStats',
  visionMission: 'aboutVisionMission',
};

function About() {
  const { aboutPage, aboutHero, aboutStory, aboutStats, aboutVisionMission } = useSiteContent();
  const ap = aboutPage || {};
  const flatData = { hero: aboutHero || {}, story: aboutStory || {}, stats: aboutStats || {}, visionMission: aboutVisionMission || {} };""",
"""const ABOUT_FLAT_SECTIONS = {
  hero: 'aboutHero',
  story: 'aboutStory',
  stats: 'aboutStats',
  visionMission: 'aboutVisionMission',
  offer: 'aboutOffer',
};

function About() {
  const { aboutPage, aboutHero, aboutStory, aboutStats, aboutVisionMission, aboutOffer } = useSiteContent();
  const ap = aboutPage || {};
  const flatData = { hero: aboutHero || {}, story: aboutStory || {}, stats: aboutStats || {}, visionMission: aboutVisionMission || {}, offer: aboutOffer || {} };"""
),
])

# ================================================================
# PART 5 - About.jsx: import CardHoverControls already added earlier
# for Stats - no additional import needed here. This part intentionally
# left as a no-op placeholder is omitted.

# ================================================================
# PART 6 - Content.jsx: remove the now-dead "What We Offer" option from
# the legacy /admin/content About-tab dropdown (mirrors Hero/Story/
# Stats/VisionMission).
# ================================================================
apply(f"{ROOT}/src/admin/pages/Content.jsx", [
(
"""// 'stats' and 'visionMission' removed - both are now managed entirely by
// the Visual Editor on their own flat siteContent keys (see
// sectionSchemas.js), same as 'hero' and 'story' before them.
const ABOUT_SECTIONS = [
  { value: 'offer', label: 'What We Offer' },
  { value: 'values', label: 'Our Values' },""",
"""// 'stats', 'visionMission' and 'offer' removed - all are now managed
// entirely by the Visual Editor on their own flat siteContent keys (see
// sectionSchemas.js), same as 'hero' and 'story' before them.
const ABOUT_SECTIONS = [
  { value: 'values', label: 'Our Values' },"""
),
])

# ================================================================
# PART 7 - SectionList.jsx: add a sidebar description for aboutOffer.
# ================================================================
apply(f"{ROOT}/src/admin/editor/SectionList.jsx", [
(
"""    aboutVisionMission: 'Vision and Mission cards - each icon, label, title, description and image individually editable.',""",
"""    aboutVisionMission: 'Vision and Mission cards - each icon, label, title, description and image individually editable.',
    aboutOffer: 'What We Offer cards - each image, icon, title, description and link individually editable.',"""
),
])

print("ALL EDITS APPLIED (About - Offer batch)")
