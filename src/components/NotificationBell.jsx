import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subscribeNotifications, markAllNotificationsRead, markNotificationRead } from '../lib/notifications';

function formatWhen(ts) {
  const date = ts?.toDate?.();
  if (!date) return '';
  return date.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

// Bell icon + dropdown "inbox" of order notifications for a signed-in
// customer - the in-website mirror of the real emails sent via Resend (see
// lib/notifications.js / lib/emailNotify.js). Only rendered when signed in.
function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!user) return undefined;
    return subscribeNotifications(user.uid, setNotifications);
  }, [user]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  function handleToggle() {
    setOpen((v) => {
      const next = !v;
      if (next && unreadCount > 0) markAllNotificationsRead(user.uid, notifications).catch(() => {});
      return next;
    });
  }

  function handleItemClick(n) {
    if (!n.read) markNotificationRead(user.uid, n.id).catch(() => {});
    setOpen(false);
    navigate('/account?tab=orders');
  }

  return (
    <div className="action-icon notification-bell-wrap" ref={wrapRef}>
      <div role="button" tabIndex={0} title="Notifications" onClick={handleToggle}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && <span className="cart-badge">{unreadCount}</span>}
      </div>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-head">Notifications</div>
          {notifications.length === 0 ? (
            <p className="notification-dropdown-empty">No notifications yet - order updates will show up here.</p>
          ) : (
            <ul className="notification-dropdown-list">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`notification-item${n.read ? '' : ' unread'}`}
                  onClick={() => handleItemClick(n)}
                >
                  <strong>{n.title}</strong>
                  <p>{n.message}</p>
                  <span>{formatWhen(n.createdAt)}</span>
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
