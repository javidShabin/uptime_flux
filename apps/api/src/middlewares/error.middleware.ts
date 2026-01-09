import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/app-error.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation error",
      issues: err.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    });
  }

  // Business / domain errors
  if (err instanceof AppError) {
    const appError = err as AppError;
    return res.status(appError.statusCode).json({
      error: appError.message,
    });
  }

  // Unknown / programming errors
  console.error("❌ API Error:", err);

  return res.status(500).json({
    error: "Internal Server Error",
  });
}
