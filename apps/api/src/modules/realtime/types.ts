export interface CheckNewPayload {
  monitorId: string;
  projectId: string;
  status: "up" | "down" | "degraded";
  latencyMs: number | null;
  httpStatus: number | null;
  errorText?: string;
  ts: string;
}

export interface IncidentPayload {
  incidentId: string;
  monitorId: string;
  projectId: string;
  status: "open" | "acknowledged" | "resolved";
  timestamp: string;
  reason?: string;
}

export type RealtimeEvent = "check:new" | "incident:opened" | "incident:updated" | "incident:resolved";

export interface RealtimeMessage {
  event: RealtimeEvent;
  data: CheckNewPayload | IncidentPayload;
}

