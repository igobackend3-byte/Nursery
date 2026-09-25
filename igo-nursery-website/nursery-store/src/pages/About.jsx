import { Fragment, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSiteContent } from '../hooks/useSiteContent';
import EditableSection from '../admin/editor/EditableSection';
import EditableElement from '../admin/editor/EditableElement';
import CardHoverControls from '../admin/editor/CardHoverControls';
import { useVisualEditor } from '../admin/editor/VisualEditorContext';
import { getSectionSchema } from '../admin/editor/sectionSchemas';

// ------------------------------------------------------------------
// About Us page - complete visual redesign per the supplied reference
// screenshot. Scoped entirely to this page: every class below is
// prefixed `abt-` (or reuses the site-wide `.eyebrow` utility) so
// nothing here can leak into or collide with any other page's styles.
//
// Images: every photo below is a real file from the user-supplied
// reference folder (public/images/about-us/), mapped 1:1 by filename to
// the section it belongs to - nothing invented or substituted.
// ------------------------------------------------------------------

const PHOTO = {
  greenhouse: '/images/about-us/01_hero_nursery_greenhouse.jpg',
  handWithPlant: '/images/about-us/02_our_story_person_holding_plant.jpg',
  vision: '/images/about-us/03_vision_growing_plant.jpg',
  mission: '/images/about-us/04_mission_plant.jpg',
  offerIndoorOutdoor: '/images/about-us/05_indoor_outdoor_plants.jpg',
  offerPots: '/images/about-us/06_pots_and_planters.jpg',
  offerSeeds: '/images/about-us/07_seeds_and_gardening.jpg',
  plantCare: '/images/about-us/08_plant_care.jpg',
  landscaping: '/images/about-us/09_landscaping.jpg',
  corporateGifting: '/images/about-us/10_corporate_gifting.jpg',
  soilMacro: '/images/about-us/11_our_values_plant_orbit.jpg',
  journeyFirst: '/images/about-us/12_journey_seedlings.jpg',
  journey: [
    '/images/about-us/13_journey_nursery_beds.jpg',
    '/images/about-us/14_journey_plant_care.jpg',
    '/images/about-us/15_journey_greenhouse.jpg',
    '/images/about-us/16_journey_nursery.jpg',
  ],
  finalCta: '/images/about-us/11_our_values_plant_orbit.jpg',
};

// ---------------------------------------------------------------- Icons
// Small original line-icons, one stroke style throughout - no icon
// library, no stock art.
const Icon = {
  Leaf: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22C12 22 20 18 20 12V5l-8-3-8 3v7C4 18 12 22 12 22z" />
    </svg>
  ),
  Pot: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3v3" /><path d="M8 6h8l1.5 4h-11z" /><path d="M7 10l1.2 9.5a2 2 0 0 0 2 1.5h3.6a2 2 0 0 0 2-1.5L17 10" />
    </svg>
  ),
  Sprout: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22V12" /><path d="M12 12C12 7 8 5 4 5c0 5 3 7 8 7Z" /><path d="M12 12c0-5 4-7 8-7 0 5-3 7-8 7Z" />
    </svg>
  ),
  Users: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Eye: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Target: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" />
    </svg>
  ),
  Watering: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 12h11l6-4v8l-6-4" /><path d="M2 12v5a1 1 0 0 0 1 1h4" /><path d="M20 6l2-2" />
    </svg>
  ),
  Landscape: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 20l6-10 4 6 3-4 5 8z" /><path d="M3 20h18" />
    </svg>
  ),
  Gift: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13" /><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8" /><path d="M16.5 8a2.5 2.5 0 0 0 0-5C14 3 12 8 12 8" />
    </svg>
  ),
  Diamond: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 3h12l4 6-10 12L2 9z" /><path d="M2 9h20" />
    </svg>
  ),
  Recycle: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 19H4.8a2 2 0 0 1-1.7-3l4-6.5" /><path d="M11 19h8.2a2 2 0 0 0 1.7-3l-1-1.6" />
      <path d="M13.5 5.5 17 4l1.5 3.5" /><path d="M8 15l-3 4 3 4" /><path d="M14 5l3-1 1 3" />
    </svg>
  ),
  Shield: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  Person: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  ),
  Truck: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1" y="6" width="14" height="11" rx="1" /><path d="M15 9h4l3 4v4h-7z" />
      <circle cx="6" cy="19" r="2" /><circle cx="17.5" cy="19" r="2" />
    </svg>
  ),
  Arrow: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Play: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M8 5v14l11-7z" /></svg>
  ),
  ChevronLeft: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="15 18 9 12 15 6" /></svg>
  ),
  ChevronRight: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="9 18 15 12 9 6" /></svg>
  ),
};

// A single floating decorative leaf - positioned via inline style so
// each placement can vary without new CSS classes per instance.
function FloatingLeaf({ style, size = 22, flip = false }) {
  return (
    <span className="abt-leaf" style={{ ...style, transform: `${style?.transform ?? ''} ${flip ? 'scaleX(-1)' : ''}` }} aria-hidden="true">
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C12 22 20 18 20 12V5l-8-3-8 3v7C4 18 12 22 12 22z" /></svg>
    </span>
  );
}

// Reveals its children with a fade/slide-up once scrolled into view.
// One shared IntersectionObserver-driven wrapper used by every section
// below - keeps the animation logic in one place instead of repeating
// it per section, and respects prefers-reduced-motion via CSS only
// (see .abt-reveal rules).
function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`abt-reveal ${visible ? 'abt-reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Animates a number counting up from 0 once its containing stat card
// scrolls into view. `value` is the numeric part; `suffix` (e.g. "+")
// is appended without animating.
function CountUp({ value, suffix = '', duration = 1200 }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - (1 - progress) * (1 - progress);
            setDisplay(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{display}{suffix}</span>;
}

// ---------------------------------------------------------------- Hero
function AboutHero({ data }) {
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
  const heading = h.heading || `${t('aboutPage.heroTitleLine1')}\n${t('aboutPage.heroTitleLine2')}`;
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
          <span className="abt-leaf" style={isEditorMode ? undefined : { top: '58%', left: '2%' }} aria-hidden="true">
            <DecorativeIconComp width={16} height={16} fill="currentColor" stroke="none" />
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
              {heading.split('\n').map((line, i) => (
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
}

// ------------------------------------------------------------ Our Story
function AboutStory({ data }) {
  const { t } = useLanguage();
  const { isEditorMode } = useVisualEditor();
  const s = data || {};

  const labelVisible = s.labelVisible !== false;
  const eyebrow = s.eyebrow || t('aboutPage.storyEyebrow');
  const headingVisible = s.headingVisible !== false;
  const heading = s.heading || `${t('aboutPage.storyTitleLine1')}\n${t('aboutPage.storyTitleLine2')}`;
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
              {heading.split('\n').map((line, i) => (
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
}

// ------------------------------------------------------------- Stats
function AboutStats({ data }) {
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
}

// ------------------------------------------------------ Vision & Mission
function AboutVisionMission({ data }) {
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
}

// ----------------------------------------------------------- What We Offer
function AboutOffer({ data }) {
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
}

// -------------------------------------------------------------- Values
function AboutValues({ data }) {
  const { t } = useLanguage();
  const { isEditorMode } = useVisualEditor();
  const v = data || {};
  const defaultItems = [
    { id: 1, icon: 'Diamond', label: 'Quality First', visible: true, order: 1 },
    { id: 2, icon: 'Users', label: 'Customer Focus', visible: true, order: 2 },
    { id: 3, icon: 'Recycle', label: 'Sustainability', visible: true, order: 3 },
    { id: 4, icon: 'Shield', label: 'Integrity', visible: true, order: 4 },
  ];
  const rawItems = v.items?.length ? v.items : defaultItems;
  const items = rawItems
    .filter((it) => it.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const valuesSchema = getSectionSchema('aboutValues');
  const scriptFields = valuesSchema.fieldGroups?.find((g) => g.key === 'script')?.fields;

  return (
    <Reveal as="section" className="abt-values">
      <div className="abt-values-media" style={{ position: 'relative' }}>
        <EditableElement sectionKey="aboutValues" field="image" type="image" label="Image" fill>
          <img src={v.image || PHOTO.soilMacro} alt={v.imageAlt || t('aboutPage.valuesImageAlt')} loading="lazy" />
        </EditableElement>
      </div>
      <div className="abt-values-copy">
        <EditableElement sectionKey="aboutValues" field="eyebrow" type="text" label="Section Label">
          <p className="eyebrow">{v.eyebrow || t('aboutPage.valuesEyebrow')}</p>
        </EditableElement>
        <EditableElement sectionKey="aboutValues" field="heading" type="text" label="Heading">
          <h2>{v.heading || t('aboutPage.valuesTitle')}</h2>
        </EditableElement>
        <EditableElement sectionKey="aboutValues" field="subtitle" type="text" label="Subtitle">
          <p className="abt-values-sub">{v.subtitle || t('aboutPage.valuesSub')}</p>
        </EditableElement>
        <div className="abt-values-row">
          {items.map((it) => {
            const VIcon = Icon[it.icon] || Icon.Diamond;
            const itemIndex = rawItems.indexOf(it);
            return (
              <CardHoverControls key={it.id} sectionKey="aboutValues" arrayField="items" index={itemIndex} itemLabel="Value">
                <div className="abt-value-item">
                  <span className="abt-value-icon"><VIcon /></span>
                  <span>{it.label}</span>
                </div>
              </CardHoverControls>
            );
          })}
        </div>
      </div>
      <EditableElement sectionKey="aboutValues" field="__script__" type="text_fields" label="Decorative Script Text" hideDelete fields={scriptFields}>
        <p className="abt-hero-script abt-values-script">
          {v.scriptLine1 || t('aboutPage.valuesScriptLine1')}<br />{v.scriptLine2 || t('aboutPage.valuesScriptLine2')}<br />{v.scriptLine3 || t('aboutPage.valuesScriptLine3')}<br />{v.scriptLine4 || t('aboutPage.valuesScriptLine4')}
        </p>
      </EditableElement>
    </Reveal>
  );
}

// ------------------------------------------------------------- Journey
function AboutJourney({ data }) {
  const { t } = useLanguage();
  const { isEditorMode } = useVisualEditor();
  const j = data || {};
  const defaultItems = [
    { id: 1, year: '2016', label: 'Our Beginning', image: PHOTO.journeyFirst, visible: true, order: 1 },
    { id: 2, year: '2018', label: 'First Nursery Expansion', image: PHOTO.journey[0], visible: true, order: 2 },
    { id: 3, year: '2020', label: 'Growing with Customers', image: PHOTO.journey[1], visible: true, order: 3 },
    { id: 4, year: '2022', label: 'Landscaping Projects', image: PHOTO.journey[2], visible: true, order: 4 },
    { id: 5, year: '2024', label: 'Modern Nursery', image: PHOTO.journey[3], visible: true, order: 5 },
  ];
  const rawItems = j.items?.length ? j.items : defaultItems;
  const items = rawItems
    .filter((it) => it.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  if (items.length === 0 && !isEditorMode) return null;

  return (
    <section className="abt-journey">
      <Reveal className="abt-journey-heading">
        <EditableElement sectionKey="aboutJourney" field="eyebrow" type="text" label="Section Label">
          <p className="eyebrow">{j.eyebrow || t('aboutPage.journeyEyebrow')}</p>
        </EditableElement>
        <EditableElement sectionKey="aboutJourney" field="heading" type="text" label="Heading">
          <h2>{j.heading || t('aboutPage.journeyTitle')}</h2>
        </EditableElement>
        <EditableElement sectionKey="aboutJourney" field="subtitle" type="text" label="Subtitle">
          <p className="abt-offer-sub">{j.subtitle || t('aboutPage.journeySub')}</p>
        </EditableElement>
      </Reveal>
      <div className="abt-journey-grid">
        {items.map((m, i) => {
          const itemIndex = rawItems.indexOf(m);
          return (
            <CardHoverControls key={m.id} sectionKey="aboutJourney" arrayField="items" index={itemIndex} itemLabel="Card">
              <Reveal className="abt-journey-card" delay={i * 80}>
                <div className="abt-journey-card-media">
                  <img src={m.image} alt={m.label} loading="lazy" />
                </div>
                <div className="abt-journey-card-body">
                  <span className="abt-journey-year">{m.year}</span>
                  <p className="abt-journey-label">{m.label}</p>
                </div>
              </Reveal>
            </CardHoverControls>
          );
        })}
      </div>
    </section>
  );
}

function AboutFinalCta({ data }) {
  const { t } = useLanguage();
  const { isEditorMode } = useVisualEditor();
  const c = data || {};
  const bg = c.backgroundImage || PHOTO.finalCta;
  
  const finalCtaSchema = getSectionSchema('aboutFinalCta');
  const buttonFields = finalCtaSchema.button?.fields;

  // The inline style handles the dark gradient overlay over the background image
  return (
    <Reveal as="section" className="abt-cta" style={{ backgroundImage: `linear-gradient(rgba(8,36,24,0.72), rgba(8,36,24,0.82)), url(${bg})` }}>
      <FloatingLeaf style={{ top: '14%', left: '8%' }} size={20} />
      <FloatingLeaf style={{ bottom: '16%', right: '10%' }} size={18} flip />
      <EditableElement sectionKey="aboutFinalCta" field="title" type="text" label="Heading">
        <h2>{c.title || t('aboutPage.ctaTitle')}</h2>
      </EditableElement>
      <EditableElement sectionKey="aboutFinalCta" field="text" type="text" label="Description">
        <p>{c.text || t('aboutPage.ctaText')}</p>
      </EditableElement>
      <EditableElement sectionKey="aboutFinalCta" field="__button__" type="text_fields" label="Button" hideDelete fields={buttonFields}>
        <Link to={c.buttonUrl || '/category/indoor-plants'} className="abt-btn abt-btn-light">{c.buttonText || t('aboutPage.ctaButton')} <Icon.Arrow /></Link>
      </EditableElement>
    </Reveal>
  );
}

const ABOUT_SECTION_COMPONENTS = {
  hero: AboutHero,
  story: AboutStory,
  stats: AboutStats,
  visionMission: AboutVisionMission,
  offer: AboutOffer,
  values: AboutValues,
  journey: AboutJourney,
  finalCta: AboutFinalCta,
};

// Sections that have been migrated off the shared, nested `aboutPage`
// object onto their own flat top-level siteContent key (Visual Editor
// convention - see siteContent.js). Add a section's key here once it
// gets the same treatment as Hero and Story.
const ABOUT_FLAT_SECTIONS = {
  hero: 'aboutHero',
  story: 'aboutStory',
  stats: 'aboutStats',
  visionMission: 'aboutVisionMission',
  offer: 'aboutOffer',
  values: 'aboutValues',
  journey: 'aboutJourney',
  finalCta: 'aboutFinalCta',
};

function About() {
  const { aboutPage, aboutHero, aboutStory, aboutStats, aboutVisionMission, aboutOffer, aboutValues, aboutJourney, aboutFinalCta } = useSiteContent();
  const ap = aboutPage || {};
  const flatData = { hero: aboutHero || {}, story: aboutStory || {}, stats: aboutStats || {}, visionMission: aboutVisionMission || {}, offer: aboutOffer || {}, values: aboutValues || {}, journey: aboutJourney || {}, finalCta: aboutFinalCta || {} };
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
}

export default About;
