'use server';

import { tokenEndpoint } from '@/lib/oauthConfig';
import { saveProviderTokens } from '@/lib/secureTokenStore';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401 });
    }

    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (error) {
      return new Response(JSON.stringify({ ok: false, error }), { status: 400 });
    }
    if (!code) {
      return new Response(JSON.stringify({ ok: false, error: 'missing code' }), { status: 400 });
    }

    const expectedState = session.user.id || session.user.email;
    if (state !== expectedState) {
      return new Response(JSON.stringify({ ok: false, error: 'State mismatch (CSRF protection)' }), { status: 403 });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;
    if (!clientId || !clientSecret || !redirectUri) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Missing GOOGLE_CLIENT_ID/SECRET/REDIRECT_URI in env' }),
        { status: 500 }
      );
    }

    const params = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    const tokenRes = await fetch(tokenEndpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const tokenJson = await tokenRes.json();
    if (!tokenRes.ok) {
      return new Response(JSON.stringify({ ok: false, error: tokenJson }), { status: 502 });
    }

    await saveProviderTokens({
      provider: 'google-fit',
      subject: expectedState,
      tokens: tokenJson,
      state,
    });

    return new Response(null, { status: 302, headers: { Location: '/home' } });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
}
