import type { AlertPayload } from "../alert.service.js";

export interface WebhookChannelConfig {
  webhook: string[];
}

export const webhookNotifier = {
  async send(
    payload: AlertPayload,
    channelConfig: WebhookChannelConfig
  ): Promise<void> {
    if (!channelConfig.webhook || channelConfig.webhook.length === 0) {
      return;
    }

    const webhookPayload = {
      event: "incident",
      monitor: {
        name: payload.monitorName,
        url: payload.monitorUrl,
        status: payload.status,
      },
      incident: {
        status: payload.incidentStatus,
        timestamp: payload.timestamp.toISOString(),
        reason: payload.reason,
      },
      source: "UptimeFlux",
    };

    // Send to all webhook URLs
    const sendPromises = channelConfig.webhook.map(async (url) => {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "UptimeFlux/1.0",
          },
          body: JSON.stringify(webhookPayload),
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => "Unknown error");
          throw new Error(`Webhook returned ${response.status}: ${errorText}`);
        }

        console.log(`[Webhook Notifier] Alert sent to ${url}`);
      } catch (error) {
        console.error(`[Webhook Notifier] Failed to send to ${url}:`, error);
        // Continue with other webhooks even if one fails
      }
    });

    await Promise.allSettled(sendPromises);
  },
};

