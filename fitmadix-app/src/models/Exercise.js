import mongoose from 'mongoose';

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['chest', 'arms', 'legs', 'core', 'back'] },
  emoji: { type: String, default: '💪' },
  sets: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  bg: { type: String, default: 'rgba(0,180,216,0.1)' },
  visible: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Exercise || mongoose.model('Exercise', ExerciseSchema);
