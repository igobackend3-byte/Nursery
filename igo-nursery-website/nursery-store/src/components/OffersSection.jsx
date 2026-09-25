import { Link } from 'react-router-dom';
import { useSiteContent } from '../hooks/useSiteContent';
import { useLanguage } from '../context/LanguageContext';
import { getOfferNoteTranslation } from '../i18n/translations';
import EditableElement from '../admin/editor/EditableElement';

function SingleLeaf() {
  return (
    <svg viewBox="0 0 40 24" fill="currentColor" aria-hidden="true" width="20" height="12">
      <path d="M2 20C10 6 26 2 38 4 34 14 20 22 2 20Z" />
    </svg>
  );
}

function CornerLeaf() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="corner-leaf-svg">
      <path d="M10 90C30 40 80 10 90 10C80 50 40 80 10 90Z" fill="currentColor" opacity="0.15" />
    </svg>
  );
}

function SmallLeaf() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="small-leaf-svg">
      <path d="M4 20C10 10 20 4 20 4C20 12 14 18 4 20Z" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

function OffersSection() {
  const { offers = {} } = useSiteContent();
  const { t, language } = useLanguage();
  
  // Provide defaults in case the old array structure was cached
  const items = Array.isArray(offers) ? offers : (offers.items || []);
  const eyebrowText = offers.eyebrow || t('offers.exclusiveDeals');
  const headingText = offers.heading || t('offers.offersForYou');
  const subtitleText = offers.subtitle || t('offers.offersSub') || 'Amazing deals to make your garden beautiful';

  return (
    <section className="offers-section-premium">
      <div className="offers-bg-premium" aria-hidden="true" style={offers.backgroundImage ? { backgroundImage: `url(${offers.backgroundImage})` } : {}}></div>

      <div className="offers-content-wrapper">
        <div className="offers-premium-header">
          <div className="offers-eyebrow-premium">
            <span className="line"></span>
            <EditableElement sectionKey="offers" field="eyebrow" label="Eyebrow">
              <span>{eyebrowText}</span>
            </EditableElement>
            <span className="line"></span>
          </div>
          <h2 className="offers-title-premium">
            <EditableElement sectionKey="offers" field="heading" label="Heading">
              <span>{headingText}</span>
            </EditableElement>
            <span className="leaf-accent"><SingleLeaf /></span>
          </h2>
          <EditableElement sectionKey="offers" field="subtitle" label="Subtitle">
            <p className="offers-subtitle-premium">{subtitleText}</p>
          </EditableElement>
          <div className="offers-divider-premium">
            <span className="line"></span>
            <SingleLeaf />
            <span className="line"></span>
          </div>
        </div>

        <div className="offers-premium-grid">
          {items.map((offer, index) => (
            <div className="offer-premium-card" key={offer.id || index} style={{ animationDelay: `${index * 0.1}s` }}>
              <EditableElement sectionKey="offers" field={`items.${index}.image`} type="image" label="Card Image">
                <div className="offer-premium-media">
                  <img src={offer.image} alt={`Offer ${offer.id}`} loading="lazy" />
                </div>
              </EditableElement>
              <div className="offer-premium-badge">
                <span>{t('offers.buildBundle')}</span>
              </div>
              <div className="offer-premium-details">
                <EditableElement sectionKey="offers" field={`items.${index}.qty`} label="Quantity">
                  <h3>{t('offers.buyAny')} {offer.qty} @ ₹{offer.price}</h3>
                </EditableElement>
                <EditableElement sectionKey="offers" field={`items.${index}.note`} label="Note">
                  <p>{getOfferNoteTranslation(offer.note, language)}</p>
                </EditableElement>
                <Link to="/category/indoor-plants" className="btn-shop-now-premium">
                  {t('offers.shopNow')} &rarr;
                </Link>
                <div className="card-leaf-decoration">
                  <SmallLeaf />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Decorative corner leaves */}
      <div className="offers-corner top-left"><CornerLeaf /></div>
      <div className="offers-corner top-right"><CornerLeaf /></div>
    </section>
  );
}

export default OffersSection;
