const fs = require('fs');

const newCode = `import { useState, createContext, useContext, useMemo } from 'react';
import { getSiteContent } from '../lib/contentStore';
import { useLanguage } from '../context/LanguageContext';
import { translateDynamicString } from '../i18n/translations';

export const SiteContentContext = createContext(null);

function deeplyTranslateContent(obj, lang) {
  if (lang === 'en' || !obj) return obj;
  if (Array.isArray(obj)) {
    return obj.map(v => deeplyTranslateContent(v, lang));
  } else if (typeof obj === 'object') {
    const res = {};
    for (const [k, v] of Object.entries(obj)) {
      res[k] = deeplyTranslateContent(v, lang);
    }
    return res;
  } else if (typeof obj === 'string') {
    return translateDynamicString(obj, lang);
  }
  return obj;
}

export function useSiteContent() {
  const contextContent = useContext(SiteContentContext);
  const [content] = useState(getSiteContent);
  const { language } = useLanguage();
  
  const baseContent = contextContent || content;
  
  return useMemo(() => {
    return deeplyTranslateContent(baseContent, language);
  }, [baseContent, language]);
}
`;

fs.writeFileSync('src/hooks/useSiteContent.js', newCode);
