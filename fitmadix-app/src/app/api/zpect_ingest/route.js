'use server';

import dbConnect from '@/lib/db';
import HdtSignal from '@/models/HdtSignal';
import { validateHdtEntry, normalizeMetrics } from '@/lib/hdtSchema';
import { generateProofStub } from '@/lib/localZkProof';

export async function POST(req) {
  try {
    const body = await req.json();
    const { ok, error } = validateHdtEntry(body);
    if (!ok) {
      return new Response(JSON.stringify({ ok: false, error }), { status: 400 });
    }

    const normalizedMetrics = normalizeMetrics(body.metrics || {});
    let proof = body.proof || null;
    if (!proof) {
      proof = await generateProofStub({ thresholdMet: false });
    }

    await dbConnect();
    const saved = await HdtSignal.create({
      userId: body.userId,
      source: body.source,
      timestamp: new Date(body.timestamp),
      metrics: normalizedMetrics,
      metadata: body.metadata || {},
      schemaVersion: '0.1.0',
      proof,
    });

    return new Response(
      JSON.stringify({ ok: true, stored: true, id: String(saved._id), proof }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
}
