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


# ---------- About.jsx : AboutHero() render-wiring + About() data source ----------
apply(f"{ROOT}/src/pages/About.jsx", [
(
"""function AboutHero({ data }) {
  const { t } = useLanguage();
  const h = data || {};
  return (
    <section className="abt-hero">
      <FloatingLeaf style={{ top: '18%', left: '46%' }} size={20} />
      <FloatingLeaf style={{ top: '58%', left: '2%' }} size={16} flip />

      <div className="abt-hero-left">
        <p className="abt-breadcrumb"><Link to="/">{h.breadcrumbHome || t('aboutPage.heroBreadcrumbHome')}</Link> <span>→</span> {h.breadcrumbCurrent || t('aboutPage.heroBreadcrumbCurrent')}</p>
        <h1 className="abt-hero-title">{h.titleLine1 || t('aboutPage.heroTitleLine1')}<br />{h.titleLine2 || t('aboutPage.heroTitleLine2')}</h1>
        <p className="abt-hero-sub">{h.subtitle || t('aboutPage.heroSub')}</p>
        <p className="abt-hero-desc">{h.description || t('aboutPage.heroDesc')}</p>
        <Link to={h.buttonUrl || '/category/indoor-plants'} className="abt-btn abt-btn-primary">
          {h.buttonText || t('aboutPage.heroCta')} <Icon.Arrow />
        </Link>
      </div>

      <div className="abt-hero-right">
        {/* "Green Spaces Happier Lives" is already composited into this
            reference image, so it isn't repeated as a separate overlay. */}
        <img src={h.image || PHOTO.greenhouse} alt={h.imageAlt || t('aboutPage.heroImageAlt')} loading="eager" />
      </div>
    </section>
  );
}""",
"""function AboutHero({ data }) {
  const { t } = useLanguage();
  const { isEditorMode } = useVisualEditor();
  const h = data || {};

  const breadcrumbHomeText = h.breadcrumbHomeText || t('aboutPage.heroBreadcrumbHome');
  const breadcrumbHomeUrl = h.breadcrumbHomeUrl || '/';
  const breadcrumbHomeVisible = h.breadcrumbHomeVisible !== false;
  const breadcrumbCurrentText = h.breadcrumbCurrentText || t('aboutPage.heroBreadcrumbCurrent');
  const breadcrumbCurrentUrl = h.breadcrumbCurrentUrl || '';
  const breadcrumbCurrentVisible = h.breadcrumbCurrentVisible !== false;
  const headingVisible = h.headingVisible !== false;
  const heading = h.heading || `${t('aboutPage.heroTitleLine1')}\\n${t('aboutPage.heroTitleLine2')}`;
  const subtitleVisible = h.subtitleVisible !== false;
  const subtitle = h.subtitle || t('aboutPage.heroSub');
  const descriptionVisible = h.descriptionVisible !== false;
  const description = h.description || t('aboutPage.heroDesc');
  const decorativeIconVisible = h.decorativeIconVisible !== false;
  const DecorativeIconComp = Icon[h.decorativeIcon] || Icon.Leaf;
  const buttonVisible = h.buttonVisible !== false;
  const buttonText = h.buttonText || t('aboutPage.heroCta');
  const buttonUrl = h.buttonUrl || '/category/indoor-plants';
  const ButtonIconComp = Icon[h.buttonIcon] || Icon.Arrow;
  const image = h.image || PHOTO.greenhouse;
  const imageAlt = h.imageAlt || t('aboutPage.heroImageAlt');

  const sectionStyle = {};
  if (h.backgroundColor) sectionStyle.backgroundColor = h.backgroundColor;
  if (h.backgroundImage) {
    sectionStyle.backgroundImage = `url(${h.backgroundImage})`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
  }
  if (h.paddingY) sectionStyle.paddingTop = sectionStyle.paddingBottom = h.paddingY;

  const heroSchema = getSectionSchema('aboutHero');
  const breadcrumbFields = heroSchema.fieldGroups?.find((g) => g.key === 'breadcrumb')?.fields;
  const headingFields = heroSchema.fieldGroups?.find((g) => g.key === 'heading')?.fields;
  const subtitleFields = heroSchema.fieldGroups?.find((g) => g.key === 'subtitle')?.fields;
  const descriptionFields = heroSchema.fieldGroups?.find((g) => g.key === 'description')?.fields;
  const iconFields = heroSchema.fieldGroups?.find((g) => g.key === 'decorativeIcon')?.fields;
  const buttonFields = heroSchema.button?.fields;

  return (
    <section className="abt-hero" style={sectionStyle}>
      {/* This decorative leaf is itself absolutely positioned (top/left
          percentages against .abt-hero) rather than sized to fill a
          parent box, so it's wrapped with `wrapperStyle` (not `fill`) -
          the wrapper takes over that exact position so the icon never
          shifts when the hover-edit chrome is added; see
          EditableElement.jsx for why `fill` alone isn't the right tool
          for an element positioned this way. */}
      {(decorativeIconVisible || isEditorMode) && (
        <EditableElement
          sectionKey="aboutHero"
          field="__decorativeIcon__"
          type="text_fields"
          label="Decorative Icon"
          hideDelete
          fields={iconFields}
          wrapperStyle={{ position: 'absolute', top: '58%', left: '2%', zIndex: 1 }}
        >
          <span className="abt-leaf" aria-hidden="true">
            <DecorativeIconComp width={16} height={16} />
          </span>
        </EditableElement>
      )}
      <FloatingLeaf style={{ top: '18%', left: '46%' }} size={20} />

      <div className="abt-hero-left">
        {(breadcrumbHomeVisible || breadcrumbCurrentVisible || isEditorMode) && (
          <EditableElement sectionKey="aboutHero" field="__breadcrumb__" type="text_fields" label="Breadcrumb" hideDelete fields={breadcrumbFields}>
            <p className="abt-breadcrumb">
              {breadcrumbHomeVisible && (<>
                <Link to={breadcrumbHomeUrl}>{breadcrumbHomeText}</Link> <span>→</span>{' '}
              </>)}
              {breadcrumbCurrentVisible && (
                breadcrumbCurrentUrl ? <Link to={breadcrumbCurrentUrl}>{breadcrumbCurrentText}</Link> : breadcrumbCurrentText
              )}
            </p>
          </EditableElement>
        )}
        {(headingVisible || isEditorMode) && (
          <EditableElement sectionKey="aboutHero" field="__heading__" type="text_fields" label="Main Heading" hideDelete fields={headingFields}>
            <h1 className="abt-hero-title">
              {heading.split('\\n').map((line, i) => (
                <Fragment key={i}>{i > 0 && <br />}{line}</Fragment>
              ))}
            </h1>
          </EditableElement>
        )}
        {(subtitleVisible || isEditorMode) && (
          <EditableElement sectionKey="aboutHero" field="__subtitle__" type="text_fields" label="Subheading" hideDelete fields={subtitleFields}>
            <p className="abt-hero-sub">{subtitle}</p>
          </EditableElement>
        )}
        {(descriptionVisible || isEditorMode) && (
          <EditableElement sectionKey="aboutHero" field="__description__" type="text_fields" label="Description" hideDelete fields={descriptionFields}>
            <p className="abt-hero-desc">{description}</p>
          </EditableElement>
        )}
        {(buttonVisible || isEditorMode) && (
          <EditableElement sectionKey="aboutHero" field="__button__" type="text_fields" label="Primary Button" hideDelete fields={buttonFields}>
            <Link to={buttonUrl} className="abt-btn abt-btn-primary">
              {buttonText} <ButtonIconComp />
            </Link>
          </EditableElement>
        )}
      </div>

      <div className="abt-hero-right">
        <EditableElement sectionKey="aboutHero" field="image" type="image" label="Hero Image" fill>
          {/* "Green Spaces Happier Lives" is already composited into this
              reference image, so it isn't repeated as a separate overlay. */}
          <img src={image} alt={imageAlt} loading="eager" />
        </EditableElement>
      </div>
    </section>
  );
}""",
),
])

apply(f"{ROOT}/src/pages/About.jsx", [
(
"""import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSiteContent } from '../hooks/useSiteContent';""",
"""import { Fragment, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSiteContent } from '../hooks/useSiteContent';
import EditableSection from '../admin/editor/EditableSection';
import EditableElement from '../admin/editor/EditableElement';
import { useVisualEditor } from '../admin/editor/VisualEditorContext';
import { getSectionSchema } from '../admin/editor/sectionSchemas';"""
),
(
"""import EditableSection from '../admin/editor/EditableSection';

function About() {
  const { aboutPage } = useSiteContent();
  const ap = aboutPage || {};
  const sectionOrder = Object.keys(ABOUT_SECTION_COMPONENTS)
    .map((key) => ({ key, ...ap[key] }))
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="abt-page">
      {sectionOrder.map(({ key }) => {
        const SectionComponent = ABOUT_SECTION_COMPONENTS[key];
        // Note: For nested structure like aboutPage.hero, we'd ideally adjust EditableSection to handle paths.
        // For visual layout purposes, we wrap them so the admin can interact.
        return (
          <EditableSection key={key} sectionKey={`about_${key}`} label={`About - ${key}`}>
            <SectionComponent data={ap[key]} />
          </EditableSection>
        );
      })}
    </div>
  );
}

export default About;""",
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
}

export default About;"""
),
])

# ---------- SectionList.jsx : page-aware title/subtitle (was hardcoded
# "Home Page" even while editing another page's sections, e.g. About) +
# a real description for the new aboutHero section instead of the generic
# fallback. ----
apply(f"{ROOT}/src/admin/editor/SectionList.jsx", [
(
"""    newsletter: 'Newsletter subscription section.',
    faq: 'Support/Help section.',
  };
  return descriptions[sectionKey] || 'Manage content for this section.';
};

export default function SectionList() {
  const { pageSections, activeSection, setActiveSection, draftContent } = useVisualEditor();

  return (
    <div className="section-list-container">
      <div className="section-list-header">
        <h2 className="section-list-title">Home Page</h2>
        <p className="section-list-subtitle">Manage and edit sections of your home page. Click on any section to edit its content directly.</p>
      </div>""",
"""    newsletter: 'Newsletter subscription section.',
    faq: 'Support/Help section.',
    aboutHero: 'Hero banner with breadcrumb, heading, description and CTA button.',
  };
  return descriptions[sectionKey] || 'Manage content for this section.';
};

// This list is reused for every page's Visual Editor screen, not just
// the Home Page - `pageId` (from the route, e.g. "about") picks the right
// title/subtitle instead of always saying "Home Page".
const PAGE_META = {
  home: { title: 'Home Page', noun: 'home page' },
  about: { title: 'About Page', noun: 'About page' },
  plants: { title: 'Plants Page', noun: 'Plants page' },
  seeds: { title: 'Seeds Page', noun: 'Seeds page' },
  'pots-planters': { title: 'Pots & Planters Page', noun: 'Pots & Planters page' },
  'plant-care': { title: 'Plant Care Page', noun: 'Plant Care page' },
};

export default function SectionList({ pageId }) {
  const { pageSections, activeSection, setActiveSection, draftContent } = useVisualEditor();
  const pageMeta = PAGE_META[pageId] || PAGE_META.home;

  return (
    <div className="section-list-container">
      <div className="section-list-header">
        <h2 className="section-list-title">{pageMeta.title}</h2>
        <p className="section-list-subtitle">Manage and edit sections of your {pageMeta.noun}. Click on any section to edit its content directly.</p>
      </div>"""
),
])

# ---------- VisualEditor.jsx : pass pageId through to SectionList ----------
apply(f"{ROOT}/src/admin/editor/VisualEditor.jsx", [
(
"""          <div className="admin-page-editor-sidebar">
            <SectionList />
          </div>""",
"""          <div className="admin-page-editor-sidebar">
            <SectionList pageId={pageId} />
          </div>"""
),
])

# ---------- Content.jsx : the old raw-form About-Hero option is now dead
# (it wrote to aboutPage.hero, which no component reads any more, now that
# Hero lives at the flat `aboutHero` key and is fully editable from
# /admin/pages/about instead) - remove it from the section picker so it
# can't be selected; the now-unreachable panel further down is left in
# place rather than deleted; it simply can never render. ----
apply(f"{ROOT}/src/admin/pages/Content.jsx", [
(
"""const ABOUT_SECTIONS = [
  { value: 'hero', label: 'Hero / Banner' },
  { value: 'story', label: 'Our Story' },""",
"""// 'hero' intentionally not listed here any more - About - Hero is now a
// flat top-level siteContent key (aboutHero) managed entirely from the
// new Visual Editor at /admin/pages/about, not from this legacy form.
const ABOUT_SECTIONS = [
  { value: 'story', label: 'Our Story' },"""
),
])

print("ALL EDITS APPLIED (batch 2 of 2 - About.jsx + SectionList + VisualEditor + Content.jsx)")
