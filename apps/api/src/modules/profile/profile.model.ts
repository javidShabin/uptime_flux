import { Schema, model, type Document, Types } from "mongoose";
import { DEFAULT_AVATAR_URL } from "../../config/constants.js";

export interface IProfile extends Document {
  userId: Types.ObjectId;
  name?: string;
  avatarUrl?: string;
  timezone?: string;

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
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
ProfileSchema.index({ userId: 1 }, { unique: true });

export const ProfileModel = model<IProfile>("Profile", ProfileSchema);

