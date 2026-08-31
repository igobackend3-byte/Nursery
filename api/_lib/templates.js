// Reusable HTML email templates for the order lifecycle. Every template
// shares one wrapper (brand header/footer) so all outgoing mail looks
// consistent; only the body block differs per email type.
const GREEN = '#1b4b36';
const LIGHT_GREEN = '#e4f3d9';

function formatMoney(n) {
  return `Rs. ${Number(n ?? 0).toLocaleString('en-IN')}`;
}

function formatDate(value) {
  // Accepts a Firestore Timestamp-ish object ({_seconds}), a JS Date, or
  // an ISO string - whatever the caller had on hand when it fired the
  // request - and renders it consistently.
  let date = null;
  if (!value) return '—';
  if (value instanceof Date) date = value;
  else if (typeof value === 'string') date = new Date(value);
  else if (typeof value._seconds === 'number') date = new Date(value._seconds * 1000);
  else if (typeof value.seconds === 'number') date = new Date(value.seconds * 1000);
  if (!date || Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function wrapEmail(title, bodyHtml) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f5f5f0;font-family:'Segoe UI',Arial,sans-serif;color:#28352d;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:${GREEN};padding:22px 28px;">
                <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.3px;">IGO Nursery</span>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h1 style="margin:0 0 16px;font-size:19px;color:${GREEN};">${title}</h1>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px;background:#f5f5f0;font-size:12px;color:#6b7a70;">
                IGO Nursery · Muttukadu, Chennai, Tamil Nadu<br />
                This is an automated message about your order - please don't reply directly to this email.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function itemsTable(items = []) {
  const rows = items.map((it) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #eee;">${it.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">${it.qty}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${formatMoney(it.subtotal)}</td>
    </tr>`).join('');

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin:16px 0;">
      <tr>
        <th style="text-align:left;padding-bottom:8px;border-bottom:2px solid ${GREEN};font-size:12px;color:#6b7a70;">ITEM</th>
        <th style="text-align:center;padding-bottom:8px;border-bottom:2px solid ${GREEN};font-size:12px;color:#6b7a70;">QTY</th>
        <th style="text-align:right;padding-bottom:8px;border-bottom:2px solid ${GREEN};font-size:12px;color:#6b7a70;">AMOUNT</th>
      </tr>
      ${rows}
    </table>`;
}

function totalsBlock(order) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin-top:4px;">
      <tr><td style="padding:3px 0;color:#6b7a70;">Subtotal</td><td style="padding:3px 0;text-align:right;">${formatMoney(order.subtotal)}</td></tr>
      ${order.discount > 0 ? `<tr><td style="padding:3px 0;color:#6b7a70;">Discount</td><td style="padding:3px 0;text-align:right;">-${formatMoney(order.discount)}</td></tr>` : ''}
      <tr><td style="padding:3px 0;color:#6b7a70;">Delivery</td><td style="padding:3px 0;text-align:right;">${order.deliveryCharge ? formatMoney(order.deliveryCharge) : 'Free'}</td></tr>
      <tr><td style="padding:8px 0 0;font-weight:700;border-top:1px solid #eee;">Total</td><td style="padding:8px 0 0;text-align:right;font-weight:700;border-top:1px solid #eee;">${formatMoney(order.total)}</td></tr>
    </table>`;
}

function addressBlock(address) {
  if (!address) return '';
  return `${address.line1}${address.line2 ? `, ${address.line2}` : ''}, ${address.city}, ${address.state} ${address.pincode}`;
}

function shortId(orderId) {
  return String(orderId).slice(0, 8).toUpperCase();
}

export function orderConfirmationEmail(order) {
  const html = `
    <p style="margin:0 0 6px;">Hi ${order.customerName || 'there'},</p>
    <p style="margin:0 0 16px;">Thanks for your order! We've received it and it's now <strong>Order Placed</strong>. Here's a summary:</p>
    <p style="margin:0 0 4px;font-size:13px;color:#6b7a70;">ORDER #${shortId(order.id)} · Expected delivery ${formatDate(order.expectedDeliveryDate)}</p>
    ${itemsTable(order.items)}
    ${totalsBlock(order)}
    <p style="margin:18px 0 4px;font-size:13px;color:#6b7a70;">DELIVERING TO</p>
    <p style="margin:0;">${addressBlock(order.address)}</p>
    <p style="margin:18px 0 0;font-size:13px;color:#6b7a70;">Payment: ${order.paymentMethod ?? '—'} · ${order.paymentStatus ?? '—'}</p>
  `;
  return { subject: `Order confirmed - #${shortId(order.id)}`, html: wrapEmail('Order confirmed 🌱', html) };
}

export function orderStatusUpdateEmail(order) {
  const isDelivered = order.status === 'Delivered';
  const isCancelled = order.status === 'Cancelled';
  const headline = isCancelled
    ? "Your order has been cancelled."
    : isDelivered
      ? "Your order has been delivered - we hope you love your plants!"
      : `Your order is now: <strong>${order.status}</strong>`;

  const html = `
    <p style="margin:0 0 6px;">Hi ${order.customerName || 'there'},</p>
    <p style="margin:0 0 16px;">${headline}</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
      <tr>
        <td style="background:${isCancelled ? '#fbeceb' : LIGHT_GREEN};color:${isCancelled ? '#c0392b' : GREEN};font-weight:700;font-size:13px;padding:6px 14px;border-radius:999px;">${order.status}</td>
      </tr>
    </table>
    <p style="margin:0 0 4px;font-size:13px;color:#6b7a70;">ORDER #${shortId(order.id)}${!isDelivered && !isCancelled ? ` · Expected delivery ${formatDate(order.expectedDeliveryDate)}` : ''}</p>
    ${itemsTable(order.items)}
    ${totalsBlock(order)}
  `;
  return { subject: `Order #${shortId(order.id)} - ${order.status}`, html: wrapEmail('Order update', html) };
}

export function adminNewOrderEmail(order) {
  const html = `
    <p style="margin:0 0 16px;">A new order just came in.</p>
    <p style="margin:0 0 4px;font-size:13px;color:#6b7a70;">ORDER #${shortId(order.id)}</p>
    <p style="margin:0 0 16px;"><strong>${order.customerName || '—'}</strong> · ${order.customerEmail || '—'} · ${order.customerPhone || '—'}</p>
    ${itemsTable(order.items)}
    ${totalsBlock(order)}
    <p style="margin:18px 0 4px;font-size:13px;color:#6b7a70;">DELIVERING TO</p>
    <p style="margin:0;">${addressBlock(order.address)}</p>
    <p style="margin:18px 0 0;font-size:13px;color:#6b7a70;">Payment: ${order.paymentMethod ?? '—'} · ${order.paymentStatus ?? '—'}</p>
  `;
  return { subject: `New order - #${shortId(order.id)} (${formatMoney(order.total)})`, html: wrapEmail('New order received', html) };
}
