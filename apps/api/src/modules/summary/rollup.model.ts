import { Schema, model, type Document, Types } from "mongoose";

export interface IRollup extends Document {
  monitorId: Types.ObjectId;
  date: Date;
  uptimePercent: number;
  avgLatencyMs: number | null;
  checksCount: number;
  downCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const RollupSchema = new Schema<IRollup>(
  {
    monitorId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Monitor",
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    uptimePercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    avgLatencyMs: {
      type: Number,
      required: false,
      default: null,
    },
    checksCount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    downCount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: one rollup per monitor per day
RollupSchema.index({ monitorId: 1, date: 1 }, { unique: true });
RollupSchema.index({ date: -1 }); // For sorting by date

export const RollupModel = model<IRollup>("Rollup", RollupSchema);

