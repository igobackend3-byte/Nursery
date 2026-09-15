import { useLanguage } from '../context/LanguageContext';
import { getLandscapingServiceTranslation } from '../i18n/translations';
import landscapingImageMap from '../data/landscapingImageMap.json';

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

// Using images dynamically synced from local folder
function serviceImage(title) {
  return landscapingImageMap[title] || null;
}

function Landscaping() {
  const { t, language } = useLanguage();
  return (
    <div className="garden-services-page">
      <p className="eyebrow">{t('pages.beyondProducts')}</p>
      <h1>{t('pages.landscapingTitle')}</h1>
      <p className="category-tagline">
        {t('pages.landscapingTagline')}
      </p>

      <div className="services-grid large landscaping-grid">
        {LANDSCAPING_SERVICES.map((title) => {
          const image = serviceImage(title);
          const localizedTitle = getLandscapingServiceTranslation(title, language);
          
          if (!image) {
            console.warn(`[MISSING IMAGE] No landscaping image found for: ${title}`);
          }

          return (
            <div className="service-card static compact has-image" key={title}>
              {image ? (
                <img src={image} alt={localizedTitle} loading="lazy" />
              ) : (
                <div style={{ width: '100%', aspectRatio: '4/3', backgroundColor: '#f8f9f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', marginBottom: '14px' }}>
                  🌱
                </div>
              )}
              <h3>{localizedTitle}</h3>
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
        <a href="mailto:ceojohnyesudas@gmail.com" className="btn-find-plant">{t('pages.requestConsultation')}</a>
      </div>
    </div>
  );
}

export default Landscaping;
