import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, default: '' },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String },
  address: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  password: { type: String },
  language: { type: String, default: 'en' },
  bloodGroup: { type: String, default: 'A+' },
  dob: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  height: { type: Number },
  weight: { type: Number, default: 70 },
  createdAt: { type: Date, default: Date.now },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
