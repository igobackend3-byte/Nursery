import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

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
  finalCta: '/images/about-us/17_final_cta_background.png',
};

// ---------------------------------------------------------------- Icons
// Small original line-icons, one stroke style throughout - no icon
// library, no stock art.
const Icon = {
  Leaf: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22C12 22 20 18 20 12V5l-8-3-8 3v7C4 18 12 22 12 22z" />
    </svg>
  ),
  Pot: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3" /><path d="M8 6h8l1.5 4h-11z" /><path d="M7 10l1.2 9.5a2 2 0 0 0 2 1.5h3.6a2 2 0 0 0 2-1.5L17 10" />
    </svg>
  ),
  Sprout: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12" /><path d="M12 12C12 7 8 5 4 5c0 5 3 7 8 7Z" /><path d="M12 12c0-5 4-7 8-7 0 5-3 7-8 7Z" />
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Eye: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Target: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" />
    </svg>
  ),
  Watering: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h11l6-4v8l-6-4" /><path d="M2 12v5a1 1 0 0 0 1 1h4" /><path d="M20 6l2-2" />
    </svg>
  ),
  Landscape: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 20l6-10 4 6 3-4 5 8z" /><path d="M3 20h18" />
    </svg>
  ),
  Gift: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13" /><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8" /><path d="M16.5 8a2.5 2.5 0 0 0 0-5C14 3 12 8 12 8" />
    </svg>
  ),
  Diamond: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l4 6-10 12L2 9z" /><path d="M2 9h20" />
    </svg>
  ),
  Recycle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 19H4.8a2 2 0 0 1-1.7-3l4-6.5" /><path d="M11 19h8.2a2 2 0 0 0 1.7-3l-1-1.6" />
      <path d="M13.5 5.5 17 4l1.5 3.5" /><path d="M8 15l-3 4 3 4" /><path d="M14 5l3-1 1 3" />
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  Person: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  ),
  Truck: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="6" width="14" height="11" rx="1" /><path d="M15 9h4l3 4v4h-7z" />
      <circle cx="6" cy="19" r="2" /><circle cx="17.5" cy="19" r="2" />
    </svg>
  ),
  Arrow: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Play: () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
  ),
  ChevronLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
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
function AboutHero() {
  const { t } = useLanguage();
  return (
    <section className="abt-hero">
      <FloatingLeaf style={{ top: '18%', left: '46%' }} size={20} />
      <FloatingLeaf style={{ top: '58%', left: '2%' }} size={16} flip />

      <div className="abt-hero-left">
        <p className="abt-breadcrumb"><Link to="/">{t('aboutPage.heroBreadcrumbHome')}</Link> <span>→</span> {t('aboutPage.heroBreadcrumbCurrent')}</p>
        <h1 className="abt-hero-title">{t('aboutPage.heroTitleLine1')}<br />{t('aboutPage.heroTitleLine2')}</h1>
        <p className="abt-hero-sub">{t('aboutPage.heroSub')}</p>
        <p className="abt-hero-desc">{t('aboutPage.heroDesc')}</p>
        <Link to="/category/indoor-plants" className="abt-btn abt-btn-primary">
          {t('aboutPage.heroCta')} <Icon.Arrow />
        </Link>
      </div>

      <div className="abt-hero-right">
        {/* "Green Spaces Happier Lives" is already composited into this
            reference image, so it isn't repeated as a separate overlay. */}
        <img src={PHOTO.greenhouse} alt={t('aboutPage.heroImageAlt')} loading="eager" />
      </div>
    </section>
  );
}

// ------------------------------------------------------------ Our Story
function AboutStory() {
  const { t } = useLanguage();
  return (
    <section className="abt-story">
      <FloatingLeaf style={{ top: '6%', left: '4%' }} size={18} />
      <FloatingLeaf style={{ bottom: '10%', right: '30%' }} size={16} flip />

      {/* The play button and "From Seed to Green" caption are already
          composited into this reference image. */}
      <Reveal className="abt-story-media">
        <img src={PHOTO.handWithPlant} alt={t('aboutPage.storyImageAlt')} loading="lazy" />
      </Reveal>

      <Reveal className="abt-story-copy" delay={120}>
        <p className="eyebrow">{t('aboutPage.storyEyebrow')}</p>
        <h2>{t('aboutPage.storyTitleLine1')}<br />{t('aboutPage.storyTitleLine2')}</h2>
        <p className="abt-story-text">{t('aboutPage.storyText')}</p>
        <Link to="/about" className="abt-btn abt-btn-primary abt-btn-sm">{t('aboutPage.storyCta')} <Icon.Arrow /></Link>
      </Reveal>
    </section>
  );
}

// ------------------------------------------------------------- Stats
function AboutStats() {
  const { t } = useLanguage();
  const stats = [
    { icon: 'Leaf', value: 10, suffix: '+', label: t('aboutPage.statYearsLabel') },
    { icon: 'Sprout', value: 5000, suffix: '+', label: t('aboutPage.statPlantsLabel') },
    { icon: 'Pot', value: 50, suffix: '+', label: t('aboutPage.statVarietiesLabel') },
    { icon: 'Users', value: 1000, suffix: '+', label: t('aboutPage.statCustomersLabel') },
  ];
  return (
    <Reveal as="section" className="abt-stats-wrap">
      <div className="abt-stats">
        {stats.map((s, i) => {
          const StatIcon = Icon[s.icon];
          return (
            <div className="abt-stat" key={s.icon}>
              <span className="abt-stat-icon"><StatIcon /></span>
              <strong><CountUp value={s.value} suffix={s.suffix} duration={1000 + i * 150} /></strong>
              <span className="abt-stat-label">{s.label}</span>
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}

// ------------------------------------------------------ Vision & Mission
function AboutVisionMission() {
  const { t } = useLanguage();
  return (
    <div className="abt-vm-grid">
      <Reveal className="abt-vm-card abt-vm-vision">
        <img className="abt-vm-media" src={PHOTO.vision} alt={t('aboutPage.visionImageAlt')} loading="lazy" />
        <span className="abt-vm-icon"><Icon.Eye /></span>
        <p className="eyebrow">{t('aboutPage.visionEyebrow')}</p>
        <h3>{t('aboutPage.visionTitle')}</h3>
        <p>{t('aboutPage.visionText')}</p>
      </Reveal>
      <Reveal className="abt-vm-card abt-vm-mission" delay={120}>
        <img className="abt-vm-media" src={PHOTO.mission} alt={t('aboutPage.missionImageAlt')} loading="lazy" />
        <span className="abt-vm-icon"><Icon.Target /></span>
        <p className="eyebrow">{t('aboutPage.missionEyebrow')}</p>
        <h3>{t('aboutPage.missionTitle')}</h3>
        <p>{t('aboutPage.missionText')}</p>
      </Reveal>
    </div>
  );
}

// ----------------------------------------------------------- What We Offer
function AboutOffer() {
  const { t } = useLanguage();
  const cards = [
    { titleKey: 'offerCard1Title', descKey: 'offerCard1Desc', icon: 'Leaf', image: PHOTO.offerIndoorOutdoor, to: '/category/indoor-plants' },
    { titleKey: 'offerCard2Title', descKey: 'offerCard2Desc', icon: 'Pot', image: PHOTO.offerPots, to: '/category/pots-planters' },
    { titleKey: 'offerCard3Title', descKey: 'offerCard3Desc', icon: 'Sprout', image: PHOTO.offerSeeds, to: '/category/seeds' },
    { titleKey: 'offerCard4Title', descKey: 'offerCard4Desc', icon: 'Watering', image: PHOTO.plantCare, to: '/category/plant-care' },
    { titleKey: 'offerCard5Title', descKey: 'offerCard5Desc', icon: 'Landscape', image: PHOTO.landscaping, to: '/landscaping' },
    { titleKey: 'offerCard6Title', descKey: 'offerCard6Desc', icon: 'Gift', image: PHOTO.corporateGifting, to: '/corporate-gifts' },
  ];

  return (
    <section className="abt-offer">
      <Reveal className="abt-offer-heading">
        <p className="eyebrow">{t('aboutPage.offerEyebrow')}</p>
        <h2>{t('aboutPage.offerTitle')}</h2>
        <p className="abt-offer-sub">{t('aboutPage.offerSub')}</p>
      </Reveal>
      <p className="abt-hero-script abt-offer-script">{t('aboutPage.offerScriptLine1')}<br />{t('aboutPage.offerScriptLine2')}<br />{t('aboutPage.offerScriptLine3')}</p>

      <div className="abt-offer-grid">
        {cards.map((c, i) => {
          const CardIcon = Icon[c.icon];
          const title = t(`aboutPage.${c.titleKey}`);
          return (
            <Reveal as={Link} to={c.to} className="abt-offer-card" key={c.titleKey} delay={i * 60}>
              <div className="abt-offer-card-media">
                <img src={c.image} alt={title} loading="lazy" />
              </div>
              <div className="abt-offer-card-body">
                <div className="abt-offer-card-text">
                  <h3><span className="abt-offer-card-icon"><CardIcon /></span>{title}</h3>
                  <p>{t(`aboutPage.${c.descKey}`)}</p>
                </div>
                <span className="abt-offer-card-arrow" aria-hidden="true"><Icon.Arrow /></span>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

// -------------------------------------------------------------- Values
function AboutValues() {
  const { t } = useLanguage();
  const values = [
    { icon: 'Diamond', labelKey: 'valueQualityFirst' },
    { icon: 'Users', labelKey: 'valueCustomerFocus' },
    { icon: 'Recycle', labelKey: 'valueSustainability' },
    { icon: 'Shield', labelKey: 'valueIntegrity' },
  ];
  return (
    <Reveal as="section" className="abt-values">
      <div className="abt-values-media">
        <img src={PHOTO.soilMacro} alt={t('aboutPage.valuesImageAlt')} loading="lazy" />
      </div>
      <div className="abt-values-copy">
        <p className="eyebrow">{t('aboutPage.valuesEyebrow')}</p>
        <h2>{t('aboutPage.valuesTitle')}</h2>
        <p className="abt-values-sub">{t('aboutPage.valuesSub')}</p>
        <div className="abt-values-row">
          {values.map((v) => {
            const VIcon = Icon[v.icon];
            return (
              <div className="abt-value-item" key={v.labelKey}>
                <span className="abt-value-icon"><VIcon /></span>
                <span>{t(`aboutPage.${v.labelKey}`)}</span>
              </div>
            );
          })}
        </div>
      </div>
      <p className="abt-hero-script abt-values-script">
        {t('aboutPage.valuesScriptLine1')}<br />{t('aboutPage.valuesScriptLine2')}<br />{t('aboutPage.valuesScriptLine3')}<br />{t('aboutPage.valuesScriptLine4')}
      </p>
    </Reveal>
  );
}

// -------------------------------------------------------- Why Choose Us
function AboutWhyChoose() {
  const { t } = useLanguage();
  const whyChoose = [
    { icon: 'Leaf', titleKey: 'whyItem1Title', textKey: 'whyItem1Text' },
    { icon: 'Person', titleKey: 'whyItem2Title', textKey: 'whyItem2Text' },
    { icon: 'Recycle', titleKey: 'whyItem3Title', textKey: 'whyItem3Text' },
    { icon: 'Truck', titleKey: 'whyItem4Title', textKey: 'whyItem4Text' },
  ];
  return (
    <section className="abt-why">
      <Reveal className="abt-why-heading">
        <p className="eyebrow">{t('aboutPage.whyEyebrow')}</p>
        <h2>{t('aboutPage.whyTitle')}</h2>
        <p className="abt-offer-sub">{t('aboutPage.whySub')}</p>
      </Reveal>
      <div className="abt-why-grid">
        {whyChoose.map((item, i) => {
          const WIcon = Icon[item.icon];
          return (
            <Reveal className="abt-why-item" key={item.titleKey} delay={i * 80}>
              <span className="abt-why-icon"><WIcon /></span>
              <h4>{t(`aboutPage.${item.titleKey}`)}</h4>
              <p>{t(`aboutPage.${item.textKey}`)}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

// ------------------------------------------------------------- Journey
function AboutJourney() {
  const { t } = useLanguage();

  const milestones = [
    { year: '2016', labelKey: 'journeyLabel1', image: PHOTO.journeyFirst },
    { year: '2018', labelKey: 'journeyLabel2', image: PHOTO.journey[0] },
    { year: '2020', labelKey: 'journeyLabel3', image: PHOTO.journey[1] },
    { year: '2022', labelKey: 'journeyLabel4', image: PHOTO.journey[2] },
    { year: '2024', labelKey: 'journeyLabel5', image: PHOTO.journey[3] },
  ];

  return (
    <section className="abt-journey">
      <Reveal className="abt-journey-heading">
        <p className="eyebrow">{t('aboutPage.journeyEyebrow')}</p>
        <h2>{t('aboutPage.journeyTitle')}</h2>
        <p className="abt-offer-sub">{t('aboutPage.journeySub')}</p>
      </Reveal>
      <div className="abt-journey-grid">
        {milestones.map((m, i) => (
          <Reveal className="abt-journey-card" key={m.year} delay={i * 80}>
            <div className="abt-journey-card-media">
              <img src={m.image} alt={t(`aboutPage.${m.labelKey}`)} loading="lazy" />
            </div>
            <div className="abt-journey-card-body">
              {/* The year itself is a date, not translated text. */}
              <span className="abt-journey-year">{m.year}</span>
              <p className="abt-journey-label">{t(`aboutPage.${m.labelKey}`)}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ------------------------------------------------------------- Final CTA
function AboutFinalCta() {
  const { t } = useLanguage();
  return (
    <Reveal as="section" className="abt-cta" style={{ backgroundImage: `linear-gradient(rgba(8,36,24,0.72), rgba(8,36,24,0.82)), url(${PHOTO.finalCta})` }}>
      <FloatingLeaf style={{ top: '14%', left: '8%' }} size={20} />
      <FloatingLeaf style={{ bottom: '16%', right: '10%' }} size={18} flip />
      <h2>{t('aboutPage.ctaTitle')}</h2>
      <p>{t('aboutPage.ctaText')}</p>
      <Link to="/category/indoor-plants" className="abt-btn abt-btn-light">{t('aboutPage.ctaButton')} <Icon.Arrow /></Link>
    </Reveal>
  );
}

function About() {
  return (
    <div className="abt-page">
      <AboutHero />
      <AboutStory />
      <AboutStats />
      <AboutVisionMission />
      <AboutOffer />
      <AboutValues />
      <AboutWhyChoose />
      <AboutJourney />
      <AboutFinalCta />
    </div>
  );
}

export default About;
