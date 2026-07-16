import mongoose from 'mongoose';

const ExposomeSnapshotSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    provider: { type: String, required: true, default: 'openweather' },
    location: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
    },
    data: { type: Object, required: true },
    fetchedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

ExposomeSnapshotSchema.index({ userId: 1, fetchedAt: -1 });

export default mongoose.models.ExposomeSnapshot || mongoose.model('ExposomeSnapshot', ExposomeSnapshotSchema);
