'use server';

import { fetchExposome } from '@/lib/exposomeService';

export async function POST(req) {
  try {
    const body = await req.json();
    const { lat, lon } = body || {};
    const result = await fetchExposome(lat, lon);
    if (!result.ok) return new Response(JSON.stringify({ ok: false, error: result.error }), { status: 502 });
    return new Response(JSON.stringify({ ok: true, data: result.data }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
}
