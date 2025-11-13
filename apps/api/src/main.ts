import Fastify from "fastify";
import { env } from "./config/env.js";        // ← ENV loader (from Zod)
import mongoPlugin from "./plugins/db.js"; // ← MongoDB plugin

/**
 * Create Fastify server instance.
 */
export async function createServer() {
  const app = Fastify({
    logger: {
      level: "info",
    },
  });

  // --- Register Plugins ---
  await app.register(mongoPlugin);

  /** Health check route */
  app.get("/health", async () => {
    return {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      env: env.NODE_ENV,
    };
  });

  return app;
}

/**
 * Start the server (only runs when file executed directly)
 */
async function start() {
  const app = await createServer();

  try {
    const port = Number(env.PORT) || 3000;

    await app.listen({
      port,
      host: "0.0.0.0",
    });

    app.log.info(`🚀 Server running at http://localhost:${port}`);
  } catch (err) {
    app.log.error(err, "❌ Failed to start server");
    process.exit(1);
  }

  /** Graceful shutdown */
  const shutdown = async () => {
    app.log.info("⏳ Shutting down...");
    await app.close();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

/**
 * Detect if file is executed directly
 */
if (import.meta.url === new URL(`file://${process.argv[1]}`, import.meta.url).href) {
  start();
}
