import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../AdminAuthContext';

function AdminLogin() {
  const { isAuthed, isNonAdminSignedIn, authLoading, signIn, signOut } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (authLoading) return <div className="admin-login-screen"><p className="admin-login-sub">Loading…</p></div>;
  if (isAuthed) return <Navigate to="/admin" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const result = await signIn(email.trim(), password);
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
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <div className="admin-login-brand">IGO Admin</div>
        <p className="admin-login-sub">Sign in with a Firebase account that has admin access.</p>
        {error && <div className="admin-error">{error}</div>}
        <div className="admin-field">
          <label htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            required
          />
        </div>
        <div className="admin-field">
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
