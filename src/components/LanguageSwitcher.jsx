import { useLanguage } from '../context/LanguageContext';

// Simple two-way EN / தமிழ் toggle - visible in the header, persists via
// LanguageContext (localStorage). Kept as plain buttons rather than a
// dropdown so it stays compact and doesn't add another click to switch.
function LanguageSwitcher() {
  const { language, setLanguage, languages, t } = useLanguage();

  return (
    <div className="language-switcher" role="group" aria-label={t('header.language')}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          className={`language-switcher-btn${language === lang.code ? ' active' : ''}`}
          onClick={() => setLanguage(lang.code)}
          aria-pressed={language === lang.code}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
