import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";


import { healthRouter } from "./modules/health/health.route.js";
import { v1Router } from "./routes/router.js";
import { notFound } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";


export function createServer() {
  const app = express();

  // Core middleware
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(',') || ["http://localhost:5173"],
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(morgan("dev"));

  // Routes
  app.use("/health", healthRouter);
  app.use("/api/v1", v1Router);

  // Errors
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
