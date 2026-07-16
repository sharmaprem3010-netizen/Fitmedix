'use server';

import { tokenEndpoint } from '@/lib/oauthConfig';
import { getProviderTokens, hasProviderTokens, saveProviderTokens } from '@/lib/secureTokenStore';

export async function GET() {
  try {
    const hasRefresh = await hasProviderTokens({ provider: 'google-fit', subject: 'default' });
    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Google Fit Token Refresh — Z‑PECT (PoC)</title>
  <style>
    body{font-family:Inter,system-ui,Segoe UI,Roboto,Arial;background:#071226;color:#e6eef8;margin:0;padding:24px}
    .card{max-width:960px;margin:32px auto;padding:24px;border-radius:12px;background:linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01));box-shadow:0 8px 40px rgba(2,6,23,0.6)}
    h1{margin:0 0 8px;font-size:20px}
    p{margin:0 0 12px;color:#bcd3e8}
    .status{padding:10px 12px;border-radius:8px;background:#021426;color:#9ad0ff;display:inline-block;margin-bottom:12px}
    button{background:linear-gradient(90deg,#00B4D8,#0077B6);color:white;border:none;padding:10px 14px;border-radius:10px;cursor:pointer;font-weight:700}
    pre{background:#021426;padding:12px;border-radius:8px;color:#cfeaff;overflow:auto}
    .hint{color:#8fb3d6;font-size:0.95rem}
    a.small{color:#9ad0ff;text-decoration:none;font-weight:600}
  </style>
</head>
<body>
  <div class="card">
    <h1>Google Fit Token Refresh (PoC)</h1>
    <p class="hint">This debug page lets you trigger a server-side token refresh using the encrypted token vault.</p>

    <div class="status">Stored refresh token: <strong>${hasRefresh ? 'Present' : 'Missing'}</strong></div>

    <div style="margin:12px 0">
      <form id="refreshForm">
        <button type="submit">Refresh tokens now</button>
      </form>
    </div>

    <div style="margin-top:12px">
      <div class="hint">Result:</div>
      <pre id="output">(click "Refresh tokens now" to run)</pre>
    </div>

    <div style="margin-top:16px;color:#8fb3d6;font-size:0.9rem">Note: This is a development PoC. Do not use in production. For production, persist tokens securely and use server-side scheduled jobs.</div>
  </div>

  <script>
    const out = document.getElementById('output');
    document.getElementById('refreshForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      out.textContent = 'Refreshing...';
      try {
        const res = await fetch('/api/google_fit_refresh', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
        const txt = await res.text();
        out.textContent = txt;
      } catch (err) {
        out.textContent = 'Error: ' + err.message;
      }
    });
  </script>
</body>
</html>`;

    return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const storedTokens = await getProviderTokens({ provider: 'google-fit', subject: 'default' });
    const refreshToken = body?.refresh_token || storedTokens?.refresh_token;
    if (!refreshToken) return new Response(JSON.stringify({ ok: false, error: 'missing refresh_token' }), { status: 400 });

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) return new Response(JSON.stringify({ ok: false, error: 'Missing GOOGLE_CLIENT_ID/SECRET in env' }), { status: 500 });

    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    });

    const tokenRes = await fetch(tokenEndpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const tokenJson = await tokenRes.json();
    if (!tokenRes.ok) return new Response(JSON.stringify({ ok: false, error: tokenJson }), { status: 502 });

    const mergedTokens = Object.assign({}, storedTokens || {}, tokenJson, { refresh_token: refreshToken });
    await saveProviderTokens({
      provider: 'google-fit',
      subject: 'default',
      tokens: mergedTokens,
    });

    return new Response(JSON.stringify({ ok: true, tokens: tokenJson }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
}
