import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { useCatalogue } from '../context/CatalogueContext';
import { useLanguage } from '../context/LanguageContext';

function Wishlist() {
  const { wishlist } = useStore();
  const { getProductById } = useCatalogue();
  const { t } = useLanguage();
  const products = wishlist.map(getProductById).filter(Boolean);

  return (
    <div className="wishlist-page">
      <p className="eyebrow">{t('header.wishlist')}</p>
      <h1>{t('wishlist.title')}</h1>

      {products.length === 0 ? (
        <div className="empty-page">
          <div className="empty-page-icon">♡</div>
          <p>{t('wishlist.empty')}</p>
          <Link to="/category/indoor-plants" className="btn-build-garden">{t('wishlist.browsePlants')}</Link>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
