'use server';

import dbConnect from '@/lib/db';
import HdtSignal from '@/models/HdtSignal';
import { normalizeMetrics } from '@/lib/hdtSchema';

export async function POST(req) {
  try {
    const body = await req.json();

    const userId = body?.userId || 'google-fit-user';
    const metrics = normalizeMetrics(body?.metrics || {});

    await dbConnect();
    const saved = await HdtSignal.create({
      userId,
      source: 'google-fit-webhook',
      timestamp: body?.timestamp ? new Date(body.timestamp) : new Date(),
      metrics,
      metadata: { payload: body },
      schemaVersion: '0.1.0',
    });

    return new Response(JSON.stringify({ ok: true, id: String(saved._id) }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
}
