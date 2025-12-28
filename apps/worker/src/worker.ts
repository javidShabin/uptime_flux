import "dotenv/config";
import { Worker } from "bullmq";
import { redisConnection } from "./config/redis";
import { connectMongo, disconnectMongo } from "./config/mongo";
import { checkMonitorJob } from "./jobs/check-monitor.job";


async function startWorker() {
  await connectMongo();

  const worker = new Worker(
    "monitor-checks",
    checkMonitorJob,
    redisConnection
  )

  worker.on("ready", () => {
    console.log("🚀 Worker is ready");
  });

  worker.on("failed", (job, err) => {
    console.error(`❌ Job ${job?.id} failed`, err);
  });

  async function shutdown() {
    console.log("⚠️ Shutting down worker...");
    await worker.close();
    await disconnectMongo();
    process.exit(0);
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

startWorker().catch((err) => {
  console.error("❌ Worker failed to start", err);
  process.exit(1);
});