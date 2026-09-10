import { Link } from 'react-router-dom';
import { useSiteContent } from '../hooks/useSiteContent';
import { useLanguage } from '../context/LanguageContext';
import { getOfferNoteTranslation } from '../i18n/translations';
// Note: this section is intentionally static - no scroll-reveal, no
// ambient motion, per the "keep everything static" brief.

// An elegant little leafy sprig used either side of the heading and,
// larger, hanging from the section's top corners.
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

function TinyFlower() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="2.6" className="offers-flower-center" />
      <circle cx="12" cy="6" r="3" />
      <circle cx="17.2" cy="9.5" r="3" />
      <circle cx="15" cy="16" r="3" />
      <circle cx="9" cy="16" r="3" />
      <circle cx="6.8" cy="9.5" r="3" />
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

// Purely decorative, fully STATIC backdrop - leaves hanging from the top
// corners, small pink flowers and green leaves scattered around the
// edges, and a soft garden-light wash. Nothing here moves.
// aria-hidden, pointer-events:none, sits behind the heading and cards.
function OffersBackdrop() {
  return (
    <div className="offers-bg" aria-hidden="true">
      <span className="offers-bokeh offers-bokeh-1" />
      <span className="offers-bokeh offers-bokeh-2" />
      <span className="offers-bokeh offers-bokeh-3" />

      <span className="offers-hang offers-hang-left"><LeafSprig /></span>
      <span className="offers-hang offers-hang-right"><LeafSprig /></span>

      <span className="offers-flower offers-flower-1"><TinyFlower /></span>
      <span className="offers-flower offers-flower-2"><TinyFlower /></span>
      <span className="offers-flower offers-flower-3"><TinyFlower /></span>
      <span className="offers-flower offers-flower-4"><TinyFlower /></span>
      <span className="offers-flower offers-flower-5"><TinyFlower /></span>
      <span className="offers-flower offers-flower-6"><TinyFlower /></span>

      <span className="offers-float-leaf offers-float-leaf-1"><SingleLeaf /></span>
      <span className="offers-float-leaf offers-float-leaf-2"><SingleLeaf /></span>
      <span className="offers-float-leaf offers-float-leaf-3"><SingleLeaf /></span>
      <span className="offers-float-leaf offers-float-leaf-4"><SingleLeaf /></span>
    </div>
  );
}

function OffersSection() {
  const { offers: OFFERS } = useSiteContent();
  const { t, language } = useLanguage();

  return (
    <section className="offers-section offers-section-v2">
      <OffersBackdrop />

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
        {OFFERS.map((offer) => (
          <div className="offer-card" key={offer.id}>
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
