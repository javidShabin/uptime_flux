import { Worker } from "bullmq";
import Redis from "ioredis";
import { env } from "../config/env.js";
import { monitorQueue } from "../queues/monitor.queue.js";
import { MonitorModel, type IMonitor } from "../modules/monitor/monitor.model.js";
import { CheckModel } from "../modules/monitor/check.model.js";
import { IncidentModel } from "../modules/monitor/incident.model.js";
import { checkHttp } from "../modules/monitor/httpChecker.js";
import { checkTcp, parseTcpTarget } from "../modules/monitor/tcpChecker.js";
import { checkPing, parsePingTarget } from "../modules/monitor/pingChecker.js";
import { IncidentService } from "../modules/monitor/incident.service.js";
import { AlertPolicyService } from "../modules/alertPolicy/alertPolicy.service.js";
import { AlertService } from "../modules/alerts/alert.service.js";

console.log("🚀 UptimeFlux Monitor Worker Running...");

// Create Redis connection for worker
// @ts-expect-error - ioredis default export type issue with NodeNext module resolution
const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 5,
  retryStrategy(times: number) {
    return Math.min(times * 50, 2000);
  },
});

// Create Redis pub client for WebSocket events
// @ts-expect-error - ioredis default export type issue with NodeNext module resolution
const redisPub = new Redis(env.REDIS_URL, {
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
    } else if (monitor.type === "ping") {
      const pingTarget = parsePingTarget(monitor.target);
      if (!pingTarget) {
        result = {
          status: "down" as const,
          latency: 0,
          error: "Invalid ping target format. Expected hostname or IP address",
        };
      } else {
        result = await checkPing({
          host: pingTarget,
          timeoutMs: monitor.timeoutMs,
          count: 1, // Single ping for faster checks
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

    // Publish check:new event via Redis Pub/Sub
    if (monitor.projectId) {
      const checkPayload = {
        monitorId: String(monitor._id),
        projectId: String(monitor.projectId),
        status: checkDoc.status,
        latencyMs: checkDoc.latencyMs,
        httpStatus: checkDoc.httpStatus,
        errorText: checkDoc.errorText || undefined,
        ts: checkDoc.ts?.toISOString() || new Date().toISOString(),
      };
      await redisPub.publish(
        `ws:project:${monitor.projectId}`,
        JSON.stringify({ event: "check:new", data: checkPayload })
      );
    }

    // Alert policy evaluation
    const alertPolicyService = new AlertPolicyService();
    const incidentService = new IncidentService();
    const alertService = new AlertService();
    const lastChecks = await CheckModel.find({ monitorId: monitor._id })
      .sort({ ts: -1 })
      .limit(10)
      .select("status ts")
      .lean();

    const policyResult = await alertPolicyService.evaluatePolicy(monitor, lastChecks);

    // Handle incident based on policy evaluation
    let incidentEvent: { type: "opened" | "resolved"; incidentId: string } | null = null;
    
    if (policyResult.action === "open") {
      const incidentResponse = await incidentService.openIncident(monitor, checkDoc);
      incidentEvent = { type: "opened", incidentId: incidentResponse.id };
    } else if (policyResult.action === "resolve") {
      const incidentResponse = await incidentService.resolveIncident(monitor);
      if (incidentResponse) {
        incidentEvent = { type: "resolved", incidentId: incidentResponse.id };
      }
    }

    // Enqueue alert if incident event occurred
    if (incidentEvent) {
      const policy = await alertPolicyService.getPolicyForMonitor(monitor);
      if (policy) {
        const incidentDoc = await IncidentModel.findById(incidentEvent.incidentId);
        if (incidentDoc && monitor.projectId) {
          await alertService.enqueueAlert(
            incidentDoc,
            monitor,
            policy,
            incidentEvent.type
          );

          // Publish incident event via Redis Pub/Sub
          const incidentPayload = {
            incidentId: String(incidentDoc._id),
            monitorId: String(monitor._id),
            projectId: String(monitor.projectId),
            status: incidentDoc.status,
            timestamp: incidentDoc.status === "resolved" 
              ? (incidentDoc.resolvedAt?.toISOString() || new Date().toISOString())
              : incidentDoc.openedAt.toISOString(),
            reason: incidentDoc.reason || undefined,
          };

          const eventName = incidentEvent.type === "opened" ? "incident:opened" : "incident:resolved";
          await redisPub.publish(
            `ws:project:${monitor.projectId}`,
            JSON.stringify({ event: eventName, data: incidentPayload })
          );
        }
      }
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
