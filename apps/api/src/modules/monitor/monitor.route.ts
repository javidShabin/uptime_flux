import { Router } from "express";
import { MonitorController } from "./monitor.controller";
import { MonitorService } from "./monitor.service";
import { validate } from "../../validation/validate";
import { createMonitorSchema, updateMonitorSchema } from "./monitor.validation";

const router = Router();

// Initialize service and controller
const monitorService = new MonitorService();
const monitorController = new MonitorController(monitorService);

/**
 * POST /monitors
 * Create a new monitor
 */
router.post("/create", validate(createMonitorSchema), monitorController.create);

/**
 * GET /monitors
 * Get all monitors
 */
router.get("/get", monitorController.findAll);

/**
 * PATCH /monitors
 * Update monitor
 */
router.patch(
  "/update/:id",
  validate(updateMonitorSchema),
  monitorController.update
);

/**
 * DELETE /monitors
 * Delete monitor
 */
router.delete("/remove/:id", monitorController.delete);

export const monitorRouter = router;
