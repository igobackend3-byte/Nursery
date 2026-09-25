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
# PART 1 - siteContent.js: promote About Vision & Mission out of the
# shared nested aboutPage object into its own flat top-level
# `aboutVisionMission` key (same convention as aboutHero/Story/Stats).
# The two named `vision`/`mission` sub-objects become an `items` array
# (same repeatable-card shape as Stats/Offer), so cards can be
# individually edited/duplicated/deleted/reordered and new ones added -
# content and defaults are otherwise unchanged.
# ================================================================
apply(f"{ROOT}/src/data/siteContent.js", [
(
"""  aboutStats: {""",
"""  // About - Vision & Mission - flat top-level key (Visual Editor
  // convention: one real siteContent key per independently manageable
  // section). The two cards are now array items so they can be
  // individually edited/duplicated/deleted, and new ones added.
  aboutVisionMission: {
    visible: true,
    order: 4,
    backgroundColor: '',
    backgroundImage: '',
    paddingY: '',
    items: [
      { id: 1, icon: 'Eye', eyebrow: 'OUR VISION', title: 'A Greener Tomorrow', text: 'To be a leading nursery brand that inspires everyone to create healthier, greener and more beautiful spaces, while promoting sustainable living for future generations.', image: '/images/about-us/03_vision_growing_plant.jpg', imageAlt: 'A young seedling growing in soft sunlight', visible: true, order: 1 },
      { id: 2, icon: 'Target', eyebrow: 'OUR MISSION', title: 'Plants for a Better Life', text: 'To provide high-quality plants, gardening products and expert guidance, making green living simple, accessible and enjoyable for all.', image: '/images/about-us/04_mission_plant.jpg', imageAlt: 'A lush green leafy plant', visible: true, order: 2 },
    ],
  },
  aboutStats: {"""
),
])

apply(f"{ROOT}/src/data/siteContent.js", [
(
"""    visionMission: {
      visible: true, order: 4,
      vision: { eyebrow: 'OUR VISION', title: 'A Greener Tomorrow', text: 'To be a leading nursery brand that inspires everyone to create healthier, greener and more beautiful spaces, while promoting sustainable living for future generations.', image: '/images/about-us/03_vision_growing_plant.jpg', imageAlt: 'A young seedling growing in soft sunlight', icon: 'Eye' },
      mission: { eyebrow: 'OUR MISSION', title: 'Plants for a Better Life', text: 'To provide high-quality plants, gardening products and expert guidance, making green living simple, accessible and enjoyable for all.', image: '/images/about-us/04_mission_plant.jpg', imageAlt: 'A lush green leafy plant', icon: 'Target' },
    },
    offer: {""",
"""    // About - Vision & Mission lives on its own now (see
    // aboutVisionMission above), promoted to a flat top-level key so it
    // can be independently reset/deleted/settings-managed by the Visual
    // Editor, exactly like Hero/Story/Stats.
    offer: {"""
),
])

# ================================================================
# PART 2 - sectionSchemas.js: add the aboutVisionMission schema entry,
# right after aboutStats. Standard `cards` shape (same mechanism as
# Stats) - each card gets hover Edit/Duplicate/Delete, a "Manage" list
# modal, and a "+ Add" Quick Action, all from schema data.
# ================================================================
apply(f"{ROOT}/src/admin/editor/sectionSchemas.js", [
(
"""  aboutStats: {
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    cards: {
      field: 'items',
      label: 'Stats',
      itemLabel: 'Stat',
      itemTitleFields: ['label'],
      itemFields: [
        { field: 'value', label: 'Number', type: 'number' },
        { field: 'suffix', label: 'Suffix (e.g. "+")', type: 'text' },
        { field: 'label', label: 'Label', type: 'text' },
        { field: 'icon', label: 'Icon', type: 'select', options: ABOUT_ICON_OPTIONS },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
};""",
"""  aboutStats: {
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    cards: {
      field: 'items',
      label: 'Stats',
      itemLabel: 'Stat',
      itemTitleFields: ['label'],
      itemFields: [
        { field: 'value', label: 'Number', type: 'number' },
        { field: 'suffix', label: 'Suffix (e.g. "+")', type: 'text' },
        { field: 'label', label: 'Label', type: 'text' },
        { field: 'icon', label: 'Icon', type: 'select', options: ABOUT_ICON_OPTIONS },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },
  aboutVisionMission: {
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
};"""
),
])

# ================================================================
# PART 3 - About.jsx: AboutVisionMission() - convert from two fixed
# named cards (vision/mission) to a mapped `items` array, each wrapped
# in CardHoverControls (same pattern as Stats) for individual hover
# Edit/Duplicate/Delete. Layout, classes and styling are unchanged -
# `.abt-vm-vision`/`.abt-vm-mission` had no CSS rules of their own (only
# `.abt-vm-card` is styled), so dropping them changes nothing visually.
# ================================================================
apply(f"{ROOT}/src/pages/About.jsx", [
(
"""function AboutVisionMission({ data }) {
  const { t } = useLanguage();
  const vision = data?.vision || {};
  const mission = data?.mission || {};
  const VisionIcon = Icon[vision.icon] || Icon.Eye;
  const MissionIcon = Icon[mission.icon] || Icon.Target;
  return (
    <div className="abt-vm-grid">
      <Reveal className="abt-vm-card abt-vm-vision">
        <img className="abt-vm-media" src={vision.image || PHOTO.vision} alt={vision.imageAlt || t('aboutPage.visionImageAlt')} loading="lazy" />
        <span className="abt-vm-icon"><VisionIcon /></span>
        <p className="eyebrow">{vision.eyebrow || t('aboutPage.visionEyebrow')}</p>
        <h3>{vision.title || t('aboutPage.visionTitle')}</h3>
        <p>{vision.text || t('aboutPage.visionText')}</p>
      </Reveal>
      <Reveal className="abt-vm-card abt-vm-mission" delay={120}>
        <img className="abt-vm-media" src={mission.image || PHOTO.mission} alt={mission.imageAlt || t('aboutPage.missionImageAlt')} loading="lazy" />
        <span className="abt-vm-icon"><MissionIcon /></span>
        <p className="eyebrow">{mission.eyebrow || t('aboutPage.missionEyebrow')}</p>
        <h3>{mission.title || t('aboutPage.missionTitle')}</h3>
        <p>{mission.text || t('aboutPage.missionText')}</p>
      </Reveal>
    </div>
  );
}""",
"""function AboutVisionMission({ data }) {
  const defaultItems = [
    { id: 1, icon: 'Eye', eyebrow: 'OUR VISION', title: 'A Greener Tomorrow', text: 'To be a leading nursery brand that inspires everyone to create healthier, greener and more beautiful spaces, while promoting sustainable living for future generations.', image: '/images/about-us/03_vision_growing_plant.jpg', imageAlt: 'A young seedling growing in soft sunlight', visible: true, order: 1 },
    { id: 2, icon: 'Target', eyebrow: 'OUR MISSION', title: 'Plants for a Better Life', text: 'To provide high-quality plants, gardening products and expert guidance, making green living simple, accessible and enjoyable for all.', image: '/images/about-us/04_mission_plant.jpg', imageAlt: 'A lush green leafy plant', visible: true, order: 2 },
  ];
  const rawItems = data?.items?.length ? data.items : defaultItems;
  const items = rawItems
    .filter((c) => c.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  if (items.length === 0) return null;

  const sectionStyle = {};
  if (data?.backgroundColor) sectionStyle.backgroundColor = data.backgroundColor;
  if (data?.backgroundImage) {
    sectionStyle.backgroundImage = `url(${data.backgroundImage})`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
  }
  if (data?.paddingY) sectionStyle.paddingTop = sectionStyle.paddingBottom = data.paddingY;

  return (
    <div className="abt-vm-grid" style={sectionStyle}>
      {items.map((c, i) => {
        const CardIcon = Icon[c.icon] || Icon.Eye;
        const itemIndex = rawItems.indexOf(c);
        return (
          <CardHoverControls key={c.id} sectionKey="aboutVisionMission" arrayField="items" index={itemIndex} itemLabel="Card">
            <Reveal className="abt-vm-card" delay={i * 120}>
              <img className="abt-vm-media" src={c.image} alt={c.imageAlt || c.title} loading="lazy" />
              <span className="abt-vm-icon"><CardIcon /></span>
              <p className="eyebrow">{c.eyebrow}</p>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </Reveal>
          </CardHoverControls>
        );
      })}
    </div>
  );
}"""
),
])

# ================================================================
# PART 4 - About.jsx: About() - special-case 'visionMission' the same
# way 'hero'/'story'/'stats' already are, reading from the new flat
# `aboutVisionMission` siteContent key instead of `ap.visionMission`.
# ================================================================
apply(f"{ROOT}/src/pages/About.jsx", [
(
"""const ABOUT_FLAT_SECTIONS = {
  hero: 'aboutHero',
  story: 'aboutStory',
  stats: 'aboutStats',
};

function About() {
  const { aboutPage, aboutHero, aboutStory, aboutStats } = useSiteContent();
  const ap = aboutPage || {};
  const flatData = { hero: aboutHero || {}, story: aboutStory || {}, stats: aboutStats || {} };""",
"""const ABOUT_FLAT_SECTIONS = {
  hero: 'aboutHero',
  story: 'aboutStory',
  stats: 'aboutStats',
  visionMission: 'aboutVisionMission',
};

function About() {
  const { aboutPage, aboutHero, aboutStory, aboutStats, aboutVisionMission } = useSiteContent();
  const ap = aboutPage || {};
  const flatData = { hero: aboutHero || {}, story: aboutStory || {}, stats: aboutStats || {}, visionMission: aboutVisionMission || {} };"""
),
])

# ================================================================
# PART 5 - Content.jsx: remove the now-dead "Vision & Mission" option
# from the legacy /admin/content About-tab dropdown (mirrors Hero/
# Story/Stats).
# ================================================================
apply(f"{ROOT}/src/admin/pages/Content.jsx", [
(
"""// 'stats' removed - About - Statistics is now managed entirely by the
// Visual Editor on its own flat `aboutStats` siteContent key (see
// sectionSchemas.js), same as 'hero' and 'story' before it.
const ABOUT_SECTIONS = [
  { value: 'visionMission', label: 'Vision & Mission' },
  { value: 'offer', label: 'What We Offer' },""",
"""// 'stats' and 'visionMission' removed - both are now managed entirely by
// the Visual Editor on their own flat siteContent keys (see
// sectionSchemas.js), same as 'hero' and 'story' before them.
const ABOUT_SECTIONS = [
  { value: 'offer', label: 'What We Offer' },"""
),
])

# ================================================================
# PART 6 - SectionList.jsx: add a sidebar description for
# aboutVisionMission.
# ================================================================
apply(f"{ROOT}/src/admin/editor/SectionList.jsx", [
(
"""    aboutStats: 'Animated stat counters - each number, label and icon individually editable.',""",
"""    aboutStats: 'Animated stat counters - each number, label and icon individually editable.',
    aboutVisionMission: 'Vision and Mission cards - each icon, label, title, description and image individually editable.',"""
),
])

print("ALL EDITS APPLIED (About - Vision & Mission batch)")
