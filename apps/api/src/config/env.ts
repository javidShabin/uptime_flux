import dotenv from "dotenv";
import { z } from "zod";

dotenv.config(); // Load .env

// Validate environment variables
const envSchema = z.object({
  PORT: z.string().default("3000"),
  MONGO_URL: z.string().min(1, "MONGO_URL is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  REDIS_URL: z.string().min(1, "REDIS_URL is required"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET is required"),
  COOKIE_SECRET: z.string().min(32, "COOKIE_SECRET must be at least 32 characters"),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(30),
  OTP_EXPIRATION_MINUTES: z.coerce.number().int().min(1).max(30).default(10),
  OTP_RESEND_INTERVAL_SECONDS: z.coerce.number().int().min(30).max(300).default(60),
  SMTP_HOST: z.string().optional().default(""),
  SMTP_PORT: z.coerce.number().int().default(587),
  SMTP_SECURE: z.coerce.boolean().default(false),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASS: z.string().optional().default(""),
  SMTP_FROM: z.string().optional().default("UptimeFlux <noreply@uptimeflux.com>"),
  CLOUD_NAME: z.string().min(1, "CLOUD_NAME is required"),
  CLOUD_API_KEY: z.string().min(1, "CLOUD_API_KEY is required"),
  CLOUD_API_SECRET: z.string().min(1, "CLOUD_API_SECRET is required"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
