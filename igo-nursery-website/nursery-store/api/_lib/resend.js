// Thin wrapper around the Resend REST API (no SDK dependency needed - a
// plain fetch call keeps the serverless function lightweight). The API key
// lives only in the Vercel/server environment (RESEND_API_KEY) - it is
// never sent to, or readable from, the browser bundle.
export async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured on the server.');
  }
  const from = process.env.RESEND_FROM_EMAIL || 'IGO Nursery <onboarding@resend.dev>';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Resend API error ${res.status}: ${text}`);
  }

  return res.json();
}
