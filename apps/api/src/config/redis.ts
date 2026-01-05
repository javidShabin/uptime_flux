import { Redis } from "ioredis";
import { env } from "./env";

let redis: Redis | null = null;

export async function connectRedis(): Promise<Redis> {
  if (redis) return redis;

  redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
  });

  await new Promise<void>((resolve, reject) => {
    redis!.once("ready", () => {
      console.log("✅ Redis connected");
      resolve();
    });

    redis!.once("error", (err) => {
      reject(err);
    });
  });

  return redis;
}

export async function closeRedis() {
  if (!redis) return;

  await redis.quit();
  redis = null;
  console.log("🛑 Redis disconnected");
}
