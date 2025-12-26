import type { Request, Response } from "express";
import type { HealthQuery } from "./health.schema";

export function healthCheck(req: Request, res: Response) {
  const { verbose } = (req.validated as HealthQuery).query;

  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    ...(verbose && { memory: process.memoryUsage() }),
  });
}
