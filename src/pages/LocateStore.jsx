import { useLanguage } from '../context/LanguageContext';

function LocateStore() {
  const { t } = useLanguage();
  return (
    <div className="locate-store-page">
      <p className="eyebrow">{t('pages.visitUs')}</p>
      <h1>{t('pages.locateStoreTitle')}</h1>
      <p className="category-tagline">IGO Nursery — Muttukadu Lab &amp; Store</p>

      <div className="store-layout">
        <div className="store-map">
          <iframe
            title="IGO Nursery location"
            src="https://www.openstreetmap.org/export/embed.html?bbox=80.22%2C12.79%2C80.28%2C12.85&layer=mapnik&marker=12.82%2C80.25"
            loading="lazy"
          />
        </div>
        <div className="store-details">
          <h3>Muttukadu Lab &amp; Store</h3>
          <p>ECR Road, Muttukadu, Chennai, Tamil Nadu 603112</p>
          <h4>{t('pages.storeHours')}</h4>
          <p>Mon–Sat: 9:00 AM – 7:00 PM<br />Sun: 10:00 AM – 5:00 PM</p>
          <h4>{t('pages.contact')}</h4>
          <p>+91 98765 43210<br />hello@igonursery.com</p>
        </div>
      </div>
    </div>
  );
}

export default LocateStore;
