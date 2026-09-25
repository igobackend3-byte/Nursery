// POST /api/send-order-email
// Body: { type: 'confirmation' | 'status_update' | 'admin_new_order', order }
//
// Runs server-side on Vercel (Node function), so RESEND_API_KEY never
// reaches the browser. `order` is the order object the caller (checkout,
// or the admin status-update flow) already has in hand from Firestore -
// there's no separate server-side order lookup here (that would need the
// Firebase Admin SDK / a service account, which is a bigger setup this
// Spark-plan project doesn't have yet). A shared-secret header is checked
// as a basic deterrent against random internet traffic hitting this
// endpoint and burning through the Resend quota - it's not a strong secret
// (it ships in the client bundle), just enough to stop opportunistic abuse.
import { sendEmail } from './_lib/resend.js';
import { orderConfirmationEmail, orderStatusUpdateEmail, adminNewOrderEmail } from './_lib/templates.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const expectedSecret = process.env.INTERNAL_API_SECRET;
  if (expectedSecret && req.headers['x-igo-secret'] !== expectedSecret) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const { type, order } = req.body ?? {};
    if (!order || !order.id) {
      res.status(400).json({ error: 'Missing order data' });
      return;
    }

    let subject; let html; let to;

    if (type === 'confirmation') {
      ({ subject, html } = orderConfirmationEmail(order));
      to = order.customerEmail;
    } else if (type === 'status_update') {
      ({ subject, html } = orderStatusUpdateEmail(order));
      to = order.customerEmail;
    } else if (type === 'admin_new_order') {
      ({ subject, html } = adminNewOrderEmail(order));
      to = process.env.ADMIN_NOTIFY_EMAIL;
    } else {
      res.status(400).json({ error: 'Unknown email type' });
      return;
    }

    if (!to) {
      res.status(400).json({ error: 'No recipient email available for this notification' });
      return;
    }

    const result = await sendEmail({ to, subject, html });
    res.status(200).json({ ok: true, id: result.id });
  } catch (err) {
    console.error('send-order-email failed:', err);
    res.status(500).json({ error: err.message || 'Failed to send email' });
  }
}
