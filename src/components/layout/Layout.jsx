import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import TopBar from './TopBar';
import Header from './Header';
import NavBar from './NavBar';
import Footer from './Footer';

function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-container">
      <TopBar />
      <Header />
      <NavBar />
      <main className="site-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
