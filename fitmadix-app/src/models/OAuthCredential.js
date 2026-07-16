import mongoose from 'mongoose';

const OAuthCredentialSchema = new mongoose.Schema(
  {
    provider: { type: String, required: true, index: true },
    subject: { type: String, required: true, default: 'default', index: true },
    encryptedPayload: { type: Object, required: true },
    state: { type: String, default: null },
    lastRefreshedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

OAuthCredentialSchema.index({ provider: 1, subject: 1 }, { unique: true });

export default mongoose.models.OAuthCredential || mongoose.model('OAuthCredential', OAuthCredentialSchema);
