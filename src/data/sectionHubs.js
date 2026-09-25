// Static (code-level) config for the 4 nav sections that share the Plants
// hub's page pattern (hero -> single-row category circles -> "View All
// Categories" -> "Popular X" products -> "View All"). Everything that
// changes per admin edit (hero text, which categories/products to show)
// lives in the CMS content store (see DEFAULT_SITE_CONTENT's
// plantsHub/seedsHub/potsHub/plantCareHub); this file only holds the fixed,
// non-editable facts: which real category slugs exist for the section, the
// umbrella slug CategoryPage aggregates under, and default section copy.
import {
  ALL_PLANT_CATEGORY_SLUGS, SEED_SUBCATEGORY_SLUGS, POT_SUBCATEGORY_SLUGS,
  ALL_PLANT_CARE_CATEGORY_SLUGS,
} from './products';

export const SECTION_HUBS = {
  plants: {
    contentKey: 'plantsHub',
    basePath: '/plants',
    umbrellaSlug: 'plants',
    navLabel: 'Plants',
    allCategorySlugs: ALL_PLANT_CATEGORY_SLUGS,
    exploreHeading: 'Explore Plant Categories',
    popularHeading: 'Popular Plants',
    defaultHero: {
      eyebrow: 'PLANTS',
      title: 'Plants',
      subtitle: 'Bring nature closer to your home. Discover a wide range of beautiful plants for every space and style.',
    },
    defaultPopularSubtitle: 'Handpicked favourites loved by plant parents.',
    suggestedPopularNames: [
      'Peace Lily', 'Money Plant', 'Snake Plant', 'Jade Plant', 'Areca Palm', 'Monstera', 'ZZ Plant',
      'Spider Plant', 'Anthurium', 'Rubber Plant', 'Fiddle Leaf Fig', 'Philodendron', 'Calathea',
      'Lavender', 'Croton',
    ],
  },
  seeds: {
    contentKey: 'seedsHub',
    basePath: '/seeds',
    umbrellaSlug: 'seeds',
    navLabel: 'Seeds',
    allCategorySlugs: SEED_SUBCATEGORY_SLUGS,
    exploreHeading: 'Explore Seed Categories',
    popularHeading: 'Popular Seeds',
    defaultHero: {
      eyebrow: 'SEEDS',
      title: 'Seeds',
      subtitle: 'Explore a wide range of quality seeds for vegetables, flowers, herbs, fruits and more.',
    },
    defaultPopularSubtitle: 'Popular choices for home gardens and kitchen gardens.',
    suggestedPopularNames: [
      'Tomato Seeds', 'Chilli Seeds', 'Brinjal Seeds', 'Okra Seeds', 'Coriander Seeds', 'Spinach Seeds',
      'Carrot Seeds', 'Radish Seeds', 'Marigold Seeds', 'Sunflower Seeds', 'Rose Seeds', 'Basil Seeds',
      'Mint Seeds', 'Cucumber Seeds', 'Watermelon Seeds',
    ],
  },
  potsPlanters: {
    contentKey: 'potsHub',
    basePath: '/pots-planters',
    umbrellaSlug: 'pots-planters',
    navLabel: 'Pots & Planters',
    allCategorySlugs: POT_SUBCATEGORY_SLUGS,
    exploreHeading: 'Explore Pot & Planter Categories',
    popularHeading: 'Popular Pots & Planters',
    defaultHero: {
      eyebrow: 'POTS & PLANTERS',
      title: 'Pots & Planters',
      subtitle: 'Find beautiful pots and planters designed to complement your plants and spaces.',
    },
    defaultPopularSubtitle: 'Handpicked pots and planters for every space and style.',
    suggestedPopularNames: [
      'Ceramic Round Pot', 'White Ceramic Planter', 'Terracotta Pot', 'Hanging Planter', 'Self Watering Pot',
      'Indoor Planter', 'Outdoor Planter', 'Wall Mounted Planter', 'Grow Bag', 'Cement Planter',
      'Decorative Pot', 'Railing Planter', 'Plant Stand', 'Minimal Planter', 'Large Floor Planter',
    ],
  },
  plantCare: {
    contentKey: 'plantCareHub',
    basePath: '/plant-care',
    umbrellaSlug: 'plant-care',
    navLabel: 'Plant Care',
    allCategorySlugs: ALL_PLANT_CARE_CATEGORY_SLUGS,
    exploreHeading: 'Explore Plant Care Categories',
    popularHeading: 'Popular Plant Care',
    defaultHero: {
      eyebrow: 'PLANT CARE',
      title: 'Plant Care',
      subtitle: 'Everything you need to keep your plants healthy, beautiful and growing throughout the year.',
    },
    defaultPopularSubtitle: 'Essential products for healthy and thriving plants.',
    suggestedPopularNames: [
      'Organic Fertilizer', 'Liquid Fertilizer', 'Vermicompost', 'Neem Cake', 'Neem Oil', 'Potting Mix',
      'Cocopeat', 'Soil Mix', 'Root Booster', 'Plant Growth Booster', 'Fungicide', 'Organic Pest Control',
      'Gardening Tool Kit', 'Plant Food', 'Leaf Shine',
    ],
  },
};

export const SECTION_HUB_LIST = Object.values(SECTION_HUBS);
