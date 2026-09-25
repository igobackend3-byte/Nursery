// Client-side trigger for the transactional order emails - the actual
// sending happens server-side in api/send-order-email.js (Vercel function),
// which holds the real Resend API key. This just POSTs the order data the
// caller already has and never touches the key itself.
//
// Returns the send promise (resolves on 2xx, rejects otherwise) so callers
// that want to track delivery status (see lib/orders.js) can do so - but
// nothing here awaits it itself, so a slow/failed email still never blocks
// or fails checkout or an admin status update.
const INTERNAL_SECRET = import.meta.env.VITE_INTERNAL_API_SECRET;

export async function notifyOrderEmail(type, order) {
  const res = await fetch('/api/send-order-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(INTERNAL_SECRET ? { 'x-igo-secret': INTERNAL_SECRET } : {}),
    },
    body: JSON.stringify({ type, order }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`send-order-email responded ${res.status}: ${body}`);
  }
  return res.json();
}
