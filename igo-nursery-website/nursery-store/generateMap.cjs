const fs = require('fs');

// We will read translations.js and evaluate it to get the `bySection` or `translations` object.
// But it's an ES module. Let's write a simple regex or parser, or just import it dynamically.

(async () => {
  const translations = await import('./src/i18n/translations.js');
  const dicts = translations.translations;
  const enDict = dicts.en;
  
  const map = {};
  
  function buildReverseMap(obj) {
    const reverse = {};
    function traverse(o, path) {
      for (const [k, v] of Object.entries(o)) {
        if (typeof v === 'string') {
          reverse[v.trim()] = path ? `${path}.${k}` : k;
        } else if (typeof v === 'object' && v !== null) {
          traverse(v, path ? `${path}.${k}` : k);
        }
      }
    }
    traverse(obj, '');
    return reverse;
  }
  
  const reverseEn = buildReverseMap(enDict);
  
  // Custom splits
  reverseEn['Grown with data,'] = 'custom_whyIgo_1';
  reverseEn['delivered with care'] = 'custom_whyIgo_2';
  
  const langs = ['ta', 'hi', 'ml', 'te', 'kn'];
  
  const fullDict = {};
  
  for (const lang of langs) {
    fullDict[lang] = {};
    const targetDict = dicts[lang];
    
    // Add custom splits
    const custom = {
      ta: { custom_whyIgo_1: 'தரவுகளுடன் வளர்க்கப்பட்டு,', custom_whyIgo_2: 'அக்கறையுடன் வழங்கப்படுகிறது' },
      hi: { custom_whyIgo_1: 'डेटा के साथ उगाया गया,', custom_whyIgo_2: 'देखभाल के साथ पहुंचाया गया' },
      ml: { custom_whyIgo_1: 'ഡാറ്റയോടെ വളർത്തി,', custom_whyIgo_2: 'കരുതലോടെ എത്തിക്കുന്നു' },
      te: { custom_whyIgo_1: 'డేటాతో పెంచబడి,', custom_whyIgo_2: 'శ్రద్ధతో అందించబడుతుంది' },
      kn: { custom_whyIgo_1: 'ಡೇಟಾದೊಂದಿಗೆ ಬೆಳೆಸಲಾಗಿದೆ,', custom_whyIgo_2: 'ಕಾಳಜಿಯಿಂದ ತಲುಪಿಸಲಾಗಿದೆ' }
    };
    
    function getValByPath(obj, path) {
      if (path.startsWith('custom_')) return custom[lang][path];
      return path.split('.').reduce((acc, key) => acc?.[key], obj);
    }
    
    for (const [enStr, path] of Object.entries(reverseEn)) {
      const translated = getValByPath(targetDict, path);
      if (translated) {
        fullDict[lang][enStr] = translated;
      }
    }
  }
  
  const fileContent = `export const siteContentStringMap = ${JSON.stringify(fullDict, null, 2)};\n`;
  fs.writeFileSync('src/i18n/siteContentStringMap.js', fileContent);
  console.log('Successfully generated siteContentStringMap.js');
})();
