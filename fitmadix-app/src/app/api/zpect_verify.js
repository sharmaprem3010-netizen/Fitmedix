'use server';

import { verifyProofStub } from '@/lib/localZkProof';

export async function POST(req) {
  try {
    const body = await req.json();
    const proof = body?.proof;
    if (!proof) return new Response(JSON.stringify({ ok: false, error: 'missing proof' }), { status: 400 });

    const result = await verifyProofStub(proof);
    return new Response(JSON.stringify({ ok: true, verified: result.verified }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
}
