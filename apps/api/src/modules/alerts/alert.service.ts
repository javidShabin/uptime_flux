import { Types } from "mongoose";
import { alertQueue, type AlertJob } from "../../queues/alert.queue.js";
import { IncidentModel, type IIncident, IncidentStatus } from "../monitor/incident.model.js";
import { MonitorModel, type IMonitor } from "../monitor/monitor.model.js";
import { AlertPolicyModel, type IAlertPolicy } from "../alertPolicy/alertPolicy.model.js";

export interface AlertPayload {
  monitorName: string;
  monitorUrl: string;
  status: "down" | "up";
  incidentStatus: "open" | "acknowledged" | "resolved";
  timestamp: Date;
  reason?: string;
}

export class AlertService {
  /**
   * Enqueue an alert job for fan-out
   */
  async enqueueAlert(
    incident: IIncident,
    monitor: IMonitor,
    policy: IAlertPolicy | null,
    event: "opened" | "resolved" | "escalated"
  ): Promise<void> {
    if (!policy) {
      return; // No policy means no alerts
    }

    if (!monitor.projectId) {
      return; // No project means no policy
    }

    const job: AlertJob = {
      incidentId: incident._id.toString(),
      monitorId: monitor._id.toString(),
      projectId: monitor.projectId.toString(),
      policyId: policy._id.toString(),
      event,
    };

    await alertQueue.add("fanout", job, {
      removeOnComplete: true,
      removeOnFail: false,
    });
  }

  /**
   * Build unified message payload for all channels
   */
  buildMessagePayload(incident: IIncident, monitor: IMonitor): AlertPayload {
    const status = incident.status === IncidentStatus.RESOLVED ? "up" : "down";
    
    return {
      monitorName: monitor.name,
      monitorUrl: monitor.target,
      status,
      incidentStatus: incident.status,
      timestamp: incident.status === IncidentStatus.RESOLVED 
        ? incident.resolvedAt || new Date()
        : incident.openedAt,
      reason: incident.reason,
    };
  }
}

