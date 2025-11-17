import type { AlertPayload } from "../alert.service.js";

export interface WhatsAppChannelConfig {
  phoneNumber: string;
  apiKey: string;
}

export const whatsappNotifier = {
  async send(
    payload: AlertPayload,
    channelConfig: WhatsAppChannelConfig
  ): Promise<void> {
    if (!channelConfig.phoneNumber || !channelConfig.apiKey) {
      return;
    }

    const statusEmoji = payload.status === "up" ? "✅" : "❌";
    const statusText = payload.status === "up" ? "UP" : "DOWN";
    
    const message = `
${statusEmoji} *UptimeFlux Alert*

*Monitor:* ${payload.monitorName}
*Status:* ${statusText}
*URL:* ${payload.monitorUrl}
*Incident Status:* ${payload.incidentStatus.toUpperCase()}
*Timestamp:* ${payload.timestamp.toISOString()}
${payload.reason ? `*Reason:* ${payload.reason}` : ""}

_Automated alert from UptimeFlux_
    `.trim();

    try {
      // Placeholder for WhatsApp API integration
      // Replace with actual WhatsApp API provider endpoint
      const url = "https://api.whatsapp.com/sendMessage";
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${channelConfig.apiKey}`,
        },
        body: JSON.stringify({
          phone: channelConfig.phoneNumber,
          message: message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`WhatsApp API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      console.log(`[WhatsApp Notifier] Alert sent to ${channelConfig.phoneNumber}`);
    } catch (error) {
      console.error("[WhatsApp Notifier] Failed to send alert:", error);
      // Log error but don't throw - allow other notifiers to proceed
      console.warn("[WhatsApp Notifier] WhatsApp API integration is a placeholder - implement actual provider");
    }
  },
};

