import axios from "axios";
import { Job } from "bullmq";
import { Monitor } from "@uptimeflux/shared";
import type { MonitorStatus } from "@uptimeflux/shared";
import { IncidentService } from "@uptimeflux/shared";
import { AlertService } from "@uptimeflux/shared";


const incidentService = new IncidentService();
const alertService = new AlertService();

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
      validateStatus: () => true, // Allow all status codes; we validate manually below
    });

    // Status-code-based validation:
    // Even if the HTTP request succeeds (no network/DNS/timeout errors),
    // we must check if the response status code is in the expected list.
    // This prevents misleading UP states for scenarios like:
    // - Vercel DEPLOYMENT_NOT_FOUND (404) - service is down but HTTP connection succeeded
    // - Other error pages that return HTTP 200 but indicate the service is unavailable
    // Only mark UP if the response status is in the monitor's expectedStatusCodes list.
    const expectedCodes = monitor.expectedStatusCodes || [200, 301, 302];
    if (expectedCodes.includes(response.status)) {
      currentStatus = "UP";
    } else {
      currentStatus = "DOWN";
    }
  } catch (error) {
    // Network errors, timeouts, DNS failures: mark as DOWN
    currentStatus = "DOWN";
  }

  // ================================
  // INCIDENT STATE TRANSITIONS
  // ================================
  if (previousStatus === "UP" && currentStatus === "DOWN") {
    const incident = await incidentService.createIncident(monitorId);

    await alertService.send({
      type: "INCIDENT_OPENED",
      monitorId,
      url: monitor.url,
      incidentId: incident._id.toString(),
      occurredAt: new Date()
    })
  }

  if (previousStatus === "DOWN" && currentStatus === "UP") {
    await incidentService.resolveIncident(monitorId);

    await alertService.send({
    type: "INCIDENT_RESOLVED",
    monitorId,
    url: monitor.url,
    occurredAt: new Date(),
  });
  }
// ================================
  // Persist monitor state
  // ================================
  await Monitor.updateOne(
    { _id: monitorId },
    {
      lastStatus: currentStatus,
      lastCheckedAt: new Date(),
    }
  );
}
