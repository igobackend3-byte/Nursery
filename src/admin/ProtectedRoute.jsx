import { Navigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

function ProtectedRoute({ children }) {
  const { isAuthed, authLoading } = useAdminAuth();
  if (authLoading) return <div className="admin-login-screen"><p className="admin-login-sub">Loading…</p></div>;
  if (!isAuthed) return <Navigate to="/admin/login" replace />;
  return children;
}

export default ProtectedRoute;
