import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Friendlier text for the Firebase Auth error codes we're likely to hit here.
function authErrorMessage(err) {
  switch (err?.code) {
    case 'auth/invalid-email':
      return 'That email address doesn\'t look right.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email - try signing in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const redirectTo = location.state?.from?.pathname ?? '/';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'signup') {
        await signup(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-overlay" />
      <button type="button" className="auth-close" aria-label="Close and return to homepage" onClick={() => navigate('/')}>
        ×
      </button>

      <div className="auth-shell">
        <div className="auth-copy">
          <h1>
            Future of
            <br />
            Farming
            <br />
            Starts Here
          </h1>

          <p>
            Experience innovation through smart monitoring, intelligent
            alerts, and advanced agricultural systems.
          </p>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>{mode === 'signup' ? 'Create your account' : 'Sign in'}</h2>

          {mode === 'signup' && (
            <>
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                aria-label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </>
          )}

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            aria-label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <div className="password-wrap">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? 'HIDE' : 'SHOW'}
            </button>
          </div>

          {mode === 'signin' && (
            <div className="auth-row">
              <label className="remember-box">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe((value) => !value)}
                />
                <span>Remember Me</span>
              </label>
            </div>
          )}

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting
              ? (mode === 'signup' ? 'CREATING ACCOUNT…' : 'SIGNING IN…')
              : (mode === 'signup' ? 'CREATE ACCOUNT' : 'SIGN IN NOW')}
          </button>

          {mode === 'signin' ? (
            <p className="auth-signup">
              Not a member yet?{' '}
              <a href="#signup" onClick={(e) => { e.preventDefault(); setError(''); setMode('signup'); }}>
                Join Now!
              </a>
            </p>
          ) : (
            <p className="auth-signup">
              Already have an account?{' '}
              <a href="#signin" onClick={(e) => { e.preventDefault(); setError(''); setMode('signin'); }}>
                Sign in
              </a>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
