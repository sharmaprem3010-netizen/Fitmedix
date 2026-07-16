'use strict';

/**
 * Local ZKP stub for PoC. Real zk-SNARK generation requires a circuits toolchain
 * (circom/snarkjs or gnark/halo2) and large build steps that must run on-device.
 * This module provides a simple promise-based stub interface so server code can
 * be integrated without raw biometric uploads.
 */

export async function generateProofStub(statement) {
  if (process.env.ALLOW_ZKP_STUB !== 'true') {
    throw new Error('ZKP stub generation disabled. Provide client proof from device or configure real prover.');
  }
  return {
    proof: 'stub-proof-1',
    publicSignals: statement || { thresholdMet: false },
    generatedAt: Date.now(),
    mode: 'stub',
  };
}

export async function verifyProofStub(proofObj) {
  if (!proofObj) return { ok: false, verified: false, error: 'missing proof' };

  const verifierUrl = process.env.ZKP_VERIFIER_URL;
  if (verifierUrl) {
    try {
      const res = await fetch(verifierUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proof: proofObj }),
      });
      const json = await res.json();
      if (!res.ok) return { ok: false, verified: false, error: json?.error || 'external verifier failed' };
      return { ok: !!json.verified, verified: !!json.verified, verifier: 'external' };
    } catch (err) {
      return { ok: false, verified: false, error: String(err) };
    }
  }

  if (process.env.ALLOW_ZKP_STUB === 'true') {
    const shapeOk = typeof proofObj === 'object' && !!proofObj.proof;
    return { ok: shapeOk, verified: shapeOk, verifier: 'stub' };
  }
  return { ok: false, verified: false, error: 'ZKP_VERIFIER_URL is not configured' };
}

export default { generateProofStub, verifyProofStub };
