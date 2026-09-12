import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsFilePath = path.join(__dirname, '../src/data/products.js');
const sourceImagesDirs = [
  'C:\\Users\\rithi\\OneDrive\\Desktop\\Nursery project\\images',
  'C:\\Users\\rithi\\OneDrive\\Desktop\\Nursery project\\plants people love'
];
const destImagesDir = path.join(__dirname, '../public/product-images');
const imageMapPath = path.join(__dirname, '../src/data/imageMap.json');

// Ensure destination exists
if (!fs.existsSync(destImagesDir)) {
  fs.mkdirSync(destImagesDir, { recursive: true });
}

function normalize(str) {
  return str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

async function run() {
  const productsContent = fs.readFileSync(productsFilePath, 'utf-8');
  
  // Extract all `name: 'Something'` from products.js
  const names = [];
  const nameRegex = /name:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = nameRegex.exec(productsContent)) !== null) {
    names.push(match[1]);
  }

  // Get all images
  let allFiles = [];
  function readDirRecursive(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        readDirRecursive(fullPath);
      } else {
        const ext = path.extname(file).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) {
          allFiles.push(fullPath);
        }
      }
    }
  }

  for (const dir of sourceImagesDirs) {
    if (fs.existsSync(dir)) {
      readDirRecursive(dir);
    } else {
      console.warn(`Source directory not found: ${dir}`);
    }
  }

  const imageMap = {};
  let matchedCount = 0;

  for (const name of names) {
    const normName = normalize(name);
    
    // Find matching image
    let bestMatch = null;
    for (const file of allFiles) {
      const basename = path.basename(file, path.extname(file));
      if (normalize(basename) === normName) {
        bestMatch = file;
        break; // First match wins
      }
    }

    if (bestMatch) {
      const ext = path.extname(bestMatch);
      // create safe filename for public directory
      const safeFilename = name.replace(/[^a-zA-Z0-9]/g, '-') + ext;
      const destPath = path.join(destImagesDir, safeFilename);
      
      fs.copyFileSync(bestMatch, destPath);
      imageMap[name] = `/product-images/${safeFilename}`;
      matchedCount++;
    }
  }

  fs.writeFileSync(imageMapPath, JSON.stringify(imageMap, null, 2));
  console.log(`Matched and copied ${matchedCount} images for ${names.length} products.`);
}

run();
