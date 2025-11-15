import { Schema, model, type Document, Types } from "mongoose";
import { DEFAULT_AVATAR_URL } from "../../config/constants.js";

export interface IProfile extends Document {
  userId: Types.ObjectId;
  firstName: string;
  lastName: string;
  name?: string;
  avatarUrl?: string;
  timezone?: string;

  // 2FA (TOTP) system
  twoFactorEnabled: boolean;
  twoFactorSecretEncrypted?: string | null;

  // Security metadata
  lastPasswordChange?: Date;

  // Timestamps handled by Mongoose
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
      index: true,
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      default: "",
    },

    avatarUrl: {
      type: String,
      default: DEFAULT_AVATAR_URL,
    },

    timezone: {
      type: String,
      default: "UTC",
    },

    // 2FA (TOTP) system
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecretEncrypted: {
      type: String,
      default: null,
    },

    // Security metadata
    lastPasswordChange: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
ProfileSchema.index({ userId: 1 }, { unique: true });

export const ProfileModel = model<IProfile>("Profile", ProfileSchema);

