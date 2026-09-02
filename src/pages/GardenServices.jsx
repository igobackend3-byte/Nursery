import { useLanguage } from '../context/LanguageContext';

const SERVICES = [
  { title: 'Terrace Garden', desc: 'Turn an unused terrace into a shaded, plant-filled retreat — from layout to irrigation.' },
  { title: 'Balcony Garden', desc: 'Compact planting plans designed for railing planters, vertical racks and tight corners.' },
  { title: 'Landscaping', desc: 'Full outdoor landscaping for homes and offices, from lawn to layered plant beds.' },
  { title: 'Plant Maintenance', desc: 'Scheduled watering, pruning and pest checks so your garden stays healthy year-round.' },
];

function GardenServices() {
  const { t } = useLanguage();
  return (
    <div className="garden-services-page">
      <p className="eyebrow">{t('pages.beyondProducts')}</p>
      <h1>{t('pages.gardenServicesTitle')}</h1>
      <p className="category-tagline">{t('pages.gardenServicesTagline')}</p>

      <div className="services-grid large">
        {SERVICES.map((service) => (
          <div className="service-card static" key={service.title}>
            <h3>{service.title}</h3>
            <p>{service.desc}</p>
            <span>{t('pages.learnMore')}</span>
          </div>
        ))}
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

export default GardenServices;
