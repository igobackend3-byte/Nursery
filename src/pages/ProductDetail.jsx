import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { getProductById, getProductsByCategory } from '../data/products';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id);
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const [qty, setQty] = useState(1);

  // Gallery = main image + any admin-added extra photos, plus a video slide
  // at the end if one was uploaded. Falls back gracefully for products that
  // only ever had the single `image` field.
  const gallery = product
    ? [product.image, ...(product.images ?? [])].filter(Boolean).map((src) => ({ type: 'image', src }))
    : [];
  if (product?.video) gallery.push({ type: 'video', src: product.video });
  const [activeSlide, setActiveSlide] = useState(0);

  if (!product) {
    return (
      <div className="empty-page">
        <h2>Product not found</h2>
        <button type="button" onClick={() => navigate('/')} className="btn-build-garden">Back to home</button>
      </div>
    );
  }

  const related = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);
  const isWishlisted = wishlist.includes(product.id);
  const active = gallery[activeSlide] ?? gallery[0];

  return (
    <div className="product-detail-page">
      <p className="breadcrumb">
        <Link to="/">Home</Link> / <Link to={`/category/${product.category}`}>{product.categoryLabel}</Link> / {product.name}
      </p>

      <div className="product-detail-layout">
        <div className="product-detail-gallery">
          {gallery.length > 1 && (
            <div className="product-detail-thumbs">
              {gallery.map((slide, i) => (
                <button
                  type="button"
                  key={i}
                  className={`product-detail-thumb${i === activeSlide ? ' active' : ''}`}
                  onClick={() => setActiveSlide(i)}
                  aria-label={slide.type === 'video' ? 'Play product video' : `Photo ${i + 1}`}
                >
                  {slide.type === 'video' ? (
                    <span className="product-detail-thumb-video">▶</span>
                  ) : (
                    <img src={slide.src} alt="" />
                  )}
                </button>
              ))}
            </div>
          )}
          <div className="product-detail-media">
            {active?.type === 'video' ? (
              <video src={active.src} controls autoPlay muted loop />
            ) : (
              <img src={active?.src ?? product.image} alt={product.name} />
            )}
          </div>
        </div>
        <div className="product-detail-info">
          <p className="eyebrow">{product.categoryLabel}</p>
          <h1>{product.name}</h1>
          <p className="product-detail-rating">{product.rating}/5</p>
          <div className="product-card-price large">
            <span className="price-now">₹{product.price}</span>
            <span className="price-was">₹{product.originalPrice}</span>
            <span className="price-off">₹{product.discount} OFF</span>
          </div>

          <div className="product-detail-specs">
            <div><span>Size</span><strong>{product.size}</strong></div>
            <div><span>Light</span><strong>{product.light}</strong></div>
            <div><span>Ideal location</span><strong>{product.location}</strong></div>
            <div><span>Maintenance</span><strong>{product.maintenance}</strong></div>
            <div><span>Watering</span><strong>{product.water}</strong></div>
          </div>

          <div className="qty-row">
            <div className="qty-stepper">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <button type="button" className="btn-build-garden" onClick={() => addToCart(product, qty)}>
              Add to cart
            </button>
            <button type="button" className={`wishlist-pill ${isWishlisted ? 'active' : ''}`} onClick={() => toggleWishlist(product)}>
              {isWishlisted ? '♥ Saved' : '♡ Save for later'}
            </button>
          </div>

          <p className="product-detail-desc">
            {product.name} is grown at our Muttukadu lab under monitored conditions and passes our
            99.2% health check before it ships. Pairs well with our terracotta pots and organic
            potting mix for the best start.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="related-products">
          <h2>You may also like</h2>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetail;
