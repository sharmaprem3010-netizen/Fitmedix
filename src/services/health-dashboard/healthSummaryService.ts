export interface HeartRateReading {
  id: string;
  timestamp: string; // ISO string
  bpm: number; // beats per minute
  state: 'resting' | 'active' | 'post-workout' | 'walking';
  notes?: string;
}

export interface ActivitySession {
  id: string;
  date: string; // YYYY-MM-DD
  dayLabel: string; // Mon, Tue, etc.
  steps: number;
  activeMinutes: number;
  caloriesBurned: number;
  distanceKm: number;
  activityType: 'walking' | 'running' | 'cycling' | 'swimming' | 'hiit' | 'general';
}

export interface UserHealthSummary {
  lastUpdated: string | null;
  restingHeartRate: number | null;
  peakHeartRate: number | null;
  avgHeartRate: number | null;
  currentBpm: number | null;
  weeklyStepsTotal: number;
  weeklyActiveMinutesTotal: number;
  dailyStepGoal: number;
  dailyActiveMinutesGoal: number;
  heartRateReadings: HeartRateReading[];
  activityHistory: ActivitySession[];
}

const STORAGE_KEY_PREFIX = 'fitmadix_health_summary_v3_';

// Initial state: Pure empty authentic baseline with zero fabricated metrics
const getEmptySummary = (): UserHealthSummary => {
  return {
    lastUpdated: null,
    restingHeartRate: null,
    peakHeartRate: null,
    avgHeartRate: null,
    currentBpm: null,
    weeklyStepsTotal: 0,
    weeklyActiveMinutesTotal: 0,
    dailyStepGoal: 10000,
    dailyActiveMinutesGoal: 45,
    heartRateReadings: [],
    activityHistory: [],
  };
};

export const userHealthSummaryService = {
  getSummary(userId: string): UserHealthSummary {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}`);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // Fallback
    }
    const empty = getEmptySummary();
    this.saveSummary(userId, empty);
    return empty;
  },

  saveSummary(userId: string, data: UserHealthSummary): void {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save health summary data', e);
    }
  },

  logHeartRate(userId: string, bpm: number, state: HeartRateReading['state'], notes?: string): UserHealthSummary {
    const summary = this.getSummary(userId);
    const reading: HeartRateReading = {
      id: `hr-${Date.now()}`,
      timestamp: new Date().toISOString(),
      bpm,
      state,
      notes,
    };

    summary.heartRateReadings.push(reading);
    if (summary.heartRateReadings.length > 30) {
      summary.heartRateReadings = summary.heartRateReadings.slice(-30);
    }

    summary.currentBpm = bpm;
    summary.lastUpdated = new Date().toISOString();

    const bpms = summary.heartRateReadings.map((r) => r.bpm);
    summary.avgHeartRate = Math.round(bpms.reduce((a, b) => a + b, 0) / bpms.length);
    summary.peakHeartRate = Math.max(...bpms);
    const restingList = summary.heartRateReadings.filter((r) => r.state === 'resting').map((r) => r.bpm);
    if (restingList.length > 0) {
      summary.restingHeartRate = Math.round(restingList.reduce((a, b) => a + b, 0) / restingList.length);
    } else {
      summary.restingHeartRate = summary.avgHeartRate;
    }

    this.saveSummary(userId, summary);
    return summary;
  },

  logActivity(userId: string, steps: number, activeMinutes: number, distanceKm?: number): UserHealthSummary {
    const summary = this.getSummary(userId);
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayLabel = days[now.getDay()];

    const existingIdx = summary.activityHistory.findIndex((a) => a.date === todayStr);
    const cal = Math.round(steps * 0.042);
    const dist = distanceKm ?? Number(((steps * 0.75) / 1000).toFixed(2));

    if (existingIdx >= 0) {
      summary.activityHistory[existingIdx].steps += steps;
      summary.activityHistory[existingIdx].activeMinutes += activeMinutes;
      summary.activityHistory[existingIdx].caloriesBurned += cal;
      summary.activityHistory[existingIdx].distanceKm = Number(
        (summary.activityHistory[existingIdx].distanceKm + dist).toFixed(2)
      );
    } else {
      summary.activityHistory.push({
        id: `act-${todayStr}`,
        date: todayStr,
        dayLabel,
        steps,
        activeMinutes,
        caloriesBurned: cal,
        distanceKm: dist,
        activityType: 'walking',
      });
      if (summary.activityHistory.length > 7) {
        summary.activityHistory.shift();
      }
    }

    summary.weeklyStepsTotal = summary.activityHistory.reduce((acc, curr) => acc + curr.steps, 0);
    summary.weeklyActiveMinutesTotal = summary.activityHistory.reduce((acc, curr) => acc + curr.activeMinutes, 0);
    summary.lastUpdated = new Date().toISOString();

    this.saveSummary(userId, summary);
    return summary;
  },

  clearData(userId: string): UserHealthSummary {
    const cleared = getEmptySummary();
    this.saveSummary(userId, cleared);
    return cleared;
  },
};
