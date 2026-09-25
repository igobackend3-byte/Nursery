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
# PART 1 - siteContent.js: promote About Stats out of the shared nested
# aboutPage object into its own flat top-level `aboutStats` key (same
# convention as aboutHero / aboutStory), so Reset/Delete/Settings scope
# correctly to just Stats. Items array keeps the exact same shape
# (id/icon/value/suffix/label/visible/order) it already had.
# ================================================================
apply(f"{ROOT}/src/data/siteContent.js", [
(
"""  // About - Story lives on its own now (see aboutStory above), promoted
  // to a flat top-level key so it can be independently reset/deleted/
  // settings-managed by the Visual Editor, exactly like Hero.
  aboutPage: {
    stats: {
      visible: true, order: 3,
      items: [
        { id: 1, icon: 'Leaf', value: 10, suffix: '+', label: 'Years Experience', visible: true, order: 1 },
        { id: 2, icon: 'Sprout', value: 5000, suffix: '+', label: 'Plants Delivered', visible: true, order: 2 },
        { id: 3, icon: 'Pot', value: 50, suffix: '+', label: 'Plant Varieties', visible: true, order: 3 },
        { id: 4, icon: 'Users', value: 1000, suffix: '+', label: 'Happy Customers', visible: true, order: 4 },
      ],
    },
    visionMission: {""",
"""  // About - Stats - flat top-level key (Visual Editor convention: one
  // real siteContent key per independently manageable section).
  aboutStats: {
    visible: true,
    order: 3,
    backgroundColor: '',
    backgroundImage: '',
    paddingY: '',
    items: [
      { id: 1, icon: 'Leaf', value: 10, suffix: '+', label: 'Years Experience', visible: true, order: 1 },
      { id: 2, icon: 'Sprout', value: 5000, suffix: '+', label: 'Plants Delivered', visible: true, order: 2 },
      { id: 3, icon: 'Pot', value: 50, suffix: '+', label: 'Plant Varieties', visible: true, order: 3 },
      { id: 4, icon: 'Users', value: 1000, suffix: '+', label: 'Happy Customers', visible: true, order: 4 },
    ],
  },
  // About - Story lives on its own now (see aboutStory above), promoted
  // to a flat top-level key so it can be independently reset/deleted/
  // settings-managed by the Visual Editor, exactly like Hero.
  aboutPage: {
    visionMission: {"""
),
])

# ================================================================
# PART 2 - sectionSchemas.js: add the aboutStats schema entry, right
# after aboutStory. Uses the standard `cards` shape (same mechanism as
# shopByCategory/homeCorners/etc.) so each stat gets its own hover
# Edit/Duplicate/Delete, plus a "Manage Stats" list modal and an
# "+ Add Stat" Quick Action, entirely from schema data - no bespoke
# admin UI code needed.
# ================================================================
apply(f"{ROOT}/src/admin/editor/sectionSchemas.js", [
(
"""    settings: true,
    reset: true,
  },
};""",
"""    settings: true,
    reset: true,
  },
  aboutStats: {
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
};"""
),
])

# ================================================================
# PART 3 - About.jsx: AboutStats() - wrap each stat card with
# CardHoverControls (same pattern already used on Home.jsx's repeatable
# cards) for individual hover Edit/Duplicate/Delete, without changing
# any layout, styling or the CountUp animation. Reads from the new
# `aboutStats` shape via `data` (still passed as the section's items).
# ================================================================
apply(f"{ROOT}/src/pages/About.jsx", [
(
"""function AboutStats({ data }) {
  const defaultStats = [
    { id: 1, icon: 'Leaf', value: 10, suffix: '+', label: 'Years Experience', visible: true, order: 1 },
    { id: 2, icon: 'Sprout', value: 5000, suffix: '+', label: 'Plants Delivered', visible: true, order: 2 },
    { id: 3, icon: 'Pot', value: 50, suffix: '+', label: 'Plant Varieties', visible: true, order: 3 },
    { id: 4, icon: 'Users', value: 1000, suffix: '+', label: 'Happy Customers', visible: true, order: 4 },
  ];
  const stats = (data?.items?.length ? data.items : defaultStats)
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  if (stats.length === 0) return null;
  return (
    <Reveal as="section" className="abt-stats-wrap">
      <div className="abt-stats">
        {stats.map((s, i) => {
          const StatIcon = Icon[s.icon] || Icon.Leaf;
          return (
            <div className="abt-stat" key={s.id}>
              <span className="abt-stat-icon"><StatIcon /></span>
              <strong><CountUp value={Number(s.value)} suffix={s.suffix} duration={1000 + i * 150} /></strong>
              <span className="abt-stat-label">{s.label}</span>
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}""",
"""function AboutStats({ data }) {
  const defaultStats = [
    { id: 1, icon: 'Leaf', value: 10, suffix: '+', label: 'Years Experience', visible: true, order: 1 },
    { id: 2, icon: 'Sprout', value: 5000, suffix: '+', label: 'Plants Delivered', visible: true, order: 2 },
    { id: 3, icon: 'Pot', value: 50, suffix: '+', label: 'Plant Varieties', visible: true, order: 3 },
    { id: 4, icon: 'Users', value: 1000, suffix: '+', label: 'Happy Customers', visible: true, order: 4 },
  ];
  const rawStats = data?.items?.length ? data.items : defaultStats;
  // Same convention as every other card-hover-controlled list (Garden
  // Services, Shop by Category, ...): hidden items are skipped here too,
  // even inside the editor - to bring one back, use "Manage Stats" (lists
  // every item, hidden or not) and re-check its Active box.
  const stats = rawStats
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  if (stats.length === 0) return null;

  const sectionStyle = {};
  if (data?.backgroundColor) sectionStyle.backgroundColor = data.backgroundColor;
  if (data?.backgroundImage) {
    sectionStyle.backgroundImage = `url(${data.backgroundImage})`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
  }
  if (data?.paddingY) sectionStyle.paddingTop = sectionStyle.paddingBottom = data.paddingY;

  return (
    <Reveal as="section" className="abt-stats-wrap" style={sectionStyle}>
      <div className="abt-stats">
        {stats.map((s, i) => {
          const StatIcon = Icon[s.icon] || Icon.Leaf;
          const itemIndex = rawStats.indexOf(s);
          return (
            <CardHoverControls key={s.id} sectionKey="aboutStats" arrayField="items" index={itemIndex} itemLabel="Stat">
              <div className="abt-stat">
                <span className="abt-stat-icon"><StatIcon /></span>
                <strong><CountUp value={Number(s.value)} suffix={s.suffix} duration={1000 + i * 150} /></strong>
                <span className="abt-stat-label">{s.label}</span>
              </div>
            </CardHoverControls>
          );
        })}
      </div>
    </Reveal>
  );
}"""
),
])

# ================================================================
# PART 4 - About.jsx: import CardHoverControls (not previously used on
# this page - only on Home.jsx so far).
# ================================================================
apply(f"{ROOT}/src/pages/About.jsx", [
(
"""import EditableElement from '../admin/editor/EditableElement';""",
"""import EditableElement from '../admin/editor/EditableElement';
import CardHoverControls from '../admin/editor/CardHoverControls';"""
),
])

# ================================================================
# PART 5 - About.jsx: About() - special-case 'stats' the same way
# 'hero' and 'story' already are, reading from the new flat `aboutStats`
# siteContent key instead of `ap.stats`.
# ================================================================
apply(f"{ROOT}/src/pages/About.jsx", [
(
"""const ABOUT_FLAT_SECTIONS = {
  hero: 'aboutHero',
  story: 'aboutStory',
};

function About() {
  const { aboutPage, aboutHero, aboutStory } = useSiteContent();
  const ap = aboutPage || {};
  const flatData = { hero: aboutHero || {}, story: aboutStory || {} };""",
"""const ABOUT_FLAT_SECTIONS = {
  hero: 'aboutHero',
  story: 'aboutStory',
  stats: 'aboutStats',
};

function About() {
  const { aboutPage, aboutHero, aboutStory, aboutStats } = useSiteContent();
  const ap = aboutPage || {};
  const flatData = { hero: aboutHero || {}, story: aboutStory || {}, stats: aboutStats || {} };"""
),
])

# ================================================================
# PART 6 - Content.jsx: remove the now-dead "Statistics" option from
# the legacy /admin/content About-tab dropdown (mirrors Hero/Story).
# ================================================================
apply(f"{ROOT}/src/admin/pages/Content.jsx", [
(
"""const ABOUT_SECTIONS = [
  { value: 'stats', label: 'Statistics' },
  { value: 'visionMission', label: 'Vision & Mission' },""",
"""// 'stats' removed - About - Statistics is now managed entirely by the
// Visual Editor on its own flat `aboutStats` siteContent key (see
// sectionSchemas.js), same as 'hero' and 'story' before it.
const ABOUT_SECTIONS = [
  { value: 'visionMission', label: 'Vision & Mission' },"""
),
])

# ================================================================
# PART 7 - SectionList.jsx: add a sidebar description for aboutStats.
# ================================================================
apply(f"{ROOT}/src/admin/editor/SectionList.jsx", [
(
"""    aboutStory: 'Our Story block with circular image, heading, description and Learn More button.',""",
"""    aboutStory: 'Our Story block with circular image, heading, description and Learn More button.',
    aboutStats: 'Animated stat counters - each number, label and icon individually editable.',"""
),
])

print("ALL EDITS APPLIED (About - Stats batch)")
