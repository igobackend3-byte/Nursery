// Client-side trigger for the transactional order emails - the actual
// sending happens server-side in api/send-order-email.js (Vercel function),
// which holds the real Resend API key. This just POSTs the order data the
// caller already has and never touches the key itself.
//
// Deliberately fire-and-forget: a failed/slow email should never block or
// fail checkout or an admin status update, so callers don't need to await
// this or handle its errors - it logs a warning and moves on.
const INTERNAL_SECRET = import.meta.env.VITE_INTERNAL_API_SECRET;

export function notifyOrderEmail(type, order) {
  fetch('/api/send-order-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(INTERNAL_SECRET ? { 'x-igo-secret': INTERNAL_SECRET } : {}),
    },
    body: JSON.stringify({ type, order }),
  }).catch((err) => {
    console.warn(`[email] ${type} notification failed to send:`, err);
  });
}
