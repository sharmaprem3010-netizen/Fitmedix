'use server';

import dbConnect from '@/lib/db';
import ExposomeSnapshot from '@/models/ExposomeSnapshot';
import { fetchExposome } from '@/lib/exposomeService';

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, lat, lon } = body || {};
    if (!userId) {
      return new Response(JSON.stringify({ ok: false, error: 'missing userId' }), { status: 400 });
    }
    if (lat === undefined || lon === undefined) {
      return new Response(JSON.stringify({ ok: false, error: 'missing lat/lon' }), { status: 400 });
    }

    const result = await fetchExposome(lat, lon);
    if (!result.ok) {
      return new Response(JSON.stringify({ ok: false, error: result.error }), { status: 502 });
    }

    await dbConnect();
    const saved = await ExposomeSnapshot.create({
      userId,
      provider: (process.env.EXPOSOME_PROVIDER || 'openweather').toLowerCase(),
      location: { lat: Number(lat), lon: Number(lon) },
      data: result.data,
      fetchedAt: result.data?.fetchedAt ? new Date(result.data.fetchedAt) : new Date(),
    });

    return new Response(
      JSON.stringify({ ok: true, id: String(saved._id), data: result.data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
}
