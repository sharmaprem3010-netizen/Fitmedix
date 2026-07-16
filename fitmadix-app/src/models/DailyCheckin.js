import mongoose from 'mongoose';

const DailyCheckinSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional for now if no auth is enforced, or make true if we have user sessions
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true
  },
  energyLevel: {
    type: String, // e.g. Low, Okay, Good
    default: 'Okay'
  },
  mood: {
    type: String,
    default: 'Okay'
  },
  symptoms: [{
    type: String
  }],
  lifestyle: {
    sleep: { type: String, default: '' },
    stress: { type: String, default: '' },
    exercise: { type: String, default: '' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a user can only have one check-in per day
// DailyCheckinSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.DailyCheckin || mongoose.model('DailyCheckin', DailyCheckinSchema);
