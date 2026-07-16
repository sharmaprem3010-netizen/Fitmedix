'use server';

import { buildGoogleAuthUrl } from '@/lib/oauthConfig';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Unauthorized: You must be logged in to connect Google Fit.' }),
        { status: 401 }
      );
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;
    if (!clientId || !redirectUri) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Missing GOOGLE_CLIENT_ID or GOOGLE_REDIRECT_URI in env' }),
        { status: 500 }
      );
    }

    const state = session.user.id || session.user.email;
    const url = buildGoogleAuthUrl({ clientId, redirectUri, state });
    return new Response(null, { status: 302, headers: { Location: url } });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
}
