import { useLanguage } from '../context/LanguageContext';

const LANDSCAPING_SERVICES = [
  'Villa Landscaping', 'Balcony Garden', 'Terrace Garden', 'Rooftop Garden', 'Vertical Garden',
  'Courtyard Garden', 'Backyard Garden', 'Frontyard Landscaping', 'Farmhouse Landscaping',
  'Resort Landscaping', 'Hotel Landscaping', 'Apartment Landscaping', 'Gated Community Landscaping',
  'Office Landscaping', 'Commercial Landscaping', 'Corporate Landscaping', 'Industrial Landscaping',
  'Campus Landscaping', 'School Landscaping', 'Hospital Landscaping', 'Temple Landscaping',
  'Park Landscaping', 'Swimming Pool Landscaping', 'Entrance Landscaping', 'Driveway Landscaping',
  'Walkway Landscaping', 'Pergola Garden', 'Gazebo Garden', 'Rock Garden', 'Zen Garden',
  'Tropical Garden', 'Japanese Garden', 'Butterfly Garden', 'Fragrance Garden', 'Herbal Garden',
  'Edible Garden', 'Water Garden', 'Koi Pond Landscaping', 'Fountain Landscaping', 'Bonsai Garden',
  'Succulent Garden', 'Cactus Garden', 'Lawn Development', 'Indoor Green Decor', 'Living Wall',
  'Moss Wall', 'Biophilic Landscaping', 'Sustainable Landscaping', 'Xeriscape Landscaping',
  'Rain Garden', 'Smart Irrigation Landscaping',
];

// The photos in public/images/landscaping-services/ are numbered 01-32 in
// the same order as the first 32 services above (see
// Garden_Images_Separate, the source folder) - e.g. "01_Villa_Landscaping.png"
// for "Villa Landscaping". Only those first 32 services have a matching
// photo right now, so the remaining ones (Butterfly Garden onward) keep the
// original text-only card rather than showing a placeholder.
const SERVICE_IMAGE_COUNT = 32;
function serviceImage(title, index) {
  if (index >= SERVICE_IMAGE_COUNT) return null;
  const num = String(index + 1).padStart(2, '0');
  return `/images/landscaping-services/${num}_${title.replace(/ /g, '_')}.png`;
}

function Landscaping() {
  const { t } = useLanguage();
  return (
    <div className="garden-services-page">
      <p className="eyebrow">{t('pages.beyondProducts')}</p>
      <h1>{t('pages.landscapingTitle')}</h1>
      <p className="category-tagline">
        {t('pages.landscapingTagline')}
      </p>

      <div className="services-grid large landscaping-grid">
        {LANDSCAPING_SERVICES.map((title, index) => {
          const image = serviceImage(title, index);
          return (
            <div className={`service-card static compact${image ? ' has-image' : ''}`} key={title}>
              {image && <img src={image} alt={title} loading="lazy" />}
              <h3>{title}</h3>
            </div>
          );
        })}
      </div>

      <div className="plant-finder-band">
        <div>
          <p className="eyebrow light">{t('pages.getStarted')}</p>
          <h2>{t('pages.tellUsAboutSpace')}</h2>
          <p>{t('pages.tellUsDesc')}</p>
        </div>
        <a href="mailto:hello@igonursery.com" className="btn-find-plant">{t('pages.requestConsultation')}</a>
      </div>
    </div>
  );
}

export default Landscaping;
