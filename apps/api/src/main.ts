import Fastify from "fastify";
import { env } from "./config/env.js";
import mongoPlugin from "./plugins/db.js";
import redisPlugin from "./plugins/redis.js";
import jwtPlugin from "./plugins/jwt.js";
import cookiePlugin from "./plugins/cookie.js";
import cloudinaryPlugin from "./plugins/cloudinary.js";
import multipart from "@fastify/multipart";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { ZodError } from "zod";
import authenticationRoutes from "./routes/authentication.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import monitorRoutes from "./routes/monitor.routes.js";
import memberRoutes from "./routes/member.routes.js";
import organizationRoutes from "./routes/organization.routes.js";
import projectRoutes from "./routes/project.routes.js";
import summaryRoutes from "./modules/summary/summary.routes.js";
import { createSocketServer } from "./modules/realtime/socket.js";

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
  
  // Security middleware
  await app.register(helmet);
  await app.register(cors, {
    origin: env.NODE_ENV === "production" ? false : true, // Configure allowed origins in production
    credentials: true,
  });
  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });
  
  await app.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });
  await app.register(cloudinaryPlugin);
  
  // Global error handler
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.code(400).send({
        error: "Validation error",
        details: error.issues,
      });
    }
    
    request.log.error(error, "Unhandled error");
    
    const statusCode = error && typeof error === "object" && "statusCode" in error 
      ? (error.statusCode as number) 
      : 500;
    const message = error && typeof error === "object" && "message" in error
      ? (error.message as string)
      : "Internal server error";
    
    return reply.code(statusCode).send({
      error: message,
    });
  });

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

  // Test endpoint - only available in development
  if (env.NODE_ENV === "development") {
    const { monitorQueue } = await import("./queues/index.js");
    app.post("/test-job", async () => {
      await monitorQueue.add("test", {
        monitorId: "123",
        url: "https://google.com",
        timeout: 5000,
      });

      return { ok: true };
    });
  }

  // Register authentication routes
  await app.register(authenticationRoutes);

  // Register profile routes
  await app.register(profileRoutes);

  // Register monitor routes
  await app.register(monitorRoutes);

  // Register member routes
  await app.register(memberRoutes);

  // Register organization routes
  await app.register(organizationRoutes);

  // Register project routes
  await app.register(projectRoutes);

  // Register summary routes
  await app.register(summaryRoutes);

  // Initialize Socket.IO server
  await createSocketServer(app);

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
