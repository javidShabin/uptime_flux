import type { FastifyInstance } from "fastify";
import { SummaryService } from "./summary.service.js";
import { SummaryController } from "./summary.controller.js";

export default async function summaryRoutes(app: FastifyInstance) {
  const service = new SummaryService();
  const controller = new SummaryController(service);

  // Get monitor summary
  app.get(
    "/monitors/:id/summary",
    { preHandler: [app.authenticate] },
    controller.getMonitorSummary
  );

  // Get project summary
  app.get(
    "/projects/:projectId/summary",
    { preHandler: [app.authenticate] },
    controller.getProjectSummary
  );

  // Get checks for a monitor
  app.get(
    "/monitors/:id/checks",
    { preHandler: [app.authenticate] },
    controller.getChecks
  );
}

