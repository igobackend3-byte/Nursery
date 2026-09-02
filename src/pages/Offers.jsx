import { Link } from 'react-router-dom';
import OffersSection from '../components/OffersSection';
import { useLanguage } from '../context/LanguageContext';

function Offers() {
  const { t } = useLanguage();
  return (
    <div className="offers-page">
      <p className="breadcrumb"><Link to="/">{t('pages.home')}</Link> / {t('pages.offersEyebrow')}</p>
      <p className="eyebrow">{t('pages.offersEyebrow')}</p>
      <h1>{t('pages.offersTitle')}</h1>
      <p className="category-tagline">
        {t('pages.offersTagline')}
      </p>
      <OffersSection />
    </div>
  );
}

export default Offers;
