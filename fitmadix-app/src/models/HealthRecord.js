import mongoose from 'mongoose';

const HealthRecordSchema = new mongoose.Schema({
  userId: { type: String, default: 'default' },
  type: { type: String, required: true },
  value: { type: String, required: true },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.HealthRecord || mongoose.model('HealthRecord', HealthRecordSchema);
