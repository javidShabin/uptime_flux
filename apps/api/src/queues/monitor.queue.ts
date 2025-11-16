import { Queue } from "bullmq";
import { env } from "../config/env.js";

/**
 * Monitor queue for scheduling health checks
 * This queue is used to enqueue monitor jobs that will be processed by workers
 */
export const monitorQueue = new Queue("monitor-run", {
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

