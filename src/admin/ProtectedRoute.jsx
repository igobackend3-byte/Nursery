import { Navigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

function ProtectedRoute({ children }) {
  const { isAuthed } = useAdminAuth();
  if (!isAuthed) return <Navigate to="/admin/login" replace />;
  return children;
}

export default ProtectedRoute;
