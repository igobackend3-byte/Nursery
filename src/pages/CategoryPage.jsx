import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { UMBRELLA_GROUPS, CATEGORIES as LOCAL_CATEGORIES } from '../data/products';
import { useCatalogue } from '../context/CatalogueContext';
import CategoryFilters, { matchesFilters } from '../components/CategoryFilters';
import { getFilterGroupsForCategory } from '../data/filterConfig';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedCategoryLabel, getLocalizedCategoryTagline } from '../utils/localizedContent';
import { useSiteContent } from '../hooks/useSiteContent';
import EditableSection from '../admin/editor/EditableSection';
import EditableElement from '../admin/editor/EditableElement';
import CardHoverControls from '../admin/editor/CardHoverControls';

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
  'microgreen-seeds': '/images/category-banners/seeds.png',
  'medicinal-seeds': '/images/category-banners/seeds.png',
  'exotic-seeds': '/images/category-banners/seeds.png',
  'native-ornamental-seeds': '/images/category-banners/seeds.png',
};

const POTS_AND_CARE_HERO_IMAGES = {
  'terracotta-pots': '/images/category-banners/terracotta pots.jpeg',
  'ceramic-pots': '/images/category-banners/ceramic pots.jpeg',
  'plastic-pots': '/images/category-banners/plastic pots.jpeg',
  'fibre-planters': '/images/category-banners/fibre plants.jpeg',
  'hanging-planters': '/images/category-banners/hanging plants.jpeg',
  'railing-planters': '/images/category-banners/railingg plants.jpeg',
  'self-watering-planters': '/images/category-banners/self watering plants.jpeg',
  'cement-planters': '/images/category-banners/cement plants.jpeg',
  'metal-planters': '/images/category-banners/metal planters.jpeg',
  'wooden-planters': '/images/category-banners/wooden plants.jpeg',
  'coco-fibre-pots': '/images/category-banners/coco fibre plants.jpeg',
  'rattan-planters': '/images/category-banners/rattan planters.jpeg',
  'bonsai-pots-subcat': '/images/category-banners/bonsai plants.jpeg',
  'balcony-planters': '/images/category-banners/balcony troughts.jpeg',
  'window-box-planters': '/images/category-banners/windows box planters.jpeg',
  'vertical-tower-planters': '/images/category-banners/vertical tower planters.jpeg',
  'upcycled-planters': '/images/category-banners/uncycled planters.jpeg',
  'grow-bags-containers': '/images/category-banners/grow plants.jpeg',
  'nursery-containers': '/images/category-banners/nursery containers.jpeg',
  'seedling-trays': '/images/category-banners/seedling trays.jpeg',
  'root-trainers': '/images/category-banners/root trainers.jpeg',
  'air-pruning-pots': '/images/category-banners/air pruning pots.jpeg',
  'fabric-grow-pots': '/images/category-banners/fabric grow plants.jpeg',
  'pro-trays': '/images/category-banners/pro trays.jpeg',
  'grow-bag-stands': '/images/category-banners/grow bags stands.jpeg',
  // Plant Care
  'cocopeat': '/images/category-banners/plant care.png',
  'potting-soil': '/images/category-banners/plant care.png',
  'potting-mix': '/images/category-banners/plant care.png',
  'red-soil': '/images/category-banners/plant care.png',
  'sand': '/images/category-banners/plant care.png',
  'vermiculite': '/images/category-banners/plant care.png',
  'perlite': '/images/category-banners/plant care.png',
  'peat-moss': '/images/category-banners/plant care.png',
  'coco-chips': '/images/category-banners/plant care.png',
  'organic-fertilizers': '/images/category-banners/plant care.png',
  'chemical-fertilizers': '/images/category-banners/plant care.png',
  'liquid-fertilizers': '/images/category-banners/plant care.png',
  'plant-tonics': '/images/category-banners/plant care.png',
  'biofertilizers': '/images/category-banners/plant care.png',
  'soil-amendments': '/images/category-banners/plant care.png',
  'manures': '/images/category-banners/plant care.png',
};

// The Gifting/Corporate Gifts pages pull gift-tagged products across every
// category rather than one category's own catalogue, so they keep their
// own small, unrelated facet sidebar rather than the category filter
// system below (out of scope for this change, and not broken by it).
const GIFT_FACETS = [
  { key: 'giftType', titleKey: 'giftType' },
  { key: 'productType', titleKey: 'productType' },
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
  const isAllPlantsPage = slug === 'plants';
  const { products, categories, getGiftProducts, getProductsByCategory } = useCatalogue();
  const { t, language } = useLanguage();
  const { gifting: giftingContent, corporateGifting: corporateGiftingContent } = useSiteContent();

  const baseProducts = useMemo(() => {
    if (isGiftPage) {
      if (slug === 'gifting' && giftingContent?.items) {
        return giftingContent.items
          .map((s, i) => ({
            visible: true,
            order: i,
            ...s,
            name: s.title || s.name,
            originalPrice: s.oldPrice || s.originalPrice,
            isBestSeller: s.badge?.toUpperCase() === 'BESTSELLER' || s.isBestSeller,
          }))
          .filter((s) => s.visible !== false)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      } else if (slug === 'corporate-gifts' && corporateGiftingContent?.items) {
        return corporateGiftingContent.items
          .map((s, i) => ({
            visible: true,
            order: i,
            ...s,
            name: s.title || s.name,
            originalPrice: s.oldPrice || s.originalPrice,
            isBestSeller: s.badge?.toUpperCase() === 'BESTSELLER' || s.isBestSeller,
          }))
          .filter((s) => s.visible !== false)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      }
      return getGiftProducts();
    }
    const umbrella = UMBRELLA_GROUPS[slug];
    if (umbrella) return products.filter((p) => umbrella.includes(p.category));
    return getProductsByCategory(slug);
  }, [slug, isGiftPage, products, giftingContent, corporateGiftingContent]);

  // Prefer the live (Firestore) category doc; fall back to the built-in
  // CATEGORIES list so code-defined umbrella categories (e.g. the grouped
  // "shop by category" tiles) still get their label/tagline even before
  // they're added to the categories collection.
  const meta = categories.find((c) => c.slug === slug) || LOCAL_CATEGORIES.find((c) => c.slug === slug);
  const localizedLabel = getLocalizedCategoryLabel(meta, language);
  const localizedTagline = getLocalizedCategoryTagline(meta, language);
  
  // Use CMS overrides for gifting if available
  const cmsHeading = slug === 'gifting' ? (giftingContent?.pageTitle || t('nav.gifting')) : 
                     slug === 'corporate-gifts' ? (corporateGiftingContent?.pageTitle || t('nav.b2bSales')) : null;
  const cmsTagline = slug === 'gifting' ? (giftingContent?.subtitle || t('pages.corporateGiftsTagline')) : 
                     slug === 'corporate-gifts' ? (corporateGiftingContent?.subtitle || t('pages.corporateGiftsTagline')) : null;

  const heading = isGiftPage
    ? (slug === 'gifting' || slug === 'corporate-gifts') ? cmsHeading : t('pages.corporateGiftsTitle')
    : isAllPlantsPage ? 'All Plants'
    : localizedLabel || t('common.allProducts');
  const tagline = isGiftPage
    ? (slug === 'gifting' || slug === 'corporate-gifts') ? cmsTagline : t('pages.corporateGiftsTagline')
    : isAllPlantsPage ? 'Every plant we grow, in one searchable, filterable list.'
    : localizedTagline;

  const prices = baseProducts.map((p) => p.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  // The reusable category filter system - `filterGroups` is resolved from
  // the current category/subcategory, so navigating from e.g. Indoor
  // Plants to Seeds automatically swaps in seed-relevant filters instead
  // of leaving plant filters showing (requirement #11).
  const filterGroups = useMemo(() => (isGiftPage ? null : getFilterGroupsForCategory(slug)), [slug, isGiftPage]);
  // A "Shop Now" card (e.g. Home's "Plants for Every Corner" section) can
  // deep-link straight into a pre-filtered view via ?location=Living Room -
  // reuses the existing `location` filter facet indoor-plants already has,
  // rather than adding a separate mechanism.
  const [searchParams] = useSearchParams();
  const initialLocation = searchParams.get('location');
  const [filters, setFilters] = useState(() => (initialLocation ? { location: [initialLocation] } : {}));
  useEffect(() => {
    setFilters(initialLocation ? { location: [initialLocation] } : {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

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

  const heroImage = PLANTS_SUBCATEGORY_HERO_IMAGES[slug] ?? SEEDS_SUBCATEGORY_HERO_IMAGES[slug] ?? POTS_AND_CARE_HERO_IMAGES[slug];

  const contentEl = (
    <div className="category-page category-page-enter">
      <nav className="category-breadcrumb" aria-label="Breadcrumb">
        <a href="/#shop-by-category">{t('home.shopByCategory')}</a>
        <span className="category-breadcrumb-sep" aria-hidden="true">/</span>
        <span className="category-breadcrumb-current">{heading}</span>
        <a href="/#shop-by-category" className="category-breadcrumb-back">
          <span aria-hidden="true">&larr;</span> {t('common.backToShopByCategory')}
        </a>
      </nav>

      <div
        className={`category-hero${heroImage ? ' category-hero-has-image' : ''}`}
        style={heroImage ? { backgroundImage: `url('${heroImage}')` } : undefined}
      >
        <p className="eyebrow">{isGiftPage ? t('nav.gifting').toUpperCase() : t('common.categoryEyebrow')}</p>
        
        {slug === 'gifting' || slug === 'corporate-gifts' ? (
          <EditableElement sectionKey={slug === 'gifting' ? 'gifting' : 'corporateGifting'} field="pageTitle" type="text" label="Page Title">
            <h1>{heading}</h1>
          </EditableElement>
        ) : (
          <h1>{heading}</h1>
        )}
        
        {slug === 'gifting' || slug === 'corporate-gifts' ? (
          <EditableElement sectionKey={slug === 'gifting' ? 'gifting' : 'corporateGifting'} field="subtitle" type="text" label="Subtitle">
            <p className="category-tagline">{tagline}</p>
          </EditableElement>
        ) : (
          <p className="category-tagline">{tagline}</p>
        )}
      </div>

      <div className={`category-layout${isGiftPage ? '' : ' ip-fullwidth'}`}>
        {isGiftPage ? (
          <aside className="filter-sidebar">
            <p className="filter-count">{t('filters.productsFound').replace('{n}', filtered.length)}</p>

            <div className="facet-group price-facet">
              <h4>{t('common.price')}</h4>
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

            {GIFT_FACETS.map(({ key, titleKey }) => {
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
                  title={t(`common.${titleKey}`)}
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
          {filtered.map((product) => {
            const card = <ProductCard key={product.id} product={product} />;
            if (slug === 'gifting') {
              const siteContentIndex = giftingContent?.items?.findIndex(p => p.id === product.id);
              if (siteContentIndex !== -1 && siteContentIndex !== undefined) {
                 return (
                   <CardHoverControls key={product.id} sectionKey="gifting" arrayField="items" index={siteContentIndex} itemLabel="Product">
                     {card}
                   </CardHoverControls>
                 );
              }
            } else if (slug === 'corporate-gifts') {
              const siteContentIndex = corporateGiftingContent?.items?.findIndex(p => p.id === product.id);
              if (siteContentIndex !== -1 && siteContentIndex !== undefined) {
                 return (
                   <CardHoverControls key={product.id} sectionKey="corporateGifting" arrayField="items" index={siteContentIndex} itemLabel="Product">
                     {card}
                   </CardHoverControls>
                 );
              }
            }
            return card;
          })}
          {filtered.length === 0 && (
            isGiftPage ? (
              <p className="empty-state">{t('common.noProductsMatchFilters')}</p>
            ) : (
              <div className="empty-state ip-empty-state">
                <p className="ip-empty-title">{t('common.noProductsFound')}</p>
                <p className="ip-empty-sub">{t('common.tryRemovingFilters')}</p>
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

  if (slug === 'gifting' || slug === 'corporate-gifts') {
    return (
      <EditableSection sectionKey={slug === 'gifting' ? 'gifting' : 'corporateGifting'} label={slug === 'gifting' ? 'Gifting Page' : 'Corporate Gifting Page'}>
        {contentEl}
      </EditableSection>
    );
  }

  return contentEl;
}

export default CategoryPage;
