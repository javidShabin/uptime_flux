import nodemailer from "nodemailer";
import { env } from "../../config/env.js";

export class EmailService {
  private transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: env.SMTP_SECURE,  // convert string -> boolean
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

  async sendOtp(email: string, code: string) {
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
  }
}


