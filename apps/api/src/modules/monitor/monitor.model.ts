import { Schema, model, type Document, Types } from "mongoose";

export enum MonitorType {
  HTTP = "http",
  HTTPS = "https",
  TCP = "tcp",
  PING = "ping",
}

export interface IMonitor extends Document {
  userId: Types.ObjectId;
  projectId?: Types.ObjectId;
  name: string;
  type: MonitorType;
  target: string; // URL or host:port
  heartbeatToken?: string;
  scheduleSec: number;
  timeoutMs: number;
  expectedStatus?: string; // e.g. "200-399"
  verifyTls?: boolean;
  tlsThresholdDays?: number;
  tags: string[];
  isPaused: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MonitorSchema = new Schema<IMonitor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Project",
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(MonitorType),
      required: true,
    },
    target: {
      type: String,
      required: true,
      trim: true,
    },
    heartbeatToken: {
      type: String,
      required: false,
      trim: true,
    },
    scheduleSec: {
      type: Number,
      required: true,
      min: 30, // Minimum 30 seconds
      default: 300, // Default 5 minutes
    },
    timeoutMs: {
      type: Number,
      required: true,
      min: 1000, // Minimum 1 second
      max: 60000, // Maximum 60 seconds
      default: 5000, // Default 5 seconds
    },
    expectedStatus: {
      type: String,
      required: false,
      trim: true,
    },
    verifyTls: {
      type: Boolean,
      default: true,
    },
    tlsThresholdDays: {
      type: Number,
      required: false,
      min: 1,
      max: 365,
    },
    tags: {
      type: [String],
      default: [],
    },
    isPaused: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
MonitorSchema.index({ userId: 1 }); // For filtering by user
MonitorSchema.index({ userId: 1, isPaused: 1 }); // Compound index for active user monitors
MonitorSchema.index({ projectId: 1 }); // For filtering by project (if used)
MonitorSchema.index({ type: 1 }); // For filtering by monitor type
MonitorSchema.index({ createdAt: -1 }); // For sorting by creation date

export const MonitorModel = model<IMonitor>("Monitor", MonitorSchema);

