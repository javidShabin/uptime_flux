import { Router } from "express";
import { validate } from "../../validation/validate.js";
import { healthQuerySchema } from "./health.schema.js";
import { healthCheck } from "./health.controller.js";

export const healthRouter = Router();

healthRouter.get(
  "/",
  validate(healthQuerySchema),
  healthCheck
);