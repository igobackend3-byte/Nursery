import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { getProductById } from '../data/products';

function Wishlist() {
  const { wishlist } = useStore();
  const products = wishlist.map(getProductById).filter(Boolean);

  return (
    <div className="wishlist-page">
      <p className="eyebrow">SAVED FOR LATER</p>
      <h1>Wishlist</h1>

      {products.length === 0 ? (
        <div className="empty-page">
          <div className="empty-page-icon">♡</div>
          <p>No saved products yet.</p>
          <Link to="/category/indoor-plants" className="btn-build-garden">Browse plants</Link>
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
