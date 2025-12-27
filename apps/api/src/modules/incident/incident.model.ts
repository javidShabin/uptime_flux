import { Schema, model, Document } from "mongoose";
import type { IncidentStatus } from "./incident.types";

/**
 * Incident MongoDB document
 */
export interface IncidentDocument extends Document {
  monitorId: string;
  status: IncidentStatus;
  startedAt: Date;
  resolvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Incident schema
 */
const incidentSchema = new Schema<IncidentDocument>(
  {
    monitorId: {
      type: String,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["OPEN", "RESOLVED"],
      default: "OPEN",
      required: true,
    },

    startedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

/**
 * Ensure only ONE open incident per monitor
 */
incidentSchema.index(
  { monitorId: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "OPEN" },
  }
);

export const Incident = model<IncidentDocument>(
  "Incident",
  incidentSchema
);