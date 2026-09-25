const fs = require('fs');
let code = fs.readFileSync('src/i18n/translations.js', 'utf8');

const appendCode = `
// Dynamically translate a string if it exactly matches an English default
const engToPath = {};
function indexEnglishStrings(obj, pathPrefix = '') {
  for (const [key, val] of Object.entries(obj)) {
    const currentPath = pathPrefix ? \`\${pathPrefix}.\${key}\` : key;
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed && !engToPath[trimmed]) {
        engToPath[trimmed] = currentPath;
      }
    } else if (typeof val === 'object' && val !== null) {
      indexEnglishStrings(val, currentPath);
    }
  }
}
indexEnglishStrings(translations.en);

export function translateDynamicString(str, lang) {
  if (!str || typeof str !== 'string' || lang === 'en') return str;
  const trimmed = str.trim();
  const path = engToPath[trimmed];
  if (path) {
    const trans = getTranslation(lang, path);
    if (trans && trans !== path) {
      return str.replace(trimmed, trans);
    }
  }
  if (heroDefaults[str]) return heroDefaults[str][lang] ?? str;
  if (offerNoteDefaults[str]) return offerNoteDefaults[str][lang] ?? str;
  if (reviewTranslations[str]) return reviewTranslations[str][lang] ?? str;
  return str;
}
`;

if (!code.includes('translateDynamicString')) {
  fs.writeFileSync('src/i18n/translations.js', code + '\n' + appendCode);
}
