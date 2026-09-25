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
# PART 3 - siteContent.js: promote About Story out of the shared
# nested aboutPage object into its own flat top-level `aboutStory` key
# (same convention as aboutHero), so Reset/Delete/Settings scope
# correctly to just Story. Adds the show/hide + two decorative-icon
# fields the new CMS wiring needs.
# ================================================================
apply(f"{ROOT}/src/data/siteContent.js", [
(
"""  // About - Hero lives on its own now (see aboutHero below), promoted to
  // a flat top-level key so it can be independently reset/deleted/settings-
  // managed by the Visual Editor, exactly like every Home Page section.
  aboutPage: {""",
"""  // About - Story - flat top-level key (Visual Editor convention: one
  // real siteContent key per independently manageable section).
  aboutStory: {
    visible: true,
    order: 2,
    backgroundColor: '',
    backgroundImage: '',
    paddingY: '',
    labelVisible: true,
    eyebrow: 'OUR STORY',
    headingVisible: true,
    heading: 'Growing Greener,\\nGrowing Better',
    textVisible: true,
    text: 'IGO Nursery started with a simple idea — to make quality plants and gardening products accessible to everyone. Today, we are a growing community of plant lovers, offering a wide range of healthy plants, quality pots, seeds and gardening essentials. Our goal is to inspire greener living and help you create beautiful, sustainable spaces.',
    decorativeIcon1Visible: true,
    decorativeIcon1: 'Leaf',
    decorativeIcon2Visible: true,
    decorativeIcon2: 'Leaf',
    buttonVisible: true,
    buttonText: 'Learn More',
    buttonUrl: '/about',
    buttonIcon: 'Arrow',
    image: '/images/about-us/02_our_story_person_holding_plant.jpg',
    imageAlt: 'A hand holding a small potted plant - From Seed to Green',
  },
  // About - Hero lives on its own now (see aboutHero below), promoted to
  // a flat top-level key so it can be independently reset/deleted/settings-
  // managed by the Visual Editor, exactly like every Home Page section.
  aboutPage: {"""
),
])

apply(f"{ROOT}/src/data/siteContent.js", [
(
"""  aboutPage: {
    story: {
      visible: true, order: 2,
      eyebrow: 'OUR STORY', titleLine1: 'Growing Greener,', titleLine2: 'Growing Better',
      text: 'IGO Nursery started with a simple idea — to make quality plants and gardening products accessible to everyone. Today, we are a growing community of plant lovers, offering a wide range of healthy plants, quality pots, seeds and gardening essentials. Our goal is to inspire greener living and help you create beautiful, sustainable spaces.',
      buttonText: 'Learn More', buttonUrl: '/about',
      image: '/images/about-us/02_our_story_person_holding_plant.jpg', imageAlt: 'A hand holding a small potted plant - From Seed to Green',
    },
    stats: {""",
"""  // About - Story lives on its own now (see aboutStory above), promoted
  // to a flat top-level key so it can be independently reset/deleted/
  // settings-managed by the Visual Editor, exactly like Hero.
  aboutPage: {
    stats: {"""
),
])

# ================================================================
# PART 4 - sectionSchemas.js: add the aboutStory schema entry, right
# after aboutHero.
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
  aboutStory: {
    images: [{ field: 'image', label: 'Story Image' }],
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    fieldGroups: [
      {
        key: 'label',
        label: 'Section Label',
        fields: [
          { field: 'eyebrow', label: 'Label Text' },
          { field: 'labelVisible', label: 'Show label', type: 'checkbox' },
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
        key: 'text',
        label: 'Description',
        fields: [
          { field: 'text', label: 'Description Text' },
          { field: 'textVisible', label: 'Show description', type: 'checkbox' },
        ],
      },
      {
        key: 'decorativeIcon1',
        label: 'Decorative Icon (top)',
        fields: [
          { field: 'decorativeIcon1', label: 'Icon', type: 'select', options: ABOUT_ICON_OPTIONS },
          { field: 'decorativeIcon1Visible', label: 'Show icon', type: 'checkbox' },
        ],
      },
      {
        key: 'decorativeIcon2',
        label: 'Decorative Icon (bottom)',
        fields: [
          { field: 'decorativeIcon2', label: 'Icon', type: 'select', options: ABOUT_ICON_OPTIONS },
          { field: 'decorativeIcon2Visible', label: 'Show icon', type: 'checkbox' },
        ],
      },
    ],
    button: {
      label: 'Learn More Button',
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

# ================================================================
# PART 5 - About.jsx: rewrite AboutStory() with full hover-editing,
# following the exact same pattern already proven for AboutHero (both
# decorative icons via wrapperStyle + the non-editor-mode span-style
# fallback, image via a fill-wrapped EditableElement - no CSS change
# needed since .abt-story-media already has position:relative - and
# label/heading/description/button each via a text_fields EditableElement).
# ================================================================
apply(f"{ROOT}/src/pages/About.jsx", [
(
"""function AboutStory({ data }) {
  const { t } = useLanguage();
  const s = data || {};
  return (
    <section className="abt-story">
      <FloatingLeaf style={{ top: '6%', left: '4%' }} size={18} />
      <FloatingLeaf style={{ bottom: '10%', right: '30%' }} size={16} flip />

      {/* The play button and "From Seed to Green" caption are already
          composited into this reference image. */}
      <Reveal className="abt-story-media">
        <img src={s.image || PHOTO.handWithPlant} alt={s.imageAlt || t('aboutPage.storyImageAlt')} loading="lazy" />
      </Reveal>

      <Reveal className="abt-story-copy" delay={120}>
        <p className="eyebrow">{s.eyebrow || t('aboutPage.storyEyebrow')}</p>
        <h2>{s.titleLine1 || t('aboutPage.storyTitleLine1')}<br />{s.titleLine2 || t('aboutPage.storyTitleLine2')}</h2>
        <p className="abt-story-text">{s.text || t('aboutPage.storyText')}</p>
        <Link to={s.buttonUrl || '/about'} className="abt-btn abt-btn-primary abt-btn-sm">{s.buttonText || t('aboutPage.storyCta')} <Icon.Arrow /></Link>
      </Reveal>
    </section>
  );
}""",
"""function AboutStory({ data }) {
  const { t } = useLanguage();
  const { isEditorMode } = useVisualEditor();
  const s = data || {};

  const labelVisible = s.labelVisible !== false;
  const eyebrow = s.eyebrow || t('aboutPage.storyEyebrow');
  const headingVisible = s.headingVisible !== false;
  const heading = s.heading || `${t('aboutPage.storyTitleLine1')}\\n${t('aboutPage.storyTitleLine2')}`;
  const textVisible = s.textVisible !== false;
  const text = s.text || t('aboutPage.storyText');
  const decorativeIcon1Visible = s.decorativeIcon1Visible !== false;
  const DecorativeIcon1Comp = Icon[s.decorativeIcon1] || Icon.Leaf;
  const decorativeIcon2Visible = s.decorativeIcon2Visible !== false;
  const DecorativeIcon2Comp = Icon[s.decorativeIcon2] || Icon.Leaf;
  const buttonVisible = s.buttonVisible !== false;
  const buttonText = s.buttonText || t('aboutPage.storyCta');
  const buttonUrl = s.buttonUrl || '/about';
  const ButtonIconComp = Icon[s.buttonIcon] || Icon.Arrow;
  const image = s.image || PHOTO.handWithPlant;
  const imageAlt = s.imageAlt || t('aboutPage.storyImageAlt');

  const sectionStyle = {};
  if (s.backgroundColor) sectionStyle.backgroundColor = s.backgroundColor;
  if (s.backgroundImage) {
    sectionStyle.backgroundImage = `url(${s.backgroundImage})`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
  }
  if (s.paddingY) sectionStyle.paddingTop = sectionStyle.paddingBottom = s.paddingY;

  const storySchema = getSectionSchema('aboutStory');
  const labelFields = storySchema.fieldGroups?.find((g) => g.key === 'label')?.fields;
  const headingFields = storySchema.fieldGroups?.find((g) => g.key === 'heading')?.fields;
  const textFields = storySchema.fieldGroups?.find((g) => g.key === 'text')?.fields;
  const icon1Fields = storySchema.fieldGroups?.find((g) => g.key === 'decorativeIcon1')?.fields;
  const icon2Fields = storySchema.fieldGroups?.find((g) => g.key === 'decorativeIcon2')?.fields;
  const buttonFields = storySchema.button?.fields;

  return (
    <section className="abt-story" style={sectionStyle}>
      {/* Both decorative leaves are themselves absolutely positioned
          (top/left or bottom/right percentages against .abt-story)
          rather than sized to fill a parent box, so each is wrapped
          with `wrapperStyle` (not `fill`) - see AboutHero's identical
          pattern and EditableElement.jsx for why. Outside editor mode
          EditableElement renders no wrapper at all, so each span also
          carries its own fallback inline position for that case. */}
      {(decorativeIcon1Visible || isEditorMode) && (
        <EditableElement
          sectionKey="aboutStory"
          field="__decorativeIcon1__"
          type="text_fields"
          label="Decorative Icon (top)"
          hideDelete
          fields={icon1Fields}
          wrapperStyle={{ position: 'absolute', top: '6%', left: '4%', zIndex: 1 }}
        >
          <span className="abt-leaf" style={isEditorMode ? undefined : { top: '6%', left: '4%' }} aria-hidden="true">
            <DecorativeIcon1Comp width={18} height={18} fill="currentColor" stroke="none" />
          </span>
        </EditableElement>
      )}
      {(decorativeIcon2Visible || isEditorMode) && (
        <EditableElement
          sectionKey="aboutStory"
          field="__decorativeIcon2__"
          type="text_fields"
          label="Decorative Icon (bottom)"
          hideDelete
          fields={icon2Fields}
          wrapperStyle={{ position: 'absolute', bottom: '10%', right: '30%', zIndex: 1 }}
        >
          <span className="abt-leaf" style={isEditorMode ? undefined : { bottom: '10%', right: '30%', transform: 'scaleX(-1)' }} aria-hidden="true">
            <DecorativeIcon2Comp width={16} height={16} fill="currentColor" stroke="none" />
          </span>
        </EditableElement>
      )}

      {/* The play button and "From Seed to Green" caption are already
          composited into this reference image. */}
      <Reveal className="abt-story-media">
        <EditableElement sectionKey="aboutStory" field="image" type="image" label="Story Image" fill>
          <img src={image} alt={imageAlt} loading="lazy" />
        </EditableElement>
      </Reveal>

      <Reveal className="abt-story-copy" delay={120}>
        {(labelVisible || isEditorMode) && (
          <EditableElement sectionKey="aboutStory" field="__label__" type="text_fields" label="Section Label" hideDelete fields={labelFields}>
            <p className="eyebrow">{eyebrow}</p>
          </EditableElement>
        )}
        {(headingVisible || isEditorMode) && (
          <EditableElement sectionKey="aboutStory" field="__heading__" type="text_fields" label="Main Heading" hideDelete fields={headingFields}>
            <h2>
              {heading.split('\\n').map((line, i) => (
                <Fragment key={i}>{i > 0 && <br />}{line}</Fragment>
              ))}
            </h2>
          </EditableElement>
        )}
        {(textVisible || isEditorMode) && (
          <EditableElement sectionKey="aboutStory" field="__text__" type="text_fields" label="Description" hideDelete fields={textFields}>
            <p className="abt-story-text">{text}</p>
          </EditableElement>
        )}
        {(buttonVisible || isEditorMode) && (
          <EditableElement sectionKey="aboutStory" field="__button__" type="text_fields" label="Learn More Button" hideDelete fields={buttonFields}>
            <Link to={buttonUrl} className="abt-btn abt-btn-primary abt-btn-sm">{buttonText} <ButtonIconComp /></Link>
          </EditableElement>
        )}
      </Reveal>
    </section>
  );
}"""
),
])

# ================================================================
# PART 6 - About.jsx: About() - special-case 'story' the same way
# 'hero' is already special-cased, reading from the new flat
# `aboutStory` siteContent key instead of `ap.story`.
# ================================================================
apply(f"{ROOT}/src/pages/About.jsx", [
(
"""function About() {
  const { aboutPage, aboutHero } = useSiteContent();
  const ap = aboutPage || {};
  const heroData = aboutHero || {};
  // Hero now lives on its own flat siteContent key (see siteContent.js) so
  // it can be independently reset/deleted/settings-managed by the Visual
  // Editor - the other 8 sections are unchanged for now, still nested
  // under aboutPage exactly as before, until each gets the same treatment.
  const sectionOrder = Object.keys(ABOUT_SECTION_COMPONENTS)
    .map((key) => ({ key, ...(key === 'hero' ? heroData : ap[key]) }))
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="abt-page">
      {sectionOrder.map(({ key }) => {
        const SectionComponent = ABOUT_SECTION_COMPONENTS[key];
        const sectionData = key === 'hero' ? heroData : ap[key];
        // Note: the other 8 sections still use this `about_${key}` pseudo
        // key, which doesn't match any real siteContent key - their Quick
        // Actions stay exactly as they were before this change (not yet
        // migrated). Only 'hero' now uses its real flat key.
        const sectionKey = key === 'hero' ? 'aboutHero' : `about_${key}`;
        return (
          <EditableSection key={key} sectionKey={sectionKey} label={`About - ${key}`}>
            <SectionComponent data={sectionData} />
          </EditableSection>
        );
      })}
    </div>
  );
}""",
"""// Sections that have been migrated off the shared, nested `aboutPage`
// object onto their own flat top-level siteContent key (Visual Editor
// convention - see siteContent.js). Add a section's key here once it
// gets the same treatment as Hero and Story.
const ABOUT_FLAT_SECTIONS = {
  hero: 'aboutHero',
  story: 'aboutStory',
};

function About() {
  const { aboutPage, aboutHero, aboutStory } = useSiteContent();
  const ap = aboutPage || {};
  const flatData = { hero: aboutHero || {}, story: aboutStory || {} };
  // Hero and Story now live on their own flat siteContent keys (see
  // siteContent.js) so each can be independently reset/deleted/settings-
  // managed by the Visual Editor - the remaining 6 sections are unchanged
  // for now, still nested under aboutPage exactly as before, until each
  // gets the same treatment.
  const sectionOrder = Object.keys(ABOUT_SECTION_COMPONENTS)
    .map((key) => ({ key, ...(ABOUT_FLAT_SECTIONS[key] ? flatData[key] : ap[key]) }))
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="abt-page">
      {sectionOrder.map(({ key }) => {
        const SectionComponent = ABOUT_SECTION_COMPONENTS[key];
        const sectionData = ABOUT_FLAT_SECTIONS[key] ? flatData[key] : ap[key];
        // Note: the remaining 6 sections still use this `about_${key}`
        // pseudo key, which doesn't match any real siteContent key - their
        // Quick Actions stay exactly as they were before this change (not
        // yet migrated). Only sections listed in ABOUT_FLAT_SECTIONS use
        // their real flat key.
        const sectionKey = ABOUT_FLAT_SECTIONS[key] || `about_${key}`;
        return (
          <EditableSection key={key} sectionKey={sectionKey} label={`About - ${key}`}>
            <SectionComponent data={sectionData} />
          </EditableSection>
        );
      })}
    </div>
  );
}"""
),
])

# ================================================================
# PART 7 - Content.jsx: remove the now-dead "Our Story" option from
# the legacy /admin/content About-tab dropdown (mirrors the earlier
# Hero cleanup). The now-unreachable panel code for it is deliberately
# left in place, same reasoning as Hero.
# ================================================================
apply(f"{ROOT}/src/admin/pages/Content.jsx", [
(
"""const ABOUT_SECTIONS = [
  { value: 'story', label: 'Our Story' },
  { value: 'stats', label: 'Statistics' },""",
"""// 'story' removed - About - Story is now managed entirely by the Visual
// Editor on its own flat `aboutStory` siteContent key (see
// sectionSchemas.js), same as 'hero' before it.
const ABOUT_SECTIONS = [
  { value: 'stats', label: 'Statistics' },"""
),
])

# ================================================================
# PART 8 - SectionList.jsx: add a sidebar description for aboutStory.
# ================================================================
apply(f"{ROOT}/src/admin/editor/SectionList.jsx", [
(
"""    aboutHero: 'Hero banner with breadcrumb, heading, description and CTA button.',""",
"""    aboutHero: 'Hero banner with breadcrumb, heading, description and CTA button.',
    aboutStory: 'Our Story block with circular image, heading, description and Learn More button.',"""
),
])

print("ALL EDITS APPLIED (About - Story batch)")
