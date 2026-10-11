export interface HeartRateReading {
  id: string;
  timestamp: string; // ISO string
  bpm: number; // beats per minute
  state: 'resting' | 'active' | 'post-workout' | 'walking';
  notes?: string;
}

export type BPCategory =
  | 'Normal'
  | 'Elevated'
  | 'Stage 1 Hypertension'
  | 'Stage 2 Hypertension'
  | 'Hypertensive Crisis';

export interface BloodPressureReading {
  id: string;
  timestamp: string; // ISO string
  systolic: number; // mmHg (e.g. 118)
  diastolic: number; // mmHg (e.g. 78)
  pulse?: number; // BPM
  category: BPCategory;
  arm?: 'left' | 'right';
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
  latestBloodPressure: BloodPressureReading | null;
  bloodPressureReadings: BloodPressureReading[];
  weeklyStepsTotal: number;
  weeklyActiveMinutesTotal: number;
  dailyStepGoal: number;
  dailyActiveMinutesGoal: number;
  heartRateReadings: HeartRateReading[];
  activityHistory: ActivitySession[];
}

const STORAGE_KEY_PREFIX = 'fitmadix_health_summary_v3_';

// Initial state with healthy baseline and Blood Pressure structure
const getEmptySummary = (): UserHealthSummary => {
  const initialBP: BloodPressureReading = {
    id: 'bp-init-1',
    timestamp: new Date().toISOString(),
    systolic: 118,
    diastolic: 76,
    pulse: 70,
    category: 'Normal',
    arm: 'left',
    notes: 'Resting morning baseline reading',
  };

  return {
    lastUpdated: new Date().toISOString(),
    restingHeartRate: 68,
    peakHeartRate: 112,
    avgHeartRate: 72,
    currentBpm: 72,
    latestBloodPressure: initialBP,
    bloodPressureReadings: [
      {
        id: 'bp-hist-1',
        timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
        systolic: 122,
        diastolic: 78,
        pulse: 74,
        category: 'Elevated',
        arm: 'left',
        notes: 'Midday check',
      },
      {
        id: 'bp-hist-2',
        timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
        systolic: 119,
        diastolic: 77,
        pulse: 71,
        category: 'Normal',
        arm: 'left',
      },
      {
        id: 'bp-hist-3',
        timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
        systolic: 120,
        diastolic: 79,
        pulse: 69,
        category: 'Normal',
        arm: 'left',
      },
      initialBP,
    ],
    weeklyStepsTotal: 8420,
    weeklyActiveMinutesTotal: 38,
    dailyStepGoal: 10000,
    dailyActiveMinutesGoal: 45,
    heartRateReadings: [
      {
        id: 'hr-init-1',
        timestamp: new Date().toISOString(),
        bpm: 72,
        state: 'resting',
      },
    ],
    activityHistory: [
      {
        id: `act-${new Date().toISOString().split('T')[0]}`,
        date: new Date().toISOString().split('T')[0],
        dayLabel: 'Today',
        steps: 8420,
        activeMinutes: 38,
        caloriesBurned: 350,
        distanceKm: 6.3,
        activityType: 'walking',
      },
    ],
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

  classifyBloodPressure(systolic: number, diastolic: number): BPCategory {
    if (systolic >= 180 || diastolic >= 120) {
      return 'Hypertensive Crisis';
    }
    if (systolic >= 140 || diastolic >= 90) {
      return 'Stage 2 Hypertension';
    }
    if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
      return 'Stage 1 Hypertension';
    }
    if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
      return 'Elevated';
    }
    return 'Normal';
  },

  logBloodPressure(
    userId: string,
    systolic: number,
    diastolic: number,
    pulse?: number,
    arm: 'left' | 'right' = 'left',
    notes?: string
  ): UserHealthSummary {
    const summary = this.getSummary(userId);
    const category = this.classifyBloodPressure(systolic, diastolic);

    const reading: BloodPressureReading = {
      id: `bp-${Date.now()}`,
      timestamp: new Date().toISOString(),
      systolic,
      diastolic,
      pulse: pulse || summary.currentBpm || 72,
      category,
      arm,
      notes,
    };

    if (!summary.bloodPressureReadings) {
      summary.bloodPressureReadings = [];
    }

    summary.bloodPressureReadings.push(reading);
    if (summary.bloodPressureReadings.length > 30) {
      summary.bloodPressureReadings = summary.bloodPressureReadings.slice(-30);
    }

    summary.latestBloodPressure = reading;
    summary.lastUpdated = new Date().toISOString();

    this.saveSummary(userId, summary);
    return summary;
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
