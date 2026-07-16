'use server';

import { suggestSchedule } from '@/lib/chronotherapyScheduler';
import { fetchExposome } from '@/lib/exposomeService';
import dbConnect from '@/lib/db';
import ChronotherapyDecision from '@/models/ChronotherapyDecision';

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, hdt = null, medications = [], location = null, useModel = false } = body || {};
    if (!userId) return new Response(JSON.stringify({ ok: false, error: 'missing userId' }), { status: 400 });

    // If exposome not provided, try to fetch from location
    let exposome = body.exposome || null;
    if (!exposome && location && location.lat && location.lon) {
      const res = await fetchExposome(location.lat, location.lon);
      if (res.ok) exposome = res.data;
    }

    if (useModel) {
      // Dynamically import model stub only when requested
      const mod = await import('@/lib/chronotherapyModel');
      const res = await mod.predictSchedule({ userId, hdt, exposome, medications, now: Date.now() });
      await dbConnect();
      if (Array.isArray(res.suggestions) && res.suggestions.length > 0) {
        await ChronotherapyDecision.insertMany(
          res.suggestions.map((s) => ({
            userId,
            medicationId: s.medicationId || 'unknown',
            originalTime: s.originalTime ? new Date(s.originalTime) : null,
            suggestedTime: s.suggestedTime ? new Date(s.suggestedTime) : null,
            reasons: s.reasons || [],
            status: 'proposed',
            engine: 'model-stub',
          }))
        );
      }
      return new Response(JSON.stringify(res), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const result = suggestSchedule({ userId, hdt, exposome, medications, now: Date.now() });
    await dbConnect();
    if (Array.isArray(result.suggestions) && result.suggestions.length > 0) {
      await ChronotherapyDecision.insertMany(
        result.suggestions.map((s) => ({
          userId,
          medicationId: s.medicationId || 'unknown',
          originalTime: s.originalTime ? new Date(s.originalTime) : null,
          suggestedTime: s.suggestedTime ? new Date(s.suggestedTime) : null,
          reasons: s.reasons || [],
          status: 'proposed',
          engine: 'rule-engine',
        }))
      );
    }
    return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
}
