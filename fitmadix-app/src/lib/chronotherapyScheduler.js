'use strict';

/**
 * Chronotherapy Scheduler (PoC rule-based engine)
 * - Input: { userId, hdt: { metrics }, exposome: { pm2_5, pollen, temperature }, medications: [ { id, name, currentTime, type } ] }
 * - Output: suggestions: [ { medicationId, originalTime, suggestedTime, reason } ]
 *
 * This is a deterministic, explainable stub for rapid iteration. Replace with ML model later.
 */

function minutesToISOTime(baseDateMs, minutesOffset) {
  const d = new Date(baseDateMs + minutesOffset * 60 * 1000);
  return d.toISOString();
}

export function suggestSchedule({ userId, hdt = {}, exposome = {}, medications = [], now = Date.now() }) {
  const suggestions = [];

  const pm25 = exposome.pm2_5 ?? null;
  const pollen = exposome.pollen ?? {};

  // Example rules:
  // 1) If PM2.5 > 75 (unhealthy), suggest advancing inhaled respiratory meds by 6 hours to pre-condition
  // 2) If pollen.tree > 3, suggest taking antihistamine 1 hour before exposure window (use now as proxy)
  // 3) For cardiovascular meds, prefer bedtime (23:00 local) to blunt morning surges — suggest if currentTime is daytime

  for (const med of medications) {
    const reasonList = [];
    let suggestedMs = new Date(med.currentTime || now).getTime();

    const lname = (med.name || '').toLowerCase();

    if (pm25 !== null && pm25 > 75 && /inhal|respir|bronch|asthma|salbutamol|steroid/.test(lname)) {
      // advance by up to 6 hours (360 minutes)
      suggestedMs = Math.max(now, suggestedMs - 360 * 60 * 1000);
      reasonList.push(`High PM2.5 (${pm25}), advance to pre-empt inflammatory response`);
    }

    if ((pollen.tree ?? 0) > 3 && /antihistamin|cetirizine|loratadine|fexofenadine/.test(lname)) {
      // schedule 60 minutes from now
      suggestedMs = Math.max(now + 60 * 60 * 1000, suggestedMs);
      reasonList.push(`High tree pollen (${pollen.tree}), dose before peak exposure`);
    }

    if (/beta[- ]?blocker|ace |statin|atorvastatin|metoprolol|bisoprolol|amlodipine|lisinopril/.test(lname)) {
      // prefer bedtime 23:00 local (approx)
      const d = new Date(now);
      const bedtime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 0, 0).getTime();
      // if suggested is during daytime (8-20), shift to bedtime
      const hour = new Date(suggestedMs).getHours();
      if (hour >= 8 && hour <= 20) {
        suggestedMs = bedtime;
        reasonList.push('Prefer bedtime dosing for cardiovascular protection');
      }
    }

    // If no rule applied, keep current
    if (reasonList.length === 0) {
      suggestions.push({ medicationId: med.id, originalTime: med.currentTime || null, suggestedTime: med.currentTime || null, reasons: ['No change recommended'] });
    } else {
      suggestions.push({ medicationId: med.id, originalTime: med.currentTime || null, suggestedTime: new Date(suggestedMs).toISOString(), reasons: reasonList });
    }
  }

  return { ok: true, userId, generatedAt: new Date(now).toISOString(), suggestions };
}

export default { suggestSchedule };