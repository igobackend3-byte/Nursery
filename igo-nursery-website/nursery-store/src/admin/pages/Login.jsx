import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../AdminAuthContext';

// Single admin account, so the login screen only ever asks for the
// password - the email is fixed and never shown. Real Firebase Auth still
// runs underneath (this account still needs role: 'admin' set on its
// users/{uid} Firestore doc, same as any admin account - see the setup
// checklist), so Firestore's security rules still actually protect the
// data; this just hides the email field from the UI.
const ADMIN_EMAIL = 'admin@igonursery.com';

function AdminLogin() {
  const { isAuthed, isNonAdminSignedIn, authLoading, signIn, signOut } = useAdminAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (authLoading) return <div className="admin-login-screen"><p className="admin-login-sub">Loading…</p></div>;
  if (isAuthed) return <Navigate to="/admin" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const result = await signIn(ADMIN_EMAIL, password);
    if (!result.ok) setError(result.error);
    setSubmitting(false);
  }

  if (isNonAdminSignedIn) {
    return (
      <div className="admin-login-screen">
        <div className="admin-login-card">
          <div className="admin-login-brand">IGO Admin</div>
          <div className="admin-error">
            This account doesn't have admin access. Ask an existing admin to grant it, or sign in with a different account.
          </div>
          <button type="button" className="admin-btn admin-btn-primary" onClick={signOut}>Sign out</button>
        </div>
      </div>
    );
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

          <button type="submit" className="admin-btn admin-btn-primary admin-login-submit" disabled={submitting}>
            {submitting ? 'SIGNING IN…' : 'SIGN IN NOW'}
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
