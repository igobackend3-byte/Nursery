import { Route, Routes } from 'react-router-dom';
import { AdminAuthProvider } from './AdminAuthContext';
import { AdminDataProvider } from './AdminDataContext';
import ProtectedRoute from './ProtectedRoute';
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
import './admin.css';

const SOON_ROUTES = [
  { path: 'media', title: 'Media Library', description: 'Central image/video manager - upload, rename, replace, search, and reuse assets sitewide.' },
  { path: 'languages', title: 'Languages', description: 'Edit and translate every website string across English, Tamil, Hindi, Telugu, Malayalam and Kannada.' },
  { path: 'seo', title: 'SEO', description: 'Meta titles, descriptions, keywords, Open Graph images, sitemap and robots.txt per page.' },
  { path: 'reviews', title: 'Reviews', description: 'Approve, reject, reply to, feature, or delete customer reviews.' },
  { path: 'garden-services', title: 'Garden Services', description: 'Add, edit, reorder and hide the garden services offered on the storefront.' },
  { path: 'landscaping', title: 'Landscaping', description: 'Manage every landscaping service card (Villa, Balcony, Terrace, Rooftop, and the rest) with images, gallery, description and CTA.' },
  { path: 'gifting', title: 'Gifting', description: 'Manage corporate, festival, birthday, wedding, and return gift catalogues, plus gift cards.' },
  { path: 'b2b', title: 'B2B Sales', description: 'Manage dealer, retailer, bulk-order, hotel, apartment, school and office accounts.' },
  { path: 'blog', title: 'Blog', description: 'Write, edit, publish, schedule and categorize blog posts, with SEO fields.' },
  { path: 'activity', title: 'Activity Logs', description: 'A timestamped audit trail of every admin action across the CMS.' },
  { path: 'backup', title: 'Backup & Restore', description: 'Export a full snapshot of site content/catalogue data, or restore from one.' },
];

// Entirely self-contained: its own auth, its own data, its own layout.
// Nothing in src/pages/ or src/components/ (the storefront) imports
// anything from this folder, and nothing here imports the storefront's
// CSS - so nothing about the live site changes by this file existing.
function AdminApp() {
  return (
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
            <Route path="reports" element={<AdminReports />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="staff" element={<AdminStaff />} />
            <Route path="settings" element={<AdminSettings />} />
            {SOON_ROUTES.map((r) => (
              <Route key={r.path} path={r.path} element={<ComingSoon title={r.title} description={r.description} />} />
            ))}
          </Route>
        </Routes>
      </AdminDataProvider>
    </AdminAuthProvider>
  );
}

export default AdminApp;
