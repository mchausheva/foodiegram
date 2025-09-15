import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: String,
  location: String,
  joinedAt: String,
  avatar: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export const UserModel = model('User', UserSchema);


