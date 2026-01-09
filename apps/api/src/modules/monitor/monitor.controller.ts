import type { Request, Response, NextFunction } from "express";
import { MonitorService } from "./monitor.service.js";
import type { CreateMonitorBody } from "./monitor.validation.js";

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
         if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
      const monitor = await this.monitorService.createMonitor(
        req.user!.id,
        body
      );
      res.status(201).json(monitor);
    } catch (error: unknown) {
      next(error);
    }
  };

  /**
   * Get all monitors
   */

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const monitors = await this.monitorService.getAllMonitors(req.user!.id);
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

      const monitor = await this.monitorService.updateMonitor(
        req.user!.id,
        id,
        req.body
      );

      res.json(monitor);
    } catch (error: any) {
      next(error);
    }
  };

  /**
   * Update monitor
   */
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Monitor id is required" });
      }

      await this.monitorService.deleteMonitor(req.user!.id, id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
