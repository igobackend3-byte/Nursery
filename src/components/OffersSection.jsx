import { Link } from 'react-router-dom';
import { useSiteContent } from '../hooks/useSiteContent';
import { useLanguage } from '../context/LanguageContext';

function OffersSection() {
  const { offers: OFFERS } = useSiteContent();
  const { t } = useLanguage();
  return (
    <section className="offers-section">
      <div className="section-heading center">
        <p className="offers-title">
          <span className="offers-icon">①</span> {t('offers.offersForYou')} <span className="offers-icon">②</span>
        </p>
        <p className="section-sub">{t('offers.offersSub')}</p>
        <div className="divider"><span /> 🌿 <span /></div>
      </div>
      <div className="offers-grid">
        {OFFERS.map((offer) => (
          <div className="offer-card" key={offer.id}>
            <div className="offer-copy">
              <h3>{t('offers.buyAny')} {offer.qty} @ ₹{offer.price}</h3>
              <p>{offer.note}</p>
              <Link to="/category/indoor-plants" className="btn-shop-now">{t('offers.shopNow')}</Link>
            </div>
            <div className="offer-badge">{t('offers.buildBundle')}</div>
            <img src={offer.image} alt="" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default OffersSection;
