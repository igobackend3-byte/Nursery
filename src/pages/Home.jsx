import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import OffersSection from '../components/OffersSection';
import { useCatalogue } from '../context/CatalogueContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useSiteContent } from '../hooks/useSiteContent';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedCategoryLabel, getLocalizedProductName } from '../utils/localizedContent';
import { CATEGORY_LABEL_TRANSLATIONS } from '../data/categoryTranslations';
import { getDiscountPercent } from '../utils/pricing';
import { getHeroFieldTranslation, getGardenServiceTranslation, getBlogPostTranslation, getJourneyStepTranslation, getCompareHeaderTranslation, getCompareTitleTranslation, getCompareRowTranslation, getTrustBadgeTranslation, getStatsStripTranslation } from '../i18n/translations';
import { getJustInProducts } from '../utils/seededShuffle';
import DecorativeLeaves from '../components/DecorativeLeaves';
import SectionVine from '../components/SectionVine';
import DecorativeFlowers from '../components/DecorativeFlowers';
import DecorativePetals from '../components/DecorativePetals';
import DecorativeGlow from '../components/DecorativeGlow';
import ComparisonSection from '../components/ComparisonSection';
import TrustBenefits from '../components/TrustBenefits';

// `stat`/`statLabel` split out only for the metric card, so "99.2%" can be
// styled as a standalone accent number instead of plain heading text.
// `key` maps to whyIgo.title{Key}/desc{Key} in src/i18n/translations.js.
// `image` is matched by filename from the user-supplied "Grown with data,
// delivered with care" folder - a card with no `image` keeps the original
// icon badge instead of a broken/missing photo.
const WHY_IGO = [
  { icon: 'wifi', key: 'Iot', image: '/images/why-igo/iot-monitored-nurseries.png' },
  { icon: 'flask', key: 'Precision', image: '/images/why-igo/precision-trials.png' },
  { icon: 'shield', stat: '99.2%', key: 'Guarantee', featured: true, image: '/images/why-igo/health-guarantee.png' },
  { icon: 'headset', key: 'Expert', image: '/images/why-igo/expert-plant-care-guidance.png' },
];

// Small original line-icon set (matches the stroke-icon style already used
// in the header/nav) - no icon library dependency added.
const WHY_IGO_ICONS = {
  wifi: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 8.5a16 16 0 0 1 20 0" />
      <path d="M5 12.5a11 11 0 0 1 14 0" />
      <path d="M8.5 16.3a6 6 0 0 1 7 0" />
      <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  flask: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6" />
      <path d="M10 3v6.4L4.7 18a2 2 0 0 0 1.7 3h11.2a2 2 0 0 0 1.7-3L14 9.4V3" />
      <path d="M7.5 15h9" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.5 4.5 5.5v5.6c0 5 3.2 8.3 7.5 10.4 4.3-2.1 7.5-5.4 7.5-10.4V5.5z" />
      <path d="M8.7 12.2l2.3 2.3 4.3-4.5" />
    </svg>
  ),
  headset: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 14v-2a8.5 8.5 0 0 1 17 0v2" />
      <rect x="3" y="14" width="4" height="6.5" rx="2" />
      <rect x="17" y="14" width="4" height="6.5" rx="2" />
    </svg>
  ),
};



// `key` maps to faq.q{Key}/a{Key} in src/i18n/translations.js.
const FAQS = [
  { key: 'Packaging' },
  { key: 'Guarantee' },
  { key: 'Help' },
  { key: 'Separate' },
  { key: 'Delivery' },
  { key: 'Cod' },
];

function Hero() {
  const { hero } = useSiteContent();
  const { language } = useLanguage();
  const t = (v) => getHeroFieldTranslation(v, language);
  return (
    <section className="hero-section">
      <video
        className="hero-video"
        src={hero.videoUrl || undefined}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="hero-video-overlay" aria-hidden="true" />
      <DecorativeLeaves variant="hero" count={2} />
      <div className="hero-content">
        <div className="tag">
          <div className="tag-dot"></div>
          {t(hero.tag)}
        </div>
        <h1 className="hero-title">
          {t(hero.titleLine1)}<br />
          <span className="highlight-text">{t(hero.titleLine2)}</span>
          <svg style={{ display: 'inline-block', marginLeft: '12px' }} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-lime)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22C12 22 20 18 20 12V5l-8-3-8 3v7C4 18 12 22 12 22z"></path>
          </svg>
        </h1>
        <p className="hero-description">
          {t(hero.description)}
        </p>
        <div className="hero-buttons">
          <button type="button" className="btn btn-primary">
            {t(hero.primaryButtonText)}
          </button>
          <Link to={hero.secondaryButtonLink} className="btn btn-secondary">
            {t(hero.secondaryButtonText)}
          </Link>
        </div>
      </div>
    </section>
  );
}

// About Us teaser - the same real "aboutStory" copy used on the /about
// page (see pages.aboutStory in i18n/translations.js), not new/invented
// text. Greening-Wonders-style placement (early on the page, right after
// Hero) but IGO's own green/white/black brand colors, not their teal.
function AboutIgo() {
  const { t } = useLanguage();
  const [ref, visible] = useScrollReveal(0.15);
  const { ourStory } = useSiteContent();

  if (ourStory && ourStory.visible === false) return null;

  // Split the heading into two parts for styling, fallback to full string if no comma
  const headingStr = t('home.whyIgoHeading');
  const splitIndex = headingStr.indexOf(',');
  const fallbackPart1 = splitIndex !== -1 ? headingStr.substring(0, splitIndex + 1) : headingStr;
  const fallbackPart2 = splitIndex !== -1 ? headingStr.substring(splitIndex + 1).trim() : '';

  const smallHeading = ourStory?.smallHeading || t('pages.ourStory');
  const headingPart1 = ourStory?.mainHeadingPart1 || fallbackPart1;
  const headingPart2 = ourStory?.mainHeadingPart2 ?? fallbackPart2;
  const description = ourStory?.description || t('pages.aboutStory');
  const buttonText = ourStory?.buttonText || t('home.discoverMore');
  const buttonUrl = ourStory?.buttonUrl || '/about';

  const sectionStyle = {};
  if (ourStory?.backgroundImage) {
    sectionStyle.backgroundImage = `linear-gradient(rgba(255,255,255,${ourStory.overlayOpacity ?? 0.5}), rgba(255,255,255,${ourStory.overlayOpacity ?? 0.5})), url(${ourStory.backgroundImage})`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
  }
  if (ourStory?.backgroundColor) sectionStyle.backgroundColor = ourStory.backgroundColor;
  if (ourStory?.paddingY) sectionStyle.paddingTop = sectionStyle.paddingBottom = ourStory.paddingY;

  const headingStyle = ourStory?.fontSize ? { fontSize: ourStory.fontSize } : undefined;
  const darkStyle = ourStory?.textColor ? { color: ourStory.textColor } : undefined;
  const lightStyle = ourStory?.accentColor ? { color: ourStory.accentColor } : undefined;

  const animate = ourStory?.animation !== false;

  return (
    <section
      ref={ref}
      className={`about-igo-section${animate ? ' reveal-section' : ''}${!animate || visible ? ' is-visible' : ''}`}
      style={sectionStyle}
    >
      <div className="about-igo-copy">
        <div className="about-igo-eyebrow-wrapper">
          <span className="eyebrow-line"></span>
          <p className="eyebrow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="eyebrow-icon">
              <path d="M17.4,5.4C14.7,2.7,10.6,2,7.3,3.7C5,5,3.7,7.4,3.7,10c0,2.3,1.1,4.5,2.9,6c-0.6,1.4-1.6,2.6-2.9,3.6c-0.3,0.2-0.3,0.7,0,1 c0.2,0.2,0.6,0.3,0.9,0.1c4.8-3.3,7.6-6,9.1-8.5c2.1-3.6,1.9-8.1,0.2-10.7C13.2,1,16.5,2.1,19.2,4.8C20,5.6,20,6.9,19.2,7.7l-4.2,4.2 c-0.4,0.4-1,0.4-1.4,0c-0.4-0.4-0.4-1,0-1.4l4.2-4.2C18.2,5.9,17.8,5.8,17.4,5.4z"/>
            </svg>
            {smallHeading}
          </p>
          <span className="eyebrow-line"></span>
        </div>

        <h2 style={headingStyle}>
          <span className="heading-dark" style={darkStyle}>{headingPart1}</span>
          {headingPart2 && <br />}
          {headingPart2 && <span className="heading-light" style={lightStyle}>{headingPart2}</span>}
        </h2>

        <p className="about-igo-text">{description}</p>

        <Link to={buttonUrl} className="btn-discover-more">
          {buttonText}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '8px'}}>
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </Link>
      </div>
    </section>
  );
}

// One clean white line-icon per category (matches the site's existing
// stroke-icon language - strokeWidth 1.8-2, round caps/joins - not a
// generic/unrelated icon set).
function CatIconPottedPlant() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 14V6" />
      <path d="M12 10c0-4-3-6-7-6 0 4 2 6.5 7 6Z" />
      <path d="M12 8c0-3.2 2.4-5 6-5 0 3.4-1.8 5.4-6 5Z" />
      <path d="M6 14h12l-1.4 6.2a2 2 0 0 1-2 1.8h-5.2a2 2 0 0 1-2-1.8L6 14Z" />
    </svg>
  );
}
function CatIconTree() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4.5" r="2" />
      <path d="M12 8v13" />
      <path d="M7 22h10" />
      <path d="M12 12c-3-1-5 .5-6 3 3 1.5 5.5.5 6-1.5" />
      <path d="M12 15c3-1 5 .5 6 3-3 1.5-5.5.5-6-1.5" />
    </svg>
  );
}
function CatIconFlower() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2.4" />
      <circle cx="12" cy="6" r="2.6" />
      <circle cx="17.2" cy="9.5" r="2.6" />
      <circle cx="15" cy="16" r="2.6" />
      <circle cx="9" cy="16" r="2.6" />
      <circle cx="6.8" cy="9.5" r="2.6" />
      <path d="M12 20v-6" />
    </svg>
  );
}
function CatIconFruit() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5c1-2 3-2.5 4-2" />
      <path d="M8.5 8C5.5 8 4 10.5 4 13.5 4 17.5 7 21 9.5 21c1 0 1.7-.5 2.5-.5s1.5.5 2.5.5c2.5 0 5.5-3.5 5.5-7.5 0-3-1.5-5.5-4.5-5.5-1.3 0-2.2.5-3 .5s-1.7-.5-3-.5Z" />
    </svg>
  );
}
function CatIconVegetable() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 3c2 0 3.5 1.5 3.5 3.5" />
      <path d="M10.5 5.5 13 3l1.5 1.5" />
      <path d="M13.5 8c3 0 5.5 2.5 5.5 6 0 4.5-4 8-7 8s-7-3.5-7-8c0-4 2.7-6.5 6-6.5.9 0 1.7.2 2.5.5Z" />
    </svg>
  );
}
function CatIconSeed() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3h14l-1 12a6 6 0 0 1-12 0L5 3Z" />
      <path d="M5 8h14" />
      <ellipse cx="12" cy="14" rx="2.2" ry="3" />
    </svg>
  );
}
function CatIconPot() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 8h14l-1.6 11.2a2 2 0 0 1-2 1.8H8.6a2 2 0 0 1-2-1.8L5 8Z" />
      <path d="M3.5 8h17" />
      <path d="M9 8V6.5A3 3 0 0 1 12 3.5a3 3 0 0 1 3 2.5V8" />
    </svg>
  );
}
function CatIconWateringCan() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10h11a3 3 0 0 1 0 6H8" />
      <path d="M3 10v6a2 2 0 0 0 2 2h3" />
      <path d="M3 10V7a1 1 0 0 1 1-1h6l3-2" />
      <path d="M17 8l4-1.5M18 11l3.5 1M17.5 5.5 20 4" />
    </svg>
  );
}
function CatIconLandscape() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20 8 9l4 6 2-3 8 8" />
      <circle cx="17" cy="6" r="2" />
    </svg>
  );
}
function CatIconDecor() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v5" />
      <circle cx="12" cy="11" r="3.5" />
      <path d="M8 21c0-3 1.8-5 4-5s4 2 4 5" />
    </svg>
  );
}
function CatIconBox() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8l9-4 9 4-9 4-9-4Z" /><path d="M3 8v9l9 4 9-4V8" /><path d="M12 12v9" />
    </svg>
  );
}
function CatIconGift() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8" />
      <path d="M16.5 8a2.5 2.5 0 0 0 0-5C14 3 12 8 12 8" />
    </svg>
  );
}

function CatIconCare() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3s7 3 7 9a7 7 0 0 1-14 0c0-6 7-9 7-9Z" />
      <path d="M12 21v-8" />
      <path d="M12 13c-2 0-3.5-1.5-3.5-3.5M12 12c2 0 3.5-1.5 3.5-3.5" />
    </svg>
  );
}
function CatIconTools() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 3.5 20 9l-2.5 2.5L12 6z" />
      <path d="m12 6-8 8v6h6l8-8" />
      <path d="M4.5 12.5 8 16" />
    </svg>
  );
}
function CatIconSupport() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21V4M16 21V6" />
      <path d="M8 9c3 0 5-1.5 8-3M8 14c3 0 5-1.5 8-3" />
      <path d="M5 21h14" />
    </svg>
  );
}
function CatIconStones() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="8" cy="16" rx="5" ry="3.5" />
      <ellipse cx="16.5" cy="17" rx="4" ry="2.8" />
      <ellipse cx="13" cy="9.5" rx="4.5" ry="3.3" />
    </svg>
  );
}

function CatIconBulb() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.8.8 1.3 1.6 1.5 2.5h5c.2-.9.7-1.7 1.5-2.5A6 6 0 0 0 12 3Z" />
    </svg>
  );
}

// A single soft leaf used for the heading flourishes and the corner
// botanical decoration - kept local to this section.
function SbcLeaf({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M40 6c0 18-10 30-26 32C12 22 22 10 40 6Z" fill="currentColor" opacity="0.9" />
      <path d="M40 6C28 14 20 24 14 38" stroke="#fff" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" />
      <path d="M31 12c-6 2-10 6-13 12M35 20c-5 1-9 4-12 9" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

// Categories for this section. Each entry is data-driven: `slug` resolves
// to a real /category/<slug> listing (an UMBRELLA_GROUPS key aggregates
// several real product categories into one focused listing) or the site's
// /gifting route. No fabricated categories/products/images.
//
// `image` is the tile artwork. It is set explicitly here (from
// /public/images/shop-by-category/) so the homepage tile always uses the
// matched local photo and does not depend on the live `categories`
// collection, whose docs may still carry older placeholder URLs. Order,
// labels, links and icons are unchanged. Tiles with no matching file in
// the folder keep their existing fallback (category banner / catalogue
// image) and are left without an `image` override.
const SHOP_CATEGORIES_V2 = [
  { label: 'Indoor Plants', slug: 'indoor-plants', to: '/category/indoor-plants', Icon: CatIconPottedPlant },
  { label: 'Outdoor Plants', slug: 'outdoor-plants', to: '/category/outdoor-plants', Icon: CatIconTree },
  { label: 'Seeds', slug: 'seeds', to: '/category/seeds', Icon: CatIconSeed, image: '/images/shop-by-category/seeds.png' },
  { label: 'Plant Care', slug: 'plant-care', to: '/category/plant-care', Icon: CatIconCare, image: '/images/shop-by-category/plant-care.png' },
  { label: 'Garden Tools', slug: 'gardening-tools', to: '/category/gardening-tools', Icon: CatIconTools, image: '/images/shop-by-category/gardening-tools.png' },
  { label: 'Plant Support', slug: 'plant-support', to: '/category/plant-support', Icon: CatIconSupport, image: '/images/shop-by-category/plant-support.png' },
  { label: 'Irrigation & Watering', slug: 'irrigation-watering', to: '/category/irrigation-watering', Icon: CatIconWateringCan, image: '/images/shop-by-category/irrigation-watering.png' },
  { label: 'Lawn & Landscaping', slug: 'lawn-landscaping', to: '/category/lawn-landscaping', Icon: CatIconLandscape, image: '/images/shop-by-category/lawn-landscaping.png' },
  { label: 'Garden Décor', slug: 'garden-decor', to: '/category/garden-decor', Icon: CatIconDecor, image: '/images/shop-by-category/garden-decor.png' },
  { label: 'Decorative Stones & Mulch', slug: 'decorative-stones-mulch', to: '/category/decorative-stones-mulch', Icon: CatIconStones, image: '/images/shop-by-category/decorative-stones-mulch.png' },
  { label: 'Gifting', slug: 'gifting', to: '/gifting', Icon: CatIconGift, image: '/images/shop-by-category/gifting.png' },

  // Grouped non-plant ranges (see UMBRELLA_GROUPS in data/products.js).
  // `image` is set here so the tile art is guaranteed even before these
  // umbrella categories exist in the live categories collection.
  { label: 'Garden & Landscaping Lighting', slug: 'garden-landscaping-lighting', to: '/category/garden-landscaping-lighting', Icon: CatIconBulb, image: '/images/shop-by-category/smart-garden-tech.png' },
  { label: 'Hand Tools & Lawn Equipment', slug: 'hand-tools-lawn-equipment', to: '/category/hand-tools-lawn-equipment', Icon: CatIconTools, image: '/images/shop-by-category/lawn-landscaping.png' },
  { label: 'Fertilizer, Biofertilizer & Crop Protection', slug: 'fertilizer-crop-protection', to: '/category/fertilizer-crop-protection', Icon: CatIconCare, image: 'https://images.unsplash.com/photo-1502394202744-021cfbb17454?q=80&w=800&auto=format&fit=crop' },
  { label: 'Cement, Wooden & Bonsai Planters', slug: 'cement-wooden-bonsai-planters', to: '/category/cement-wooden-bonsai-planters', Icon: CatIconPot, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=800&auto=format&fit=crop' },
  { label: 'Décor & Fairy-Garden Ornaments', slug: 'decor-fairy-garden', to: '/category/decor-fairy-garden', Icon: CatIconDecor, image: '/images/shop-by-category/garden-decor.png' },
  { label: 'Plant Support, Trellis & Staking', slug: 'plant-support-trellis-staking', to: '/category/plant-support-trellis-staking', Icon: CatIconSupport, image: '/images/shop-by-category/plant-support.png' },
  { label: 'Self-Watering & Railing Planters', slug: 'self-watering-railing-planters', to: '/category/self-watering-railing-planters', Icon: CatIconPot, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=800&auto=format&fit=crop' },
];

// A handful of the supplied photos (see /public/images/shop-by-category/)
// already have a title, icon and "Explore" button baked into the artwork
// itself. For those specific files, skip this component's own text/icon/
// button overlay - rendering both was producing duplicated category names
// on the card. Every other tile keeps the normal overlay untouched.
const PRECOMPOSED_TILE_IMAGES = new Set([
  '/images/shop-by-category/seeds.png',
  '/images/shop-by-category/plant-care.png',
  '/images/shop-by-category/gardening-tools.png',
  '/images/shop-by-category/plant-support.png',
  '/images/shop-by-category/irrigation-watering.png',
  '/images/shop-by-category/lawn-landscaping.png',
  '/images/shop-by-category/garden-decor.png',
  '/images/shop-by-category/decorative-stones-mulch.png',
  '/images/shop-by-category/gifting.png',
]);

function ShopByCategory() {
  const { categories, getGiftProducts } = useCatalogue();
  const { t, language } = useLanguage();
  const [ref, visible] = useScrollReveal(0.1);
  const { shopByCategory: sbc } = useSiteContent();
  // 'gifting' is a real route (see App.jsx) but has no entry in the
  // categories collection - fall back to a real gift-tagged product
  // photo, the same source the homepage's own GiftingBand uses.
  const giftImage = getGiftProducts()[0]?.image;

  if (sbc && sbc.visible === false) return null;

  const title = sbc?.title || t('home.shopByCategory');
  const subtitle = sbc?.subtitle || t('home.shopByCategorySub');

  // The admin's tile list (add/delete/reorder/hide) is the source of truth
  // for WHICH tiles exist and in what order - SHOP_CATEGORIES_V2 is only
  // consulted per-slug for its icon/route/fallback image. A tile the admin
  // adds with no matching static entry gets a generic icon and a
  // /category/<slug> route.
  const staticBySlug = new Map(SHOP_CATEGORIES_V2.map((entry) => [entry.slug, entry]));
  const tiles = sbc?.tiles?.length ? sbc.tiles : SHOP_CATEGORIES_V2.map((entry, i) => ({ ...entry, order: i, visible: true }));
  const orderedEntries = tiles
    .filter((tile) => tile.visible !== false)
    .sort((a, b) => a.order - b.order)
    .map((tile) => {
      const staticEntry = staticBySlug.get(tile.slug);
      return {
        entry: staticEntry ?? { slug: tile.slug, to: `/category/${tile.slug}`, Icon: CatIconPottedPlant },
        override: tile,
      };
    });

  const sectionStyle = {};
  if (sbc?.backgroundColor) sectionStyle.backgroundColor = sbc.backgroundColor;
  if (sbc?.paddingY) sectionStyle.paddingTop = sectionStyle.paddingBottom = sbc.paddingY;
  const headingStyle = {};
  if (sbc?.fontSize) headingStyle.fontSize = sbc.fontSize;
  if (sbc?.textColor) headingStyle.color = sbc.textColor;
  const animate = sbc?.animation !== false;

  return (
    <section id="shop-by-category" ref={ref} className={`shop-by-category shop-by-category-v2${animate ? ' reveal-section' : ''}${!animate || visible ? ' is-visible' : ''}`} style={sectionStyle}>
      <div className="sbc-heading">
        <h2 style={headingStyle}>
          <SbcLeaf className="sbc-heading-leaf sbc-heading-leaf-left" />
          {title}
          <SbcLeaf className="sbc-heading-leaf sbc-heading-leaf-right" />
        </h2>
        <p className="section-sub sbc-sub-shift">{subtitle}</p>
      </div>

      <div className="category-grid">
        {orderedEntries.map(({ entry, override }) => {
          const cat = categories.find((c) => c.slug === entry.slug);
          const image = override?.image || entry.image || cat?.image || (entry.slug === 'gifting' ? giftImage : undefined);
          const { Icon } = entry;
          // Always read the display name from the local, static translation
          // table by slug (not from the live `categories` doc, which may
          // not carry a `translations` field) - falls back to the English
          // label automatically when a language has no entry yet. An admin
          // override (any language) wins over both.
          const localizedLabel = override?.label || CATEGORY_LABEL_TRANSLATIONS[entry.slug]?.[language] || entry.label;
          const exploreText = override?.exploreText || t('home.explore');
          // A few supplied photos already have an (English-only, baked-in)
          // title/icon/Explore button printed into the artwork. Since that
          // text can never change with the site language, always draw our
          // own translatable overlay on top and darken the image enough
          // there to fully hide the baked-in text underneath it.
          const isPrecomposed = PRECOMPOSED_TILE_IMAGES.has(image);
          return (
            <Link to={entry.to} key={entry.slug} className="cat-card">
              <span className="cat-card-media">
                <img src={image} alt="" className="cat-card-img" />
                <span className={`cat-card-scrim${isPrecomposed ? ' cat-card-scrim-solid' : ''}`} aria-hidden="true" />
                <span className="cat-card-content">
                  <span className="cat-card-icon" aria-hidden="true"><Icon /></span>
                  <span className="cat-card-title">{localizedLabel}</span>
                  <span className="cat-card-explore">{exploreText}</span>
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- Plants for every corner of your home
function SofaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" />
      <path d="M2.5 12h19a.5.5 0 0 1 .5.5V16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3.5a.5.5 0 0 1 .5-.5Z" />
      <path d="M4 17v2M20 17v2" />
    </svg>
  );
}
function BedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6" />
      <path d="M3 18h18" />
      <path d="M4 10V7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
      <path d="M14 10V8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M3 21v-3M21 21v-3" />
    </svg>
  );
}
function BalconyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="9" rx="1" />
      <path d="M8 3v9M16 3v9" />
      <path d="M4 20v-6M20 20v-6M3 20h18" />
    </svg>
  );
}
function OfficeChairIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="3" width="10" height="7" rx="2" />
      <path d="M9 10v3h6v-3" />
      <path d="M12 13v4" />
      <path d="M8 21l4-3 4 3" />
      <path d="M6 20h12" />
    </svg>
  );
}

// Photos are real project photography (see project images folder), not
// placeholders - each cropped/compressed to a consistent card aspect ratio.
const HOME_CORNERS = [
  { key: 'livingRoom', location: 'Living Room', image: '/images/home-corners/living-room.jpg', Icon: SofaIcon },
  { key: 'bedroom', location: 'Bedroom', image: '/images/home-corners/bedroom.jpg', Icon: BedIcon },
  { key: 'balcony', location: 'Balcony', image: '/images/home-corners/balcony.jpg', Icon: BalconyIcon },
  { key: 'office', location: 'Office', image: '/images/home-corners/office.jpg', Icon: OfficeChairIcon },
];

const HOME_CORNER_ICONS = { sofa: SofaIcon, bed: BedIcon, balcony: BalconyIcon, officeChair: OfficeChairIcon };

function HomeCorners() {
  const { t } = useLanguage();
  const [ref, visible] = useScrollReveal(0.1);
  const { homeCorners: hc } = useSiteContent();

  if (hc && hc.visible === false) return null;

  const title = hc?.title || t('home.cornersHeading');
  const subtitle = hc?.subtitle;
  const cards = hc?.cards?.length
    ? [...hc.cards].filter((c) => c.visible !== false).sort((a, b) => a.order - b.order)
    : HOME_CORNERS.map((c, i) => ({
        id: c.key, title: t(`home.corner${c.key.charAt(0).toUpperCase()}${c.key.slice(1)}`), image: c.image,
        icon: c.key === 'livingRoom' ? 'sofa' : c.key === 'bedroom' ? 'bed' : c.key, buttonText: t('offers.shopNow'),
        buttonLink: `/category/indoor-plants?location=${encodeURIComponent(c.location)}`, order: i,
      }));

  const sectionStyle = {};
  if (hc?.backgroundImage) {
    sectionStyle.backgroundImage = `url(${hc.backgroundImage})`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
  }

  return (
    <section ref={ref} className={`home-corners reveal-section${visible ? ' is-visible' : ''}`} style={sectionStyle}>
      <DecorativeGlow variant="corners" />
      <DecorativeLeaves variant="category" count={4} />
      <DecorativeFlowers variant="category" count={3} />

      <div className="home-corners-heading">
        <span className="home-corners-leaf home-corners-leaf-left" aria-hidden="true"><SproutIcon /></span>
        <h2>{title}</h2>
        <span className="home-corners-leaf home-corners-leaf-right" aria-hidden="true"><SproutIcon /></span>
      </div>
      {subtitle && <p className="section-sub" style={{ textAlign: 'center', marginTop: -8 }}>{subtitle}</p>}
      <div className="home-corners-grid">
        {cards.map((card) => {
          const CardIcon = HOME_CORNER_ICONS[card.icon] || SofaIcon;
          return (
            <Link to={card.buttonLink} className="home-corner-card" key={card.id}>
              <div className="home-corner-media">
                <img src={card.image} alt={card.title} loading="lazy" />
              </div>
              <span className="home-corner-icon"><CardIcon /></span>
              <h3>{card.title}</h3>
              <span className="home-corner-cta">{card.buttonText}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// Custom play/pause overlay for the autoplaying, muted background video -
// the video itself has no native controls (cleaner look), this button is
// the only way to pause/resume it.
function CompleteGardenVideo({ cg }) {
  const videoRef = useRef(null);
  const autoplay = cg?.videoAutoplay !== false;
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const src = cg?.videoUrl || '/videos/garden-journey.mp4';
  const loop = cg?.videoLoop !== false;
  const muted = cg?.videoMuted !== false;
  const showToggle = cg?.videoShowToggle !== false;

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play();
    else video.pause();
  }

  return (
    <div className="complete-garden-media complete-garden-video-wrap">
      <video
        ref={videoRef}
        className="complete-garden-video"
        src={src}
        poster={cg?.videoPoster || undefined}
        autoPlay={autoplay}
        muted={muted}
        loop={loop}
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      {showToggle && (
        <button
          type="button"
          className="complete-garden-video-toggle"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
      )}
    </div>
  );
}

function CompleteGarden() {
  const { t } = useLanguage();
  const [ref, visible] = useScrollReveal(0.15);
  const { completeGarden: cg } = useSiteContent();

  if (cg && cg.visible === false) return null;

  const heading = cg?.heading || t('home.completeGardenHeading');
  const description = cg?.description || t('home.completeGardenDesc');
  const defaultPills = [
    { id: 1, icon: '🌱', text: t('home.pillYourPlant'), visible: true, order: 1 },
    { id: 2, icon: '🪴', text: t('home.pillRightPot'), visible: true, order: 2 },
    { id: 3, icon: '🌾', text: t('home.pillGrowingMix'), visible: true, order: 3 },
    { id: 4, icon: '💧', text: t('home.pillPlantNutrition'), visible: true, order: 4 },
  ];
  // Pills used to be plain strings (e.g. "🌱 Your plant") - normalize either
  // shape so an older saved list still renders correctly.
  const pills = (cg?.pills?.length ? cg.pills : defaultPills)
    .map((p, i) => (typeof p === 'string' ? { id: i, icon: '', text: p, visible: true, order: i } : p))
    .filter((p) => p.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const buttonText = cg?.buttonText || t('home.buildYourGarden');
  const buttonUrl = cg?.buttonUrl || '/category/pots-planters';
  const buttonVisible = cg?.buttonVisible !== false;

  const sectionStyle = {};
  if (cg?.backgroundColor) sectionStyle.backgroundColor = cg.backgroundColor;
  if (cg?.paddingY) sectionStyle.paddingTop = sectionStyle.paddingBottom = cg.paddingY;
  const headingStyle = {};
  if (cg?.fontSize) headingStyle.fontSize = cg.fontSize;
  if (cg?.textColor) headingStyle.color = cg.textColor;
  const animate = cg?.animation !== false;

  return (
    <section ref={ref} className={`complete-garden${animate ? ' reveal-section' : ''}${!animate || visible ? ' is-visible' : ''}`} style={sectionStyle}>
      <CompleteGardenVideo cg={cg} />
      <div className="complete-garden-copy">
        <h2 style={headingStyle}>{heading}</h2>
        <p>{description}</p>
        <div className="pill-row">
          {pills.map((p, i) => (
            <span key={p.id ?? i} style={{ display: 'contents' }}>
              {i > 0 && <span className="pill-plus">+</span>}
              <span className="pill">{p.icon ? `${p.icon} ${p.text}` : p.text}</span>
            </span>
          ))}
        </div>
        {buttonVisible && <Link to={buttonUrl} className="btn-build-garden">{buttonText}</Link>}
      </div>
    </section>
  );
}

function BestSellers() {
  const { getBestSellers, getProductById } = useCatalogue();
  const { t } = useLanguage();
  const [ref, visible] = useScrollReveal(0.1);
  const { plantsPeopleLove: ppl } = useSiteContent();

  if (ppl && ppl.visible === false) return null;

  const curated = ppl?.productIds?.length
    ? ppl.productIds.map((id) => getProductById(id)).filter(Boolean)
    : null;
  const products = curated ?? getBestSellers(8);

  const eyebrow = ppl?.eyebrow || t('home.lovedEyebrow');
  const heading = ppl?.heading || t('home.plantsPeopleLove');
  const seeAllText = ppl?.seeAllText || t('home.seeAll');
  const seeAllLink = ppl?.seeAllLink || '/category/indoor-plants';

  return (
    <section ref={ref} className={`best-sellers reveal-section${visible ? ' is-visible' : ''}`}>
      <DecorativeLeaves variant="best-sellers" count={2} />
      <SectionVine variant="best-sellers" active={visible} />
      <div className="section-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>
            {heading}
            <span className="heading-leaf-accent" aria-hidden="true"><LeafGlyph /></span>
          </h2>
        </div>
        <Link to={seeAllLink} className="see-all">{seeAllText}</Link>
      </div>
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

// A small seeded shuffle, not Math.random() - the catalogue has no "date
// added"/"isNew" field to sort by (see data/products.js), so a genuinely
// re-randomised pick would make "Just In" show different products on every
// reload/render, which reads as broken rather than curated. This picks the
// same 10 consistently while still looking like a real, non-alphabetical,
// non-price-sorted selection - not a fabricated "new arrivals" dataset.
function JustIn() {
  const { products, getProductById } = useCatalogue();
  const { t } = useLanguage();
  const [ref, visible] = useScrollReveal(0.1);
  const { justIn: ji } = useSiteContent();

  // Homepage shows a 5-product preview; the full 10-product list lives on
  // /just-in (JustInPage.jsx) - both read from the same seeded ordering
  // via getJustInProducts, just sliced to a different length. A curated
  // admin productIds list (if set) overrides the automatic seeded pick.
  const curated = ji?.productIds?.length
    ? ji.productIds.map((id) => getProductById(id)).filter(Boolean)
    : null;
  const justInProducts = useMemo(
    () => curated ?? getJustInProducts(products, 5),
    [products, curated]
  );

  if (ji && ji.visible === false) return null;
  if (justInProducts.length === 0) return null;

  const title = ji?.title || t('home.justInTitle');
  const subtitle = ji?.subtitle || t('home.justInSubtitle');
  const viewAllText = ji?.viewAllText || t('home.viewAll');
  const viewAllLink = ji?.viewAllLink || '/just-in';

  return (
    <section ref={ref} className={`just-in reveal-section${visible ? ' is-visible' : ''}`}>
      <DecorativeGlow variant="just-in" />
      <DecorativeLeaves variant="just-in" count={3} />
      <DecorativePetals variant="just-in" count={2} />
      <SectionVine variant="just-in" active={visible} />

      <div className="section-heading">
        <div>
          <h2>
            {title}
            <span className="just-in-fresh-accent" aria-hidden="true"><LeafGlyph /></span>
          </h2>
          <p className="section-sub">{subtitle}</p>
        </div>
        <Link to={viewAllLink} className="see-all">{viewAllText}</Link>
      </div>
      <div className="just-in-grid">
        {justInProducts.map((p) => (
          <ProductCard key={p.id} product={p} isNew={!p.hideNewBadge} />
        ))}
      </div>
    </section>
  );
}

function GardenServicesTeaser() {
  const { gardenServices: gs } = useSiteContent();
  const { t, language } = useLanguage();
  const [ref, visible] = useScrollReveal(0.15);

  if (gs && gs.visible === false) return null;

  const badgeText = gs?.badgeText || t('home.beyondProducts');
  const heading = gs?.heading || t('home.gardenServices');
  const description = gs?.description || t('home.gardenServicesTeaserSub');
  // Items used to be a plain {title, to} array with the image looked up by
  // title from a hardcoded map - normalize an older saved list to the
  // richer shape so it still renders instead of erroring.
  const items = (gs?.items?.length ? gs.items : [])
    .map((s, i) => ({ description: '', buttonText: t('home.learnMore'), buttonLink: s.to || '/garden-services', visible: true, order: i, ...s }))
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (items.length === 0) return null;

  return (
    <section ref={ref} className={`garden-services-teaser reveal-section${visible ? ' is-visible' : ''}`}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{badgeText}</p>
          <h2>{heading}</h2>
        </div>
        <p className="section-sub">{description}</p>
      </div>
      <div className="services-grid">
        {items.map((s) => {
          const localizedTitle = getGardenServiceTranslation(s.title, language)?.title ?? s.title;
          return (
            <Link to={s.buttonLink} key={s.id ?? s.title} className={`service-card${s.image ? ' has-image' : ''}`}>
              {s.image && <img src={s.image} alt={localizedTitle} loading="lazy" />}
              <h3>{localizedTitle}</h3>
              {s.description && <p className="service-card-desc">{s.description}</p>}
              <span>{s.buttonText || t('home.learnMore')}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// Original simple line-icons (matching the header's stroke-icon style) -
// no external icon set or third-party artwork used.
function SproutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21V10" />
      <path d="M12 10C12 6 9 4 5 4c0 4 2 7 7 7Z" />
      <path d="M12 10c0-4 3-6 7-6 0 4-2 7-7 7Z" />
    </svg>
  );
}

function QualityCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function PreparedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 8h14l-1.5 11a2 2 0 0 1-2 1.8H8.5a2 2 0 0 1-2-1.8L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      <path d="M12 12v4" />
    </svg>
  );
}

function HomeReadyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
      <path d="M12 13c-1.5-1.5-1.5-3 0-4.5 1.5 1.5 1.5 3 0 4.5Z" />
    </svg>
  );
}

// Original IGO Nursery brand story - not sourced from any reference site.
const JOURNEY_STEPS = [
  {
    number: '01',
    title: 'Grown at IGO Nursery',
    desc: 'Every plant starts right here, raised in our own nursery beds and given the time it needs to grow strong.',
    image: '/images/journey/grown-at-nursery.png',
    Icon: SproutIcon,
  },
  {
    number: '02',
    title: 'Quality Checked',
    desc: 'Before it goes anywhere, each plant is inspected for health, pests and structure — only the best move forward.',
    image: '/images/journey/quality-checked.png',
    Icon: QualityCheckIcon,
  },
  {
    number: '03',
    title: 'Carefully Prepared',
    desc: 'We pot, wrap and pack every plant by hand so it travels safely from our nursery to your doorstep.',
    image: '/images/journey/carefully-prepared.png',
    Icon: PreparedIcon,
  },
  {
    number: '04',
    title: 'Ready for Your Home',
    desc: 'Your plant arrives healthy and settled in, ready to find its spot and start thriving in its new home.',
    image: '/images/journey/ready-for-your-home.png',
    Icon: HomeReadyIcon,
  },
];

const JOURNEY_ICONS = {
  sprout: SproutIcon,
  qualityCheck: QualityCheckIcon,
  prepared: PreparedIcon,
  homeReady: HomeReadyIcon,
};

function JourneyStep({ step, index, number }) {
  const [ref, visible] = useScrollReveal(0.25);
  const Icon = JOURNEY_ICONS[step.icon] || SproutIcon;
  const { language } = useLanguage();
  const tr = getJourneyStepTranslation(step.title, language);
  const title = tr?.title ?? step.title;
  const description = step.description ?? step.desc;
  return (
    <div
      ref={ref}
      className={`journey-step${visible ? ' journey-step-visible' : ''}`}
      style={{ transitionDelay: `${index * 130}ms` }}
    >
      <div className="journey-step-media">
        {step.image ? <img src={step.image} alt={title} /> : <span className="journey-step-noimage" aria-hidden="true"><Icon /></span>}
        <span className="journey-step-icon"><Icon /></span>
      </div>
      <div className="journey-step-body">
        <span className="journey-step-number">{number}</span>
        <h3>{title}</h3>
        <p>{tr?.desc ?? description}</p>
      </div>
    </div>
  );
}

// Small original flat-vector delivery rider (dark grey/black Himalayan-style
// adventure bike + IGO-uniformed rider + plant box) that travels along the
// dotted route line - pure CSS-driven, no image assets or libraries.
// Purely decorative, so hidden from assistive tech.
function DeliveryRider() {
  return (
    <div className="journey-rider-track" aria-hidden="true">
      {/* 
        Scaled down to approx 80% of previous iteration (0.6 scale instead of 0.75),
        anchored at the bottom center so it sits exactly on the dotted line without overlapping text.
      */}
      <div className="journey-rider" style={{ transform: 'translate(-50%, -100%) scale(0.6)', transformOrigin: 'bottom center', width: '220px' }}>
        <div className="journey-rider-bob">
          {/* viewBox tightly hugs the bottom of the wheels (y=126) so it rides exactly on the line */}
          <svg className="journey-rider-svg" viewBox="0 0 240 126" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', height: 'auto' }}>
            <defs>
              <linearGradient id="helmetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#374151" />
                <stop offset="100%" stopColor="#111827" />
              </linearGradient>
              <linearGradient id="tankGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4B5563" />
                <stop offset="100%" stopColor="#1F2937" />
              </linearGradient>
              <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1f2937" />
                <stop offset="100%" stopColor="#030712" />
              </linearGradient>
              <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="5" stdDeviation="3" floodOpacity="0.25" floodColor="#000" />
              </filter>
            </defs>
            
            {/* Soft shadow directly under the tires */}
            <ellipse cx="120" cy="124" rx="85" ry="4" fill="rgba(0,0,0,0.15)" filter="blur(2px)" />

            <g filter="url(#softShadow)">
              {/* --- MOTORCYCLE --- */}
              {/* Rear Fender & Rack */}
              <path d="M 40 71 Q 55 51 80 66" fill="none" stroke="#111827" strokeWidth="5" strokeLinecap="round" />
              <path d="M 35 51 L 75 51" fill="none" stroke="#1f2937" strokeWidth="4" strokeLinecap="round" />
              <rect x="35" y="51" width="40" height="3" fill="#374151" />

              {/* Delivery Box (Rear) */}
              <rect x="25" y="16" width="45" height="35" rx="3" fill="#1f2937" stroke="#111827" strokeWidth="2" />
              <rect x="30" y="21" width="35" height="25" rx="2" fill="#374151" />
              <path d="M 42 31 C 47 34 47 40 42 42 C 37 40 37 34 42 31 Z" fill="#48bb78" />
              <path d="M 47 34 C 52 31 57 31 57 39 C 54 41 49 41 47 34 Z" fill="#48bb78" />
              <circle cx="47" cy="34" r="1.5" fill="#1f2937" />

              {/* Rear Wheel (r=26, cy=100 -> bottom touches 126) */}
              <g transform="translate(60, 100)">
                <circle cx="0" cy="0" r="23" fill="none" stroke="#111827" strokeWidth="10" />
                <circle cx="0" cy="0" r="16" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
                {[0, 30, 60, 90, 120, 150].map((angle) => (
                  <line key={`r-${angle}`} x1="-16" y1="0" x2="16" y2="0" stroke="#d1d5db" strokeWidth="1.2" transform={`rotate(${angle})`} />
                ))}
                <circle cx="0" cy="0" r="4" fill="#374151" />
              </g>

              {/* Exhaust Pipe */}
              <path d="M 100 96 L 50 86" fill="none" stroke="#4b5563" strokeWidth="5" strokeLinecap="round" />
              <path d="M 70 88 L 40 78" fill="none" stroke="#1f2937" strokeWidth="7" strokeLinecap="round" />

              {/* Motorcycle Body & Frame */}
              <path d="M 60 56 L 115 56 L 125 46 L 60 46 Z" fill="#111827" /> {/* Seat */}
              
              {/* Himalayan Adventure Tank */}
              <path d="M 115 56 L 120 36 L 155 36 Q 170 36 160 61 L 115 61 Z" fill="url(#tankGrad)" stroke="#111827" strokeWidth="2" />
              {/* Tank Green Accent Stripe */}
              <path d="M 125 41 L 155 41 L 150 48 L 122 48 Z" fill="#48bb78" opacity="0.9" />
              <text x="127" y="46" fill="#111827" fontSize="4.5" fontWeight="bold" letterSpacing="0.5">HIMALAYAN</text>

              {/* Engine Block & Bash Plate */}
              <rect x="105" y="61" width="45" height="30" rx="5" fill="#374151" stroke="#111827" strokeWidth="2" />
              <line x1="110" y1="66" x2="145" y2="66" stroke="#1f2937" strokeWidth="1.5" />
              <line x1="110" y1="71" x2="145" y2="71" stroke="#1f2937" strokeWidth="1.5" />
              <line x1="110" y1="76" x2="145" y2="76" stroke="#1f2937" strokeWidth="1.5" />
              <path d="M 100 61 L 155 61 L 155 96 L 100 96 Z" fill="none" stroke="#111827" strokeWidth="3" rx="8" />

              {/* Front Fork & Suspension */}
              <line x1="145" y1="36" x2="180" y2="100" stroke="#9ca3af" strokeWidth="4" strokeLinecap="round" />
              <line x1="152" y1="32" x2="187" y2="96" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
              
              {/* Front Beak */}
              <path d="M 155 61 Q 175 51 195 66 L 185 71 Q 170 64 152 68 Z" fill="#4b5563" stroke="#111827" strokeWidth="1.5" />
              <path d="M 165 81 Q 195 71 210 94" fill="none" stroke="#111827" strokeWidth="3" strokeLinecap="round" />

              {/* Front Wheel */}
              <g transform="translate(182, 100)">
                <circle cx="0" cy="0" r="23" fill="none" stroke="#111827" strokeWidth="10" />
                <circle cx="0" cy="0" r="16" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
                {[0, 30, 60, 90, 120, 150].map((angle) => (
                  <line key={`f-${angle}`} x1="-16" y1="0" x2="16" y2="0" stroke="#d1d5db" strokeWidth="1.2" transform={`rotate(${angle})`} />
                ))}
                <circle cx="0" cy="0" r="4" fill="#374151" />
              </g>

              {/* Headlight & Windscreen */}
              <circle cx="160" cy="31" r="8" fill="#f3f4f6" stroke="#111827" strokeWidth="2.5" />
              <path d="M 155 26 Q 150 1 168 -2 L 165 24 Z" fill="rgba(203, 213, 225, 0.4)" stroke="#64748b" strokeWidth="1.5" />
              
              {/* Handlebars & Hand Guards */}
              <path d="M 142 16 L 155 6 L 165 16" fill="none" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
              <path d="M 135 18 Q 140 12 145 18 Z" fill="#1f2937" /> {/* Hand guard */}

              {/* --- RIDER --- */}
              {/* Back Cargo Pants (Dark Pants) */}
              <path d="M 95 51 L 115 74 L 105 91 L 95 91 L 100 74 L 85 61 Z" fill="#2d3748" stroke="#111827" strokeWidth="1.5" strokeLinejoin="round" />
              <rect x="100" y="66" width="8" height="10" rx="1.5" fill="#2d3748" stroke="#111827" strokeWidth="1" transform="rotate(-15 105 72)" />

              {/* Foot placement firmly on foot peg */}
              <path d="M 93 88 L 110 88 L 113 94 L 90 94 Z" fill="#111827" rx="2" />
              <circle cx="102" cy="91" r="2.5" fill="#4b5563" /> {/* Foot peg */}

              {/* Black Half-Sleeve IGO T-Shirt (Torso leaning slightly forward into natural riding posture) */}
              <path d="M 78 51 Q 90 20 110 20 L 122 33 Q 110 54 95 51 Z" fill="#111827" />
              <text x="90" y="40" fill="#ffffff" fontSize="6.5" fontWeight="900" transform="rotate(15 90 40)">IGO</text>
              
              {/* Sleeves */}
              <path d="M 110 20 L 122 33 L 115 42 L 98 30 Z" fill="#1f2937" />
              <text x="108" y="35" fill="#ffffff" fontSize="4" fontWeight="900" transform="rotate(25 108 35)">IGO</text>

              {/* Arms (Skin Tone) leaning forward to handlebars */}
              {/* Right Arm (Background) */}
              <path d="M 115 39 Q 130 35 142 16" fill="none" stroke="#b45309" strokeWidth="4.5" strokeLinecap="round" />
              {/* Left Arm (Foreground) */}
              <path d="M 112 40 Q 128 36 140 18" fill="none" stroke="#f59e0b" strokeWidth="5.5" strokeLinecap="round" opacity="0.9" /> 
              <path d="M 112 40 Q 128 36 140 18" fill="none" stroke="#d97706" strokeWidth="5" strokeLinecap="round" />
              
              {/* Gloves (Black) on both hands holding handlebar */}
              <circle cx="140" cy="18" r="4.5" fill="#1f2937" />

              {/* Matte Black Full-Face Helmet */}
              <circle cx="112" cy="8" r="13" fill="url(#helmetGrad)" />
              <path d="M 112 -5 A 13 13 0 0 1 125 8 L 125 16 A 4 4 0 0 1 118 20 L 104 20 A 4 4 0 0 1 98 16 L 98 8 A 13 13 0 0 1 112 -5 Z" fill="#1f2937" />
              
              {/* Helmet Visor & Details */}
              <path d="M 114 -2 Q 129 0 125 11 Q 115 11 112 4 Z" fill="url(#visorGrad)" stroke="#111827" strokeWidth="1" />
              <line x1="106" y1="16" x2="118" y2="16" stroke="#111827" strokeWidth="2" strokeLinecap="round" /> 

              {/* Rider Backpack (Subtle, for professional look) */}
              <path d="M 75 26 Q 65 36 78 48 L 85 44 Q 80 31 85 24 Z" fill="#1f2937" stroke="#111827" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function NurseryJourney() {
  const { t } = useLanguage();
  const [ref, visible] = useScrollReveal(0.15);
  const { nurseryJourney: nj } = useSiteContent();

  if (nj && nj.visible === false) return null;

  const eyebrow = nj?.eyebrow || t('home.ourProcess');
  const heading = nj?.heading || t('home.journeyHeading');
  const subtitle = nj?.subtitle || t('home.journeySub');
  const showRider = nj?.showRider !== false;
  const steps = (nj?.steps?.length ? nj.steps : JOURNEY_STEPS.map((s, i) => ({ id: i, title: s.title, description: s.desc, image: s.image, icon: Object.keys(JOURNEY_ICONS)[i], visible: true, order: i })))
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (steps.length === 0) return null;

  return (
    <section ref={ref} className={`nursery-journey reveal-section${visible ? ' is-visible' : ''}`}>
      <div className="section-heading center">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{heading}</h2>
        <p className="section-sub">{subtitle}</p>
      </div>
      <div className="journey-track">
        <div className="journey-line" aria-hidden="true" />
        {showRider && <DeliveryRider />}
        {steps.map((step, i) => (
          <JourneyStep key={step.id ?? step.title} step={step} index={i} number={String(i + 1).padStart(2, '0')} />
        ))}
      </div>
    </section>
  );
}

function WhyIgoCard({ item, index }) {
  const [ref, visible] = useScrollReveal(0.2);
  const { t } = useLanguage();
  const title = item.title || t(`whyIgo.title${item.key}`);
  const description = item.description || t(`whyIgo.desc${item.key}`);
  // `featured` was the old boolean field name (sometimes saved as the
  // string 'true' by an older plain-text editor) - `badgeEnabled` is the
  // current one, so either shape still renders correctly.
  const badgeEnabled = item.badgeEnabled ?? (item.featured === true || item.featured === 'true');
  const badgeText = item.badgeText || t('whyIgo.tagVerified');
  return (
    <div
      ref={ref}
      className={`why-igo-card ${badgeEnabled ? 'why-igo-card-featured' : ''} ${visible ? 'why-igo-card-visible' : ''}`}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      {badgeEnabled && <span className="why-igo-tag">{badgeText}</span>}
      {item.image ? (
        <img
          className="why-igo-image"
          src={item.image}
          alt={title}
          loading="lazy"
        />
      ) : (
        <span className="why-igo-icon">{WHY_IGO_ICONS[item.icon] || WHY_IGO_ICONS.wifi}</span>
      )}
      {item.stat ? (
        <h3>
          <span className="why-igo-stat">{item.stat}</span> {title}
        </h3>
      ) : (
        <h3>{title}</h3>
      )}
      <p>{description}</p>
    </div>
  );
}

function WhyIGO() {
  const { t } = useLanguage();
  const [ref, visible] = useScrollReveal(0.15);
  const { whyIgo } = useSiteContent();

  if (whyIgo && whyIgo.visible === false) return null;

  const eyebrow = whyIgo?.eyebrow || t('home.whyIgoEyebrow');
  const heading = whyIgo?.heading || t('home.whyIgoHeading');
  const buttonText = whyIgo?.buttonText || t('home.discoverMore');
  const buttonUrl = whyIgo?.buttonUrl || '/about';
  const buttonVisible = whyIgo?.buttonVisible !== false;
  const cards = (whyIgo?.cards?.length ? whyIgo.cards : WHY_IGO.map((c, i) => ({ ...c, visible: true, order: i })))
    .filter((c) => c.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (cards.length === 0) return null;

  const sectionStyle = {};
  if (whyIgo?.backgroundColor) sectionStyle.backgroundColor = whyIgo.backgroundColor;
  if (whyIgo?.paddingY) sectionStyle.paddingTop = sectionStyle.paddingBottom = whyIgo.paddingY;
  const headingStyle = {};
  if (whyIgo?.fontSize) headingStyle.fontSize = whyIgo.fontSize;
  if (whyIgo?.textColor) headingStyle.color = whyIgo.textColor;
  const animate = whyIgo?.animation !== false;

  return (
    <section ref={ref} className={`why-igo${animate ? ' reveal-section' : ''}${!animate || visible ? ' is-visible' : ''}`} style={sectionStyle}>
      <div className="section-heading center">
        <p className="eyebrow">{eyebrow}</p>
        <h2 style={headingStyle}>{heading}</h2>
      </div>
      <div className="why-igo-grid">
        {cards.map((item, i) => (
          <WhyIgoCard item={item} index={i} key={item.id ?? item.key} />
        ))}
      </div>
      {buttonVisible && (
        <div className="why-igo-cta-row">
          <Link to={buttonUrl} className="btn-discover">{buttonText}</Link>
        </div>
      )}
    </section>
  );
}

// --- Comparison table: "How we compare to buying plants elsewhere" ---
// Original line-icons matching the header's stroke-icon style.
function BugIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="8" width="8" height="10" rx="4" />
      <path d="M12 8V5" /><path d="M9 5 7.5 3.5" /><path d="M15 5l1.5-1.5" />
      <path d="M6 12H3" /><path d="M21 12h-3" />
      <path d="m6 17-2 2" /><path d="m18 17 2 2" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <rect x="9" y="2.5" width="6" height="3" rx="1" />
      <path d="M9 11h6" /><path d="M9 15h4" />
    </svg>
  );
}

function SoilMoundIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18c2-6 6-9 9-9s7 3 9 9" />
      <path d="M3 18h18" />
      <path d="M9 13c1-1 2-1 3 0" />
    </svg>
  );
}

function HeartLeafIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20s-7-4.4-9-9.2C1.8 6.8 4 4 7 4c2 0 4 1.2 5 3 1-1.8 3-3 5-3 3 0 5.2 2.8 4 6.8-2 4.8-9 9.2-9 9.2Z" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8l9-4 9 4-9 4-9-4Z" /><path d="M3 8v9l9 4 9-4V8" /><path d="M12 12v9" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" /><rect x="17" y="13" width="4" height="6" rx="1.5" />
      <path d="M19 19v1a3 3 0 0 1-3 3h-3" />
    </svg>
  );
}

function LeafGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21C7 21 4 17 4 12c0-3 2-6 5-7 1 4 4 6 8 6-1 5-3 10-5 10Z" />
      <path d="M8 15c2-3 5-5 9-6" />
    </svg>
  );
}

function ShopIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9l1-5h14l1 5" />
      <path d="M4 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
      <path d="M5 9v10h14V9" /><path d="M9 19v-6h6v6" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.5 4 5.8 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.8-4-9s1.5-6.5 4-9Z" />
    </svg>
  );
}

function LeafBranchIcon() {
  return (
    <svg viewBox="0 0 120 300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M10 16c42 62 28 142 60 282" />
      <path d="M24 58c20-10 40-8 50 8" />
      <path d="M34 108c22-6 42 0 50 18" />
      <path d="M44 163c22-4 40 4 46 22" />
      <path d="M51 218c20 0 36 10 40 26" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22C12 22 20 18 20 12V5l-8-3-8 3v7C4 18 12 22 12 22z" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="7" width="14" height="10" rx="1" />
      <path d="M15 10h4l3 3v4h-7z" />
      <circle cx="6" cy="19" r="2" /><circle cx="17.5" cy="19" r="2" />
    </svg>
  );
}

const COMPARISON_ROWS = [
  { label: 'Plant Quality', Icon: LeafGlyph, local: 'Inconsistent, no quality checks', igoText: 'Every plant checked before it ships', igoHighlight: 'checked', others: 'Quality varies by seller' },
  { label: 'Pest Control', Icon: BugIcon, local: 'Pest issues common', igoText: 'Pest-free before it leaves our nursery', igoHighlight: 'Pest-free', others: 'Rarely guaranteed' },
  { label: 'Repotting', Icon: ClipboardIcon, local: 'Often needs immediate repotting', igoText: 'Ships repot-ready in the right container', igoHighlight: 'repot-ready', others: 'Depends on how it was packed' },
  { label: 'Soil Quality', Icon: SoilMoundIcon, local: 'Standard, unlabelled soil', igoText: 'Right soil mix for each plant type', igoHighlight: 'Right soil mix', others: 'Generic, one-size-fits-all soil' },
  { label: 'Growing Conditions', Icon: SproutIcon, local: 'Sourcing and origin unclear', igoText: 'Grown and hardened in our own nursery', igoHighlight: 'hardened', others: 'Sourced from multiple third parties' },
  { label: 'Plant Health', Icon: HeartLeafIcon, local: 'No health guarantee', igoText: 'Healthy on arrival, or we make it right', igoHighlight: 'Healthy', others: 'Limited or unclear guarantee' },
  { label: 'Packaging', Icon: BoxIcon, local: 'Basic, prone to damage in transit', igoText: 'Secure, moisture-safe packaging', igoHighlight: 'moisture-safe', others: 'Standard courier packaging' },
  { label: 'Customer Support', Icon: HeadsetIcon, local: 'In-person only, no follow-up', igoText: 'Real plant-care guidance after purchase', igoHighlight: 'plant-care guidance', others: 'Email or chat only' },
];

const TRUST_BADGES = [
  { title: 'Quality Assured', desc: 'Every time you order', Icon: ShieldIcon },
  { title: 'Grown with Care', desc: 'By our expert team', Icon: SproutIcon },
  { title: 'Safe & Secure Delivery', desc: 'Right to your doorstep', Icon: TruckIcon },
  { title: "We're Here for You", desc: 'Before & after purchase', Icon: HeadsetIcon },
];

function HighlightText({ text, part }) {
  const idx = part ? text.indexOf(part) : -1;
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <strong>{part}</strong>
      {text.slice(idx + part.length)}
    </>
  );
}

function ComparisonRow({ row, index, hovered, onHover, onLeave }) {
  const [ref, visible] = useScrollReveal(0.15);
  const { language } = useLanguage();
  const tr = getCompareRowTranslation(row.label, language);
  const delay = `${index * 90}ms`;
  const rowHovered = hovered === index;
  const cellClass = (extra) =>
    `compare-cell ${extra} ${visible ? 'compare-cell-visible' : ''} ${rowHovered ? 'compare-row-hovered' : ''}`;

  return (
    <div style={{ display: 'contents' }}>
      <div
        ref={ref}
        className={cellClass('compare-label')}
        style={{ transitionDelay: delay, gridRow: index + 2 }}
        onMouseEnter={() => onHover(index)}
        onMouseLeave={onLeave}
      >
        <span className="compare-row-icon"><row.Icon /></span>
        <span>{tr?.label ?? row.label}</span>
      </div>
      <div
        className={cellClass('compare-local')}
        style={{ transitionDelay: delay, gridRow: index + 2 }}
        onMouseEnter={() => onHover(index)}
        onMouseLeave={onLeave}
      >
        <span className={`compare-status compare-status-local ${visible ? 'compare-status-pop' : ''}`} aria-hidden="true">✕</span>
        <span>{tr?.local ?? row.local}</span>
      </div>
      <div className={cellClass('compare-igo')} style={{ transitionDelay: delay, gridRow: index + 2 }}>
        <span className={`compare-status compare-status-igo ${visible ? 'compare-status-pop' : ''}`} aria-hidden="true">✓</span>
        <span><HighlightText text={tr?.igoText ?? row.igoText} part={tr?.igoHighlight ?? row.igoHighlight} /></span>
      </div>
      <div
        className={cellClass('compare-others')}
        style={{ transitionDelay: delay, gridRow: index + 2 }}
        onMouseEnter={() => onHover(index)}
        onMouseLeave={onLeave}
      >
        <span className={`compare-status compare-status-others ${visible ? 'compare-status-pop' : ''}`} aria-hidden="true">~</span>
        <span>{tr?.others ?? row.others}</span>
      </div>
    </div>
  );
}

function OurStoryBand() {
  const [ref, visible] = useScrollReveal(0.2);
  const { language, t } = useLanguage();
  const { ourStoryBand: osb } = useSiteContent();

  if (osb && osb.visible === false) return null;

  const badgeEnabled = osb?.badgeEnabled !== false;
  const badgeText = osb?.badgeText || t('about.badge');
  const founderImage = osb?.founderImage;
  // Founder's name is a proper noun - kept as-is across every language by
  // default, same as the "IGO Nursery" brand name, unless overridden.
  const founderName = osb?.founderName || 'Dr John Yesudhas';
  const founderDesignation = osb?.founderDesignation || t('about.designation');
  const heading = osb?.heading || t('about.title');
  const taglinePlain = osb?.taglinePlain || t('about.quotePlain');
  const taglineHighlight = osb?.taglineHighlight || t('about.quoteHighlight');
  const showTaglineIcon = osb?.showTaglineIcon !== false;
  const defaultParagraphs = [
    { id: 1, before: t('about.paragraph1'), strong: '', after: '', visible: true, order: 1 },
    { id: 2, before: t('about.paragraph2Before'), strong: t('about.paragraph2Strong'), after: t('about.paragraph2After'), visible: true, order: 2 },
    { id: 3, before: `${t('about.paragraph3')} 🌿`, strong: '', after: '', visible: true, order: 3 },
  ];
  const paragraphs = (osb?.paragraphs?.length ? osb.paragraphs : defaultParagraphs)
    .filter((p) => p.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <section ref={ref} className={`os-band${visible ? ' os-band-visible' : ''}`}>
      <DecorativeLeaves variant="story" count={2} />
      <SectionVine variant="story" active={visible} />
      <div className="os-story">
        <div className="os-media">
          {badgeEnabled && <span className="os-badge">{badgeText}</span>}
          {founderImage ? (
            <img
              src={founderImage}
              alt={`${founderName}, Founder of IGO Nursery`}
              className="os-story-photo"
              loading="lazy"
            />
          ) : (
            <div className="os-story-photo os-story-photo-fallback" aria-hidden="true"><LeafGlyph /></div>
          )}
          <div className="os-media-caption">
            <p className="os-media-name">{founderName}</p>
            <p className="os-media-title">{founderDesignation}</p>
          </div>
        </div>

        <div className="os-copy">
          <h2>{heading}</h2>
          <p className="os-quote">
            {taglinePlain} <span className="os-quote-highlight">{taglineHighlight}</span>
            {showTaglineIcon && <span className="os-quote-leaf" aria-hidden="true"><LeafGlyph /></span>}
          </p>
          {paragraphs.map((p) => (
            <p key={p.id}>
              {p.before}{p.strong && <strong>{p.strong}</strong>}{p.after}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function NurseryComparison() {
  const [hoveredRow, setHoveredRow] = useState(null);
  const { language } = useLanguage();
  const titleTr = getCompareTitleTranslation(language);
  const [ref, visible] = useScrollReveal(0.1);

  return (
    <section ref={ref} className={`compare-section reveal-section${visible ? ' is-visible' : ''}`}>
      <div className="compare-leaf-decor compare-leaf-decor-left" aria-hidden="true"><LeafBranchIcon /></div>
      <div className="compare-leaf-decor compare-leaf-decor-right" aria-hidden="true"><LeafBranchIcon /></div>

      <div className="section-heading center">
        <p className="compare-ornament" aria-hidden="true">
          <span className="compare-ornament-line" />
          <LeafGlyph />
          <span className="compare-ornament-line" />
        </p>
        <h2 className="compare-title">
          {titleTr ? <>{titleTr.pre}<em>{titleTr.em}</em>{titleTr.post}</> : <>How we compare to <em>buying plants</em> elsewhere.</>}
        </h2>
      </div>

      <div className="compare-wrap">
        <div className="compare-grid">
          <div className="compare-header compare-header-blank" style={{ gridRow: 1 }} />
          <div className="compare-header compare-header-local" style={{ gridRow: 1 }}>
            <span className="compare-header-icon compare-header-icon-local"><ShopIcon /></span>
            {getCompareHeaderTranslation('Local Nurseries', language)}
          </div>
          <div className="compare-featured-bg" style={{ gridRow: '1 / -1' }} aria-hidden="true" />
          <div className="compare-header compare-header-igo" style={{ gridRow: 1 }}>
            <span className="compare-header-badge"><LeafGlyph /></span>
            IGO Nursery
          </div>
          <div className="compare-header compare-header-others" style={{ gridRow: 1 }}>
            <span className="compare-header-icon compare-header-icon-others"><GlobeIcon /></span>
            {getCompareHeaderTranslation('Others (Online)', language)}
          </div>

          {COMPARISON_ROWS.map((row, i) => (
            <ComparisonRow
              key={row.label}
              row={row}
              index={i}
              hovered={hoveredRow}
              onHover={setHoveredRow}
              onLeave={() => setHoveredRow(null)}
            />
          ))}
        </div>
      </div>

      <div className="compare-trust-row">
        {TRUST_BADGES.map(({ title, desc, Icon }) => {
          const tr = getTrustBadgeTranslation(title, language);
          return (
            <div className="compare-trust-badge" key={title}>
              <span className="compare-trust-icon"><Icon /></span>
              <div>
                <h4>{tr?.title ?? title}</h4>
                <p>{tr?.desc ?? desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function PlantFinderBand() {
  const { t } = useLanguage();
  const [ref, visible] = useScrollReveal(0.2);
  const { plantFinder: pf } = useSiteContent();

  if (pf && pf.visible === false) return null;

  const eyebrow = pf?.eyebrow || t('home.plantFinderEyebrow');
  const heading = pf?.heading || t('home.plantFinderHeading');
  const description = pf?.description || t('home.plantFinderBandDesc');
  const buttonEnabled = pf?.buttonEnabled !== false;
  const buttonText = pf?.buttonText || t('home.findMyPlant');
  const buttonUrl = pf?.buttonUrl || '/plant-finder';

  const sectionStyle = {};
  if (pf?.backgroundColor) sectionStyle.backgroundColor = pf.backgroundColor;
  if (pf?.backgroundImage) {
    sectionStyle.backgroundImage = `url(${pf.backgroundImage})`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
  }
  if (pf?.paddingY) sectionStyle.paddingTop = sectionStyle.paddingBottom = pf.paddingY;
  if (pf?.buttonBgColor) sectionStyle['--pf-btn-bg'] = pf.buttonBgColor;
  if (pf?.buttonTextColor) sectionStyle['--pf-btn-text'] = pf.buttonTextColor;
  if (pf?.buttonHoverBgColor) sectionStyle['--pf-btn-hover-bg'] = pf.buttonHoverBgColor;
  if (pf?.buttonHoverTextColor) sectionStyle['--pf-btn-hover-text'] = pf.buttonHoverTextColor;

  return (
    <section ref={ref} className={`plant-finder-band reveal-section${visible ? ' is-visible' : ''}`} style={sectionStyle}>
      <div>
        <p className="eyebrow light" style={pf?.labelColor ? { color: pf.labelColor } : undefined}>{eyebrow}</p>
        <h2 style={pf?.headingColor ? { color: pf.headingColor } : undefined}>{heading}</h2>
        <p style={pf?.descriptionColor ? { color: pf.descriptionColor } : undefined}>{description}</p>
      </div>
      {buttonEnabled && (
        <Link to={buttonUrl} target={pf?.buttonNewTab ? '_blank' : undefined} rel={pf?.buttonNewTab ? 'noopener noreferrer' : undefined} className="btn-find-plant">
          {buttonText}
        </Link>
      )}
    </section>
  );
}

function GardenJournal() {
  const { gardenJournal: gj } = useSiteContent();
  const { t, language } = useLanguage();
  const [ref, visible] = useScrollReveal(0.1);

  if (gj && gj.visible === false) return null;

  const eyebrow = gj?.eyebrow || t('home.learnGrowThrive');
  const heading = gj?.heading || t('home.gardenJournal');
  const seeAllEnabled = gj?.seeAllEnabled !== false;
  const seeAllText = gj?.seeAllText || t('home.seeAll');
  const seeAllLink = gj?.seeAllLink || '/blog';
  const readGuideText = gj?.readGuideText || t('home.readGuide');
  // Older saved posts used `to` for the link - normalize to `linkUrl` so an
  // older save still opens and links correctly here.
  const posts = (gj?.posts?.length ? gj.posts : [])
    .map((p) => ({ linkUrl: p.to || p.linkUrl, linkTarget: '_self', visible: true, ...p }))
    .filter((p) => p.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (posts.length === 0) return null;

  const sectionStyle = {};
  if (gj?.backgroundColor) sectionStyle.backgroundColor = gj.backgroundColor;
  if (gj?.paddingY) sectionStyle.paddingTop = sectionStyle.paddingBottom = gj.paddingY;
  const headingStyle = gj?.textColor ? { color: gj.textColor } : undefined;

  return (
    <section ref={ref} className={`garden-journal reveal-section${visible ? ' is-visible' : ''}`} style={sectionStyle}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 style={headingStyle}>{heading}</h2>
        </div>
        {seeAllEnabled && <Link to={seeAllLink} className="see-all">{seeAllText}</Link>}
      </div>
      <div className="journal-grid">
        {posts.map((post) => {
          const title = getBlogPostTranslation(post.title, language)?.title ?? post.title;
          return (
            <Link
              to={post.linkUrl}
              target={post.linkTarget === '_blank' ? '_blank' : undefined}
              rel={post.linkTarget === '_blank' ? 'noopener noreferrer' : undefined}
              key={post.id}
              className="journal-card"
            >
              {post.image ? (
                <img src={post.image} alt={post.imageAlt || title} className="journal-media" loading="lazy" />
              ) : (
                <span className="journal-media journal-media-fallback" aria-hidden="true"><LeafGlyph /></span>
              )}
              <h3>{title}</h3>
              <span>{readGuideText}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// Original simple line-icons for the gifting highlight row - same stroke
// style as the site's other inline icon set (see SproutIcon etc.).
function GiftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="4" rx="1"></rect>
      <path d="M12 8v13"></path>
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path>
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8"></path>
      <path d="M16.5 8a2.5 2.5 0 0 0 0-5C14 3 12 8 12 8"></path>
    </svg>
  );
}

function ClipboardListIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="4" width="14" height="17" rx="2"></rect>
      <path d="M9 3h6a1 1 0 0 1 1 1v1H8V4a1 1 0 0 1 1-1z"></path>
      <path d="M9 11h6"></path>
      <path d="M9 15h6"></path>
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.59 2.59A2 2 0 0 0 11.17 2H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.41l9 9a2 2 0 0 0 2.82 0l7.17-7.17a2 2 0 0 0 0-2.82z"></path>
      <circle cx="7.5" cy="7.5" r="1.5"></circle>
    </svg>
  );
}

function ChatQuoteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  );
}

// Sits directly below Garden journal, above Customer reviews.
const GIFTING_IMAGE = '/images/gifting-hero.jpg';
const GIFTING_ICONS = { gift: <GiftIcon />, clipboard: <ClipboardListIcon />, tag: <TagIcon />, chat: <ChatQuoteIcon /> };

function GiftingBand() {
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
}



function Faq() {
  const { t } = useLanguage();
  const { faq } = useSiteContent();
  const defaultItems = useMemo(() => FAQS.map((f, i) => ({
    id: i, question: t(`faq.q${f.key}`), answer: t(`faq.a${f.key}`), visible: true, defaultOpen: i === 0, order: i,
  })), [t]);
  const items = (faq?.items?.length ? faq.items : defaultItems)
    .filter((f) => f.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const initialOpen = items.findIndex((f) => f.defaultOpen);
  const [open, setOpen] = useState(initialOpen);
  const [ref, visible] = useScrollReveal(0.15);

  if (faq && faq.visible === false) return null;
  if (items.length === 0) return null;

  const eyebrow = faq?.eyebrow || t('home.supportEyebrow');
  const heading = faq?.heading || t('home.faqHeading');
  const openIcon = faq?.openIcon || '−';
  const closedIcon = faq?.closedIcon || '+';

  const sectionStyle = {};
  if (faq?.backgroundColor) sectionStyle.backgroundColor = faq.backgroundColor;
  if (faq?.dividerColor) sectionStyle['--faq-divider'] = faq.dividerColor;
  if (faq?.iconColor) sectionStyle['--faq-icon'] = faq.iconColor;
  if (faq?.questionColor) sectionStyle['--faq-question'] = faq.questionColor;
  if (faq?.answerColor) sectionStyle['--faq-answer'] = faq.answerColor;

  return (
    <section ref={ref} className={`faq-section reveal-section${visible ? ' is-visible' : ''}`} id="faq" style={sectionStyle}>
      <div className="section-heading center">
        <p className="eyebrow" style={faq?.eyebrowColor ? { color: faq.eyebrowColor } : undefined}>{eyebrow}</p>
        <h2 style={faq?.headingColor ? { color: faq.headingColor } : undefined}>{heading}</h2>
      </div>
      <div className="faq-list">
        {items.map((item, idx) => (
          <div className={`faq-item ${open === idx ? 'open' : ''}`} key={item.id}>
            <button type="button" onClick={() => setOpen(open === idx ? -1 : idx)}>
              <span>{item.question}</span>
              <span className="faq-toggle">{open === idx ? openIcon : closedIcon}</span>
            </button>
            {open === idx && <p>{item.answer}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

// No newsletter/subscriber storage exists anywhere in this project yet
// (no API route, no Firestore collection) - submitting only validates the
// email client-side and shows the admin's configured message. Wiring this
// to an actual subscriber list is a separate, real backend feature (like
// the Products/Categories Firestore collections), not a text/styling change.
function Newsletter() {
  const { t } = useLanguage();
  const [ref, visible] = useScrollReveal(0.2);
  const { newsletter: nl } = useSiteContent();
  const [status, setStatus] = useState(null);

  if (nl && nl.visible === false) return null;

  const heading = nl?.heading || t('home.newsletterHeading');
  const placeholder = nl?.placeholder || t('home.newsletterPlaceholder');
  const buttonEnabled = nl?.buttonEnabled !== false;
  const buttonText = nl?.buttonText || t('home.subscribe');
  const successMessage = nl?.successMessage || 'Thanks for subscribing!';
  const errorMessage = nl?.errorMessage || 'Please enter a valid email address.';

  const sectionStyle = {};
  if (nl?.backgroundColor) sectionStyle.backgroundColor = nl.backgroundColor;
  if (nl?.paddingY) sectionStyle.paddingTop = sectionStyle.paddingBottom = nl.paddingY;
  if (nl?.inputBgColor) sectionStyle['--nl-input-bg'] = nl.inputBgColor;
  if (nl?.inputTextColor) sectionStyle['--nl-input-text'] = nl.inputTextColor;
  if (nl?.inputPlaceholderColor) sectionStyle['--nl-input-placeholder'] = nl.inputPlaceholderColor;
  if (nl?.inputBorderColor) sectionStyle['--nl-input-border'] = nl.inputBorderColor;
  if (nl?.inputFocusBorderColor) sectionStyle['--nl-input-focus-border'] = nl.inputFocusBorderColor;
  if (nl?.buttonBgColor) sectionStyle['--nl-btn-bg'] = nl.buttonBgColor;
  if (nl?.buttonTextColor) sectionStyle['--nl-btn-text'] = nl.buttonTextColor;
  if (nl?.buttonHoverBgColor) sectionStyle['--nl-btn-hover-bg'] = nl.buttonHoverBgColor;
  if (nl?.buttonHoverTextColor) sectionStyle['--nl-btn-hover-text'] = nl.buttonHoverTextColor;

  function handleSubmit(e) {
    e.preventDefault();
    const email = e.target.elements.email.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setStatus(isValid ? 'success' : 'error');
    if (isValid) e.target.reset();
  }

  return (
    <section ref={ref} className={`newsletter-section reveal-section${visible ? ' is-visible' : ''}`} style={sectionStyle}>
      <h2 style={nl?.headingColor ? { color: nl.headingColor } : undefined}>{heading}</h2>
      <form onSubmit={handleSubmit} className="newsletter-form">
        <input name="email" type="email" placeholder={placeholder} required />
        {buttonEnabled && <button type="submit">{buttonText}</button>}
      </form>
      {status && (
        <p className={`newsletter-message newsletter-message-${status}`}>
          {status === 'success' ? successMessage : errorMessage}
        </p>
      )}
    </section>
  );
}

// ---------------------------------------------------------------- Stats strip
function StatsUsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function StatsPottedPlantIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21V11" />
      <path d="M12 11C12 6 8 4 4 4c0 5 3 7 8 7Z" />
      <path d="M12 11c0-5 4-7 8-7 0 5-3 7-8 7Z" />
      <path d="M7 21h10l-1.2-7H8.2z" />
    </svg>
  );
}
function StatsBadgeStarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 15.9 6.4 19.1l1.4-6.3L3 8.5l6.4-.6z" />
    </svg>
  );
}
function StatsPackageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8 12 3 3 8l9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" />
    </svg>
  );
}
function StatsPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13z" /><circle cx="12" cy="9" r="3" />
    </svg>
  );
}

const STATS_ITEMS = [
  { key: 'Happy Customers', value: '1L+', title: 'Happy Customers', subtitle: 'Trust in Our Greenery', Icon: StatsUsersIcon },
  { key: 'Plant Varieties', value: '1000+', title: 'Plant Varieties', subtitle: 'For Every Space', Icon: StatsPottedPlantIcon },
  { key: 'Customer Rating', value: '4.7+', title: 'Customer Rating', subtitle: 'Loved by Plant Parents', Icon: StatsBadgeStarIcon },
  { key: 'Orders Delivered', value: '2L+', title: 'Orders Delivered', subtitle: 'Successfully', Icon: StatsPackageIcon },
  { key: 'Cities Served', value: '500+', title: 'Cities Served', subtitle: 'Across India', Icon: StatsPinIcon },
];

function StatsStrip() {
  const { language } = useLanguage();
  const [ref, visible] = useScrollReveal(0.2);
  return (
    <section ref={ref} className={`stats-strip reveal-section${visible ? ' is-visible' : ''}`}>
      <div className="stats-strip-leaf" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 22V12" /><path d="M12 12C12 7 8 5 4 5c0 5 3 7 8 7Z" /><path d="M12 12c0-5 4-7 8-7 0 5-3 7-8 7Z" /></svg>
      </div>
      {STATS_ITEMS.map((item) => {
        const tr = getStatsStripTranslation(item.key, language);
        return (
          <div className="stats-strip-item" key={item.key}>
            <span className="stats-strip-icon"><item.Icon /></span>
            <div className="stats-strip-copy">
              <strong className="stats-strip-value">{item.value}</strong>
              <span className="stats-strip-title">{tr?.title ?? item.title}</span>
              <span className="stats-strip-subtitle">{tr?.subtitle ?? item.subtitle}</span>
            </div>
          </div>
        );
      })}
    </section>
  );
}

function Home() {
  // Support deep-links back to a section, e.g. the category listing page's
  // "Back to Shop by Category" link (/#shop-by-category). RRD doesn't
  // scroll to hash targets on its own.
  useEffect(() => {
    const id = window.location.hash.replace('#', '');
    if (!id) return;
    const el = document.getElementById(id);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }, []);

  return (
    <>
      <Hero />
      <AboutIgo />
      <OffersSection />
      <StatsStrip />
      <ShopByCategory />
      <HomeCorners />
      <BestSellers />
      <JustIn />
      <CompleteGarden />
      <GardenServicesTeaser />
      <NurseryJourney />
      <WhyIGO />
      <OurStoryBand />
      <ComparisonSection />
      <TrustBenefits />
      <PlantFinderBand />
      <GardenJournal />
      <GiftingBand />
      <Newsletter />
      <Faq />
    </>
  );
}

export default Home;
