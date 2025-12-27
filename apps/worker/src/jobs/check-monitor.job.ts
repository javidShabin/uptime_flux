import axios from "axios";
import { Job } from "bullmq";
import { Monitor } from "@uptimeflux/shared";
import type { MonitorStatus } from "@uptimeflux/shared";


/**
 * Executes uptime check for a monitor
 */
export async function checkMonitorJob(job: Job<{ monitorId: string }>) {
  const { monitorId } = job.data;

  const monitor = await Monitor.findById(monitorId);
  if (!monitor || !monitor.isActive) {
    return;
  }

  let status: MonitorStatus = "DOWN";

  try {
    const response = await axios.get(monitor.url, {
      timeout: 10_000,
      validateStatus: () => true,
    });

    status = response.status < 500 ? "UP" : "DOWN";
  } catch (error) {
    status = "DOWN";
  }

  // Update monitor state
  monitor.lastStatus = status;
  monitor.lastCheckedAt = new Date();
  await monitor.save();
}
