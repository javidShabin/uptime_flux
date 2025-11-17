import type { FastifyInstance } from "fastify";
import { ProjectService } from "./project.service.js";
import { ProjectController } from "./project.controller.js";
import { requireProjectMember } from "../rbac/requireRole.js";
import { Role } from "../rbac/permissions.js";

export default async function projectRoutes(app: FastifyInstance) {
    const service = new ProjectService();
    const controller = new ProjectController(service);
  
    // Create project in organization
    app.post(
      "/orgs/:orgId/projects",
      { preHandler: [app.authenticate] },
      controller.createProject
    );
  
    // Get projects by organization
    app.get(
      "/orgs/:orgId/projects",
      { preHandler: [app.authenticate] },
      controller.getProjectsByOrg
    );
  
    // Get project by ID
    app.get(
      "/projects/:projectId",
      {
        preHandler: [app.authenticate, requireProjectMember(Role.VIEWER)],
      },
      controller.getProjectById
    );
  
    // Update project
    app.patch(
      "/projects/:projectId",
      {
        preHandler: [app.authenticate, requireProjectMember(Role.MAINTAINER)],
      },
      controller.updateProject
    );
  
    // Delete project
    app.delete(
      "/projects/:projectId",
      {
        preHandler: [app.authenticate, requireProjectMember(Role.OWNER)],
      },
      controller.deleteProject
    );
}

