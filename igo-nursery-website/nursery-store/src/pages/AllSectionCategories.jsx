import { Link } from 'react-router-dom';
import { useCatalogue } from '../context/CatalogueContext';

function LeafPlaceholder() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22C12 22 20 18 20 12V5l-8-3-8 3v7C4 18 12 22 12 22z" />
    </svg>
  );
}

// Every real category for the section - not a curated subset, so nothing
// existing gets hidden here even if it's left out of the smaller
// single-row picks on the hub page.
function AllSectionCategories({ config }) {
  const { categories } = useCatalogue();
  const list = config.allCategorySlugs
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter(Boolean);

  return (
    <div className="plants-hub-page">
      <nav className="category-breadcrumb" aria-label="Breadcrumb">
        <Link to={config.basePath}>{config.navLabel}</Link>
        <span className="category-breadcrumb-sep" aria-hidden="true">/</span>
        <span className="category-breadcrumb-current">All Categories</span>
      </nav>

      <section className="plants-hub-hero">
        <p className="eyebrow">{config.navLabel.toUpperCase()}</p>
        <h1>All {config.navLabel} Categories</h1>
        <p>Every category we carry under {config.navLabel}.</p>
      </section>

      <section className="plants-hub-section">
        <div className="plants-hub-cat-grid plants-hub-cat-grid-all">
          {list.map((category) => (
            <Link key={category.slug} to={`${config.basePath}/${category.slug}`} className="plants-hub-cat-card">
              <span className="plants-hub-cat-media">
                {category.image ? <img src={category.image} alt={category.label} loading="lazy" /> : <LeafPlaceholder />}
              </span>
              <span className="plants-hub-cat-name">{category.label}</span>
              <span className="plants-hub-cat-explore">Explore →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AllSectionCategories;
