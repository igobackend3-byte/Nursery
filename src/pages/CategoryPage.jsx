import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { CATEGORIES, PRODUCTS, getGiftProducts, getProductsByCategory } from '../data/products';

// "All Seeds" / "All Pots & Planters" are umbrella pages that pool every
// real subcategory together, the same way the plant categories fan out
// under "Plants" in the nav.
const SEED_SUBCATEGORY_SLUGS = [
  'vegetable-seeds', 'flower-seeds', 'herb-seeds', 'fruit-seeds', 'microgreen-seeds',
  'lawn-grass-seeds', 'fodder-seeds', 'medicinal-seeds', 'exotic-seeds', 'native-ornamental-seeds',
];
const POT_SUBCATEGORY_SLUGS = [
  'terracotta-pots', 'ceramic-pots', 'plastic-pots', 'fibre-planters', 'metal-planters',
  'wooden-planters', 'cement-planters', 'hanging-planters', 'railing-planters',
  'self-watering-planters', 'coco-fibre-pots', 'rattan-planters', 'bonsai-pots-subcat',
  'balcony-planters', 'window-box-planters', 'vertical-tower-planters', 'upcycled-planters',
];
const PLANT_CARE_SUBCATEGORY_SLUGS = [
  'potting-media', 'organic-fertilizers', 'chemical-fertilizers', 'liquid-nutrients',
  'biofertilizers', 'plant-protection', 'propagation-supplies', 'composting-products',
];
const UMBRELLA_GROUPS = {
  seeds: ['seeds', ...SEED_SUBCATEGORY_SLUGS],
  'pots-planters': ['pots-planters', ...POT_SUBCATEGORY_SLUGS],
  'plant-care': ['plant-care', ...PLANT_CARE_SUBCATEGORY_SLUGS],
};

const PLANT_FACETS = [
  { key: 'size', title: 'Plant Size' },
  { key: 'light', title: 'Light Requirement' },
  { key: 'location', title: 'Ideal Location' },
  { key: 'maintenance', title: 'Maintenance' },
  { key: 'water', title: 'Water Schedule' },
];

const GIFT_FACETS = [
  { key: 'giftType', title: 'Gift Type' },
  { key: 'productType', title: 'Product Type' },
];

// Non-plant categories (seeds, pots, plant-care supplies) don't have a
// light/water/maintenance schedule - filter by type and price instead.
const SUPPLY_SLUGS = new Set([
  'seeds', ...SEED_SUBCATEGORY_SLUGS,
  'pots-planters', ...POT_SUBCATEGORY_SLUGS,
  'plant-care', ...PLANT_CARE_SUBCATEGORY_SLUGS,
  'gardening-tools', 'garden-decor',
]);
const SUPPLY_FACETS = [{ key: 'productType', title: 'Type' }];

function FacetGroup({ title, options, selected, onToggle }) {
  return (
    <div className="facet-group">
      <h4>{title}</h4>
      <ul>
        {options.map(({ value, count }) => (
          <li key={value}>
            <label>
              <input
                type="checkbox"
                checked={selected.includes(value)}
                onChange={() => onToggle(value)}
              />
              <span>{value}</span>
              <em>{count}</em>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CategoryPage({ slugOverride }) {
  const { slug: slugParam } = useParams();
  const slug = slugOverride ?? slugParam;
  const isGiftPage = slug === 'gifting' || slug === 'corporate-gifts';
  const isSupplyPage = SUPPLY_SLUGS.has(slug);

  const baseProducts = useMemo(() => {
    if (slug === 'gifting') return getGiftProducts();
    if (slug === 'corporate-gifts') return getGiftProducts();
    const umbrella = UMBRELLA_GROUPS[slug];
    if (umbrella) return PRODUCTS.filter((p) => umbrella.includes(p.category));
    return getProductsByCategory(slug);
  }, [slug]);

  const meta = CATEGORIES.find((c) => c.slug === slug);
  const heading = isGiftPage
    ? slug === 'gifting'
      ? 'Gifting'
      : 'Corporate Gifts'
    : meta?.label ?? 'All Products';
  const tagline = isGiftPage
    ? 'Thoughtful, ready-to-gift plants and planters for every occasion.'
    : meta?.tagline ?? '';

  const facetDefs = isGiftPage ? GIFT_FACETS : isSupplyPage ? SUPPLY_FACETS : PLANT_FACETS;
  const [selectedFacets, setSelectedFacets] = useState({});
  const prices = baseProducts.map((p) => p.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;
  const [priceMax, setPriceMax] = useState(maxPrice);

  const effectivePriceMax = priceMax || maxPrice;

  function toggleFacet(key, value) {
    setSelectedFacets((prev) => {
      const current = prev[key] ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  }

  const filtered = baseProducts.filter((p) => {
    if ((isGiftPage || isSupplyPage) && p.price > effectivePriceMax) return false;
    return facetDefs.every(({ key }) => {
      const selected = selectedFacets[key];
      if (!selected || selected.length === 0) return true;
      return selected.includes(p[key]);
    });
  });

  return (
    <div className="category-page">
      <div className="category-hero">
        <p className="eyebrow">{isGiftPage ? 'GIFTING' : 'CATEGORY'}</p>
        <h1>{heading}</h1>
        <p className="category-tagline">{tagline}</p>
      </div>

      <div className="category-layout">
        <aside className="filter-sidebar">
          <p className="filter-count">{filtered.length} products found</p>

          {(isGiftPage || isSupplyPage) && (
            <div className="facet-group price-facet">
              <h4>Price</h4>
              <div className="price-inputs">
                <span>₹{minPrice}</span>
                <span>—</span>
                <span>₹{effectivePriceMax}</span>
              </div>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={effectivePriceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
              />
            </div>
          )}

          {facetDefs.map(({ key, title }) => {
            const counts = new Map();
            baseProducts.forEach((p) => {
              const val = p[key];
              if (!val) return;
              counts.set(val, (counts.get(val) ?? 0) + 1);
            });
            const options = Array.from(counts.entries()).map(([value, count]) => ({ value, count }));
            if (options.length === 0) return null;
            return (
              <FacetGroup
                key={key}
                title={title}
                options={options}
                selected={selectedFacets[key] ?? []}
                onToggle={(value) => toggleFacet(key, value)}
              />
            );
          })}
        </aside>

        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {filtered.length === 0 && <p className="empty-state">No products match your filters.</p>}
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
