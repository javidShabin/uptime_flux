export type AlertType = "INCIDENT_OPENED" | "INCIDENT_RESOLVED";

export interface AlertPayload {
  monitorId: string;
  url: string;
  incidentId?: string;
  occurredAt: Date;
  type: AlertType;
}