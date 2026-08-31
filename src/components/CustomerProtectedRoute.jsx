import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Gate for customer-only pages (Profile, Addresses, Order History - built in
// a later phase). Not applied to any existing route yet - Cart/Wishlist stay
// guest-usable for now so today's UX doesn't change.
function CustomerProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <div className="auth-loading">Loading…</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default CustomerProtectedRoute;
