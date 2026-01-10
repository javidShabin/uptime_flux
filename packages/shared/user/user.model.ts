import { Schema, model, type Document } from "mongoose";

/**
 * User document interface
 */
export interface UserDocument extends Document {
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  isEmailVerified?: boolean;
  emailOTPHash?: string;
  emailOTPExpiresAt?: Date;
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
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailOTPHash: { type: String },
    emailOTPExpiresAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ email: 1 }, { unique: true });

export const User = model<UserDocument>("User", userSchema);
