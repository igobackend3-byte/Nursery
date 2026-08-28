const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/products.js');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = {
  'indoor-plants': '/category-banners/indoor plants banner image.png',
  'outdoor-plants': '/category-banners/outdoor plants banner image.png',
  'bonsai': '/category-banners/Bonsai & Orchids bsckground image.jpg',
  'palms': '/category-banners/palms banner image.png',
  'cycads': '/category-banners/cycads banner image.png',
  'succulents': '/category-banners/catcus background image.jpg',
  'cactus': '/category-banners/catcus background image.jpg',
  'table-top-plants': '/category-banners/Table Top & Mini Plants background image.jpg',
  'mini-plants': '/category-banners/Table Top & Mini Plants background image.jpg',
  'orchids': '/category-banners/Bonsai & Orchids bsckground image.jpg',
  'bromeliads': '/category-banners/Bromeliads, Ferns & Carnivorous Plants background image.jpg',
  'ferns': '/category-banners/Bromeliads, Ferns & Carnivorous Plants background image.jpg',
  'carnivorous-plants': '/category-banners/Bromeliads, Ferns & Carnivorous Plants background image.jpg',
  'aquatic-pond-plants': '/category-banners/Aquatic & Pond Plants background image.jpg',
  'vertical-garden-plants': '/category-banners/Vertical Garden & Green Wall Plants background image.jpg',
  'green-wall-plants': '/category-banners/Vertical Garden & Green Wall Plants background image.jpg',
  'terrace-garden-plants': '/category-banners/Terrace, Balcony & Hanging Basket Plants background image.jpg',
  'balcony-plants': '/category-banners/Terrace, Balcony & Hanging Basket Plants background image.jpg',
  'hanging-basket-plants': '/category-banners/Terrace, Balcony & Hanging Basket Plants background image.jpg',
  'fruit-plants': '/category-banners/outdoor plants banner image.png',
  'herbs': '/category-banners/Table Top & Mini Plants background image.jpg',
  'medicinal-plants': '/category-banners/indoor plants banner image.png',
  'aromatic-plants': '/category-banners/indoor plants banner image.png',
  'spice-plants': '/category-banners/outdoor plants banner image.png',
  'sacred-plants': '/category-banners/indoor plants banner image.png',
  'butterfly-garden-plants': '/category-banners/outdoor plants banner image.png',
  'bee-friendly-plants': '/category-banners/outdoor plants banner image.png',
  'bird-attracting-plants': '/category-banners/outdoor plants banner image.png',
  'fragrant-plants': '/category-banners/indoor plants banner image.png',
  'edible-flowers': '/category-banners/outdoor plants banner image.png',
  'coastal-plants': '/category-banners/outdoor plants banner image.png',
  'landscaping-trees': '/category-banners/outdoor plants banner image.png',
  'landscaping-plants': '/category-banners/outdoor plants banner image.png',
};

// We will find each object matching the slug and replace the image property.
// Example: { slug: 'indoor-plants', label: '...', tagline: '...', image: '...' }
// Let's use a regex that matches the slug and updates the image field.

Object.keys(replacements).forEach(slug => {
  const newImage = replacements[slug];
  const regex = new RegExp(`({\\s*slug:\\s*'${slug}',[\\s\\S]*?image:\\s*')[^']*(',?\\s*})`);
  content = content.replace(regex, `$1${newImage}$2`);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Updated products.js');
