import Fastify from "fastify";
import { env } from "./config/env.js";
import mongoPlugin from "./plugins/db.js";
import redisPlugin from "./plugins/redis.js";
import { monitorQueue } from "./queues/index.js";
import jwtPlugin from "./plugins/jwt.js";
import cookiePlugin from "./plugins/cookie.js";
import cloudinaryPlugin from "./plugins/cloudinary.js";
import multipart from "@fastify/multipart";
import authenticationRoutes from "./modules/authentication/auth.routes.js";
import profileRoutes from "./modules/profile/profile.routes.js";
import monitorRoutes from "./modules/monitor/monitor.routes.js";

export async function createServer() {
  const app = Fastify({
    logger: { level: "info" },
    bodyLimit: 1048576, // 1MB
  });

  // --- Register Plugins FIRST ---
  await app.register(mongoPlugin);
  await app.register(redisPlugin);
  await app.register(cookiePlugin);
  await app.register(jwtPlugin);
  await app.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });
  await app.register(cloudinaryPlugin);

  // --- THEN Register Routes ---
  app.get("/health", async () => {
    return {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      env: env.NODE_ENV,
      redis: app.redis?.status || "unknown",
    };
  });

  app.post("/test-job", async () => {
    await monitorQueue.add("test", {
      monitorId: "123",
      url: "https://google.com",
      timeout: 5000,
    });

    return { ok: true };
  });

  // Register authentication routes
  await app.register(authenticationRoutes, { prefix: "/auth" });

  // Register profile routes
  await app.register(profileRoutes, { prefix: "/profile" });

  // Register monitor routes
  await app.register(monitorRoutes, { prefix: "/monitors" });

  return app;
}

async function start() {
  const app = await createServer();

  try {
    const port = Number(env.PORT) || 3000;

    await app.listen({ port, host: "0.0.0.0" });

    app.log.info(`🚀 Server running at http://localhost:${port}`);
  } catch (err) {
    app.log.error(err, "❌ Failed to start server");
    process.exit(1);
  }

  const shutdown = async () => {
    app.log.info("⏳ Shutting down...");
    await app.close();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

if (import.meta.url === new URL(`file://${process.argv[1]}`, import.meta.url).href) {
  start();
}
