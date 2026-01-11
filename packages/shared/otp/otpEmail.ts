import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "javid.main.act@gmail.com",
    pass: "jrdz wicb zxqr kias"
  }
});

export async function sendOtpEmail(email: string, otp: string) {
  
  try {
    await transporter.sendMail({
      from: `"UptimeFlux" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your UptimeFlux account",
      html: `
      <div style="font-family: Arial, sans-serif; background:#0f172a; color:white; padding:32px; border-radius:12px;">
        <h2 style="color:#38bdf8;">UptimeFlux Email Verification</h2>

        <p>Use the OTP below to verify your email:</p>

        <div style="font-size:32px; font-weight:bold; letter-spacing:6px;">
          ${otp}
        </div>

        <p>This OTP expires in 10 minutes.</p>

        <p>If you did not request this, ignore this email.</p>
      </div>
      `
    });
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw new Error(`Email service unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
