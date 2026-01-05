import { createServer } from "./server.js";
import { env } from "./config/env.js";
import { connectMongo, disconnectMongo } from "./config/mongo.js";
import { closeRedis, connectRedis } from "./config/redis.js";

async function bootstrap() {
  // 1️⃣ Connect infrastructure first
  await connectMongo();
  await connectRedis();

  // 2️⃣ Create express app
  const app = createServer();

  // 3️⃣ Start HTTP server
  const server = app.listen(env.PORT, () => {
    console.log(`🚀 API running on port ${env.PORT}`);
  });

  // 4️⃣ Graceful shutdown
  async function gracefulShutdown(signal: string) {
    console.log(`⚠️ Received ${signal}. Shutting down...`);

    // Stop accepting new connections
    server.close(async () => {
      console.log("✅ HTTP server closed");

      try {
        await closeRedis();
        await disconnectMongo();
        console.log("✅ Mongo & Redis disconnected");
        process.exit(0);
      } catch (err) {
        console.error("❌ Error during shutdown", err);
        process.exit(1);
      }
    });

    // Failsafe (force exit)
    setTimeout(() => {
      console.error("❌ Force exiting after timeout");
      process.exit(1);
    }, 10_000);
  }

  process.on("SIGTERM", gracefulShutdown);
  process.on("SIGINT", gracefulShutdown);
}

// 5️⃣ Start application
bootstrap().catch((err) => {
  console.error("❌ Failed to start server", err);
  process.exit(1);
});
