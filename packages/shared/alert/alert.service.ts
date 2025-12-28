import type { AlertPayload } from "./alert.types";

/**
 * AlertService
 *
 * Central place for sending alerts.
 * Email now, Slack/Webhook later.
 */
export class AlertService {
  async send(payload: AlertPayload) {
    switch (payload.type) {
      case "INCIDENT_OPENED":
        await this.sendDownAlert(payload);
        break;

      case "INCIDENT_RESOLVED":
        await this.sendRecoveryAlert(payload);
        break;
    }
  }
  private async sendDownAlert(payload: AlertPayload) {
    console.log(`DOWN: ${payload.url} at ${payload.occurredAt.toISOString()}`);
  }
  private async sendRecoveryAlert(payload: AlertPayload) {
    console.log(
      `UP: ${payload.url} recovered at ${payload.occurredAt.toISOString()}`
    );
  }
}
