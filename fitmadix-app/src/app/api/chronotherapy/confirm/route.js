'use server';

import dbConnect from '@/lib/db';
import ChronotherapyDecision from '@/models/ChronotherapyDecision';

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, accepted = [] } = body || {};
    if (!userId) return new Response(JSON.stringify({ ok: false, error: 'missing userId' }), { status: 400 });

    await dbConnect();

    if (Array.isArray(accepted) && accepted.length > 0) {
      const ops = accepted.map((item) => ({
        updateOne: {
          filter: { userId, medicationId: item.medicationId },
          update: {
            $set: {
              originalTime: item.originalTime ? new Date(item.originalTime) : null,
              suggestedTime: item.suggestedTime ? new Date(item.suggestedTime) : null,
              reasons: item.reasons || [],
              status: 'accepted',
              engine: item.engine || 'rule-engine',
            },
          },
          upsert: true,
        },
      }));
      await ChronotherapyDecision.bulkWrite(ops);
    }

    return new Response(JSON.stringify({ ok: true, acceptedCount: accepted.length }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
}
