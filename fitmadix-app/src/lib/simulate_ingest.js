/* Simulate wearable ingest: validate sample payload and append normalized entry to zpect-hdt-store.json */
const fs = require('fs');
const path = require('path');

const SAMPLE_PATH = path.join(__dirname, 'sample_google_fit.json');
const STORE_PATH = path.join(__dirname, 'zpect-hdt-store.json');

function validate(payload) {
  if (!payload || typeof payload !== 'object') return { ok: false, error: 'invalid payload' };
  if (!payload.userId || typeof payload.userId !== 'string') return { ok: false, error: 'missing userId' };
  if (!payload.source || typeof payload.source !== 'string') return { ok: false, error: 'missing source' };
  if (!payload.timestamp || typeof payload.timestamp !== 'number') return { ok: false, error: 'missing timestamp' };
  if (!payload.metrics || typeof payload.metrics !== 'object') return { ok: false, error: 'missing metrics' };
  return { ok: true };
}

function normalizeMetrics(metrics) {
  const normalized = {};
  if (metrics.hr !== undefined) normalized.hr = Number(metrics.hr);
  if (metrics.heartRate !== undefined) normalized.hr = Number(metrics.heartRate);
  if (metrics.hrv !== undefined) normalized.hrv = Number(metrics.hrv);
  if (metrics.spo2 !== undefined) normalized.spo2 = Number(metrics.spo2);
  if (metrics.sleep !== undefined) normalized.sleep = metrics.sleep;
  return normalized;
}

async function run() {
  try {
    const raw = fs.readFileSync(SAMPLE_PATH, 'utf8');
    const payload = JSON.parse(raw);

    const v = validate(payload);
    if (!v.ok) {
      console.error('Validation failed:', v.error);
      process.exit(2);
    }

    const normalized = normalizeMetrics(payload.metrics || {});
    const entry = Object.assign({ version: '0.1.0', receivedAt: Date.now() }, payload, { metrics: normalized });

    let arr = [];
    try {
      const cur = fs.readFileSync(STORE_PATH, 'utf8');
      arr = JSON.parse(cur || '[]');
    } catch (e) {
      // file may not exist yet
    }
    arr.push(entry);
    fs.writeFileSync(STORE_PATH, JSON.stringify(arr, null, 2), 'utf8');

    console.log('Simulated ingest success. Entry appended to store.');
    console.log('Appended entry:', JSON.stringify(entry, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error during simulation:', err);
    process.exit(1);
  }
}

run();
