import { Schema, model, type Document } from "mongoose";

/**
 * User document interface
 */
export interface UserDocument extends Document {
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
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
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ email: 1 }, { unique: true });

export const User = model<UserDocument>("User", userSchema);