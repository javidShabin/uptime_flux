import { Queue } from "bullmq";
import { env } from "../config/env";

/**
 * Monitor Queue
 *
 * BullMQ producer utilities for scheduling
 * uptime check jobs.
 */

export interface MonitorJobPayload {
  monitorId: string;
}

/**
 * Redis-backed BullMQ queue
 */
const monitorQueue = new Queue<MonitorJobPayload>("monitor-checks", {
  connection: {
    url: env.REDIS_URL,
  },
});

// =================================
// Schedule monitor check job
// =================================
export async function scheduleMonitorJob(
  monitorId: string,
  intervalSeconds: number
) {
  await monitorQueue.add(
    "check-monitor",
    { monitorId },
    {
      jobId: monitorId, // Prevent duplicates
      repeat: {
        every: intervalSeconds * 1000,
      },
      removeOnComplete: true,
      removeOnFail: 100,
    }
  );
}

// =================================
// Remove scheduled monitor job
// =================================
export async function removeMonitorJob(monitoId: string) {
  const repeatablejobs = await monitorQueue.getRepeatableJobs();

  for (const job of repeatablejobs) {
    if (job.id === monitoId) {
      await monitorQueue.removeRepeatableByKey(job.key);
    }
  }
}
