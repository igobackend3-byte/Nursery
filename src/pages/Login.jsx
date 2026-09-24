import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

// Friendlier text for the Firebase Auth error codes we're likely to hit here.
function authErrorMessage(err, t) {
  switch (err?.code) {
    case 'auth/invalid-email':
      return t('auth.errInvalidEmail');
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return t('auth.invalidCredentials');
    case 'auth/email-already-in-use':
      return t('auth.errAccountExists');
    case 'auth/weak-password':
      return t('auth.errWeakPassword');
    default:
      return t('auth.errGeneric');
  }
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();
  const { t } = useLanguage();

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
      setError(authErrorMessage(err, t));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-overlay" />
      <button type="button" className="auth-close" aria-label={t('auth.close')} onClick={() => navigate('/')}>
        ×
      </button>

      <div className="auth-shell">
        <div className="auth-copy">
          <h1>
            {t('auth.heroLine1')}
            <br />
            {t('auth.heroLine2')}
            <br />
            {t('auth.heroLine3')}
          </h1>

          <p>
            {t('auth.heroDesc')}
          </p>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>{mode === 'signup' ? t('auth.createYourAccount') : t('auth.signIn')}</h2>

          {mode === 'signup' && (
            <>
              <label htmlFor="name">{t('auth.fullName')}</label>
              <input
                id="name"
                type="text"
                placeholder={t('auth.fullName')}
                aria-label={t('auth.fullName')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </>
          )}

          <label htmlFor="email">{t('auth.emailAddress')}</label>
          <input
            id="email"
            type="email"
            placeholder={t('auth.emailAddress')}
            aria-label={t('auth.emailAddress')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">{t('auth.password')}</label>
          <div className="password-wrap">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder={t('auth.password')}
              aria-label={t('auth.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? t('auth.hide') : t('auth.show')}
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
                <span>{t('auth.rememberMe')}</span>
              </label>
            </div>
          )}

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting
              ? (mode === 'signup' ? t('auth.creatingAccount') : t('auth.signingIn'))
              : (mode === 'signup' ? t('auth.createAccountBtn') : t('auth.signInNow'))}
          </button>

          {mode === 'signin' ? (
            <p className="auth-signup">
              {t('auth.notMemberYet')}{' '}
              <a href="#signup" onClick={(e) => { e.preventDefault(); setError(''); setMode('signup'); }}>
                {t('auth.joinNow')}
              </a>
            </p>
          ) : (
            <p className="auth-signup">
              {t('auth.alreadyHaveAccount')}{' '}
              <a href="#signin" onClick={(e) => { e.preventDefault(); setError(''); setMode('signin'); }}>
                {t('auth.signIn')}
              </a>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
