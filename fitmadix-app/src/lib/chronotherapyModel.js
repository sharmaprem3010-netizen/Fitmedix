'use strict';

/**
 * Chronotherapy ML model stub (edge inference placeholder).
 * In production this would load a compact model (e.g., ONNX/TF Lite) and run locally on-device.
 * For PoC, delegate to rule-based suggestSchedule but mark output as 'model-stub'.
 */
import { suggestSchedule } from './chronotherapyScheduler';

export async function predictSchedule(input) {
  const modelEndpoint = process.env.CHRONO_MODEL_ENDPOINT;
  if (modelEndpoint) {
    const res = await fetch(modelEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json?.error || 'chronotherapy model endpoint failed');
    }
    return json;
  }

  if (process.env.ALLOW_MODEL_STUB === 'true') {
    await new Promise((r) => setTimeout(r, 120));
    const res = suggestSchedule(input);
    res.model = { name: 'model-stub', version: '0.1.0' };
    return res;
  }

  throw new Error('CHRONO_MODEL_ENDPOINT is not configured');
}

export default { predictSchedule };