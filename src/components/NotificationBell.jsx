import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { useNotificationFeed } from '../hooks/useNotificationFeed';

function formatWhen(ts) {
  const date = ts?.toDate?.();
  if (!date) return '';
  return date.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function activateOnKey(handler) {
  return (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handler();
    }
  };
}

// Bell icon + dropdown "inbox" for a signed-in customer. Merges personal
// order-lifecycle notifications with admin-broadcast announcements (see
// hooks/useNotificationFeed.js) - the in-website mirror of the real emails
// sent via Resend, plus offers/general notices the admin publishes. Only
// rendered when signed in.
function NotificationBell() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { pushToast } = useStore();
  const [open, setOpen] = useState(false);
  const [justArrived, setJustArrived] = useState(false);
  const wrapRef = useRef(null);
  const pulseTimeout = useRef(null);

  const { feed, unreadCount, markRead, markAllRead } = useNotificationFeed(user, profile, {
    onNewArrival: (n) => {
      pushToast({ type: 'cart', message: `${n.icon} ${n.title}` });
      setJustArrived(true);
      clearTimeout(pulseTimeout.current);
      pulseTimeout.current = setTimeout(() => setJustArrived(false), 1800);
    },
  });

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    function handleEscape(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => () => clearTimeout(pulseTimeout.current), []);

  if (!user) return null;

  function handleItemClick(n) {
    markRead(n);
    setOpen(false);
    if (n.actionUrl) navigate(n.actionUrl);
  }

  return (
    <div className="action-icon notification-bell-wrap" ref={wrapRef}>
      <div
        role="button"
        tabIndex={0}
        title={t('header.notifications')}
        aria-label={t('header.notifications')}
        aria-expanded={open}
        className={justArrived ? 'notification-bell-ring' : ''}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={activateOnKey(() => setOpen((v) => !v))}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && <span className="cart-badge notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
      </div>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-head">
            <span>{t('notifications.title')}{unreadCount > 0 ? ` (${unreadCount})` : ''}</span>
            {unreadCount > 0 && (
              <button type="button" className="notification-mark-all" onClick={markAllRead}>
                {t('notifications.markAllRead')}
              </button>
            )}
          </div>
          {feed === null ? (
            <div className="notification-dropdown-loading">
              <div className="acc-skeleton-row" /><div className="acc-skeleton-row" />
            </div>
          ) : feed.length === 0 ? (
            <div className="notification-dropdown-empty">
              <span className="notification-empty-icon">🔔</span>
              <strong>{t('common.noNotificationsYet')}</strong>
              <p>{t('notifications.allCaughtUp')}</p>
            </div>
          ) : (
            <ul className="notification-dropdown-list">
              {feed.map((n) => (
                <li
                  key={n.id}
                  className={`notification-item${n.read ? '' : ' unread'}${n.priority === 'high' ? ' priority-high' : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleItemClick(n)}
                  onKeyDown={activateOnKey(() => handleItemClick(n))}
                >
                  <span className="notification-item-icon">{n.icon}</span>
                  <div className="notification-item-body">
                    <strong>{n.title}</strong>
                    <p>{n.message}</p>
                    <div className="notification-item-foot">
                      <span>{formatWhen(n.createdAt)}</span>
                      {n.actionLabel && <span className="notification-cta">{n.actionLabel} →</span>}
                    </div>
                  </div>
                  {!n.read && <span className="notification-unread-dot" aria-hidden="true" />}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
