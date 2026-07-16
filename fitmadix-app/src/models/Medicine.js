import mongoose from 'mongoose';

const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  generic: { type: String, required: true },
  expiry: { type: String, required: true },
  usage: { type: String, required: true },
  dosage: { type: String, required: true },
  whenToUse: { type: String, required: true },
  sideEffects: { type: String, required: true },
  dangerous: { type: String, required: true },
  tags: [{
    text: String,
    type: { type: String, enum: ['safe', 'caution', 'danger'] }
  }],
  visible: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Medicine || mongoose.model('Medicine', MedicineSchema);
