import type { FastifyInstance } from "fastify";
import { IncidentService } from "./incident.service.js";
import { IncidentController } from "./incident.controller.js";

export default async function incidentRoutes(app: FastifyInstance) {
  const service = new IncidentService();
  const controller = new IncidentController(service);

  // Get all incidents (with pagination and filters)
  app.get("/", { preHandler: [app.authenticate] }, controller.getIncidents);

  // Acknowledge incident
  app.post(
    "/:id/ack",
    { preHandler: [app.authenticate] },
    controller.acknowledgeIncident
  );

  // Resolve incident
  app.post(
    "/:id/resolve",
    { preHandler: [app.authenticate] },
    controller.resolveIncident
  );
}

