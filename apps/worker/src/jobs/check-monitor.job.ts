import axios from "axios";
import { Job } from "bullmq";
import { Monitor } from "@uptimeflux/shared";
import type { MonitorStatus } from "@uptimeflux/shared";
import { IncidentService } from "@uptimeflux/shared";


const incidentService = new IncidentService();

/**
 * Executes uptime check for a monitor
 */
export async function checkMonitorJob(job: Job<{ monitorId: string }>) {
  const { monitorId } = job.data;

  const monitor = await Monitor.findById(monitorId);
  if (!monitor || !monitor.isActive) {
    return;
  }

  const previousStatus = monitor.lastStatus;
  let currentStatus: MonitorStatus = "DOWN";

  try {
    const response = await axios.get(monitor.url, {
      timeout: 10_000,
      validateStatus: () => true,
    });

    currentStatus = response.status < 500 ? "UP" : "DOWN";
  } catch (error) {
    currentStatus = "DOWN";
  }

  // ================================
  // INCIDENT STATE TRANSITIONS
  // ================================
  if (previousStatus === "UP" && currentStatus === "DOWN") {
    await incidentService.createIncident(monitorId);
  }

  if (previousStatus === "DOWN" && currentStatus === "UP") {
    await incidentService.resolveIncident(monitorId);
  }
// ================================
  // Persist monitor state
  // ================================
  monitor.lastStatus = currentStatus;
  monitor.lastCheckedAt = new Date();
  await monitor.save();
}
