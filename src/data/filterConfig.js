// Centralised, data-driven filter configuration. Every product listing
// page (CategoryPage) calls `getFilterGroupsForCategory(slug)` to find out
// which filter groups it should show - the filter UI itself
// (components/CategoryFilters.jsx) has no category-specific knowledge at
// all, it just renders whatever group list it's handed.
//
// A "group" is `{ key, title, isArray?, isPrice?, hasSwatch?, icon? }`:
//   - `key`       the product field it reads (see data/products.js)
//   - `isArray`   the field holds an array (a product can match more than
//                 one option at once - e.g. a plant can be both a
//                 "Succulent" and "Air Purifying")
//   - `isPrice`   renders the From/To number inputs instead of checkboxes
//   - `hasSwatch` shows a small colour dot beside each option
//   - `icon`      key into components/filterIcons.jsx (defaults to `key`)
import {
  SEED_SUBCATEGORY_SLUGS, POT_SUBCATEGORY_SLUGS, PLANT_CARE_SUBCATEGORY_SLUGS,
} from './products.js';

const PRICE_GROUP = { key: 'price', title: 'Price', isPrice: true };
const AVAILABILITY_GROUP = { key: 'availability', title: 'Availability' };

// ---------- Indoor Plants: the original, working reference set. Left
// exactly as it already was - this is the "reusable foundation" the rest
// of the site's filters are modelled on. ----------
const INDOOR_PLANTS_FILTERS = [
  { key: 'plantType', title: 'Type of Plants', isArray: true },
  { key: 'size', title: 'Plant Size' },
  PRICE_GROUP,
  { key: 'light', title: 'Light' },
  { key: 'location', title: 'Ideal Plants Location', isArray: true },
  { key: 'indoorOutdoor', title: 'Indoor/Outdoor' },
  { key: 'maintenance', title: 'Maintenance' },
  { key: 'water', title: 'Water Schedule' },
  { key: 'color', title: 'Color', isArray: true, hasSwatch: true },
  AVAILABILITY_GROUP,
];

// ---------- Plant family: every other plant/greenery category (outdoor
// plants, bonsai, palms, succulents, cactus, ferns, orchids, herbs,
// medicinal/aromatic/fruit plants, landscaping stock, etc). Same shape as
// Indoor Plants, relabelled to match how these are actually shopped for
// outdoors (Sunlight / Water Requirement / Growth Rate). ----------
const PLANT_FAMILY_FILTERS = [
  { key: 'plantType', title: 'Plant Type', isArray: true },
  { key: 'size', title: 'Plant Size' },
  PRICE_GROUP,
  { key: 'light', title: 'Sunlight', icon: 'light' },
  { key: 'location', title: 'Ideal Location', isArray: true, icon: 'location' },
  { key: 'growthRate', title: 'Growth Rate' },
  { key: 'maintenance', title: 'Maintenance' },
  { key: 'water', title: 'Water Requirement', icon: 'water' },
  { key: 'color', title: 'Color', isArray: true, hasSwatch: true },
  AVAILABILITY_GROUP,
];

// ---------- Seed family ----------
const SEED_FAMILY_FILTERS = [
  { key: 'seedType', title: 'Seed Type' },
  { key: 'growingSeason', title: 'Growing Season' },
  { key: 'light', title: 'Sunlight Requirement', icon: 'light' },
  { key: 'germinationTime', title: 'Germination Time' },
  { key: 'packSize', title: 'Pack Size' },
  { key: 'organic', title: 'Organic / Non-Organic', icon: 'organic' },
  PRICE_GROUP,
  AVAILABILITY_GROUP,
];

// ---------- Pots & Planters family ----------
const POT_FAMILY_FILTERS = [
  { key: 'material', title: 'Material' },
  { key: 'size', title: 'Size' },
  { key: 'shape', title: 'Shape' },
  { key: 'color', title: 'Color', isArray: true, hasSwatch: true },
  { key: 'indoorOutdoor', title: 'Indoor/Outdoor' },
  { key: 'drainage', title: 'Drainage' },
  { key: 'productType', title: 'Pot Type' },
  PRICE_GROUP,
  AVAILABILITY_GROUP,
];

// ---------- Plant Care (+ Gardening Tools) family ----------
const PLANT_CARE_FAMILY_FILTERS = [
  { key: 'productType', title: 'Product Type' },
  { key: 'organicOrChemical', title: 'Organic / Chemical', icon: 'organicOrChemical' },
  { key: 'packSize', title: 'Pack Size' },
  PRICE_GROUP,
  AVAILABILITY_GROUP,
];

// ---------- Fallback for anything else (garden decor, etc.) - still
// data-driven and never blank, just the attributes every product has. ----------
const GENERIC_FILTERS = [
  { key: 'productType', title: 'Product Type' },
  PRICE_GROUP,
  AVAILABILITY_GROUP,
];

const SEED_SLUGS = new Set(['seeds', ...SEED_SUBCATEGORY_SLUGS]);
const POT_SLUGS = new Set(['pots-planters', ...POT_SUBCATEGORY_SLUGS]);
const PLANT_CARE_SLUGS = new Set(['plant-care', ...PLANT_CARE_SUBCATEGORY_SLUGS, 'gardening-tools']);
const DECOR_SLUGS = new Set(['garden-decor']);

export function getFilterGroupsForCategory(slug) {
  if (slug === 'indoor-plants') return INDOOR_PLANTS_FILTERS;
  if (SEED_SLUGS.has(slug)) return SEED_FAMILY_FILTERS;
  if (POT_SLUGS.has(slug)) return POT_FAMILY_FILTERS;
  if (PLANT_CARE_SLUGS.has(slug)) return PLANT_CARE_FAMILY_FILTERS;
  if (DECOR_SLUGS.has(slug)) return GENERIC_FILTERS;
  // Every remaining category slug in CATEGORIES (outdoor-plants, bonsai,
  // palms, succulents, cactus, ferns, orchids, herbs, medicinal/aromatic/
  // fruit plants, landscaping stock, etc.) is a plant-type category.
  return PLANT_FAMILY_FILTERS;
}
