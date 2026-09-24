import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';
import { useAdminData } from './AdminDataContext';
import { subscribeAllOrders } from '../lib/orders';
import {
  ShieldIcon, MoonIcon, SunIcon, StoreIcon, RefreshIcon, LogoutIcon,
  DashboardIcon, CartIcon, LeadsIcon, BoxIcon, GridIcon, StackIcon, UsersIcon,
  ReportsIcon, CouponIcon, FileIcon, StaffIcon, GearIcon, BellIcon,
  StarIcon, LeafServiceIcon, TreeIcon, GiftIcon2, BuildingIcon,
  BookIcon, ImagesIcon, GlobeIcon, SearchIcon,
} from './adminIcons';

// Flat horizontal nav, in the exact order requested - one scrollable pill
// row rather than a sidebar. `soon: true` items route to the shared
// ComingSoon placeholder (see AdminApp.jsx's SOON_ROUTES) so the nav can
// show the full planned structure without faking finished work.
const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: DashboardIcon, end: true },
  { to: '/admin/orders', label: 'Orders', icon: CartIcon },
  { to: '/admin/products', label: 'Products', icon: BoxIcon },
  { to: '/admin/categories', label: 'Categories', icon: GridIcon },
  { to: '/admin/inventory', label: 'Inventory', icon: StackIcon },
  { to: '/admin/customers', label: 'Customers', icon: UsersIcon },
  { to: '/admin/reviews', label: 'Reviews', icon: StarIcon, soon: true },
  { to: '/admin/coupons', label: 'Offers', icon: CouponIcon },
  { to: '/admin/garden-services', label: 'Garden Services', icon: LeafServiceIcon, soon: true },
  { to: '/admin/landscaping', label: 'Landscaping', icon: TreeIcon, soon: true },
  { to: '/admin/gifting', label: 'Gifting', icon: GiftIcon2, soon: true },
  { to: '/admin/b2b', label: 'B2B Sales', icon: BuildingIcon, soon: true },
  { to: '/admin/blog', label: 'Blog', icon: BookIcon, soon: true },
  { to: '/admin/content', label: 'Content', icon: FileIcon },
  { to: '/admin/media', label: 'Media Library', icon: ImagesIcon, soon: true },
  { to: '/admin/languages', label: 'Languages', icon: GlobeIcon, soon: true },
  { to: '/admin/seo', label: 'SEO', icon: SearchIcon, soon: true },
  { to: '/admin/leads', label: 'Visitor Leads', icon: LeadsIcon },
  { to: '/admin/reports', label: 'Reports', icon: ReportsIcon },
  { to: '/admin/staff', label: 'Users & Roles', icon: StaffIcon },
  { to: '/admin/settings', label: 'Settings', icon: GearIcon },
];

const THEME_KEY = 'igo-admin-theme';

function AdminLayout() {
  const { signOut } = useAdminAuth();
  const { products } = useAdminData();
  const [orderCount, setOrderCount] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) ?? 'light');
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => subscribeAllOrders((orders) => setOrderCount(orders.length)), []);
  useEffect(() => { localStorage.setItem(THEME_KEY, theme); }, [theme]);

  useEffect(() => {
    if (!profileOpen) return undefined;
    function onDocClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [profileOpen]);

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  return (
    <div className="admin-root" data-theme={theme}>
      <header className="admin-topbar">
        <div className="admin-topbar-brand">
          <span className="admin-topbar-icon"><ShieldIcon width="22" height="22" /></span>
          <div>
            <div className="admin-topbar-title">IGO Nursery Admin</div>
            <div className="admin-topbar-sub">{products.length} products · {orderCount ?? '—'} orders total</div>
          </div>
        </div>
        <div className="admin-topbar-actions">
          <button type="button" className="admin-topbar-btn" onClick={toggleTheme}>
            {theme === 'dark' ? <SunIcon width="15" height="15" /> : <MoonIcon width="15" height="15" />}
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-topbar-btn">
            <StoreIcon width="15" height="15" /> View Store
          </a>
          <button type="button" className="admin-topbar-btn" onClick={() => window.location.reload()}>
            <RefreshIcon width="15" height="15" /> Refresh
          </button>
          <NavLink to="/admin/notifications" className="admin-topbar-icon-btn" aria-label="Notifications" title="Notifications">
            <BellIcon width="17" height="17" />
          </NavLink>
          <div className="admin-profile" ref={profileRef}>
            <button
              type="button"
              className="admin-profile-btn"
              onClick={() => setProfileOpen((v) => !v)}
              aria-expanded={profileOpen}
              aria-label="Admin profile"
            >
              A
            </button>
            {profileOpen && (
              <div className="admin-profile-menu">
                <NavLink to="/admin/staff" onClick={() => setProfileOpen(false)}>Users &amp; Roles</NavLink>
                <NavLink to="/admin/settings" onClick={() => setProfileOpen(false)}>Settings</NavLink>
                <button type="button" className="admin-profile-logout" onClick={signOut}>
                  <LogoutIcon width="14" height="14" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <nav className="admin-tabbar">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `admin-tab${isActive ? ' active' : ''}`}>
            <Icon width="15" height="15" />
            {label}
          </NavLink>
        ))}
      </nav>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
