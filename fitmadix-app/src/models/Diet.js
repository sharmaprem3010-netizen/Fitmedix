import mongoose from 'mongoose';

const DietSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  emoji: { type: String, default: '🥗' },
  gradient: { type: String, default: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)' },
  meals: {
    breakfast: String,
    lunch: String,
    snack: String,
    dinner: String
  },
  calories: { type: String },
  visible: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Diet || mongoose.model('Diet', DietSchema);
