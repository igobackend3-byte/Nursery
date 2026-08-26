import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ToastIcon({ type }) {
  if (type === 'wishlist-add') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    );
  }
  if (type === 'wishlist-remove') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function Toast({ type = 'cart', message, actionLabel, actionTo, onDone, duration = 3500 }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const hideTimer = setTimeout(() => setLeaving(true), duration);
    return () => clearTimeout(hideTimer);
  }, [duration]);

  useEffect(() => {
    if (!leaving) return undefined;
    const removeTimer = setTimeout(onDone, 260);
    return () => clearTimeout(removeTimer);
  }, [leaving, onDone]);

  return (
    <div className={`toast toast-${type} ${leaving ? 'toast-leaving' : ''}`} role="status">
      <span className="toast-icon"><ToastIcon type={type} /></span>
      <span className="toast-message">{message}</span>
      {actionTo && (
        <Link to={actionTo} className="toast-action" onClick={() => setLeaving(true)}>
          {actionLabel}
        </Link>
      )}
      <button type="button" className="toast-close" onClick={() => setLeaving(true)} aria-label="Dismiss notification">
        ×
      </button>
    </div>
  );
}

export default Toast;
