// Vercel Serverless Function — Email notification fallback
// Deployed at: https://your-domain.com/api/notify
//
// SETUP (only needed if you want backup email alerts beyond HubSpot workflows):
// 1. Sign up at resend.com (free, 100 emails/day)
// 2. Get API key from resend.com/api-keys
// 3. In Vercel project → Settings → Environment Variables → add:
//      RESEND_API_KEY=re_xxxxxxxxxxxx
//      NOTIFY_TO=eugenio@nationsroyalty.com,karen@nationsroyalty.com
// 4. Redeploy
//
// If you skip this, the page still works — it just won't have a backup
// email. HubSpot workflow alerts are the primary notification.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.NOTIFY_TO;

  if (!apiKey || !notifyTo) {
    // Silently succeed — HubSpot is the primary path, this is just backup
    return res.status(200).json({ ok: true, note: 'Notify endpoint not configured' });
  }

  const data = req.body;
  if (!data?.email) {
    return res.status(400).json({ error: 'Missing data' });
  }

  const routeLabel = {
    nrc: 'Nations Royalty',
    fogler: 'Fogler, Rubinoff LLP',
    both: 'Both teams'
  }[data.routeTo] || data.routeTo;

  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
      <div style="border-left: 4px solid #d44a22; padding-left: 16px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #999;">IBA Lunch &amp; Learn — New submission</p>
        <p style="margin: 4px 0 0 0; font-size: 14px; color: #333;">Route to: <strong>${routeLabel}</strong></p>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 8px 0; color: #999; width: 110px;">Name</td><td style="padding: 8px 0;"><strong>${data.firstName} ${data.lastName}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #999;">Email</td><td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
        ${data.organization ? `<tr><td style="padding: 8px 0; color: #999;">Organization</td><td style="padding: 8px 0;">${data.organization}</td></tr>` : ''}
        ${data.role ? `<tr><td style="padding: 8px 0; color: #999;">Role</td><td style="padding: 8px 0;">${data.role}</td></tr>` : ''}
      </table>

      <div style="margin-top: 24px; padding: 16px; background: #f4ece0; border-radius: 6px;">
        <p style="margin: 0 0 8px 0; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #999;">Their question / note</p>
        <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #1a1410; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
      </div>

      <p style="margin-top: 24px; font-size: 11px; color: #999;">
        Submitted ${new Date(data.submittedAt).toLocaleString('en-CA', { timeZone: 'America/Toronto' })} ET<br>
        From: ${data.source}
      </p>
    </div>
  `;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'NRC Lunch & Learn <noreply@nationsroyalty.com>',
        to: notifyTo.split(',').map(e => e.trim()),
        subject: `🍽️ Lunch & Learn — ${data.firstName} ${data.lastName} (→ ${routeLabel})`,
        html,
        reply_to: data.email
      })
    });

    if (!r.ok) {
      const err = await r.text();
      console.error('Resend error:', err);
      return res.status(500).json({ error: 'Email send failed' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal error' });
  }
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
