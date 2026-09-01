import { useEffect, useRef, useState } from 'react';
import {
  subscribeNotifications, markAllNotificationsRead, markNotificationRead,
} from '../lib/notifications';
import {
  subscribeActiveAnnouncements, subscribeReadAnnouncementIds,
  markAllAnnouncementsRead, markAnnouncementRead,
} from '../lib/announcements';

// Merges the two real-time sources that make up a customer's notification
// feed - their personal order-lifecycle notifications, and the admin's
// site-wide announcements (offers/general broadcasts) - into one list,
// respecting the customer's notification preferences (see
// lib/profile.js / Account.jsx Settings tab). Shared by the header
// NotificationBell and the Account page's Notifications tab so both stay
// in sync and behave identically.
export function useNotificationFeed(user, profile, { onNewArrival } = {}) {
  const [personal, setPersonal] = useState(null);
  const [announcements, setAnnouncements] = useState(null);
  const [readAnnouncementIds, setReadAnnouncementIds] = useState(new Set());
  const seenIds = useRef(null); // null until first merge, so mount doesn't fire toasts

  useEffect(() => {
    if (!user) return undefined;
    return subscribeNotifications(user.uid, setPersonal);
  }, [user]);

  useEffect(() => subscribeActiveAnnouncements(setAnnouncements), []);

  useEffect(() => {
    if (!user) return undefined;
    return subscribeReadAnnouncementIds(user.uid, setReadAnnouncementIds);
  }, [user]);

  const prefs = profile?.notificationPrefs ?? {};
  const isCategoryEnabled = (category) => prefs[category] !== false; // default on

  const feed = (() => {
    if (personal === null || announcements === null) return null;
    const personalItems = personal
      .filter((n) => isCategoryEnabled(n.category ?? 'orders'))
      .map((n) => ({
        id: `p-${n.id}`, rawId: n.id, source: 'personal',
        category: n.category ?? 'orders', icon: n.icon ?? '🔔',
        title: n.title, message: n.message, createdAt: n.createdAt,
        read: n.read, actionUrl: n.actionUrl, actionLabel: null,
        priority: n.priority ?? 'normal',
      }));
    const announcementItems = announcements
      .filter((a) => isCategoryEnabled(a.category))
      .map((a) => ({
        id: `a-${a.id}`, rawId: a.id, source: 'announcement',
        category: a.category, icon: a.icon,
        title: a.title, message: a.message, createdAt: a.createdAt,
        read: readAnnouncementIds.has(a.id), actionUrl: a.actionUrl || null,
        actionLabel: a.actionLabel || null, priority: a.priority ?? 'normal',
      }));
    return [...personalItems, ...announcementItems].sort((a, b) => {
      const at = a.createdAt?.toMillis?.() ?? 0;
      const bt = b.createdAt?.toMillis?.() ?? 0;
      return bt - at;
    });
  })();

  // Fire a toast for any brand-new unread item that appears after the
  // first snapshot (so login/page-load never spams a wall of toasts for
  // existing notifications - only genuinely new arrivals, live).
  useEffect(() => {
    if (!feed) return;
    if (seenIds.current === null) {
      seenIds.current = new Set(feed.map((n) => n.id));
      return;
    }
    const newUnread = feed.filter((n) => !n.read && !seenIds.current.has(n.id));
    seenIds.current = new Set(feed.map((n) => n.id));
    if (newUnread.length > 0 && onNewArrival) {
      newUnread.forEach((n) => onNewArrival(n));
    }
  }, [feed]); // eslint-disable-line react-hooks/exhaustive-deps

  const unreadCount = feed ? feed.filter((n) => !n.read).length : 0;

  function markRead(item) {
    if (item.read || !user) return;
    if (item.source === 'personal') markNotificationRead(user.uid, item.rawId).catch(() => {});
    else markAnnouncementRead(user.uid, item.rawId).catch(() => {});
  }

  function markAllRead() {
    if (!user || !feed) return;
    const unreadPersonal = (personal ?? []).filter((n) => !n.read);
    const unreadAnnouncementIds = feed.filter((n) => n.source === 'announcement' && !n.read).map((n) => n.rawId);
    markAllNotificationsRead(user.uid, unreadPersonal).catch(() => {});
    if (unreadAnnouncementIds.length > 0) markAllAnnouncementsRead(user.uid, unreadAnnouncementIds).catch(() => {});
  }

  return { feed, unreadCount, markRead, markAllRead };
}
