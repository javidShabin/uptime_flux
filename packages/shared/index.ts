export enum MonitorStatus {
  UP = "UP",
  DOWN = "DOWN",
}

export interface MonitorJobPayload {
  monitorId: string;
}
