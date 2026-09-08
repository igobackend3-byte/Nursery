import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import TopBar from './TopBar';
import Header from './Header';
import NavBar from './NavBar';
import Footer from './Footer';
import ScrollProgress from '../ScrollProgress';
import BackToTop from '../BackToTop';
import useLeafParallax from '../../hooks/useLeafParallax';

// The Account page keeps the utility header (logo, search, language,
// notifications, account/wishlist/cart icons) but drops the announcement
// bar, the category nav menu (Plants/Seeds/.../Locate Store), and the
// footer - by design request, so it reads as a focused account screen
// without the full storefront chrome around it. Every other route is
// unaffected.
const ACCOUNT_ROUTE = '/account';

function Layout() {
  const location = useLocation();
  const isAccountPage = location.pathname === ACCOUNT_ROUTE;

  useLeafParallax();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-container">
      <ScrollProgress />
      {!isAccountPage && <TopBar />}
      <Header />
      {!isAccountPage && <NavBar />}
      <main className="site-main">
        <Outlet />
      </main>
      {!isAccountPage && <Footer />}
      <BackToTop />
    </div>
  );
}

export default Layout;
