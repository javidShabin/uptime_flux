import { Router } from "express";
import { z } from "zod";
import { validate } from "../validation/validate.js";

export const healthRouter = Router();

const healthQuerySchema = z.object({
  query: z.object({
    verbose: z
      .string()
      .optional()
      .transform((v) => v === "true"),
  }),
});

healthRouter.get(
  "/",
  validate(healthQuerySchema),
  (req, res) => {
    const { verbose } = (req as any).validated.query;

    res.status(200).json({
      status: "ok",
      uptime: process.uptime(),
      ...(verbose && { memory: process.memoryUsage() }),
    });
  }
);
