import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = 'C:\\Users\\rithi\\OneDrive\\Desktop\\Nursery project\\landscapings';
const destDir = path.join(__dirname, '../public/images/nav-landscaping');
const mapPath = path.join(__dirname, '../src/data/landscapingImageMap.json');

const LANDSCAPING_SERVICES = [
  'Villa Landscaping', 'Balcony Garden', 'Terrace Garden', 'Rooftop Garden', 'Vertical Garden',
  'Courtyard Garden', 'Backyard Garden', 'Frontyard Landscaping', 'Farmhouse Landscaping',
  'Resort Landscaping', 'Hotel Landscaping', 'Apartment Landscaping', 'Gated Community Landscaping',
  'Office Landscaping', 'Commercial Landscaping', 'Corporate Landscaping', 'Industrial Landscaping',
  'Campus Landscaping', 'School Landscaping', 'Hospital Landscaping', 'Temple Landscaping',
  'Park Landscaping', 'Swimming Pool Landscaping', 'Entrance Landscaping', 'Driveway Landscaping',
  'Walkway Landscaping', 'Pergola Garden', 'Gazebo Garden', 'Rock Garden', 'Zen Garden',
  'Tropical Garden', 'Japanese Garden', 'Butterfly Garden', 'Fragrance Garden', 'Herbal Garden',
  'Edible Garden', 'Water Garden', 'Koi Pond Landscaping', 'Fountain Landscaping', 'Bonsai Garden',
  'Succulent Garden', 'Cactus Garden', 'Lawn Development', 'Indoor Green Decor', 'Living Wall',
  'Moss Wall', 'Biophilic Landscaping', 'Sustainable Landscaping', 'Xeriscape Landscaping',
  'Rain Garden', 'Smart Irrigation Landscaping'
];

// Ensure destination exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function normalize(str) {
  return str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

const typoMap = {
  'terracegarden': 'terracgarden',
  'frontyardlandscaping': 'frontyardgarden',
  'apartmentlandscaping': 'aparrtmentlandscaping',
  'fountainlandscaping': 'fountaingarden',
  'cactusgarden': 'catcusgarden',
  'biophiliclandscaping': 'biofiliclandscaping',
  'xeriscapelandscaping': 'xeriscapelanscaping'
};

async function run() {
  if (!fs.existsSync(sourceDir)) {
    console.error(`Source directory not found: ${sourceDir}`);
    return;
  }

  const files = fs.readdirSync(sourceDir).filter(f => !fs.statSync(path.join(sourceDir, f)).isDirectory());
  const imageMap = {};
  let matchedCount = 0;
  let missingCount = 0;

  for (const service of LANDSCAPING_SERVICES) {
    const normService = normalize(service);
    let bestMatch = null;

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (!['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) continue;

      const basename = path.basename(file, path.extname(file));
      const normBasename = normalize(basename);

      // Check exact normalize match, or if basename contains service name (or vice-versa)
      // Also check typo map
      if (normBasename === normService || 
          (typoMap[normService] && normBasename === typoMap[normService]) ||
          (normBasename.length > 5 && normService.length > 5 && 
           (normBasename.includes(normService) || normService.includes(normBasename)))) {
        bestMatch = file;
        break;
      }
    }

    if (bestMatch) {
      const srcPath = path.join(sourceDir, bestMatch);
      const ext = path.extname(bestMatch);
      const safeFilename = service.replace(/[^a-zA-Z0-9]/g, '-') + ext;
      const destPath = path.join(destDir, safeFilename);
      
      fs.copyFileSync(srcPath, destPath);
      imageMap[service] = `/images/nav-landscaping/${safeFilename}`;
      matchedCount++;
    } else {
      console.warn(`[MISSING IMAGE] No matching image found for: ${service}`);
      missingCount++;
    }
  }

  fs.writeFileSync(mapPath, JSON.stringify(imageMap, null, 2));
  console.log(`\nMatched and copied ${matchedCount} images.`);
  console.log(`Missing images for ${missingCount} services.`);
}

run();
