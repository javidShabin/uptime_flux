import type { Request, Response, NextFunction } from "express";
import { MonitorService } from "./monitor.service";

/**
 * MonitorController
 *
 * Handles HTTP layer only:
 * - Reads request
 * - Calls service
 * - Sends response
 */

export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  // Create monitor
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const monitor = await this.monitorService.createMonitor(req.body)
        res.status(201).json(monitor)
    } catch (error:any) {
        next(error)
    }
  };
}
