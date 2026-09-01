import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { UMBRELLA_GROUPS } from '../data/products';
import { useCatalogue } from '../context/CatalogueContext';
import CategoryFilters, { matchesFilters } from '../components/CategoryFilters';
import { getFilterGroupsForCategory } from '../data/filterConfig';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedCategoryLabel, getLocalizedCategoryTagline } from '../utils/localizedContent';

// Hero banner photos for every Plants sub-section, sourced from the real
// photos in `Nursery project/images` (see public/images/plants-subcategories/).
// Several categories share one source photo where the provided folder had
// one combined image for multiple related subcategories (e.g. "Bonsai &
// Orchids"); categories with no matching photo at all use the closest
// visually-relevant image instead of a fabricated one - see the comment
// on each of those below.
const PLANTS_SUBCATEGORY_HERO_IMAGES = {
  // ---- Direct 1:1 matches ----
  'indoor-plants': '/images/plants-subcategories/indoor-plants-banner.png',
  'outdoor-plants': '/images/plants-subcategories/outdoor-plants-banner.png',
  'palms': '/images/plants-subcategories/palms-banner.png',
  'cycads': '/images/plants-subcategories/cycads-banner.png',
  'cactus': '/images/plants-subcategories/cactus-banner.jpg',
  'aquatic-pond-plants': '/images/plants-subcategories/aquatic-pond-plants-banner.jpg',
  // ---- One provided photo covers multiple related subcategories ----
  'bonsai': '/images/plants-subcategories/bonsai-banner.jpg',
  'orchids': '/images/plants-subcategories/orchids-banner.jpg',
  'bromeliads': '/images/plants-subcategories/bromeliads-banner.jpg',
  'ferns': '/images/plants-subcategories/ferns-banner.jpg',
  'carnivorous-plants': '/images/plants-subcategories/carnivorous-plants-banner.jpg',
  'table-top-plants': '/images/plants-subcategories/table-top-plants-banner.jpg',
  'mini-plants': '/images/plants-subcategories/mini-plants-banner.jpg',
  'vertical-garden-plants': '/images/plants-subcategories/vertical-garden-plants-banner.jpg',
  'green-wall-plants': '/images/plants-subcategories/green-wall-plants-banner.jpg',
  'terrace-garden-plants': '/images/plants-subcategories/terrace-garden-plants-banner.jpg',
  'balcony-plants': '/images/plants-subcategories/balcony-plants-banner.jpg',
  'hanging-basket-plants': '/images/plants-subcategories/hanging-basket-plants-banner.jpg',
  // ---- No dedicated photo provided - closest visual match used instead ----
  'succulents': '/images/plants-subcategories/succulents-banner.jpg', // tabletop succulents photo
  'herbs': '/images/plants-subcategories/herbs-banner.jpg', // small potted herbs, tabletop photo
  'aromatic-plants': '/images/plants-subcategories/aromatic-plants-banner.jpg', // potted lavender/herbs, terrace photo
  'fragrant-plants': '/images/plants-subcategories/fragrant-plants-banner.jpg', // flowering terrace/balcony photo
  'edible-flowers': '/images/plants-subcategories/edible-flowers-banner.jpg', // colourful potted flowers, terrace photo
  'coastal-plants': '/images/plants-subcategories/coastal-plants-banner.jpg', // drought-tolerant garden photo
  'landscaping-trees': '/images/plants-subcategories/landscaping-trees-banner.png', // tall statement trees, palms photo
  'fruit-plants': '/images/plants-subcategories/fruit-plants-banner.png', // outdoor garden photo
  'medicinal-plants': '/images/plants-subcategories/medicinal-plants-banner.png', // outdoor garden photo
  'spice-plants': '/images/plants-subcategories/spice-plants-banner.png', // outdoor garden photo
  'sacred-plants': '/images/plants-subcategories/sacred-plants-banner.png', // outdoor garden photo
  'butterfly-garden-plants': '/images/plants-subcategories/butterfly-garden-plants-banner.png', // flowering garden photo
  'bee-friendly-plants': '/images/plants-subcategories/bee-friendly-plants-banner.png', // flowering garden photo
  'bird-attracting-plants': '/images/plants-subcategories/bird-attracting-plants-banner.png', // flowering garden photo
  'landscaping-plants': '/images/plants-subcategories/landscaping-plants-banner.png', // outdoor garden photo
};

// Hero banner photos for the Seeds sub-sections, same mechanism as the
// Plants map above. Only mapped for the subcategories that currently have a
// matching file in public/images/seeds-subcategories/ - the folder doesn't
// (yet) have a photo for every Seeds subcategory (e.g. All Seeds, Fruit,
// Microgreens, Medicinal, Exotic, Native & Ornamental), so those simply fall
// back to the plain text-only hero, same as any other category with no photo.
const SEEDS_SUBCATEGORY_HERO_IMAGES = {
  'vegetable-seeds': '/images/seeds-subcategories/vegetable seeds.png',
  'flower-seeds': '/images/seeds-subcategories/flowers seeds.png',
  'herb-seeds': '/images/seeds-subcategories/herbs seeds.png',
  'lawn-grass-seeds': '/images/seeds-subcategories/lawn seeds.png',
  'fodder-seeds': '/images/seeds-subcategories/fodder seeds.png',
};

// The Gifting/Corporate Gifts pages pull gift-tagged products across every
// category rather than one category's own catalogue, so they keep their
// own small, unrelated facet sidebar rather than the category filter
// system below (out of scope for this change, and not broken by it).
const GIFT_FACETS = [
  { key: 'giftType', title: 'Gift Type' },
  { key: 'productType', title: 'Product Type' },
];

function GiftFacetGroup({ title, options, selected, onToggle }) {
  return (
    <div className="facet-group">
      <h4>{title}</h4>
      <ul>
        {options.map(({ value, count }) => (
          <li key={value}>
            <label>
              <input type="checkbox" checked={selected.includes(value)} onChange={() => onToggle(value)} />
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
  const { products, categories, getGiftProducts, getProductsByCategory } = useCatalogue();
  const { t, language } = useLanguage();

  const baseProducts = useMemo(() => {
    if (isGiftPage) return getGiftProducts();
    const umbrella = UMBRELLA_GROUPS[slug];
    if (umbrella) return products.filter((p) => umbrella.includes(p.category));
    return getProductsByCategory(slug);
  }, [slug, isGiftPage, products]);

  const meta = categories.find((c) => c.slug === slug);
  const localizedLabel = getLocalizedCategoryLabel(meta, language);
  const localizedTagline = getLocalizedCategoryTagline(meta, language);
  const heading = isGiftPage
    ? slug === 'gifting' ? t('nav.gifting') : 'Corporate Gifts'
    : localizedLabel || 'All Products';
  const tagline = isGiftPage
    ? 'Thoughtful, ready-to-gift plants and planters for every occasion.'
    : localizedTagline;

  const prices = baseProducts.map((p) => p.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  // The reusable category filter system - `filterGroups` is resolved from
  // the current category/subcategory, so navigating from e.g. Indoor
  // Plants to Seeds automatically swaps in seed-relevant filters instead
  // of leaving plant filters showing (requirement #11).
  const filterGroups = useMemo(() => (isGiftPage ? null : getFilterGroupsForCategory(slug)), [slug, isGiftPage]);
  const [filters, setFilters] = useState({});
  useEffect(() => { setFilters({}); }, [slug]);

  // Gift page's own unrelated facet state (unchanged from before).
  const [giftFacets, setGiftFacets] = useState({});
  const [priceMax, setPriceMax] = useState(maxPrice);
  const effectivePriceMax = priceMax || maxPrice;
  function toggleGiftFacet(key, value) {
    setGiftFacets((prev) => {
      const current = prev[key] ?? [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, [key]: next };
    });
  }

  const filtered = isGiftPage
    ? baseProducts.filter((p) => {
        if (p.price > effectivePriceMax) return false;
        return GIFT_FACETS.every(({ key }) => {
          const selected = giftFacets[key];
          if (!selected || selected.length === 0) return true;
          return selected.includes(p[key]);
        });
      })
    : baseProducts.filter((p) => matchesFilters(p, filters, filterGroups));

  const heroImage = PLANTS_SUBCATEGORY_HERO_IMAGES[slug] ?? SEEDS_SUBCATEGORY_HERO_IMAGES[slug];

  return (
    <div className="category-page">
      <div
        className={`category-hero${heroImage ? ' category-hero-has-image' : ''}`}
        style={heroImage ? { backgroundImage: `url('${heroImage}')` } : undefined}
      >
        <p className="eyebrow">{isGiftPage ? 'GIFTING' : 'CATEGORY'}</p>
        <h1>{heading}</h1>
        <p className="category-tagline">{tagline}</p>
      </div>

      <div className={`category-layout${isGiftPage ? '' : ' ip-fullwidth'}`}>
        {isGiftPage ? (
          <aside className="filter-sidebar">
            <p className="filter-count">{filtered.length} products found</p>

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

            {GIFT_FACETS.map(({ key, title }) => {
              const counts = new Map();
              baseProducts.forEach((p) => {
                const val = p[key];
                if (!val) return;
                counts.set(val, (counts.get(val) ?? 0) + 1);
              });
              const options = Array.from(counts.entries()).map(([value, count]) => ({ value, count }));
              if (options.length === 0) return null;
              return (
                <GiftFacetGroup
                  key={key}
                  title={title}
                  options={options}
                  selected={giftFacets[key] ?? []}
                  onToggle={(value) => toggleGiftFacet(key, value)}
                />
              );
            })}
          </aside>
        ) : (
          <CategoryFilters
            products={baseProducts}
            groups={filterGroups}
            filters={filters}
            setFilters={setFilters}
            resultCount={filtered.length}
            priceBounds={{ min: minPrice, max: maxPrice }}
          />
        )}

        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {filtered.length === 0 && (
            isGiftPage ? (
              <p className="empty-state">No products match your filters.</p>
            ) : (
              <div className="empty-state ip-empty-state">
                <p className="ip-empty-title">No products found</p>
                <p className="ip-empty-sub">Try removing some filters or changing your selection.</p>
                {Object.keys(filters).length > 0 && (
                  <button type="button" className="ip-btn-primary" onClick={() => setFilters({})}>
                    Clear All Filters
                  </button>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
