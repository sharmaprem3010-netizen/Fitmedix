export function normalizePayload(rawPayload) {
  // Defensive check
  if (!rawPayload || !rawPayload.data) return null;
  
  const { platform, steps, heartRate, sleep } = rawPayload.data;
  let normalizedSteps = 0;
  let avgHeartRate = 0;
  
  // Normalization logic based on platform structure
  if (platform === 'ios') {
    if (Array.isArray(steps)) {
      normalizedSteps = steps.reduce((sum, record) => sum + (record.value || 0), 0);
    }
    if (Array.isArray(heartRate) && heartRate.length > 0) {
      const sum = heartRate.reduce((acc, record) => acc + (record.value || 0), 0);
      avgHeartRate = Math.round(sum / heartRate.length);
    }
  } else if (platform === 'android') {
    if (Array.isArray(steps)) {
      normalizedSteps = steps.reduce((sum, record) => sum + (record.count || 0), 0);
    }
    if (Array.isArray(heartRate) && heartRate.length > 0) {
      // Android health connect HR is usually a series of samples
      const samples = heartRate.flatMap(r => r.samples || []);
      if (samples.length > 0) {
        const sum = samples.reduce((acc, sample) => acc + (sample.beatsPerMinute || 0), 0);
        avgHeartRate = Math.round(sum / samples.length);
      }
    }
  }

  return {
    source: platform,
    deviceId: rawPayload.deviceId || 'unknown',
    metrics: {
      totalSteps: normalizedSteps,
      avgHeartRate: avgHeartRate || null,
      sleepData: sleep || null
    },
    syncTimestamp: new Date().toISOString()
  };
}
