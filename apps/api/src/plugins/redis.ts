import fp from "fastify-plugin";
import Redis from "ioredis";
import type { FastifyInstance } from "fastify";
import type { Redis as RedisType } from "ioredis";
import { env } from "../config/env.js";

declare module "fastify" {
  interface FastifyInstance {
    redis: RedisType;
  }
}

async function redisPlugin(app: FastifyInstance) {
  // @ts-expect-error - ioredis default export type issue with NodeNext module resolution
  const client = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 5,
    retryStrategy(times: number) {
      return Math.min(times * 50, 2000);
    },
  });

  client.on("connect", () => {
    app.log.info("🔌 Redis connected");
  });
  
  client.on("error", (err: Error) => {
    app.log.error(err, "❌ Redis error");
  });

  app.decorate("redis", client);

  app.addHook("onClose", async () => {
    await client.quit();
    app.log.info("🔌 Redis connection closed");
  });
}

export default fp(redisPlugin);
