import { Schema, model } from "mongoose";

const incidentSchema = new Schema({
  monitorId: { type: Schema.Types.ObjectId, ref: "Monitor" },
  status: {
    type: String,
    enum: ["open", "resolved"],
    default: "open"
  },
  openedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
});

export const IncidentModel = model("Incident", incidentSchema);
