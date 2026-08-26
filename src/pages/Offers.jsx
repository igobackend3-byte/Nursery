import { Link } from 'react-router-dom';
import OffersSection from '../components/OffersSection';

function Offers() {
  return (
    <div className="offers-page">
      <p className="breadcrumb"><Link to="/">Home</Link> / Offers</p>
      <p className="eyebrow">OFFERS</p>
      <h1>All offers, in one place</h1>
      <p className="category-tagline">
        Plant bundles, category discounts and seasonal deals across the IGO catalogue.
      </p>
      <OffersSection />
    </div>
  );
}

export default Offers;
