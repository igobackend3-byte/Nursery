import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  function handleSubmit(e) {
    e.preventDefault();
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
          <h2>Sign in</h2>

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            aria-label="Email Address"
          />

          <label htmlFor="password">Password</label>
          <div className="password-wrap">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              aria-label="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? 'HIDE' : 'SHOW'}
            </button>
          </div>

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

          <button type="submit" className="auth-submit">
            SIGN IN NOW
          </button>

          <p className="auth-help">Lost your password?</p>
          <p className="auth-signup">
            Not a member yet? <a href="#signup">Join Now!</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
