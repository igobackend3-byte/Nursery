import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { useCatalogue } from '../context/CatalogueContext';
import { getDiscountPercent } from '../utils/pricing';
import { getLocalizedProductName, getLocalizedCategoryLabel } from '../utils/localizedContent';

function ProductCard({ product }) {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const { t, language } = useLanguage();
  const { categories } = useCatalogue();
  const isWishlisted = wishlist.includes(product.id);
  const discountPercent = getDiscountPercent(product.originalPrice, product.price);
  const localizedName = getLocalizedProductName(product, language);
  const categoryDoc = categories.find((c) => c.slug === product.category);
  const localizedCategoryLabel = getLocalizedCategoryLabel(categoryDoc, language) || product.categoryLabel;

  return (
    <div className="product-card">
      <Link
        to={`/product/${product.id}`}
        className={`product-card-media${product.isBestSeller ? ' has-bestseller' : ''}`}
      >
        {product.isBestSeller && <span className="bestseller-badge">{t('common.bestseller')}</span>}
        <img src={product.image} alt={localizedName} loading="lazy" />
        <span className="rating-badge">{product.rating}/5</span>
        <button
          type="button"
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          aria-label="Toggle wishlist"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? '#e63946' : 'none'} stroke={isWishlisted ? '#e63946' : '#333'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
        <button
          type="button"
          className="cart-quick-btn"
          onClick={(e) => {
            e.preventDefault();
            addToCart(product, 1);
          }}
          aria-label={t('common.addToCart')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        </button>
      </Link>
      <div className="product-card-body">
        <Link to={`/product/${product.id}`}>
          <h3>{localizedName}</h3>
        </Link>
        <p className="product-card-category">{localizedCategoryLabel}</p>
        <div className="product-card-price">
          <span className="price-now">₹{product.price}</span>
          <span className="price-was">₹{product.originalPrice}</span>
        </div>
        {discountPercent > 0 && <p className="price-off">{discountPercent}% OFF</p>}
        <Link to={`/product/${product.id}`} className="btn-details">
          {t('common.viewDetails').toUpperCase()}
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
