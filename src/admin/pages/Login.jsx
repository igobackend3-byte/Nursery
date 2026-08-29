import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../AdminAuthContext';

function AdminLogin() {
  const { isAuthed, signIn } = useAdminAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  if (isAuthed) return <Navigate to="/admin" replace />;

  function handleSubmit(e) {
    e.preventDefault();
    const result = signIn(password);
    if (!result.ok) setError(result.error);
  }

  return (
    <div className="admin-login-screen">
      <div className="admin-login-overlay" />

      <button
        type="button"
        className="admin-login-close"
        aria-label="Close and return to storefront"
        onClick={() => navigate('/')}
      >
        &times;
      </button>

      <div className="admin-login-shell">
        <div className="admin-login-copy">
          <h1>
            IGO Nursery
            <br />
            Admin Console
          </h1>
          <p>
            Manage products, orders, customers and store content from a single
            secure dashboard.
          </p>
        </div>

        <form className="admin-login-card" onSubmit={handleSubmit}>
          <h2>Sign in</h2>

          {error && <div className="admin-error">{error}</div>}

          <label htmlFor="admin-password">Password</label>
          <div className="admin-login-pw">
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter admin password"
              aria-label="Password"
              autoFocus
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? 'HIDE' : 'SHOW'}
            </button>
          </div>

          <div className="admin-login-row">
            <label className="admin-login-remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe((value) => !value)}
              />
              <span>Remember Me</span>
            </label>
          </div>

          <button type="submit" className="admin-btn admin-btn-primary admin-login-submit">
            SIGN IN NOW
          </button>

          <p className="admin-login-note">
            Access is restricted to authorised IGO staff.
          </p>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
