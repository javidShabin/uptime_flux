import { Schema, model, type Document } from "mongoose";

/**
 * User document interface
 */
export interface UserDocument extends Document {
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  isEmailVerified: boolean;
  emailOTPHash: string;
  emailOTPExpiresAt: Date;
  emailOTPLastSentAt?: Date;
  emailOTPAttempts?: number;
  googleId: string;
  authProvider: {
    type: string,
    enum: ["local", "google"],
    default: "local"
  }
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
    emailOTPLastSentAt: { type: Date },
    emailOTPAttempts: { type: Number, default: 0 },
    googleId: {type: String},
    authProvider: {
      type: String,
      enum: ["local", "google"],
    default: "local"
    }
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ email: 1 }, { unique: true });

export const User = model<UserDocument>("User", userSchema);
