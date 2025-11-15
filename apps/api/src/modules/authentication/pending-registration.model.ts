import { Schema, model, type Document } from "mongoose";

export interface PendingRegistrationDocument extends Document {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  otpCodeHash: string;
  otpExpiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const pendingRegistrationSchema = new Schema<PendingRegistrationDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    otpCodeHash: { type: String, required: true },
    otpExpiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

pendingRegistrationSchema.index({ email: 1 }, { unique: true });
pendingRegistrationSchema.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 0 });

export const PendingRegistrationModel = model<PendingRegistrationDocument>(
  "PendingRegistration",
  pendingRegistrationSchema
);

