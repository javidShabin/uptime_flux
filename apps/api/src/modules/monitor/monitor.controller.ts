import type { Request, Response, NextFunction } from "express";
import { MonitorService } from "./monitor.service";
import type { CreateMonitorBody } from "./monitor.validation";

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

  /**
   * Create monitor
   */
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req.validated as { body: CreateMonitorBody };
      const monitor = await this.monitorService.createMonitor(body);
      res.status(201).json(monitor);
    } catch (error: unknown) {
      next(error);
    }
  };

  /**
   * Get all monitors
   */

  findAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const monitors = await this.monitorService.getAllMonitors();
      res.json(monitors);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Update monitor
   */
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Monitor id is required" });
      }

      const monitor = await this.monitorService.updateMonitor(id, req.body);

      res.json(monitor);
    } catch (error: any) {
      next(error);
    }
  };
}
