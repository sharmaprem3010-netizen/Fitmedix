import mongoose from 'mongoose';

const MedicalReportSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  biomarkers: { type: Array, default: [] },
  summary: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.MedicalReport || mongoose.model('MedicalReport', MedicalReportSchema);
