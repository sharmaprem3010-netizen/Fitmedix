import mongoose from 'mongoose';

const ConsultationSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Using String to match other schemas like HealthRecord which use String for userId
  doctorName: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  rawTranscript: { type: String }, // Encrypted or plain text depending on implementation
  audioFileUrl: { type: String }, // To be deleted after 30 days
  audioRetentionUntil: { type: Date },
  summary: {
    diagnosis: [String],
    medications: [{ name: String, dosage: String, frequency: String }],
    tests: [String],
    lifestyleAdvice: [String],
    nextAppointment: String
  },
  language: { type: String, default: 'en' },
  sharedWith: [{ type: String }], // Array of family member IDs or emails
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Consultation || mongoose.model('Consultation', ConsultationSchema);
