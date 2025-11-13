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
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
