import { Route, Routes } from 'react-router-dom';
import { AdminAuthProvider } from './AdminAuthContext';
import { AdminDataProvider } from './AdminDataContext';
import ProtectedRoute from './ProtectedRoute';
import { LanguageContext } from '../context/LanguageContext';
import { getTranslation, LANGUAGES } from '../i18n/translations';
import AdminLayout from './AdminLayout';
import AdminLogin from './pages/Login';
import AdminDashboard from './pages/Dashboard';
import AdminProducts from './pages/Products';
import AdminCategories from './pages/Categories';
import AdminOrders from './pages/Orders';
import AdminVisitorLeads from './pages/VisitorLeads';
import AdminInventory from './pages/Inventory';
import AdminCustomers from './pages/Customers';
import AdminReports from './pages/Reports';
import AdminCoupons from './pages/Coupons';
import AdminNotifications from './pages/Notifications';
import AdminContent from './pages/Content';
import AdminStaff from './pages/Staff';
import AdminSettings from './pages/Settings';
import ComingSoon from './pages/ComingSoon';
import PagesList from './pages/PagesList';
import VisualEditor from './editor/VisualEditor';
import './admin.css';

const SOON_ROUTES = [
  { path: 'languages', title: 'Languages', description: 'Edit and translate every website string across English, Tamil, Hindi, Telugu, Malayalam and Kannada.' },
  { path: 'seo', title: 'SEO', description: 'Meta titles, descriptions, keywords, Open Graph images, sitemap and robots.txt per page.' },
  { path: 'reviews', title: 'Reviews', description: 'Approve, reject, reply to, feature, or delete customer reviews.' },
  { path: 'activity', title: 'Activity Logs', description: 'A timestamped audit trail of every admin action across the CMS.' },
  { path: 'backup', title: 'Backup & Restore', description: 'Export a full snapshot of site content/catalogue data, or restore from one.' },
];

// Entirely self-contained: its own auth, its own data, its own layout.
// Nothing in src/pages/ or src/components/ (the storefront) imports
// anything from this folder, and nothing here imports the storefront's
// CSS - so nothing about the live site changes by this file existing.
function AdminApp() {
  return (
    <LanguageContext.Provider value={{ language: 'en', setLanguage: () => {}, t: (path) => getTranslation('en', path), languages: LANGUAGES }}>
      <AdminAuthProvider>
        <AdminDataProvider>
          <Routes>
          <Route path="login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="leads" element={<AdminVisitorLeads />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="settings" element={<AdminSettings />} />
            
            <Route path="pages" element={<PagesList />} />
            {SOON_ROUTES.map((r) => (
              <Route key={r.path} path={r.path} element={<ComingSoon title={r.title} description={r.description} />} />
            ))}
          </Route>
          
          {/* Visual Editor takes over the entire screen, outside AdminLayout */}
          <Route path="pages/:pageId" element={<ProtectedRoute><VisualEditor /></ProtectedRoute>} />
          </Routes>
        </AdminDataProvider>
      </AdminAuthProvider>
    </LanguageContext.Provider>
  );
}

export default AdminApp;
