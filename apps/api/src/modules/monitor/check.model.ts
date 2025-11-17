import { Schema, model } from "mongoose";

const checkSchema = new Schema(
  {
    monitorId: { type: Schema.Types.ObjectId, ref: "Monitor", index: true },
    status: { type: String, enum: ["up", "down", "degraded"], required: true },
    latencyMs: { type: Number },
    httpStatus: { type: Number },
    errorText: { type: String },
    region: { type: String, default: "in1" },
    ts: { type: Date, default: Date.now, index: true }
  },
  { timestamps: false }
);

export const CheckModel = model("Check", checkSchema);
