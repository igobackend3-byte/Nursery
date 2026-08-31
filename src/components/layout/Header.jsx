import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
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

// Web Speech API - built into Chrome/Edge/Safari, no extra dependency.
// Firefox and some browsers don't implement it, so the mic button only
// renders when it's actually available (checked once, not per-render).
const SpeechRecognitionCtor = typeof window !== 'undefined'
  ? (window.SpeechRecognition || window.webkitSpeechRecognition)
  : null;

function Header() {
  const navigate = useNavigate();
  const { cartCount, wishlistCount } = useStore();
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const recognitionRef = useRef(null);
  const typedPlaceholder = useTypewriter(SEARCH_PLACEHOLDER_PHRASES);
  const showAnimatedPlaceholder = !query && !isSearchFocused;

  function runSearch(term) {
    const trimmed = term.trim();
    if (trimmed) navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function handleSubmit(e) {
    e.preventDefault();
    runSearch(query);
  }

  function handleMicClick() {
    if (!SpeechRecognitionCtor) return;
    setVoiceError('');

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onerror = (event) => {
      setIsListening(false);
      setVoiceError(event.error === 'not-allowed' ? 'Microphone access denied.' : "Couldn't hear that - try again.");
    };
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const heard = event.results?.[0]?.[0]?.transcript ?? '';
      if (heard) {
        setQuery(heard);
        runSearch(heard);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  useEffect(() => () => recognitionRef.current?.stop(), []);

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
        {SpeechRecognitionCtor && (
          <button
            type="button"
            className={`search-mic-btn${isListening ? ' listening' : ''}`}
            onClick={handleMicClick}
            aria-label={isListening ? 'Stop voice search' : 'Search by voice'}
            title={isListening ? 'Listening... click to stop' : 'Search by voice'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
              <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="8" y1="22" x2="16" y2="22" />
            </svg>
          </button>
        )}
        {voiceError && <span className="search-mic-error">{voiceError}</span>}
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
