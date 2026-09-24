import { Link } from 'react-router-dom';
import { useSiteContent } from '../hooks/useSiteContent';
import { useLanguage } from '../context/LanguageContext';
import { getOfferNoteTranslation } from '../i18n/translations';
import DecorativeLeaves from './DecorativeLeaves';
import DecorativePetals from './DecorativePetals';
import BundleButterfly from './BundleButterfly';

// An elegant little leafy sprig used either side of the heading
function LeafSprig() {
  return (
    <svg viewBox="0 0 60 90" fill="none" aria-hidden="true">
      <path d="M30 4C30 4 30 60 30 86" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
      <path d="M30 22C22 14 10 14 4 20c4 12 16 16 26 8z" fill="currentColor" opacity="0.85" />
      <path d="M30 20c8-8 20-8 26-2-4 12-16 16-26 8z" fill="currentColor" opacity="0.7" />
      <path d="M30 44c-8-8-20-8-26-2 4 12 16 16 26 8z" fill="currentColor" opacity="0.8" />
      <path d="M30 42c8-8 20-8 26-2-4 12-16 16-26 8z" fill="currentColor" opacity="0.62" />
      <path d="M30 66c-7-7-17-7-22-2 3 10 13 14 22 7z" fill="currentColor" opacity="0.72" />
    </svg>
  );
}

function SingleLeaf() {
  return (
    <svg viewBox="0 0 40 24" fill="currentColor" aria-hidden="true">
      <path d="M2 20C10 6 26 2 38 4 34 14 20 22 2 20Z" />
    </svg>
  );
}

function OffersSection() {
  const { offers: OFFERS } = useSiteContent();
  const { t, language } = useLanguage();

  return (
    <section className="offers-section offers-section-v2 offers-animated">
      {/* Botanical Background Image */}
      <div className="offers-bg-image" aria-hidden="true">
         <div className="offers-radial-glow"></div>
      </div>

      {/* Premium Animations */}
      <div className="offers-animations" aria-hidden="true">
        <DecorativeLeaves variant="offers" count={6} />
        <DecorativePetals variant="offers" count={5} />
        <div className="offers-flying-butterfly butterfly-1"><BundleButterfly tone="blue" /></div>
        <div className="offers-flying-butterfly butterfly-2"><BundleButterfly tone="orange" delay={1} /></div>
        <div className="offers-flying-butterfly butterfly-3"><BundleButterfly tone="pink" delay={2} /></div>
      </div>

      <div className="section-heading center offers-heading">
        <p className="offers-eyebrow">{t('offers.exclusiveDeals')}</p>
        <p className="offers-title">
          <span className="offers-icon offers-icon-left"><LeafSprig /></span>
          {t('offers.offersForYou')}
          <span className="offers-icon offers-icon-right"><LeafSprig /></span>
        </p>
        <p className="section-sub">{t('offers.offersSub')}</p>
        <div className="divider"><span /> <SingleLeaf /> <span /></div>
      </div>

      <div className="offers-grid">
        {OFFERS.map((offer, index) => (
          <div className="offer-card" key={offer.id} style={{ animationDelay: `${index * 0.15}s` }}>
            <div className="offer-copy">
              <h3>{t('offers.buyAny')} {offer.qty} @ ₹{offer.price}</h3>
              <p>{getOfferNoteTranslation(offer.note, language)}</p>
            </div>
            <div className="offer-badge">
              <span>{t('offers.buildBundle')}</span>
            </div>
            <div className="offer-card-media">
              <img src={offer.image} alt="" loading="lazy" />
            </div>
            <Link to="/category/indoor-plants" className="btn-shop-now">{t('offers.shopNow')}</Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default OffersSection;
