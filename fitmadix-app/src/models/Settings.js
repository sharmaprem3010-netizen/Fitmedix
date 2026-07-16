import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true },
  value: { type: mongoose.Schema.Types.Mixed },
  updatedAt: { type: Date, default: Date.now }
});

// Static default settings
SettingsSchema.statics.getDefaults = function () {
  return {
    featureToggles: {
      medicine: true,
      aiGuide: true,
      reportTranslator: true,
      scanSearch: true,
      diseases: true,
      diets: true,
      exercises: true,
      yoga: true,
      healthRecords: true,
      storage: true,
      qa: true,
      healthStatus: true,
    },
    bannerTitle: 'Get the Best Medical Services',
    bannerText: 'We provide best quality medical services for you and your family.',
    bannerEmoji: '👨‍⚕️',
  };
};

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
