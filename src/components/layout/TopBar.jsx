import { useLanguage } from '../../context/LanguageContext';
import { getTopBarMessageTranslation } from '../../i18n/translations';

function TopBar() {
  const { language } = useLanguage();
  const message = getTopBarMessageTranslation(language);
  return (
    <div className="top-bar">
      <p>
        {message} {message}
      </p>
    </div>
  );
}

export default TopBar;
