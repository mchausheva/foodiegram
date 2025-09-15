import { Schema, model } from 'mongoose';

const BannedEmailSchema = new Schema({
  email: { type: String, required: true, unique: true }
}, { timestamps: true });

export const BannedEmailModel = model('BannedEmail', BannedEmailSchema);


