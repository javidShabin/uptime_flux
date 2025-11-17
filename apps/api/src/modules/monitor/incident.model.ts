import { Schema, model, type Document, Types } from "mongoose";

export enum IncidentStatus {
  OPEN = "open",
  ACKNOWLEDGED = "acknowledged",
  RESOLVED = "resolved",
}

export interface IIncident extends Document {
  monitorId: Types.ObjectId;
  projectId?: Types.ObjectId;
  status: IncidentStatus;
  reason?: string;
  openedAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  acknowledgedBy?: Types.ObjectId;
  resolvedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const IncidentSchema = new Schema<IIncident>(
  {
    monitorId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Monitor",
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Project",
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(IncidentStatus),
      required: true,
      default: IncidentStatus.OPEN,
      index: true,
    },
    reason: {
      type: String,
      required: false,
      trim: true,
    },
    openedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    acknowledgedAt: {
      type: Date,
      required: false,
    },
    resolvedAt: {
      type: Date,
      required: false,
    },
    acknowledgedBy: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    resolvedBy: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
IncidentSchema.index({ monitorId: 1, status: 1 }); // Compound index for finding open incidents
IncidentSchema.index({ projectId: 1 }); // For filtering by project
IncidentSchema.index({ status: 1 }); // For filtering by status
IncidentSchema.index({ openedAt: -1 }); // For sorting by opening date

export const IncidentModel = model<IIncident>("Incident", IncidentSchema);
