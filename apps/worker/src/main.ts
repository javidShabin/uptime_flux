import { Worker } from "bullmq";
import IORedis from "ioredis";
import dotenv from "dotenv";
import monitorProcessor from "./processors/monitor.processor";

dotenv.config();

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

console.log("🚀 Worker started. Listening for monitor-run jobs...");

const worker = new Worker(
  "monitor-run",
  async (job) => {
    console.log("📌 Processing job:", job.id);
    const result = await monitorProcessor(job);
    console.log("✅ Completed job:", job.id, result);
    return result;
  },
  {
    connection,
    concurrency: 5, // ⭐ Important
  }
);

// Worker Events
worker.on("completed", (job) => {
  console.log(`🎉 Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err);
});
