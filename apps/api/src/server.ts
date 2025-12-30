import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";


import { healthRouter } from "./modules/health/health.route";
import { v1Router } from "./routes/router";
import { notFound } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/error.middleware";

export function createServer() {
  const app = express();

  // Core middleware
  app.use(helmet());
  app.use(
  cors({
    origin: "http://localhost:3000",
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
