import type { FastifyInstance } from "fastify";
import { OrgService } from "./org.service.js";
import { OrgController } from "./org.controller.js";

export default async function orgRoutes(app: FastifyInstance) {
  const service = new OrgService()
  const controller = new OrgController(service)

  // Create organization
  app.post("/create", {preHandler: [app.authenticate]}, controller.createOrg);

  // Get organization by ID
  app.get("/org/:id", {preHandler: [app.authenticate]}, controller.getOrgById);

  // Get organizations list
  app.get("/", {preHandler: [app.authenticate]}, controller.getOrgs);

}

