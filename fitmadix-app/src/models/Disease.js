import mongoose from 'mongoose';

const DiseaseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  icon: { type: String, default: '🦠' },
  iconBg: { type: String, default: 'rgba(230,57,70,0.1)' },
  symptoms: [String],
  cure: [String],
  prevention: { type: String },
  visible: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Disease || mongoose.model('Disease', DiseaseSchema);
