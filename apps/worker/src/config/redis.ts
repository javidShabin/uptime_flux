import { Redis } from "ioredis";
import { env } from "./env";

export const redisConnection = {
  connection: {
    url: env.REDIS_URL,
  },
};
