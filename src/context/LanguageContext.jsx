import { createContext, useContext, useEffect, useState } from 'react';
import { getTranslation, LANGUAGES } from '../i18n/translations';

const STORAGE_KEY = 'igo_lang';
const VALID_CODES = LANGUAGES.map((l) => l.code);
const LanguageContext = createContext(null);

function getInitialLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (VALID_CODES.includes(stored)) return stored;
  } catch {
    // localStorage unavailable (private mode, etc.) - fall back silently.
  }
  return 'en';
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Not fatal - the choice just won't survive a refresh this session.
    }
    document.documentElement.lang = language;
  }, [language]);

  function setLanguage(lang) {
    if (VALID_CODES.includes(lang)) setLanguageState(lang);
  }

  function t(path) {
    return getTranslation(language, path);
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
