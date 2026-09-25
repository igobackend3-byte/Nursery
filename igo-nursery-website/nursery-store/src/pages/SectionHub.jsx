import { Link } from 'react-router-dom';
import { useCatalogue } from '../context/CatalogueContext';
import { useSiteContent } from '../hooks/useSiteContent';
import ProductCard from '../components/ProductCard';
import CategoryIllustration from '../components/CategoryIllustration';
import EditableSection from '../admin/editor/EditableSection';
import EditableElement from '../admin/editor/EditableElement';
import CardHoverControls from '../admin/editor/CardHoverControls';
import ProductCardHoverControls from '../admin/editor/ProductCardHoverControls';

// Generic fallback glyph for a category with no uploaded image - same
// "leaf placeholder instead of a broken image" pattern used across the
// rest of the site.
function LeafPlaceholder() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22C12 22 20 18 20 12V5l-8-3-8 3v7C4 18 12 22 12 22z" />
    </svg>
  );
}

// `override` (optional) is this card's entry from the section's
// `categories` array in siteContent - an admin-editable image/label
// layered on top of the real category record, matched by slug, exactly
// like Home.jsx's Shop By Category tiles. The routing Link always stays
// pinned to the category's real slug - not editable, same scope limit
// already used for Shop By Category.
function CategoryCircle({ category, basePath, override }) {
  const label = override?.label || category.label;
  const image = override?.image;
  return (
    <Link to={`${basePath}/${category.slug}`} className="plants-hub-circle-card">
      <span className="plants-hub-circle-media">
        {image ? <img src={image} alt={label} /> : <CategoryIllustration slug={category.slug} />}
      </span>
      <span className="plants-hub-circle-name">{label}</span>
    </Link>
  );
}

function getDefaultPopularProducts(products, config) {
  const picked = [];
  const usedIds = new Set();
  for (const name of config.suggestedPopularNames) {
    const match = products.find((p) => config.allCategorySlugs.includes(p.category) && p.name.toLowerCase().startsWith(name.toLowerCase()) && !usedIds.has(p.id));
    if (match) {
      picked.push(match);
      usedIds.add(match.id);
    }
  }
  if (picked.length < 15) {
    const topRated = products
      .filter((p) => config.allCategorySlugs.includes(p.category) && !usedIds.has(p.id))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0));
    for (const p of topRated) {
      if (picked.length >= 15) break;
      picked.push(p);
      usedIds.add(p.id);
    }
  }
  return picked.slice(0, 15);
}

function sectionStyleFrom(data) {
  const style = {};
  if (data?.backgroundColor) style.backgroundColor = data.backgroundColor;
  if (data?.backgroundImage) {
    style.backgroundImage = `url(${data.backgroundImage})`;
    style.backgroundSize = 'cover';
    style.backgroundPosition = 'center';
  }
  if (data?.paddingY) style.paddingTop = style.paddingBottom = data.paddingY;
  return style;
}

// Shared page pattern for Plants/Seeds/Pots & Planters/Plant Care: hero,
// a single-row category circle strip with a "More" tile when the full
// category list is bigger than what's configured to show, then a 15-
// product "Popular X" grid. Only `config` (see data/sectionHubs.js) and
// the matching CMS content differ between the 4 pages - this one
// component renders all of them.
//
// Content lives on 3 flat siteContent keys per hub - `${contentKey}Hero`
// / `${contentKey}Explore` / `${contentKey}Popular` - rather than one
// dotted pseudo-key per section, so Reset to Default / Delete Section /
// Section Settings each operate on a real top-level key, same convention
// as every About page section.
function SectionHub({ config }) {
  const { categories, products } = useCatalogue();
  const siteContent = useSiteContent();

  const heroSectionKey = `${config.contentKey}Hero`;
  const exploreSectionKey = `${config.contentKey}Explore`;
  const popularSectionKey = `${config.contentKey}Popular`;

  const hero = siteContent[heroSectionKey] || {};
  const explore = siteContent[exploreSectionKey] || {};
  const popular = siteContent[popularSectionKey] || {};

  const rawCategories = explore.categories?.length
    ? explore.categories
    : config.allCategorySlugs.slice(0, 13).map((slug, i) => ({ id: slug, slug, image: '', label: '', visible: true, order: i }));
  const landingCategories = rawCategories
    .filter((c) => c.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((override) => ({ override, category: categories.find((c) => c.slug === override.slug) }))
    .filter((entry) => entry.category);
  const hasMoreCategories = config.allCategorySlugs.length > landingCategories.length;

  const popularProducts = popular.productIds?.length
    ? popular.productIds.map((id) => products.find((p) => p.id === id)).filter(Boolean)
    : getDefaultPopularProducts(products, config);

  const heroBgClass = `${config.contentKey === 'plantsHub' ? 'plants-hub-hero-with-bg' : ''} ${config.contentKey === 'potsHub' ? 'pots-hub-hero-with-bg' : ''} ${config.contentKey === 'seedsHub' ? 'seeds-hub-hero-with-bg' : ''} ${config.contentKey === 'plantCareHub' ? 'plant-care-hub-hero-with-bg' : ''}`;

  return (
    <div className="plants-hub-page">
      <nav className="category-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="category-breadcrumb-sep" aria-hidden="true">/</span>
        <span className="category-breadcrumb-current">{config.navLabel}</span>
      </nav>

      <EditableSection sectionKey={heroSectionKey} label="Hero">
        <section className={`plants-hub-hero ${heroBgClass}`} style={sectionStyleFrom(hero)}>
          <EditableElement sectionKey={heroSectionKey} field="heroEyebrow" type="text" label="Small Label">
            <p className="eyebrow">{hero.heroEyebrow || config.defaultHero.eyebrow}</p>
          </EditableElement>
          <EditableElement sectionKey={heroSectionKey} field="heroTitle" type="text" label="Heading">
            <h1>{hero.heroTitle || config.defaultHero.title}</h1>
          </EditableElement>
          <EditableElement sectionKey={heroSectionKey} field="heroSubtitle" type="text" label="Description">
            <p>{hero.heroSubtitle || config.defaultHero.subtitle}</p>
          </EditableElement>
        </section>
      </EditableSection>

      <EditableSection sectionKey={exploreSectionKey} label="Explore Categories">
        <section className="plants-hub-section" style={sectionStyleFrom(explore)}>
          <div className="plants-hub-section-head">
            <h2>{config.exploreHeading}</h2>
            <Link to={`${config.basePath}/categories`} className="plants-hub-see-more">View All Categories →</Link>
          </div>
          <div className="plants-hub-circle-row">
            {landingCategories.map(({ override, category }) => {
              const itemIndex = rawCategories.indexOf(override);
              return (
                <CardHoverControls key={override.id ?? override.slug} sectionKey={exploreSectionKey} arrayField="categories" index={itemIndex} itemLabel="Category">
                  <CategoryCircle category={category} basePath={config.basePath} override={override} />
                </CardHoverControls>
              );
            })}
            {hasMoreCategories && (
              <Link to={`${config.basePath}/categories`} className="plants-hub-circle-card">
                <span className="plants-hub-circle-media plants-hub-circle-more">More →</span>
                <span className="plants-hub-circle-name">View All</span>
              </Link>
            )}
          </div>
        </section>
      </EditableSection>

      <EditableSection sectionKey={popularSectionKey} label="Popular Products" products={popularProducts}>
        <section className="plants-hub-section plants-hub-popular-section" style={sectionStyleFrom(popular)}>
          <div className="plants-hub-section-head" style={{ marginBottom: '16px' }}>
            <h2>{config.popularHeading}</h2>
            <Link to={`${config.basePath}/all`} className="plants-hub-see-more">View All {config.navLabel} →</Link>
          </div>
          <EditableElement sectionKey={popularSectionKey} field="popularPlantsSubtitle" type="text" label="Subtitle">
            <p className="plants-hub-popular-sub">{popular.popularPlantsSubtitle || config.defaultPopularSubtitle}</p>
          </EditableElement>
          <div className="product-grid">
            {popularProducts.map((product) => (
              <ProductCardHoverControls key={product.id} sectionKey={popularSectionKey} product={product} displayedIds={popularProducts.map((p) => p.id)}>
                <ProductCard product={product} />
              </ProductCardHoverControls>
            ))}
          </div>
        </section>
      </EditableSection>
    </div>
  );
}

export default SectionHub;
