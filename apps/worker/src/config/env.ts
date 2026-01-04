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
  MONGO_URI: requireEnv("MONGO_URI"),
  REDIS_URL: requireEnv("REDIS_URL"),
};
