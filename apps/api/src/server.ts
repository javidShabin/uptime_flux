import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";


import { healthRouter } from "./modules/health/health.route";
import { notFound } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/error.middleware";

export function createServer() {
  const app = express();

  // Core middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  // Routes
  app.use("/health", healthRouter);

  // Errors
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
