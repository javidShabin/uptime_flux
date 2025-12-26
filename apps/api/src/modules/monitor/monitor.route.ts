import { Router } from "express";
import { MonitorController } from "./monitor.controller";
import { MonitorService } from "./monitor.service";
import { validate } from "../../validation/validate";
import { createMonitorSchema } from "./monitor.validation";

const router = Router();

// Initialize service and controller
const monitorService = new MonitorService();
const monitorController = new MonitorController(monitorService);

/**
 * POST /monitors
 * Create a new monitor
 */
router.post(
  "/create",
  validate(createMonitorSchema),
  monitorController.create
);

/**
 * GET /monitors
 * Get all monitors
 */
router.get("/get",
  monitorController.findAll
)

export const monitorRouter = router;