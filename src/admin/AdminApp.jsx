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
import './admin.css';

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
          </Route>
        </Routes>
      </AdminDataProvider>
    </AdminAuthProvider>
  );
}

export default AdminApp;
