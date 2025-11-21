import { Queue } from "bullmq";
import { env } from "../config/env.js";

export type RollupJob = {
  monitorId: string;
  date: string; // YYYY-MM-DD format
};

/**
 * Rollup queue for daily aggregation jobs
 * This queue is used to enqueue rollup jobs that will be processed by workers
 */
export const rollupQueue = new Queue("rollup-daily", {
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

