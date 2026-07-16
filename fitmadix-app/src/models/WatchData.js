import mongoose from 'mongoose';

const WatchDataSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  deviceId: { type: String, default: 'Fitmadix Watch' },
  heartRate: { type: Number },
  batteryLevel: { type: Number },
  steps: { type: Number, default: 0 },
  stepsGoal: { type: Number, default: 10000 },
  activeMinutes: { type: Number, default: 0 },
  caloriesActive: { type: Number, default: 0 },
  spo2: { type: Number },
  distance: { type: Number, default: 0 },
  sleepHours: { type: Number, default: 0 },
  sleepMinutes: { type: Number, default: 0 },
  sleepScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.WatchData || mongoose.model('WatchData', WatchDataSchema);
