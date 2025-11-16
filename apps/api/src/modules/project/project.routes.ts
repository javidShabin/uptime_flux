import type { FastifyInstance } from "fastify";
import { ProjectService } from "./project.service.js";
import { ProjectController } from "./project.controller.js";
import { requireProjectMember } from "../rbac/requireRole.js";
import { Role } from "../rbac/permissions.js";

export default async function projectRoutes(app: FastifyInstance) {
  
}

