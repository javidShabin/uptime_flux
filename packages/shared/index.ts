export * from "./monitor/index.js";
export * from "./incident/index.js";
export * from "./alert/index.js";
export * from "./user/index.js";

// Explicit re-exports for better TypeScript resolution
export { User } from "./user/user.model.js";
export { Monitor } from "./monitor/monitor.model.js";
export { Incident } from "./incident/incident.model.js";
export type { IncidentDTO } from "./incident/incident.types.js";

export interface MonitorJobPayload {
  monitorId: string;
}