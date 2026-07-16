'use strict';

/**
 * Human Digital Twin (HDT) schema and simple validator.
 * This is a lightweight, versioned schema for local HDT entries.
 * Expand fields as ingestion and simulation needs grow.
 */

export const HDT_SCHEMA_VERSION = '0.1.0';

export const HDT_FIELDS = {
  userId: 'string',
  source: 'string', // e.g., 'google-fit', 'apple-health', 'wearable-x'
  timestamp: 'number', // epoch ms
  metrics: 'object', // e.g., { hr: 72, hrv: 42, spo2: 98 }
  // metadata may include device id, raw event id, confidence
};

export function validateHdtEntry(entry) {
  if (!entry || typeof entry !== 'object') return { ok: false, error: 'invalid payload' };
  if (!entry.userId || typeof entry.userId !== 'string') return { ok: false, error: 'missing userId' };
  if (!entry.source || typeof entry.source !== 'string') return { ok: false, error: 'missing source' };
  if (!entry.timestamp || typeof entry.timestamp !== 'number') return { ok: false, error: 'missing timestamp' };
  if (!entry.metrics || typeof entry.metrics !== 'object') return { ok: false, error: 'missing metrics' };
  return { ok: true };
}

export function normalizeMetrics(metrics) {
  // Minimal normalizations: rename common keys, ensure numeric values
  const normalized = {};
  if (metrics.hr !== undefined) normalized.hr = Number(metrics.hr);
  if (metrics.heartRate !== undefined) normalized.hr = Number(metrics.heartRate);
  if (metrics.hrv !== undefined) normalized.hrv = Number(metrics.hrv);
  if (metrics.spo2 !== undefined) normalized.spo2 = Number(metrics.spo2);
  if (metrics.sleep !== undefined) normalized.sleep = metrics.sleep; // keep object
  return normalized;
}

export default {
  version: HDT_SCHEMA_VERSION,
  validateHdtEntry,
  normalizeMetrics,
};
