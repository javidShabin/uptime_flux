import type { FastifyInstance } from "fastify";
import { MemberService } from "./member.service.js";
import { MemberController } from "./memeber.controller.js";
import { requireProjectMember } from "../rbac/requireRole.js";
import { Role } from "../rbac/permissions.js";

export default async function memberRoutes(app: FastifyInstance) {
  
  
}

