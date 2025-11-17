import { Worker } from "bullmq";
import Redis from "ioredis";
import { env } from "../config/env.js";
import { monitorQueue } from "../queues/monitor.queue.js";
import { MonitorModel, type IMonitor } from "../modules/monitor/monitor.model.js";
import { CheckModel } from "../modules/monitor/check.model.js";
import { checkHttp } from "../modules/monitor/httpChecker.js";
import { checkTcp, parseTcpTarget } from "../modules/monitor/tcpChecker.js";
import { IncidentService } from "../modules/monitor/incident.service.js";
import { AlertPolicyService } from "../modules/alertPolicy/alertPolicy.service.js";

console.log("🚀 UptimeFlux Monitor Worker Running...");

// Create Redis connection for worker
// @ts-expect-error - ioredis default export type issue with NodeNext module resolution
const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 5,
  retryStrategy(times: number) {
    return Math.min(times * 50, 2000);
  },
});

new Worker(
  monitorQueue.name,
  async job => {
    const { monitorId } = job.data;

    const monitor = await MonitorModel.findById(monitorId);

    if (!monitor) return;

    // If paused → only reschedule
    if (monitor.isPaused) {
      return scheduleNext(monitor);
    }

    // Run appropriate check
    let result;
    if (monitor.type === "http" || monitor.type === "https") {
      result = await checkHttp({
        url: monitor.target,
        timeoutMs: monitor.timeoutMs,
        verifyTls: monitor.verifyTls,
        expectedStatus: monitor.expectedStatus,
        tlsThresholdDays: monitor.tlsThresholdDays,
      });
    } else if (monitor.type === "tcp") {
      const tcpTarget = parseTcpTarget(monitor.target);
      if (!tcpTarget) {
        result = {
          status: "down" as const,
          latency: 0,
          error: "Invalid TCP target format. Expected host:port",
        };
      } else {
        result = await checkTcp({
          host: tcpTarget.host,
          port: tcpTarget.port,
          timeoutMs: monitor.timeoutMs,
        });
      }
    }

    if (!result) {
      return scheduleNext(monitor);
    }

    // Write check document
    const checkDoc = await CheckModel.create({
      monitorId,
      status: result.status === "up" ? "up" : "down",
      latencyMs: result.latency ?? null,
      httpStatus: "statusCode" in result ? result.statusCode ?? null : null,
      errorText: result.error ?? null,
      region: "in1"
    });

    // Alert policy evaluation
    const alertPolicyService = new AlertPolicyService();
    const incidentService = new IncidentService();
    const lastChecks = await CheckModel.find({ monitorId: monitor._id })
      .sort({ ts: -1 })
      .limit(10)
      .select("status ts")
      .lean();

    const policyResult = await alertPolicyService.evaluatePolicy(monitor, lastChecks);

    // Handle incident based on policy evaluation
    if (policyResult.action === "open") {
      await incidentService.openIncident(monitor, checkDoc);
    } else if (policyResult.action === "resolve") {
      await incidentService.resolveIncident(monitor);
    }

    // Schedule next run
    scheduleNext(monitor);

    return true;
  },
  {
    connection: redis,
    concurrency: 10
  }
);

function scheduleNext(monitor: IMonitor) {
  return monitorQueue.add(
    "run",
    { monitorId: monitor._id },
    {
      delay: monitor.scheduleSec * 1000,
      removeOnComplete: true
    }
  );
}
