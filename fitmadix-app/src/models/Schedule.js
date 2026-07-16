import mongoose from 'mongoose';

const ScheduleSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false // Optional for now
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true
  },
  time: {
    type: String, // e.g. '09:00 AM'
    required: true
  },
  title: {
    type: String, // e.g. 'General Checkup' or 'Morning Run'
    required: true
  },
  type: {
    type: String, // e.g. 'Dr. Priya Sharma' or 'Cardio'
    required: true
  },
  icon: {
    type: String, // e.g. '🩺'
    default: '📅'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Schedule || mongoose.model('Schedule', ScheduleSchema);
