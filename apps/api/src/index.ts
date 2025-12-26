import { createServer } from "./server";
import { env } from "./config/env";

const app = createServer();

const server = app.listen(env.PORT, () => {
  console.log(`🚀 API running on port ${env.PORT}`);
});

async function gracefulShutdown(signal: string) {
  console.log(`⚠️ Received ${signal}. Shutting down...`);

  server.close(() => {
    console.log("✅ HTTP server closed");
    process.exit(0);
  });

  // Failsafe
  setTimeout(() => {
    console.error("❌ Force exiting");
    process.exit(1);
  }, 10_000);
}

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
