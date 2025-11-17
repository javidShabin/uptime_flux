import type { FastifyInstance } from "fastify";
import { AlertPolicyService } from "./alertPolicy.service.js";
import { AlertPolicyController } from "./alertPolicy.controller.js";

export default async function alertPolicyRoutes(app: FastifyInstance) {
  const service = new AlertPolicyService();
  const controller = new AlertPolicyController(service);

  // Get all policies for a project
  app.get(
    "/projects/:projectId/policies",
    { preHandler: [app.authenticate] },
    controller.getPolicies
  );

  // Create a new alert policy
  app.post(
    "/projects/:projectId/policies",
    { preHandler: [app.authenticate] },
    controller.createPolicy
  );

  // Update an alert policy
  app.patch(
    "/policies/:id",
    { preHandler: [app.authenticate] },
    controller.updatePolicy
  );

  // Delete an alert policy
  app.delete(
    "/policies/:id",
    { preHandler: [app.authenticate] },
    controller.deletePolicy
  );
}

