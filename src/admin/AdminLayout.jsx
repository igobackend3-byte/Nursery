import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';
import { useAdminData } from './AdminDataContext';
import {
  ShieldIcon, MoonIcon, SunIcon, StoreIcon, RefreshIcon, LogoutIcon,
  DashboardIcon, CartIcon, LeadsIcon, BoxIcon, GridIcon, StackIcon, UsersIcon,
  ReportsIcon, CouponIcon, FileIcon, StaffIcon, GearIcon,
} from './adminIcons';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: DashboardIcon, end: true },
  { to: '/admin/orders', label: 'Orders', icon: CartIcon },
  { to: '/admin/leads', label: 'Visitor Leads', icon: LeadsIcon },
  { to: '/admin/products', label: 'Products', icon: BoxIcon },
  { to: '/admin/categories', label: 'Categories', icon: GridIcon },
  { to: '/admin/inventory', label: 'Inventory', icon: StackIcon },
  { to: '/admin/customers', label: 'Customers', icon: UsersIcon },
  { to: '/admin/reports', label: 'Reports', icon: ReportsIcon },
  { to: '/admin/coupons', label: 'Coupons', icon: CouponIcon },
  { to: '/admin/content', label: 'Content', icon: FileIcon },
  { to: '/admin/staff', label: 'Staff & Roles', icon: StaffIcon },
  { to: '/admin/settings', label: 'Settings', icon: GearIcon },
];

const THEME_KEY = 'igo-admin-theme';

function AdminLayout() {
  const { signOut } = useAdminAuth();
  const { products, orders } = useAdminData();
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) ?? 'light');

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  return (
    <div className="admin-root" data-theme={theme}>
      <header className="admin-topbar">
        <div className="admin-topbar-brand">
          <span className="admin-topbar-icon"><ShieldIcon width="22" height="22" /></span>
          <div>
            <div className="admin-topbar-title">Admin Control Panel</div>
            <div className="admin-topbar-sub">{products.length} products · {orders.length} orders total</div>
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
          <button type="button" className="admin-topbar-btn admin-topbar-btn-danger" onClick={signOut}>
            <LogoutIcon width="15" height="15" /> Logout
          </button>
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
