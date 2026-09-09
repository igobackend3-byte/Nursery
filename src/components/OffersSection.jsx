import { Link } from 'react-router-dom';
import { useSiteContent } from '../hooks/useSiteContent';
import { useLanguage } from '../context/LanguageContext';
import { getOfferNoteTranslation } from '../i18n/translations';
import { useScrollReveal } from '../hooks/useScrollReveal';
import DecorativeLeaves from './DecorativeLeaves';
import DecorativeFlowers from './DecorativeFlowers';
import DecorativePetals from './DecorativePetals';
import SectionVine from './SectionVine';
import HangingVine from './HangingVine';
import DecorativeGlow from './DecorativeGlow';
import BundleButterfly from './BundleButterfly';

// Small decorative leaf icon, replacing the old circled-number (①②)
// glyphs either side of the heading and the emoji in the divider -
// purely presentational, no offer data/text/prices/links touched.
function OfferLeafIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C12 22 20 18 20 12V5l-8-3-8 3v7C4 18 12 22 12 22z" /></svg>
  );
}

// One tone/delay per badge, cycled by index, so no two badges' butterflies
// flap in perfect sync or share the exact same colour.
const BUNDLE_BUTTERFLY_TONES = [
  { tone: 'orange', delay: 0 },
  { tone: 'blue', delay: 0.6 },
  { tone: 'pink', delay: 1.1 },
  { tone: 'yellow', delay: 0.3 },
  { tone: 'purple', delay: 0.9 },
];

function OffersSection() {
  const { offers: OFFERS } = useSiteContent();
  const { t, language } = useLanguage();
  const [vineRef, vineVisible] = useScrollReveal(0.15);
  return (
    <section className="offers-section" ref={vineRef} style={{ position: 'relative' }}>
      <DecorativeGlow variant="offers" />
      <HangingVine variant="offers" side="left" active={vineVisible} />
      <HangingVine variant="offers" side="right" active={vineVisible} />
      <DecorativeLeaves variant="offers" count={3} />
      <DecorativeFlowers variant="offers" count={2} />
      <DecorativePetals variant="offers" count={3} />
      <SectionVine variant="offers" active={vineVisible} />
      
      <div className="section-heading center" style={{ position: 'relative' }}>
        <p className="offers-title">
          <span className="offers-icon"><OfferLeafIcon /></span> {t('offers.offersForYou')} <span className="offers-icon"><OfferLeafIcon /></span>
        </p>
        <p className="section-sub">{t('offers.offersSub')}</p>
        <div className="divider"><span /> <OfferLeafIcon /> <span /></div>
      </div>
      <div className="offers-grid">
        {OFFERS.map((offer, i) => {
          const butterfly = BUNDLE_BUTTERFLY_TONES[i % BUNDLE_BUTTERFLY_TONES.length];
          return (
          <div className="offer-card" key={offer.id}>
            <div className="offer-copy">
              <h3>{t('offers.buyAny')} {offer.qty} @ ₹{offer.price}</h3>
              <p>{getOfferNoteTranslation(offer.note, language)}</p>
            </div>
            <div className="offer-badge">
              <span>{t('offers.buildBundle')}</span>
              <BundleButterfly tone={butterfly.tone} delay={butterfly.delay} />
            </div>
            <div className="offer-card-media">
              <img src={offer.image} alt="" loading="lazy" />
            </div>
            <Link to="/category/indoor-plants" className="btn-shop-now">{t('offers.shopNow')}</Link>
          </div>
          );
        })}
      </div>
    </section>
  );
}

export default OffersSection;
