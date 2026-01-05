import { Router } from "express";
import { validate } from "../../validation/validate";
import { healthQuerySchema } from "./health.schema";
import { healthCheck } from "./health.controller";

export const healthRouter = Router();

healthRouter.get(
  "/",
  validate(healthQuerySchema),
  healthCheck
);