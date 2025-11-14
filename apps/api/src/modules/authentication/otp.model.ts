import { Schema, model, type Document } from "mongoose";

export enum OtpType {
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
}

export interface OtpDocument extends Document {
  email: string;
  codeHash: string;
  type: OtpType;
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema = new Schema<OtpDocument>(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    codeHash: { type: String, required: true },
    type: { type: String, enum: Object.values(OtpType), required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 5 },
  },
  { timestamps: true }
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.index({ email: 1, type: 1 }, { unique: true });

export const OtpModel = model<OtpDocument>("Otp", otpSchema);
