import { Worker } from "bullmq";
import Redis from "ioredis";
import { env } from "../config/env.js";
import { rollupQueue, type RollupJob } from "../queues/rollup.queue.js";
import { MonitorModel } from "../modules/monitor/monitor.model.js";
import { CheckModel } from "../modules/monitor/check.model.js";
import { RollupModel } from "../modules/summary/rollup.model.js";
import { SummaryService } from "../modules/summary/summary.service.js";
import { Types } from "mongoose";

console.log("📊 UptimeFlux Rollup Worker Running...");

// Create Redis connection for worker
// @ts-expect-error - ioredis default export type issue with NodeNext module resolution
const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 5,
  retryStrategy(times: number) {
    return Math.min(times * 50, 2000);
  },
});

const summaryService = new SummaryService();

new Worker(
  rollupQueue.name,
  async (job) => {
    const { monitorId, date } = job.data as RollupJob;

    const monitor = await MonitorModel.findById(monitorId);
    if (!monitor) {
      console.warn(`[Rollup Worker] Monitor ${monitorId} not found`);
      return;
    }

    // Parse date (YYYY-MM-DD) to Date object at UTC 00:00
    const dateObj = new Date(date + "T00:00:00.000Z");
    const nextDay = new Date(dateObj);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);

    // Fetch checks for the day
    const checks = await CheckModel.find({
      monitorId: new Types.ObjectId(monitorId),
      ts: { $gte: dateObj, $lt: nextDay },
    }).lean();

    if (checks.length === 0) {
      console.log(`[Rollup Worker] No checks found for monitor ${monitorId} on ${date}`);
      return;
    }

    // Compute metrics
    const windowMs = nextDay.getTime() - dateObj.getTime();
    const uptimePercent = summaryService.computeUptimePercent(
      checks,
      windowMs,
      monitor.scheduleSec * 1000
    );

    const latencies = checks
      .map((c) => c.latencyMs)
      .filter((l): l is number => l !== null && l !== undefined);
    const avgLatencyMs =
      latencies.length > 0
        ? Math.round((latencies.reduce((a, b) => a + b, 0) / latencies.length) * 100) / 100
        : null;

    const checksCount = checks.length;
    const downCount = checks.filter((c) => c.status === "down").length;

    // Upsert rollup (idempotent)
    await RollupModel.findOneAndUpdate(
      {
        monitorId: new Types.ObjectId(monitorId),
        date: dateObj,
      },
      {
        monitorId: new Types.ObjectId(monitorId),
        date: dateObj,
        uptimePercent: Math.round(uptimePercent * 100) / 100,
        avgLatencyMs,
        checksCount,
        downCount,
      },
      {
        upsert: true,
        new: true,
      }
    );

    console.log(
      `[Rollup Worker] Processed rollup for monitor ${monitorId}, date: ${date}, uptime: ${Math.round(uptimePercent * 100) / 100}%`
    );

    return true;
  },
  {
    connection: redis,
    concurrency: 5,
  }
);

