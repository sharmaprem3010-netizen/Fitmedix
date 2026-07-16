import mongoose from 'mongoose';

const YogaPoseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subtitle: { type: String },
  emoji: { type: String, default: '🧘' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  duration: { type: String },
  bg: { type: String, default: 'rgba(0,180,216,0.1)' },
  visible: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.YogaPose || mongoose.model('YogaPose', YogaPoseSchema);
