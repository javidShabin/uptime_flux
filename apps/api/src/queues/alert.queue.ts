import { Queue } from "bullmq";
import { env } from "../config/env.js";

export type AlertJob = {
  incidentId: string;
  monitorId: string;
  projectId: string;
  policyId: string;
  event: "opened" | "resolved" | "escalated";
};

/**
 * Alert queue for fan-out notifications
 * This queue is used to enqueue alert jobs that will be processed by alert workers
 */
export const alertQueue = new Queue("alert-fanout", {
  connection: { url: env.REDIS_URL },
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 100,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  },
});

