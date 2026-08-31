import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import TopBar from './TopBar';
import Header from './Header';
import NavBar from './NavBar';
import Footer from './Footer';

// The Account page is a standalone screen by design request - no
// storefront chrome above or below it (no announcement bar, logo/search
// header, category nav, or footer), just the account content itself.
// Every other route keeps the full site chrome unchanged.
const CHROME_LESS_ROUTES = ['/account'];

function Layout() {
  const location = useLocation();
  const isChromeLess = CHROME_LESS_ROUTES.includes(location.pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-container">
      {!isChromeLess && (
        <>
          <TopBar />
          <Header />
          <NavBar />
        </>
      )}
      <main className="site-main">
        <Outlet />
      </main>
      {!isChromeLess && <Footer />}
    </div>
  );
}

export default Layout;
