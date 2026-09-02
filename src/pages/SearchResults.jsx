import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useCatalogue } from '../context/CatalogueContext';
import { useLanguage } from '../context/LanguageContext';

// Real full-catalogue search, across every product's name/category/tags -
// not scoped to whatever category the user happened to be browsing (the
// header search previously just linked to /category/indoor-plants?q=..,
// which never even read `q`, so results never actually matched the typed
// query - see Header.jsx's onSubmit).
function scoreMatch(product, terms) {
  const translatedNames = Object.values(product.translations ?? {}).map((tr) => tr?.name).filter(Boolean);
  const haystack = [
    product.name,
    ...translatedNames,
    product.categoryLabel,
    product.category,
    ...(product.tags ?? []),
  ].filter(Boolean).join(' ').toLowerCase();

  let score = 0;
  for (const term of terms) {
    if (!haystack.includes(term)) return 0; // every term must appear somewhere
    if (product.name.toLowerCase().startsWith(term)) score += 3;
    else if (product.name.toLowerCase().includes(term)) score += 2;
    else score += 1;
  }
  return score;
}

function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const { products } = useCatalogue();
  const { t } = useLanguage();

  const results = useMemo(() => {
    const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return [];
    return products
      .map((p) => ({ product: p, score: scoreMatch(p, terms) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.product);
  }, [products, q]);

  return (
    <div className="category-page">
      <div className="category-hero">
        <p className="eyebrow">SEARCH</p>
        <h1>{q ? `Results for "${q}"` : 'Search'}</h1>
        <p className="category-tagline">{results.length} product{results.length === 1 ? '' : 's'} found</p>
      </div>

      <div className="category-layout ip-fullwidth">
        <div className="product-grid">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {results.length === 0 && (
            <div className="empty-state ip-empty-state">
              <p className="ip-empty-title">{t('common.noProductsFound')}</p>
              <p className="ip-empty-sub">{t('common.tryDifferentSearch')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
