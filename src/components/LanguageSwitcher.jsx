import { useLanguage } from '../context/LanguageContext';

// A native <select> rather than a row of pill buttons - with 6 languages
// (English, Tamil, Hindi, Malayalam, Telugu, Kannada) a button row would
// overflow the header on anything narrower than a wide desktop. A select
// stays compact at any width, is natively keyboard/screen-reader
// accessible, and needs no custom open/close/outside-click handling.
function LanguageSwitcher() {
  const { language, setLanguage, languages, t } = useLanguage();

  return (
    <select
      className="language-switcher-select"
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      aria-label={t('header.language')}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>{lang.label}</option>
      ))}
    </select>
  );
}

export default LanguageSwitcher;
