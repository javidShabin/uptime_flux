import { Schema, model, Types, Document } from "mongoose";

/**
 * Allowed monitor statuses
 */
export type MonitorStatus = "UP" | "DOWN" | "UNKNOWN";

/**
 * Monitor document interface
 */
export interface MonitorDocument extends Document {
  url: string;
  userId: Types.ObjectId
  interval: number; // in seconds
  isActive: boolean;
  lastStatus: MonitorStatus;
  lastCheckedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Monitor schema
 */
const monitorSchema = new Schema<MonitorDocument>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    userId: {
      type: Types.ObjectId,
      required: true,
      index: true,
    },

    interval: {
      type: Number,
      required: true,
      min: 30, // minimum 30 seconds
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastStatus: {
      type: String,
      enum: ["UP", "DOWN", "UNKNOWN"],
      default: "UNKNOWN",
    },

    lastCheckedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes (important for performance)
 */
monitorSchema.index({ isActive: 1 });
monitorSchema.index({ lastStatus: 1 });
monitorSchema.index({ url: 1 }, { unique: true });
monitorSchema.index({ userId: 1 });
monitorSchema.index({ userId: 1, url: 1 }, { unique: true });

export const Monitor = model<MonitorDocument>("Monitor", monitorSchema);
