import type { FastifyInstance } from "fastify";
import { MemberService } from "./member.service.js";
import { MemberController } from "./memeber.controller.js";
import { requireProjectMember } from "../rbac/requireRole.js";
import { Role } from "../rbac/permissions.js";

export default async function memberRoutes(app: FastifyInstance) {
  const service = new MemberService();
  const controller = new MemberController(service);

  // Create member (add user to project)
  app.post(
    "/projects/:projectId/members",
    {
      preHandler: [app.authenticate, requireProjectMember(Role.OWNER)],
    },
    controller.createMember
  );

  // Get members by project
  app.get(
    "/projects/:projectId/members",
    {
      preHandler: [app.authenticate, requireProjectMember(Role.VIEWER)],
    },
    controller.getMembers
  );

  // Update member role
  app.patch(
    "/projects/:projectId/members/:memberId",
    {
      preHandler: [app.authenticate, requireProjectMember(Role.OWNER)],
    },
    controller.updateMember
  );
}
