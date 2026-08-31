import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useCatalogue } from '../context/CatalogueContext';
import { useLanguage } from '../context/LanguageContext';

function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, updateCartQty, removeFromCart } = useStore();
  const { getProductById } = useCatalogue();
  const { t } = useLanguage();
  const items = cart
    .map((item) => ({ ...item, product: getProductById(item.id) }))
    .filter((item) => item.product);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  if (items.length === 0) {
    return (
      <div className="empty-page">
        <h1>{t('cart.title')}</h1>
        <div className="empty-page-icon">🛒</div>
        <p>{t('cart.empty')}</p>
        <Link to="/category/indoor-plants" className="btn-build-garden">{t('cart.continueShopping')}</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>{t('cart.title')}</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map(({ product, qty }) => (
            <div className="cart-row" key={product.id}>
              <img src={product.image} alt={product.name} />
              <div className="cart-row-info">
                <Link to={`/product/${product.id}`}>{product.name}</Link>
                <p>{product.categoryLabel}</p>
                <p className="price-now">₹{product.price}</p>
              </div>
              <div className="qty-stepper">
                <button type="button" onClick={() => updateCartQty(product.id, qty - 1)}>−</button>
                <span>{qty}</span>
                <button type="button" onClick={() => updateCartQty(product.id, qty + 1)}>+</button>
              </div>
              <p className="cart-row-total">₹{product.price * qty}</p>
              <button type="button" className="cart-remove" onClick={() => removeFromCart(product.id)}>
                {t('cart.remove')}
              </button>
            </div>
          ))}
        </div>
        <aside className="cart-summary">
          <h2>{t('cart.orderSummary')}</h2>
          <div className="cart-summary-row">
            <span>{t('cart.subtotal')}</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="cart-summary-row">
            <span>{t('cart.delivery')}</span>
            <span>{t('cart.calculatedAtCheckout')}</span>
          </div>
          <button
            type="button"
            className="btn-build-garden full-width"
            onClick={() => navigate(isAuthenticated ? '/checkout' : '/login', { state: { from: { pathname: '/checkout' } } })}
          >
            {t('cart.proceedToCheckout')}
          </button>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
