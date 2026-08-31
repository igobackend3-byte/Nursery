import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { useTypewriter } from '../../hooks/useTypewriter';
import NotificationBell from '../NotificationBell';
import igoLogo from '../../assets/igo-nursery-logo.jpeg';

const SEARCH_PLACEHOLDER_PHRASES = [
  'Search plants...',
  'Search seeds...',
  'Search pots & planters...',
  'Search plant care...',
  'Search gifting...',
];

function Header() {
  const navigate = useNavigate();
  const { cartCount, wishlistCount } = useStore();
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const typedPlaceholder = useTypewriter(SEARCH_PLACEHOLDER_PHRASES);
  const showAnimatedPlaceholder = !query && !isSearchFocused;

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) navigate(`/category/indoor-plants?q=${encodeURIComponent(query)}`);
  }

  return (
    <header className="primary-header">
      <div className="logo-container" onClick={() => navigate('/')} role="button" tabIndex={0}>
        <img src={igoLogo} alt="IGO Nursery" className="logo-icon" />
        <span className="logo-text-animate">IGO Nursery</span>
      </div>

      <form className="search-bar" onSubmit={handleSubmit}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <div className="search-input-wrap">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            aria-label="Search plants, pots, seeds"
          />
          {showAnimatedPlaceholder && (
            <span className="search-typing-placeholder" aria-hidden="true">
              {typedPlaceholder}
              <span className="search-typing-cursor">|</span>
            </span>
          )}
        </div>
      </form>

      <div className="user-actions">
        <NotificationBell />
        <div className="action-icon" onClick={() => navigate(isAuthenticated ? '/account' : '/login')} role="button" tabIndex={0} title="Account">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
        <div className="action-icon" onClick={() => navigate('/wishlist')} role="button" tabIndex={0} title="Wishlist">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
        </div>
        <div className="action-icon" onClick={() => navigate('/cart')} role="button" tabIndex={0} title="Cart">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          <span className="cart-badge">{cartCount}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
