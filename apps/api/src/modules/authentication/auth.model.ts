import bcrypt from "bcryptjs";
import { Schema, model, type Document } from "mongoose";

export interface RefreshTokenEntity {
  tokenId: string;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  revokedAt?: Date;
}

export interface SafeUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDocument extends Document {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  otpVerifiedAt?: Date;
  lastLoginAt?: Date;
  refreshTokens: RefreshTokenEntity[];
  comparePassword(candidate: string): Promise<boolean>;
  toSafeObject(): SafeUser;
}

const refreshTokenSchema = new Schema<RefreshTokenEntity>(
  {
    tokenId: { type: String, required: true },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    revokedAt: { type: Date },
  },
  { _id: false }
);

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    otpVerifiedAt: { type: Date },
    lastLoginAt: { type: Date },
    refreshTokens: { type: [refreshTokenSchema], default: [] },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

userSchema.methods.comparePassword = function comparePassword(
  candidate: string
) {
  return bcrypt.compare(candidate, this.passwordHash);
};

userSchema.methods.toSafeObject = function toSafeObject(): SafeUser {
  return {
    id: this._id.toString(),
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    isEmailVerified: this.isEmailVerified,
    lastLoginAt: this.lastLoginAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const UserModel = model<UserDocument>("User", userSchema);
