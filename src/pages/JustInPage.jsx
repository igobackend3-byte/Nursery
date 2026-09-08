import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useCatalogue } from '../context/CatalogueContext';
import { useLanguage } from '../context/LanguageContext';
import { getJustInProducts } from '../utils/seededShuffle';

// Dedicated "Just In" listing (linked from the homepage's "View All").
// Same seeded ordering as the homepage JustIn section
// (getJustInProducts), just sliced to 10 instead of 5 - one source of
// truth, no duplicated product list.
function JustInPage() {
  const { products } = useCatalogue();
  const { t } = useLanguage();
  const justInProducts = useMemo(() => getJustInProducts(products, 10), [products]);

  return (
    <div className="category-page">
      <p className="breadcrumb"><Link to="/">{t('pages.home')}</Link> / {t('home.justInTitle')}</p>
      <div className="category-hero">
        <p className="eyebrow">{t('home.justInEyebrow')}</p>
        <h1>{t('home.justInTitle')}</h1>
        <p className="category-tagline">{t('home.justInSubtitle')}</p>
      </div>
      <div className="product-grid" style={{ padding: '0 48px' }}>
        {justInProducts.map((p) => (
          <ProductCard key={p.id} product={p} isNew />
        ))}
      </div>
    </div>
  );
}

export default JustInPage;
