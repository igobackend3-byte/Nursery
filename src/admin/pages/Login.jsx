import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../AdminAuthContext';

function AdminLogin() {
  const { isAuthed, signIn } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isAuthed) return <Navigate to="/admin" replace />;

  function handleSubmit(e) {
    e.preventDefault();
    const result = signIn(password);
    if (!result.ok) setError(result.error);
  }

  return (
    <div className="admin-login-screen">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <div className="admin-login-brand">IGO Admin</div>
        <p className="admin-login-sub">Local preview password - replaced by real staff sign-in once Firebase is connected.</p>
        {error && <div className="admin-error">{error}</div>}
        <div className="admin-field">
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
          />
        </div>
        <button type="submit" className="admin-btn admin-btn-primary">Sign in</button>
      </form>
    </div>
  );
}

export default AdminLogin;
