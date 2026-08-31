import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useCatalogue } from '../context/CatalogueContext';
import { subscribeAddresses, addAddress } from '../lib/addresses';
import { placeOrder } from '../lib/orders';
import AddressForm from '../components/AddressForm';

const BLANK_ADDRESS = { label: 'Home', line1: '', line2: '', city: '', state: '', pincode: '', phone: '' };

function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, pushToast } = useStore();
  const { getProductById } = useCatalogue();

  const [addresses, setAddresses] = useState(null); // null = loading
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [addingNew, setAddingNew] = useState(false);
  const [newAddress, setNewAddress] = useState(BLANK_ADDRESS);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = subscribeAddresses(user.uid, (list) => {
      setAddresses(list);
      setAddingNew(list.length === 0);
      setSelectedAddressId((prev) => prev || list.find((a) => a.isDefault)?.id || list[0]?.id || '');
    });
    return unsub;
  }, [user.uid]);

  const items = cart
    .map((item) => ({ ...item, product: getProductById(item.id) }))
    .filter((item) => item.product);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  if (items.length === 0) {
    return (
      <div className="empty-page">
        <h1>Checkout</h1>
        <div className="empty-page-icon">🛒</div>
        <p>Your cart is empty - add something before checking out.</p>
        <Link to="/category/indoor-plants" className="btn-build-garden">Continue shopping</Link>
      </div>
    );
  }

  async function handlePlaceOrder() {
    setError('');
    let address;
    if (addingNew) {
      const required = ['line1', 'city', 'state', 'pincode', 'phone'];
      if (required.some((f) => !newAddress[f].trim())) {
        setError('Please fill in all the required address fields.');
        return;
      }
      address = newAddress;
    } else {
      address = addresses.find((a) => a.id === selectedAddressId);
      if (!address) {
        setError('Please select or add a delivery address.');
        return;
      }
    }

    setPlacing(true);
    try {
      // Save a brand-new address to the address book too, so it's there
      // next time - doesn't block order placement if it fails.
      if (addingNew) {
        try { await addAddress(user.uid, address); } catch { /* non-fatal */ }
      }
      const orderId = await placeOrder(user, { cart, address, paymentMethod, getProductById });
      pushToast({ type: 'cart', message: 'Order placed! Thank you for shopping with us.', actionLabel: 'View Orders', actionTo: '/account?tab=orders' });
      navigate('/account?tab=orders', { state: { placedOrderId: orderId } });
    } catch (err) {
      setError('Could not place your order. Please try again.');
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="cart-page checkout-page">
      <p className="eyebrow">SECURE CHECKOUT</p>
      <h1>Checkout</h1>
      <div className="cart-layout">
        <div className="cart-items">
          <div className="cart-summary" style={{ marginBottom: 0 }}>
            <div className="checkout-section-head">
              <span className="checkout-step-badge">1</span>
              <h2>Delivery address</h2>
            </div>

            {addresses === null && <p>Loading addresses…</p>}

            {addresses !== null && addresses.length > 0 && !addingNew && (
              <div className="checkout-address-list">
                {addresses.map((addr) => (
                  <label
                    className={`checkout-address-option${selectedAddressId === addr.id ? ' selected' : ''}`}
                    key={addr.id}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                    />
                    <span>
                      <strong>{addr.label}</strong> — {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} {addr.pincode} · {addr.phone}
                    </span>
                  </label>
                ))}
                <button type="button" className="checkout-add-address-btn" onClick={() => setAddingNew(true)}>
                  + Add a new address
                </button>
              </div>
            )}

            {addingNew && (
              <div className="checkout-address-form">
                {addresses !== null && addresses.length > 0 && (
                  <button type="button" className="checkout-add-address-btn" onClick={() => setAddingNew(false)}>
                    ← Use a saved address
                  </button>
                )}
                <AddressForm value={newAddress} onChange={setNewAddress} />
              </div>
            )}
          </div>

          <div className="cart-summary" style={{ marginTop: 16 }}>
            <div className="checkout-section-head">
              <span className="checkout-step-badge">2</span>
              <h2>Payment method</h2>
            </div>
            <div className="checkout-payment-options">
              {['COD', 'UPI'].map((method) => (
                <label className={`checkout-address-option${paymentMethod === method ? ' selected' : ''}`} key={method}>
                  <input type="radio" name="payment" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                  <span>{method === 'COD' ? 'Cash on Delivery' : 'UPI'}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="cart-summary" style={{ marginTop: 16, marginBottom: 0 }}>
            <div className="checkout-section-head">
              <span className="checkout-step-badge">3</span>
              <h2>Review your order</h2>
            </div>
            <div className="cart-items" style={{ marginTop: 0 }}>
              {items.map(({ product, qty }) => (
                <div className="cart-row" key={product.id}>
                  <img src={product.image} alt={product.name} />
                  <div className="cart-row-info">
                    <span>{product.name}</span>
                    <p>{product.categoryLabel} · Qty {qty}</p>
                  </div>
                  <p className="cart-row-total">₹{product.price * qty}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="cart-summary checkout-summary-sticky">
          <h2>Order summary</h2>
          <div className="cart-summary-row">
            <span>{items.length} item{items.length > 1 ? 's' : ''}</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="cart-summary-row">
            <span>Delivery</span>
            <span>Free</span>
          </div>
          <div className="checkout-total-row">
            <span>Total</span>
            <span>₹{subtotal}</span>
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="button" className="btn-build-garden full-width" onClick={handlePlaceOrder} disabled={placing}>
            {placing ? 'Placing order…' : `Place order · ₹${subtotal}`}
          </button>
          <p className="checkout-secure-note">🔒 Your information is encrypted and secure.</p>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;
