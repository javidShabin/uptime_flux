import { Schema, model, type Document } from "mongoose";

/**
 * User document interface
 */
export interface UserDocument extends Document {
  email: string;
  passwordHash: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  isEmailVerified: boolean;
  emailOTPHash: string;
  emailOTPExpiresAt: Date;
  emailOTPLastSentAt?: Date;
  emailOTPAttempts?: number;
}

/**
 * User schema
 */
const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailOTPHash: { type: String },
    emailOTPExpiresAt: { type: Date },
    emailOTPLastSentAt: { type: Date },
    emailOTPAttempts: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ email: 1 }, { unique: true });

export const User = model<UserDocument>("User", userSchema);