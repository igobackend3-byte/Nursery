import { Link } from 'react-router-dom';
import { useSiteContent } from '../hooks/useSiteContent';
import { useLanguage } from '../context/LanguageContext';
import { getOfferNoteTranslation } from '../i18n/translations';

// Small decorative leaf icon, replacing the old circled-number (①②)
// glyphs either side of the heading and the emoji in the divider -
// purely presentational, no offer data/text/prices/links touched.
function OfferLeafIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C12 22 20 18 20 12V5l-8-3-8 3v7C4 18 12 22 12 22z" /></svg>
  );
}

function OffersSection() {
  const { offers: OFFERS } = useSiteContent();
  const { t, language } = useLanguage();
  return (
    <section className="offers-section">
      <div className="section-heading center">
        <p className="offers-title">
          <span className="offers-icon"><OfferLeafIcon /></span> {t('offers.offersForYou')} <span className="offers-icon"><OfferLeafIcon /></span>
        </p>
        <p className="section-sub">{t('offers.offersSub')}</p>
        <div className="divider"><span /> <OfferLeafIcon /> <span /></div>
      </div>
      <div className="offers-grid">
        {OFFERS.map((offer) => (
          <div className="offer-card" key={offer.id}>
            <div className="offer-copy">
              <h3>{t('offers.buyAny')} {offer.qty} @ ₹{offer.price}</h3>
              <p>{getOfferNoteTranslation(offer.note, language)}</p>
              <Link to="/category/indoor-plants" className="btn-shop-now">{t('offers.shopNow')}</Link>
            </div>
            <div className="offer-badge"><span>{t('offers.buildBundle')}</span></div>
            <div className="offer-card-media">
              <img src={offer.image} alt="" loading="lazy" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default OffersSection;
