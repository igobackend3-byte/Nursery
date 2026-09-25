import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const navPath = path.join(__dirname, '../src/data/navigation.js');
const mapPath = path.join(__dirname, '../src/data/landscapingImageMap.json');

const imageMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

const childrenStr = Object.entries(imageMap).map(([service, image]) => {
  // e.g. { label: 'Villa Landscaping', to: '/landscaping#villa-landscaping', image: '/images/nav-landscaping/Villa Landscaping.png' }
  return `        { label: '${service}', to: '/landscaping#${service.toLowerCase().replace(/ /g, '-')}', image: '${image}' },`;
}).join('\n');

let navContent = fs.readFileSync(navPath, 'utf8');

// Find the line with "label: 'Landscaping', to: '/landscaping'"
const targetLine = "      { label: 'Landscaping', to: '/landscaping' },";
const replacement = `      { 
        label: 'Landscaping', 
        to: '/landscaping',
        children: [
${childrenStr}
        ]
      },`;

if (navContent.includes(targetLine)) {
  navContent = navContent.replace(targetLine, replacement);
  fs.writeFileSync(navPath, navContent);
  console.log('Successfully updated navigation.js');
} else {
  console.log('Could not find target line in navigation.js');
}
