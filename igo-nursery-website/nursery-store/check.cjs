const fs = require('fs');
const translations = fs.readFileSync('src/i18n/translations.js', 'utf8');
const siteContent = fs.readFileSync('src/data/siteContent.js', 'utf8');

const tMatch = translations.match(/:\s*['"](.*?)['"]/g) || [];
const sMatch = siteContent.match(/:\s*['"](.*?)['"]/g) || [];

console.log('T:', tMatch.length, 'S:', sMatch.length);
