import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="empty-page">
      <h1>{t('pages.notFoundTitle')}</h1>
      <p>{t('pages.notFoundDesc')}</p>
      <Link to="/" className="btn-build-garden">{t('pages.backToHome')}</Link>
    </div>
  );
}

export default NotFound;
