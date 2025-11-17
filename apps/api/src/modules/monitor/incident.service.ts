import { CheckModel } from "./check.model.js";
import { IncidentModel } from "./incident.model.js";
import type { IMonitor } from "./monitor.model.js";
import type { Document } from "mongoose";

interface ICheck extends Document {
  monitorId?: any;
  status: "up" | "down" | "degraded";
  latencyMs?: number | null;
  httpStatus?: number | null;
  errorText?: string | null;
  region?: string;
  ts?: Date;
}

export async function evaluateIncident(monitor: IMonitor, check: ICheck) {
  // Find current open incident
  const existingIncident = await IncidentModel.findOne({
    monitorId: monitor._id,
    status: "open"
  });

  // === OPEN INCIDENT ===
  if (check.status === "down" && !existingIncident) {
    const incident = await IncidentModel.create({
      monitorId: monitor._id,
      status: "open",
      openedAt: new Date()
    });
    return { type: "opened", incident };
  }

  // === RESOLVE INCIDENT ===
  if (check.status === "up" && existingIncident) {
    existingIncident.status = "resolved";
    existingIncident.resolvedAt = new Date();
    await existingIncident.save();
    return { type: "resolved", incident: existingIncident };
  }

  return null;
}
