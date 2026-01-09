import dotenv from "dotenv";

dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required env: ${key}`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(requireEnv("PORT")),

  MONGO_URI: requireEnv("MONGO_URI"),
  REDIS_URL: requireEnv("REDIS_URL"),

  JWT_SECRET: requireEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: requireEnv("JWT_EXPIRES_IN"),
  CORS_ORIGIN: process.env.CORS_ORIGIN || "",
} as const;
