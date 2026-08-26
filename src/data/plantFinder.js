// Plant Finder matching logic. Every signal used here comes from real fields
// already in the plant catalogue (category, size, price, rating) - nothing
// is invented. Category groupings below are an editorial UX grouping of
// real category slugs (same technique already used for the homepage
// "Beginner-Friendly" section), not a new data field.
import { PRODUCTS } from './products';

export const QUESTIONS = [
  {
    id: 'space',
    question: 'Where will your plant live?',
    options: [
      { value: 'indoor', label: 'Indoors', hint: 'Living room, bedroom, desk, office' },
      { value: 'outdoor', label: 'Outdoors', hint: 'Balcony, terrace, garden' },
    ],
  },
  {
    id: 'size',
    question: 'How much space do you have for it?',
    options: [
      { value: 'small', label: 'Small', hint: 'Desk, shelf or windowsill' },
      { value: 'medium', label: 'Medium', hint: 'A corner or side table' },
      { value: 'large', label: 'Large', hint: 'Floor space to spare' },
    ],
  },
  {
    id: 'experience',
    question: 'How much plant experience do you have?',
    options: [
      { value: 'beginner', label: 'Just starting out', hint: 'Something forgiving and easy' },
      { value: 'experienced', label: "I've kept plants before", hint: 'Open to something more particular' },
    ],
  },
  {
    id: 'budget',
    question: "What's your budget?",
    options: [
      { value: 'low', label: 'Under ₹250', hint: '' },
      { value: 'mid', label: '₹250 – ₹500', hint: '' },
      { value: 'high', label: '₹500+', hint: '' },
    ],
  },
];

const INDOOR_SLUGS = new Set([
  'indoor-plants', 'succulents', 'cactus', 'mini-plants', 'table-top-plants',
  'bonsai', 'orchids', 'herbs', 'ferns', 'bromeliads', 'carnivorous-plants',
  'medicinal-plants', 'aromatic-plants', 'green-wall-plants', 'cycads',
  'aquatic-pond-plants', 'fragrant-plants',
]);

const OUTDOOR_SLUGS = new Set([
  'outdoor-plants', 'landscaping-plants', 'landscaping-trees', 'fruit-plants',
  'palms', 'coastal-plants', 'spice-plants', 'sacred-plants',
  'terrace-garden-plants', 'balcony-plants', 'hanging-basket-plants',
  'vertical-garden-plants', 'butterfly-garden-plants', 'bee-friendly-plants',
  'bird-attracting-plants', 'edible-flowers',
]);

// Categories that are broadly easier to keep alive - used only to break ties
// toward more forgiving picks for beginners, never to hide other results.
const BEGINNER_EASY_SLUGS = new Set([
  'indoor-plants', 'succulents', 'cactus', 'mini-plants', 'table-top-plants',
  'outdoor-plants', 'balcony-plants', 'herbs',
]);

const BUDGET_RANGES = {
  low: { min: 0, max: 250 },
  mid: { min: 250, max: 500 },
  high: { min: 500, max: Infinity },
};

// Parses the real `size` field (e.g. "Small (Under 20cm)", "Large (Above
// 60cm)", "Medium (20-60cm)") into a small/medium/large bucket.
export function getPlantSizeBucket(product) {
  const label = product.size || '';
  if (/small/i.test(label)) return 'small';
  if (/large/i.test(label)) return 'large';
  if (/medium/i.test(label)) return 'medium';
  return null;
}

function scorePlant(product, answers) {
  let score = 0;

  const sizeBucket = getPlantSizeBucket(product);
  if (sizeBucket === answers.size) score += 2;
  else if (sizeBucket) score += 1; // any known size beats an unknown one

  const { min, max } = BUDGET_RANGES[answers.budget];
  if (product.price >= min && product.price <= max) score += 2;
  else if (product.price <= max * 1.2) score += 1;

  if (answers.experience === 'beginner' && BEGINNER_EASY_SLUGS.has(product.category)) {
    score += 2;
  }

  score += (product.rating || 0) / 5; // gentle tiebreaker toward higher-rated plants

  return score;
}

// Returns up to `count` matches for the given quiz answers, plus whether the
// result set had to be widened because strict matches were too thin - so the
// UI can be honest about it instead of silently padding the list.
export function matchPlants(answers, count = 8) {
  const spaceSlugs = answers.space === 'indoor' ? INDOOR_SLUGS : OUTDOOR_SLUGS;
  const pool = PRODUCTS.filter((p) => spaceSlugs.has(p.category));

  const scored = pool
    .map((p) => ({ product: p, score: scorePlant(p, answers) }))
    .sort((a, b) => b.score - a.score);

  const strongMatches = scored.filter((s) => s.score >= 3);
  const widened = strongMatches.length < 3;
  const results = (widened ? scored : strongMatches).slice(0, count).map((s) => s.product);

  return { results, widened };
}
