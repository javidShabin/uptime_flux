import nodemailer from "nodemailer";
import { env } from "../../config/env.js";

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    // Only create transporter if SMTP is configured
    if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: Number(env.SMTP_PORT),
        secure: env.SMTP_SECURE,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
    }
  }

  async sendOtp(email: string, code: string) {
    // In development or if SMTP not configured, log OTP to console
    if (!this.transporter || (env.NODE_ENV === "development" && (!env.SMTP_HOST || env.SMTP_HOST === ""))) {
      console.log("📧 [DEV MODE] OTP for", email, ":", code);
      console.log("📧 [DEV MODE] OTP expires in", env.OTP_EXPIRATION_MINUTES, "minutes");
      return;
    }

    try {
      const subject = "Your UptimeFlux verification code";
      const text = `Hi,\n\nUse the code ${code} to verify your email address. This code expires in ${env.OTP_EXPIRATION_MINUTES} minutes.\n\nIf you did not request this, ignore this email.`;
      const html = `<p>Hi,</p><p>Use the code <strong>${code}</strong> to verify your email address. This code expires in ${env.OTP_EXPIRATION_MINUTES} minutes.</p><p>If you did not request this, ignore this email.</p>`;

      await this.transporter.sendMail({
        from: env.SMTP_FROM,
        to: email,
        subject,
        text,
        html,
      });
      
      console.log("✅ OTP email sent to:", email);
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      throw new Error(`Failed to send email: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}


