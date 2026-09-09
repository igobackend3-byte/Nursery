import { Link } from 'react-router-dom';
import { useSiteContent } from '../hooks/useSiteContent';
import { useLanguage } from '../context/LanguageContext';
import { getOfferNoteTranslation } from '../i18n/translations';
import { useScrollReveal } from '../hooks/useScrollReveal';
import DecorativeLeaves from './DecorativeLeaves';
import DecorativeFlowers from './DecorativeFlowers';
import SectionVine from './SectionVine';

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
  // Only used to trigger the new corner vine's one-time draw-in below -
  // does not touch the section's own className or the existing
  // mount-triggered offer-card entrance animation.
  const [vineRef, vineVisible] = useScrollReveal(0.15);
  return (
    <section className="offers-section" ref={vineRef}>
      <DecorativeLeaves variant="offers" count={3} />
      <DecorativeFlowers variant="offers" count={2} />
      <SectionVine variant="offers" active={vineVisible} />
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
            </div>
            <div className="offer-badge"><span>{t('offers.buildBundle')}</span></div>
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
