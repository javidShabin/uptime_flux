import type { AlertPayload } from "../alert.service.js";

export interface TelegramChannelConfig {
  botToken: string;
  chatId: string;
}

export const telegramNotifier = {
  async send(
    payload: AlertPayload,
    channelConfig: TelegramChannelConfig
  ): Promise<void> {
    if (!channelConfig.botToken || !channelConfig.chatId) {
      return;
    }

    const statusEmoji = payload.status === "up" ? "✅" : "❌";
    const statusText = payload.status === "up" ? "UP" : "DOWN";
    
    const message = `
${statusEmoji} <b>UptimeFlux Alert</b>

<b>Monitor:</b> ${payload.monitorName}
<b>Status:</b> ${statusText}
<b>URL:</b> ${payload.monitorUrl}
<b>Incident Status:</b> ${payload.incidentStatus.toUpperCase()}
<b>Timestamp:</b> ${payload.timestamp.toISOString()}
${payload.reason ? `<b>Reason:</b> ${payload.reason}` : ""}

<i>Automated alert from UptimeFlux</i>
    `.trim();

    try {
      const url = `https://api.telegram.org/bot${channelConfig.botToken}/sendMessage`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: channelConfig.chatId,
          text: message,
          parse_mode: "HTML",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Telegram API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      console.log(`[Telegram Notifier] Alert sent to chat ${channelConfig.chatId}`);
    } catch (error) {
      console.error("[Telegram Notifier] Failed to send alert:", error);
      throw error;
    }
  },
};

