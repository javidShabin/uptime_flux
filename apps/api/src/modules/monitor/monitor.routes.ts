import type { FastifyInstance } from "fastify";
import { MonitorService } from "./monitor.service.js";
import { MonitorController } from "./monitor.controller.js";

export default async function monitorRoutes(app: FastifyInstance) {
  const service = new MonitorService();
  const controller = new MonitorController(service);

  // Get all monitors (with pagination and filters)
  app.get("/", { preHandler: [app.authenticate] }, controller.getMonitors);

  // Get monitor by ID
  app.get("/:id", { preHandler: [app.authenticate] }, controller.getMonitorById);

  // Create new monitor
  app.post("/", { preHandler: [app.authenticate] }, controller.createMonitor);

  // Update monitor
  app.put("/:id", { preHandler: [app.authenticate] }, controller.updateMonitor);

  // Delete monitor
  app.delete("/:id", { preHandler: [app.authenticate] }, controller.deleteMonitor);

  // Toggle pause status
  app.patch("/:id/pause", { preHandler: [app.authenticate] }, controller.togglePauseMonitor);
}

