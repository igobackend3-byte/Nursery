import { Link } from 'react-router-dom';

export const OFFERS = [
  { qty: 4, price: 799, note: 'WITH GROW POT', image: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?q=80&w=500&auto=format&fit=crop' },
  { qty: 4, price: 999, note: 'WITH KRISH POT', image: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?q=80&w=500&auto=format&fit=crop' },
  { qty: 4, price: 1199, note: 'WITH LAGOS POT', image: 'https://images.unsplash.com/photo-1611048267451-e6ed903d4a38?q=80&w=500&auto=format&fit=crop' },
];

function OffersSection() {
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
          <div className="offer-card" key={offer.price}>
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
