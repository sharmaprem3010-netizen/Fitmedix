import mongoose from 'mongoose';

const HdtSignalSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    source: { type: String, required: true, index: true },
    timestamp: { type: Date, required: true, index: true },
    metrics: { type: Object, required: true },
    metadata: { type: Object, default: {} },
    proof: { type: Object, default: null },
    schemaVersion: { type: String, default: '0.1.0' },
  },
  { timestamps: true }
);

HdtSignalSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.models.HdtSignal || mongoose.model('HdtSignal', HdtSignalSchema);
