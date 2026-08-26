import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { getProductById } from '../data/products';

function Cart() {
  const { cart, updateCartQty, removeFromCart } = useStore();
  const items = cart
    .map((item) => ({ ...item, product: getProductById(item.id) }))
    .filter((item) => item.product);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  if (items.length === 0) {
    return (
      <div className="empty-page">
        <h1>Shopping cart</h1>
        <div className="empty-page-icon">🛒</div>
        <p>Your cart is waiting for something green.</p>
        <Link to="/category/indoor-plants" className="btn-build-garden">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping cart</h1>
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
                Remove
              </button>
            </div>
          ))}
        </div>
        <aside className="cart-summary">
          <h2>Order summary</h2>
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="cart-summary-row">
            <span>Delivery</span>
            <span>Calculated at checkout</span>
          </div>
          <button type="button" className="btn-build-garden full-width">Proceed to checkout</button>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
