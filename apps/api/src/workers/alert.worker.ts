import { Worker } from "bullmq";
import Redis from "ioredis";
import { env } from "../config/env.js";
import { alertQueue, type AlertJob } from "../queues/alert.queue.js";
import { MonitorModel } from "../modules/monitor/monitor.model.js";
import { IncidentModel } from "../modules/monitor/incident.model.js";
import { AlertPolicyModel } from "../modules/alertPolicy/alertPolicy.model.js";
import { AlertService } from "../modules/alerts/alert.service.js";
import { emailNotifier } from "../modules/alerts/notifiers/email.js";
import { telegramNotifier } from "../modules/alerts/notifiers/telegram.js";
import { whatsappNotifier } from "../modules/alerts/notifiers/whatsapp.js";
import { webhookNotifier } from "../modules/alerts/notifiers/webhook.js";

console.log("🚨 UptimeFlux Alert Worker Running...");

// Create Redis connection for worker
// @ts-expect-error - ioredis default export type issue with NodeNext module resolution
const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 5,
  retryStrategy(times: number) {
    return Math.min(times * 50, 2000);
  },
});

new Worker(
  alertQueue.name,
  async (job) => {
    const { incidentId, monitorId, projectId, policyId, event } = job.data as AlertJob;

    // Load required models
    const [incident, monitor, policy] = await Promise.all([
      IncidentModel.findById(incidentId),
      MonitorModel.findById(monitorId),
      AlertPolicyModel.findById(policyId),
    ]);

    if (!incident || !monitor || !policy) {
      throw new Error(
        `Missing required data: incident=${!!incident}, monitor=${!!monitor}, policy=${!!policy}`
      );
    }

    // Build alert payload
    const alertService = new AlertService();
    const payload = alertService.buildMessagePayload(incident, monitor);

    // Fan-out to all configured channels
    const notificationPromises: Promise<void>[] = [];

    // Email notifications
    if (policy.channels.email && policy.channels.email.length > 0) {
      notificationPromises.push(
        emailNotifier.send(payload, { email: policy.channels.email }).catch((error) => {
          console.error("[Alert Worker] Email notification failed:", error);
        })
      );
    }

    // Telegram notification
    if (policy.channels.telegram) {
      notificationPromises.push(
        telegramNotifier.send(payload, policy.channels.telegram).catch((error) => {
          console.error("[Alert Worker] Telegram notification failed:", error);
        })
      );
    }

    // WhatsApp notification
    if (policy.channels.whatsapp) {
      notificationPromises.push(
        whatsappNotifier.send(payload, policy.channels.whatsapp).catch((error) => {
          console.error("[Alert Worker] WhatsApp notification failed:", error);
        })
      );
    }

    // Webhook notifications
    if (policy.channels.webhook && policy.channels.webhook.length > 0) {
      notificationPromises.push(
        webhookNotifier.send(payload, { webhook: policy.channels.webhook }).catch((error) => {
          console.error("[Alert Worker] Webhook notification failed:", error);
        })
      );
    }

    // Wait for all notifications to complete (or fail gracefully)
    await Promise.allSettled(notificationPromises);

    console.log(
      `[Alert Worker] Processed alert for incident ${incidentId}, event: ${event}, channels: ${notificationPromises.length}`
    );

    return true;
  },
  {
    connection: redis,
    concurrency: 5,
  }
);

