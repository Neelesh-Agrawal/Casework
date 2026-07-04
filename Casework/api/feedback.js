/**
 * Vercel serverless proxy → Google Apps Script → Google Sheet.
 * Avoids browser CORS issues when posting directly to script.google.com.
 *
 * Env (Vercel → Settings → Environment Variables):
 *   GOOGLE_SHEETS_WEBHOOK_URL  — Apps Script /exec deployment URL
 *   FEEDBACK_WEBHOOK_SECRET    — optional shared secret (set same in Apps Script)
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhook) {
    return res.status(503).json({ error: 'GOOGLE_SHEETS_WEBHOOK_URL is not configured' });
  }

  const entry = req.body;
  if (!entry || typeof entry !== 'object') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const payload = {
    ...entry,
    savedAt: entry.savedAt || Date.now(),
  };

  const secret = process.env.FEEDBACK_WEBHOOK_SECRET;
  if (secret) {
    payload._secret = secret;
  }

  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    const text = await response.text();
    if (!response.ok) {
      return res.status(502).json({ error: 'Google Sheets webhook failed', detail: text.slice(0, 500) });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Feedback proxy error', detail: err.message });
  }
}
