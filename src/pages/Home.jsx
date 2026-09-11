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
import { getHeroFieldTranslation, getGardenServiceTranslation, getBlogPostTranslation, getReviewTranslation, getJourneyStepTranslation, getCompareHeaderTranslation, getCompareTitleTranslation, getCompareRowTranslation, getTrustBadgeTranslation, getStatsStripTranslation } from '../i18n/translations';
import { getJustInProducts } from '../utils/seededShuffle';
import DecorativeLeaves from '../components/DecorativeLeaves';
import SectionVine from '../components/SectionVine';
import DecorativeFlowers from '../components/DecorativeFlowers';
import DecorativePetals from '../components/DecorativePetals';
import DecorativeGlow from '../components/DecorativeGlow';

// `stat`/`statLabel` split out only for the metric card, so "99.2%" can be
// styled as a standalone accent number instead of plain heading text.
// `key` maps to whyIgo.title{Key}/desc{Key} in src/i18n/translations.js.
const WHY_IGO = [
  { icon: 'wifi', key: 'Iot' },
  { icon: 'flask', key: 'Precision' },
  { icon: 'shield', stat: '99.2%', key: 'Guarantee', featured: true },
  { icon: 'headset', key: 'Expert' },
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

const REVIEWS = [
  { name: 'Ananya R.', rating: 5, text: 'The plants arrived so much healthier than I expected. Great packaging too.' },
  { name: 'Karthik S.', rating: 5, text: 'Ordered a bonsai as a gift — the recipient loved it. Will order again.' },
  { name: 'Priya M.', rating: 4, text: 'Good range of pots and the care guide that came with my order was genuinely useful.' },
];

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
        src={hero.videoUrl}
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
  return (
    <section ref={ref} className={`about-igo-section reveal-section${visible ? ' is-visible' : ''}`}>
      <div className="about-igo-copy">
        <p className="eyebrow">{t('pages.ourStory')}</p>
        <h2>{t('home.whyIgoHeading')}</h2>
        <p className="about-igo-text">{t('pages.aboutStory')}</p>
        <Link to="/about" className="btn-build-garden">{t('home.discoverMore')}</Link>
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
  // 'gifting' is a real route (see App.jsx) but has no entry in the
  // categories collection - fall back to a real gift-tagged product
  // photo, the same source the homepage's own GiftingBand uses.
  const giftImage = getGiftProducts()[0]?.image;

  return (
    <section id="shop-by-category" ref={ref} className={`shop-by-category shop-by-category-v2 reveal-section${visible ? ' is-visible' : ''}`}>
      <div className="sbc-heading">
        <h2>
          <SbcLeaf className="sbc-heading-leaf sbc-heading-leaf-left" />
          {t('home.shopByCategory')}
          <SbcLeaf className="sbc-heading-leaf sbc-heading-leaf-right" />
        </h2>
        <p className="section-sub sbc-sub-shift">{t('home.shopByCategorySub')}</p>
      </div>

      <div className="category-grid">
        {SHOP_CATEGORIES_V2.map((entry) => {
          const cat = categories.find((c) => c.slug === entry.slug);
          const image = entry.image || cat?.image || (entry.slug === 'gifting' ? giftImage : undefined);
          const { Icon } = entry;
          // Always read the display name from the local, static translation
          // table by slug (not from the live `categories` doc, which may
          // not carry a `translations` field) - falls back to the English
          // label automatically when a language has no entry yet.
          const localizedLabel = CATEGORY_LABEL_TRANSLATIONS[entry.slug]?.[language] || entry.label;
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
                  <span className="cat-card-explore">{t('home.explore')}</span>
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

function HomeCorners() {
  const { t } = useLanguage();
  const [ref, visible] = useScrollReveal(0.1);
  return (
    <section ref={ref} className={`home-corners reveal-section${visible ? ' is-visible' : ''}`}>
      <DecorativeGlow variant="corners" />
      <DecorativeLeaves variant="category" count={4} />
      <DecorativeFlowers variant="category" count={3} />

      <div className="home-corners-heading">
        <span className="home-corners-leaf home-corners-leaf-left" aria-hidden="true"><SproutIcon /></span>
        <h2>{t('home.cornersHeading')}</h2>
        <span className="home-corners-leaf home-corners-leaf-right" aria-hidden="true"><SproutIcon /></span>
      </div>
      <div className="home-corners-grid">
        {HOME_CORNERS.map((corner) => {
          const label = t(`home.corner${corner.key.charAt(0).toUpperCase()}${corner.key.slice(1)}`);
          return (
            <Link
              to={`/category/indoor-plants?location=${encodeURIComponent(corner.location)}`}
              className="home-corner-card"
              key={corner.key}
            >
              <div className="home-corner-media">
                <img src={corner.image} alt={label} loading="lazy" />
              </div>
              <span className="home-corner-icon"><corner.Icon /></span>
              <h3>{label}</h3>
              <span className="home-corner-cta">{t('offers.shopNow')}</span>
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
function CompleteGardenVideo() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

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
        src="/videos/garden-journey.mp4"
        autoPlay
        muted
        loop
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
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
    </div>
  );
}

function CompleteGarden() {
  const { t } = useLanguage();
  const [ref, visible] = useScrollReveal(0.15);
  return (
    <section ref={ref} className={`complete-garden reveal-section${visible ? ' is-visible' : ''}`}>
      <CompleteGardenVideo />
      <div className="complete-garden-copy">
        <h2>{t('home.completeGardenHeading')}</h2>
        <p>{t('home.completeGardenDesc')}</p>
        <div className="pill-row">
          <span className="pill">{t('home.pillYourPlant')}</span>
          <span className="pill-plus">+</span>
          <span className="pill">{t('home.pillRightPot')}</span>
          <span className="pill-plus">+</span>
          <span className="pill">{t('home.pillGrowingMix')}</span>
          <span className="pill-plus">+</span>
          <span className="pill">{t('home.pillPlantNutrition')}</span>
        </div>
        <Link to="/category/pots-planters" className="btn-build-garden">{t('home.buildYourGarden')}</Link>
      </div>
    </section>
  );
}

function BestSellers() {
  const { getBestSellers } = useCatalogue();
  const { t } = useLanguage();
  const [ref, visible] = useScrollReveal(0.1);
  const products = getBestSellers(8);
  return (
    <section ref={ref} className={`best-sellers reveal-section${visible ? ' is-visible' : ''}`}>
      <DecorativeLeaves variant="best-sellers" count={2} />
      <SectionVine variant="best-sellers" active={visible} />
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t('home.lovedEyebrow')}</p>
          <h2>
            {t('home.plantsPeopleLove')}
            <span className="heading-leaf-accent" aria-hidden="true"><LeafGlyph /></span>
          </h2>
        </div>
        <Link to="/category/indoor-plants" className="see-all">{t('home.seeAll')}</Link>
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
  const { products } = useCatalogue();
  const { t } = useLanguage();
  const [ref, visible] = useScrollReveal(0.1);
  // Homepage shows a 5-product preview; the full 10-product list lives on
  // /just-in (JustInPage.jsx) - both read from the same seeded ordering
  // via getJustInProducts, just sliced to a different length.
  const justInProducts = useMemo(() => getJustInProducts(products, 5), [products]);

  if (justInProducts.length === 0) return null;

  return (
    <section ref={ref} className={`just-in reveal-section${visible ? ' is-visible' : ''}`}>
      <DecorativeGlow variant="just-in" />
      <DecorativeLeaves variant="just-in" count={3} />
      <DecorativePetals variant="just-in" count={2} />
      <SectionVine variant="just-in" active={visible} />
      
      <div className="section-heading">
        <div>
          <h2>
            {t('home.justInTitle')}
            <span className="just-in-fresh-accent" aria-hidden="true"><LeafGlyph /></span>
          </h2>
          <p className="section-sub">{t('home.justInSubtitle')}</p>
        </div>
        <Link to="/just-in" className="see-all">{t('home.viewAll')}</Link>
      </div>
      <div className="just-in-grid">
        {justInProducts.map((p) => (
          <ProductCard key={p.id} product={p} isNew />
        ))}
      </div>
    </section>
  );
}

function GardenServicesTeaser() {
  const { gardenServices: services } = useSiteContent();
  const { t, language } = useLanguage();
  const [ref, visible] = useScrollReveal(0.15);
  return (
    <section ref={ref} className={`garden-services-teaser reveal-section${visible ? ' is-visible' : ''}`}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t('home.beyondProducts')}</p>
          <h2>{t('home.gardenServices')}</h2>
        </div>
        <p className="section-sub">{t('home.gardenServicesTeaserSub')}</p>
      </div>
      <div className="services-grid">
        {services.map((s) => (
          <Link to={s.to} key={s.title} className="service-card">
            <h3>{getGardenServiceTranslation(s.title, language)?.title ?? s.title}</h3>
            <span>{t('home.learnMore')}</span>
          </Link>
        ))}
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

function JourneyStep({ step, index }) {
  const [ref, visible] = useScrollReveal(0.25);
  const { Icon } = step;
  const { language } = useLanguage();
  const tr = getJourneyStepTranslation(step.title, language);
  return (
    <div
      ref={ref}
      className={`journey-step${visible ? ' journey-step-visible' : ''}`}
      style={{ transitionDelay: `${index * 130}ms` }}
    >
      <div className="journey-step-media">
        <img src={step.image} alt={tr?.title ?? step.title} />
        <span className="journey-step-icon"><Icon /></span>
      </div>
      <div className="journey-step-body">
        <span className="journey-step-number">{step.number}</span>
        <h3>{tr?.title ?? step.title}</h3>
        <p>{tr?.desc ?? step.desc}</p>
      </div>
    </div>
  );
}

// Small original flat-vector delivery rider (orange/black KTM-style bike +
// uniformed rider + plant box) that travels along the dotted route line -
// pure CSS-driven, no image assets or libraries. Purely decorative, so
// hidden from assistive tech.
function DeliveryRider() {
  return (
    <div className="journey-rider-track" aria-hidden="true">
      <div className="journey-rider">
        <div className="journey-rider-shadow" />
        <div className="journey-rider-bob">
          <svg className="journey-rider-svg" viewBox="0 0 160 90" xmlns="http://www.w3.org/2000/svg">
            {/* delivery box */}
            <rect x="8" y="18" width="26" height="22" rx="4" className="rider-box" />
            <path d="M21 24 C25 26 25 32 21 34 C17 32 17 26 21 24 Z" className="rider-box-leaf" />

            {/* footboard + fairing (KTM-style orange bodywork) */}
            <rect x="30" y="52" width="82" height="8" rx="4" className="rider-tank" />
            <path
              d="M96,54 C96,30 102,16 116,14 C122,13 126,16 126,22 L126,40 C126,48 122,54 114,54 Z"
              className="rider-tank"
            />
            <circle cx="123" cy="21" r="3" className="rider-headlight" />

            {/* seat + handlebar (black) */}
            <rect x="46" y="30" width="8" height="24" rx="3" className="rider-dark" />
            <rect x="34" y="24" width="30" height="10" rx="5" className="rider-dark" />
            <rect x="118" y="8" width="20" height="5" rx="2.5" className="rider-dark" transform="rotate(-8 128 10)" />

            {/* rider: seated upright, facing right - hip on the seat, torso
                leaning slightly forward, leg bending down to the footrest,
                arm reaching forward to the handlebar grip */}
            <path d="M60,32 Q63,44 66,54" className="rider-limb" />
            <path d="M60,32 C61,25 64,18 69,14" className="rider-limb rider-limb-thick" />
            <path d="M68,15 Q98,8 127,11" className="rider-limb" />

            {/* rider: uniform jacket with a small IGO accent */}
            <path d="M64,16 L72,13 L76,31 L58,35 Z" className="rider-uniform" />
            <path d="M66,16 L72,14 L74,20 L67,22 Z" className="rider-uniform-accent" />

            {/* rider: helmet, facing forward/right */}
            <circle cx="72" cy="10" r="9" className="rider-helmet" />
            <path d="M65,9 C69,6 79,6 82,10" className="rider-visor" />
            <ellipse cx="75.5" cy="6.5" rx="2" ry="1" className="rider-visor-shine" />

            {/* wheels (black tire, silver rim/hub) */}
            <g className="rider-wheel" style={{ transformOrigin: '34px 62px' }}>
              <circle cx="34" cy="62" r="14" className="rider-tire" />
              <circle cx="34" cy="62" r="8" className="rider-rim" />
              <circle cx="34" cy="62" r="3" className="rider-hub" />
              <line x1="34" y1="50" x2="34" y2="74" className="rider-spoke" />
              <line x1="22" y1="62" x2="46" y2="62" className="rider-spoke" />
            </g>
            <g className="rider-wheel" style={{ transformOrigin: '118px 62px' }}>
              <circle cx="118" cy="62" r="14" className="rider-tire" />
              <circle cx="118" cy="62" r="8" className="rider-rim" />
              <circle cx="118" cy="62" r="3" className="rider-hub" />
              <line x1="118" y1="50" x2="118" y2="74" className="rider-spoke" />
              <line x1="106" y1="62" x2="130" y2="62" className="rider-spoke" />
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
  return (
    <section ref={ref} className={`nursery-journey reveal-section${visible ? ' is-visible' : ''}`}>
      <div className="section-heading center">
        <p className="eyebrow">{t('home.ourProcess')}</p>
        <h2>{t('home.journeyHeading')}</h2>
        <p className="section-sub">{t('home.journeySub')}</p>
      </div>
      <div className="journey-track">
        <div className="journey-line" aria-hidden="true" />
        <DeliveryRider />
        {JOURNEY_STEPS.map((step, i) => (
          <JourneyStep key={step.title} step={step} index={i} />
        ))}
      </div>
    </section>
  );
}

function WhyIgoCard({ item, index }) {
  const [ref, visible] = useScrollReveal(0.2);
  const { t } = useLanguage();
  return (
    <div
      ref={ref}
      className={`why-igo-card ${item.featured ? 'why-igo-card-featured' : ''} ${visible ? 'why-igo-card-visible' : ''}`}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      {item.featured && <span className="why-igo-tag">{t('whyIgo.tagVerified')}</span>}
      <span className="why-igo-icon">{WHY_IGO_ICONS[item.icon]}</span>
      {item.stat ? (
        <h3>
          <span className="why-igo-stat">{item.stat}</span> {t(`whyIgo.title${item.key}`)}
        </h3>
      ) : (
        <h3>{t(`whyIgo.title${item.key}`)}</h3>
      )}
      <p>{t(`whyIgo.desc${item.key}`)}</p>
    </div>
  );
}

function WhyIGO() {
  const { t } = useLanguage();
  const [ref, visible] = useScrollReveal(0.15);
  return (
    <section ref={ref} className={`why-igo reveal-section${visible ? ' is-visible' : ''}`}>
      <div className="section-heading center">
        <p className="eyebrow">{t('home.whyIgoEyebrow')}</p>
        <h2>{t('home.whyIgoHeading')}</h2>
      </div>
      <div className="why-igo-grid">
        {WHY_IGO.map((item, i) => (
          <WhyIgoCard item={item} index={i} key={item.key} />
        ))}
      </div>
      <div className="why-igo-cta-row">
        <Link to="/about" className="btn-discover">{t('home.discoverMore')}</Link>
      </div>
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

  return (
    <section ref={ref} className={`os-band${visible ? ' os-band-visible' : ''}`}>
      <DecorativeLeaves variant="story" count={2} />
      <SectionVine variant="story" active={visible} />
      <div className="os-story">
        <div className="os-media">
          <span className="os-badge">{t('about.badge')}</span>
          <img
            src="/images/home/our-story.jpeg"
            alt="Dr John Yesudhas, Founder of IGO Nursery"
            className="os-story-photo"
            loading="lazy"
          />
          <div className="os-media-caption">
            {/* Founder's name is a proper noun - kept as-is across every
                language, same as the "Agritech Farms" brand name. */}
            <p className="os-media-name">Dr John Yesudhas</p>
            <p className="os-media-title">{t('about.designation')}</p>
          </div>
        </div>

        <div className="os-copy">
          <h2>{t('about.title')}</h2>
          <p className="os-quote">
            {t('about.quotePlain')} <span className="os-quote-highlight">{t('about.quoteHighlight')}</span>
            <span className="os-quote-leaf" aria-hidden="true"><LeafGlyph /></span>
          </p>
          <p>{t('about.paragraph1')}</p>
          <p>
            {t('about.paragraph2Before')}<strong>{t('about.paragraph2Strong')}</strong>{t('about.paragraph2After')}
          </p>
          <p>{t('about.paragraph3')} <span aria-hidden="true">🌿</span></p>
        </div>
      </div>

      <div className="os-testimonials">
        <DecorativeLeaves variant="testimonials" count={3} />
        <div className="section-heading center">
          <h2>{t('about.customerReviews')}</h2>
        </div>
        <div className="os-testimonial-grid">
          {REVIEWS.map((r) => (
            <div className="os-testimonial-card" key={r.name}>
              <div className="os-testimonial-head">
                <span className="os-avatar" aria-hidden="true">{r.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</span>
                <div>
                  <p className="os-testimonial-name">{r.name}</p>
                  <p className="os-testimonial-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
                </div>
              </div>
              <p className="os-testimonial-text">&ldquo;{getReviewTranslation(r.text, language)}&rdquo;</p>
            </div>
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
  return (
    <section ref={ref} className={`plant-finder-band reveal-section${visible ? ' is-visible' : ''}`}>
      <div>
        <p className="eyebrow light">{t('home.plantFinderEyebrow')}</p>
        <h2>{t('home.plantFinderHeading')}</h2>
        <p>{t('home.plantFinderBandDesc')}</p>
      </div>
      <Link to="/plant-finder" className="btn-find-plant">{t('home.findMyPlant')}</Link>
    </section>
  );
}

function GardenJournal() {
  const { journal } = useSiteContent();
  const { t, language } = useLanguage();
  const [ref, visible] = useScrollReveal(0.1);
  return (
    <section ref={ref} className={`garden-journal reveal-section${visible ? ' is-visible' : ''}`}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t('home.learnGrowThrive')}</p>
          <h2>{t('home.gardenJournal')}</h2>
        </div>
        <Link to="/blog" className="see-all">{t('home.seeAll')}</Link>
      </div>
      <div className="journal-grid">
        {journal.map((post) => (
          <Link to={post.to} key={post.id} className="journal-card">
            <div className="journal-media" style={{ backgroundImage: `url('${post.image}')` }} />
            <h3>{getBlogPostTranslation(post.title, language)?.title ?? post.title}</h3>
            <span>{t('home.readGuide')}</span>
          </Link>
        ))}
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

// Sits directly below Garden journal, above Customer reviews. The visual
// is a real gift-tagged product photo from the catalogue (see products.js
// `gift: true` entries) - not a stock/placeholder image.
function GiftingBand() {
  const { t } = useLanguage();
  const { getGiftProducts } = useCatalogue();
  const showcase = getGiftProducts()[0];
  const [ref, visible] = useScrollReveal(0.15);

  return (
    <section ref={ref} className={`gifting-band reveal-section${visible ? ' is-visible' : ''}`}>
      <div className="gifting-band-copy">
        <h2>{t('home.giftingHeading')}</h2>
        <p>{t('home.giftingDesc')}</p>
        <p className="gifting-band-highlight">{t('home.giftingHighlight')}</p>

        <div className="gifting-band-points">
          <span className="gifting-band-point">
            <span className="gifting-band-point-icon"><GiftIcon /></span>
            {t('home.giftingPointHampers')}
          </span>
          <span className="gifting-band-divider" aria-hidden="true" />
          <span className="gifting-band-point">
            <span className="gifting-band-point-icon"><ClipboardListIcon /></span>
            {t('home.giftingPointBulk')}
          </span>
          <span className="gifting-band-divider" aria-hidden="true" />
          <span className="gifting-band-point">
            <span className="gifting-band-point-icon"><TagIcon /></span>
            {t('home.giftingPointCustom')}
          </span>
        </div>

        <div className="gifting-band-buttons">
          <Link to="/gifting" className="btn-gift-primary">
            <GiftIcon /> {t('home.giftingExploreBtn')}
          </Link>
          <Link to="/corporate-gifts" className="btn-gift-secondary">
            <ChatQuoteIcon /> {t('home.giftingQuoteBtn')}
          </Link>
        </div>
      </div>

      <div className="gifting-band-media">
        {showcase && <img src={showcase.image} alt={showcase.name} loading="lazy" />}
      </div>
    </section>
  );
}

function Reviews() {
  const { t, language } = useLanguage();
  const [ref, visible] = useScrollReveal(0.1);
  return (
    <section ref={ref} className={`reviews-section reveal-section${visible ? ' is-visible' : ''}`}>
      <div className="section-heading center">
        <h2>{t('home.customerReviews')}</h2>
        <p className="section-sub">{t('home.reviewsSub')}</p>
      </div>
      <div className="reviews-grid">
        {REVIEWS.map((r) => (
          <div className="review-card" key={r.name}>
            <p className="review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
            <p className="review-text">&ldquo;{getReviewTranslation(r.text, language)}&rdquo;</p>
            <p className="review-name">{r.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(0);
  const [ref, visible] = useScrollReveal(0.15);
  return (
    <section ref={ref} className={`faq-section reveal-section${visible ? ' is-visible' : ''}`} id="faq">
      <div className="section-heading center">
        <p className="eyebrow">{t('home.supportEyebrow')}</p>
        <h2>{t('home.faqHeading')}</h2>
      </div>
      <div className="faq-list">
        {FAQS.map((item, idx) => (
          <div className={`faq-item ${open === idx ? 'open' : ''}`} key={item.key}>
            <button type="button" onClick={() => setOpen(open === idx ? -1 : idx)}>
              <span>{t(`faq.q${item.key}`)}</span>
              <span className="faq-toggle">{open === idx ? '−' : '+'}</span>
            </button>
            {open === idx && <p>{t(`faq.a${item.key}`)}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  const { t } = useLanguage();
  const [ref, visible] = useScrollReveal(0.2);
  return (
    <section ref={ref} className={`newsletter-section reveal-section${visible ? ' is-visible' : ''}`}>
      <h2>{t('home.newsletterHeading')}</h2>
      <form onSubmit={(e) => e.preventDefault()} className="newsletter-form">
        <input type="email" placeholder={t('home.newsletterPlaceholder')} required />
        <button type="submit">{t('home.subscribe')}</button>
      </form>
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
      <NurseryComparison />
      <PlantFinderBand />
      <GardenJournal />
      <GiftingBand />
      <Reviews />
      <Newsletter />
      <Faq />
    </>
  );
}

export default Home;
