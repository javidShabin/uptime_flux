import type { AlertPayload } from "./alert.types.js";
import { emailTransporter } from "./email.js";
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
    await emailTransporter.sendMail({
      from: process.env.ALERT_FROM,
      to: process.env.ALERT_TO,
      subject: `🚨 DOWN: ${payload.url}`,
      html: `
        <h2>🚨 Site Down</h2>
        <p><strong>URL:</strong> ${payload.url}</p>
        <p><strong>Time:</strong> ${payload.occurredAt.toISOString()}</p>
      `,
    });
  }
  private async sendRecoveryAlert(payload: AlertPayload) {
    await emailTransporter.sendMail({
      from: process.env.ALERT_FROM,
      to: process.env.ALERT_TO,
      subject: `✅ UP: ${payload.url}`,
      html: `
        <h2>✅ Site Recovered</h2>
        <p><strong>URL:</strong> ${payload.url}</p>
        <p><strong>Time:</strong> ${payload.occurredAt.toISOString()}</p>
      `,
    });
  }
}
