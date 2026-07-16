import mongoose from 'mongoose';

const ChronotherapyDecisionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    medicationId: { type: String, required: true },
    originalTime: { type: Date, default: null },
    suggestedTime: { type: Date, default: null },
    reasons: [{ type: String }],
    status: { type: String, enum: ['proposed', 'accepted', 'rejected'], default: 'proposed' },
    engine: { type: String, default: 'rule-engine' },
  },
  { timestamps: true }
);

ChronotherapyDecisionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.ChronotherapyDecision || mongoose.model('ChronotherapyDecision', ChronotherapyDecisionSchema);
