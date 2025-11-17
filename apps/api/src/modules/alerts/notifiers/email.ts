import nodemailer from "nodemailer";
import { env } from "../../../config/env.js";
import type { AlertPayload } from "../alert.service.js";

export interface EmailChannelConfig {
  email: string[];
}

export const emailNotifier = {
  async send(
    payload: AlertPayload,
    channelConfig: EmailChannelConfig
  ): Promise<void> {
    if (!channelConfig.email || channelConfig.email.length === 0) {
      return;
    }

    const subject = `[UptimeFlux Alert] ${payload.monitorName} - ${payload.incidentStatus.toUpperCase()}`;
    
    const statusEmoji = payload.status === "up" ? "✅" : "❌";
    const statusText = payload.status === "up" ? "UP" : "DOWN";
    
    const text = `
UptimeFlux Alert Notification

${statusEmoji} Monitor: ${payload.monitorName}
Status: ${statusText}
URL: ${payload.monitorUrl}
Incident Status: ${payload.incidentStatus.toUpperCase()}
Timestamp: ${payload.timestamp.toISOString()}
${payload.reason ? `Reason: ${payload.reason}` : ""}

---
This is an automated alert from UptimeFlux.
    `.trim();

    const html = `
      <h2>${statusEmoji} UptimeFlux Alert</h2>
      <p><strong>Monitor:</strong> ${payload.monitorName}</p>
      <p><strong>Status:</strong> ${statusText}</p>
      <p><strong>URL:</strong> <a href="${payload.monitorUrl}">${payload.monitorUrl}</a></p>
      <p><strong>Incident Status:</strong> ${payload.incidentStatus.toUpperCase()}</p>
      <p><strong>Timestamp:</strong> ${payload.timestamp.toISOString()}</p>
      ${payload.reason ? `<p><strong>Reason:</strong> ${payload.reason}</p>` : ""}
      <hr>
      <p><em>This is an automated alert from UptimeFlux.</em></p>
    `;

    // Create transporter if SMTP is configured
    let transporter: nodemailer.Transporter | null = null;
    if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: Number(env.SMTP_PORT),
        secure: env.SMTP_SECURE,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
    }

    // Send to all email addresses
    for (const email of channelConfig.email) {
      try {
        if (!transporter || (env.NODE_ENV === "development" && (!env.SMTP_HOST || env.SMTP_HOST === ""))) {
          console.log(`[Email Notifier] [DEV MODE] Alert email to ${email}:`, subject);
          console.log(`[Email Notifier] [DEV MODE] Body:`, text);
          continue;
        }

        await transporter.sendMail({
          from: env.SMTP_FROM,
          to: email,
          subject,
          text,
          html,
        });

        console.log(`[Email Notifier] Alert sent to ${email}`);
      } catch (error) {
        console.error(`[Email Notifier] Failed to send to ${email}:`, error);
        // Continue with other emails even if one fails
      }
    }
  },
};

