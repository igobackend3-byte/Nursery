import { Link } from 'react-router-dom';
import { useSiteContent } from '../hooks/useSiteContent';

function OffersSection() {
  const { offers: OFFERS } = useSiteContent();
  return (
    <section className="offers-section">
      <div className="section-heading center">
        <p className="offers-title">
          <span className="offers-icon">①</span> Offers For You <span className="offers-icon">②</span>
        </p>
        <p className="section-sub">Amazing deals to make your garden beautiful</p>
        <div className="divider"><span /> 🌿 <span /></div>
      </div>
      <div className="offers-grid">
        {OFFERS.map((offer) => (
          <div className="offer-card" key={offer.id}>
            <div className="offer-copy">
              <h3>BUY ANY {offer.qty} @ ₹{offer.price}</h3>
              <p>{offer.note}</p>
              <Link to="/category/indoor-plants" className="btn-shop-now">SHOP NOW →</Link>
            </div>
            <div className="offer-badge">BUILD YOUR OWN BUNDLE</div>
            <img src={offer.image} alt="" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default OffersSection;
