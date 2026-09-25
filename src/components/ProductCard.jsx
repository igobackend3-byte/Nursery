import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { useCatalogue } from '../context/CatalogueContext';
import { getDiscountPercent } from '../utils/pricing';
import { getLocalizedProductName, getLocalizedCategoryLabel } from '../utils/localizedContent';
import imageMap from '../data/imageMap.json';

// Inline data: URI leaf icon - shown in place of a broken <img> if a
// product's image is ever missing/deleted, instead of the browser's
// broken-image icon. Never hotlinks an external placeholder.
const NO_IMAGE_PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23eef5ee"/><path d="M32 50V26" stroke="%232f6b3a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 26c0-10-8-16-16-16 0 10 6 16 16 16Z" fill="%234f9a5c"/><path d="M32 26c0-10 8-16 16-16 0 10-6 16-16 16Z" fill="%232f6b3a"/></svg>'
);

// `isNew` is opt-in per usage (e.g. the homepage "Just In" section) - never
// set by default, so every other place ProductCard is already used is
// unaffected.
function ProductCard({ product, isNew = false }) {
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
        className={`product-card-media${product.isBestSeller ? ' has-bestseller' : ''}${isNew ? ' has-new' : ''}`}
      >
        {product.isBestSeller && <span className="bestseller-badge">{t('common.bestseller')}</span>}
        {isNew && <span className="new-badge">{t('home.newBadge')}</span>}
        <img 
          src={imageMap[product.name] || product.image || NO_IMAGE_PLACEHOLDER} 
          alt={localizedName} 
          loading="lazy" 
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = NO_IMAGE_PLACEHOLDER; }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} 
        />
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
