import { useEffect, useState } from 'react';

// Small floating "back to top" button, leaf-styled to match the site's
// icon set. Only shown once the user has scrolled down a bit; clicking
// it smooth-scrolls back to the top of the page.
function BackToTop() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShown(window.scrollY > 600);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <button
      type="button"
      className={`av-back-to-top${shown ? ' is-shown' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
      tabIndex={shown ? 0 : -1}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22C12 22 20 18 20 12V5l-8-3-8 3v7C4 18 12 22 12 22z" />
        <path d="M12 16V9" />
        <path d="M8.5 12.5 12 9l3.5 3.5" />
      </svg>
    </button>
  );
}

export default BackToTop;
