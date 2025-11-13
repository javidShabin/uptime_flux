import { Queue } from "bullmq";
import { env } from "../config/env.js";

export const monitorQueue = new Queue("monitor-run", {
  connection: { url: env.REDIS_URL },
});
