import type { FastifyRequest, FastifyReply } from "fastify";
import { Types } from "mongoose";
import { MemberModel } from "../../modules/member/member.model.js";
import { ProjectModel } from "../../modules/project/project.model.js";
import { OrgModel } from "../../modules/orgainization/org.model.js";
import { Role, type Role as RoleType, canAssignRole, hasPermission } from "./permissions.js";

export interface MemberContext {
  memberId: string;
  userId: string;
  orgId: string;
  projectId: string;
  role: RoleType;
}

declare module "fastify" {
  interface FastifyRequest {
    member?: MemberContext;
  }
}

/**
 * Middleware to require user to be a member of a project
 */
export function requireProjectMember(
  minRole: RoleType = Role.VIEWER
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;
      const { projectId } = request.params as { projectId: string };

      if (!Types.ObjectId.isValid(projectId)) {
        return reply.code(400).send({ error: "Invalid project ID format" });
      }

      if (!Types.ObjectId.isValid(userId)) {
        return reply.code(400).send({ error: "Invalid user ID format" });
      }

      // Find project
      const project = await ProjectModel.findById(projectId).lean();
      if (!project) {
        return reply.code(404).send({ error: "Project not found" });
      }

      // Check if user is org owner (org owners have full access)
      const org = await OrgModel.findById(project.orgId).lean();
      if (!org) {
        return reply.code(404).send({ error: "Organization not found" });
      }

      if (String(org.ownerId) === userId) {
        // Org owner has owner role on all projects
        request.member = {
          memberId: "",
          userId,
          orgId: String(project.orgId),
          projectId,
          role: Role.OWNER,
        };
        return;
      }

      // Find member record
      const member = await MemberModel.findOne({
        projectId: new Types.ObjectId(projectId),
        userId: new Types.ObjectId(userId),
      }).lean();

      if (!member) {
        return reply.code(403).send({ error: "You are not a member of this project" });
      }

      // Check if user has required role
      if (!hasPermission(member.role as RoleType, minRole)) {
        return reply.code(403).send({
          error: `This action requires ${minRole} role or higher`,
        });
      }

      // Attach member context to request
      request.member = {
        memberId: String(member._id),
        userId,
        orgId: String(project.orgId),
        projectId,
        role: member.role as RoleType,
      };
    } catch (error) {
      request.log.error(error, "Error in requireProjectMember");
      return reply.code(500).send({ error: "Internal server error" });
    }
  };
}

/**
 * Middleware to require user to be org owner or project member with specific role
 */
export function requireOrgOwnerOrProjectRole(minRole: RoleType = Role.VIEWER) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;
      const { projectId } = request.params as { projectId: string };

      if (!Types.ObjectId.isValid(projectId)) {
        return reply.code(400).send({ error: "Invalid project ID format" });
      }

      if (!Types.ObjectId.isValid(userId)) {
        return reply.code(400).send({ error: "Invalid user ID format" });
      }

      // Find project
      const project = await ProjectModel.findById(projectId).lean();
      if (!project) {
        return reply.code(404).send({ error: "Project not found" });
      }

      // Check if user is org owner
      const org = await OrgModel.findById(project.orgId).lean();
      if (!org) {
        return reply.code(404).send({ error: "Organization not found" });
      }

      if (String(org.ownerId) === userId) {
        request.member = {
          memberId: "",
          userId,
          orgId: String(project.orgId),
          projectId,
          role: Role.OWNER,
        };
        return;
      }

      // Check project membership
      const member = await MemberModel.findOne({
        projectId: new Types.ObjectId(projectId),
        userId: new Types.ObjectId(userId),
      }).lean();

      if (!member) {
        return reply.code(403).send({ error: "You are not a member of this project" });
      }

      if (!hasPermission(member.role as RoleType, minRole)) {
        return reply.code(403).send({
          error: `This action requires ${minRole} role or higher`,
        });
      }

      request.member = {
        memberId: String(member._id),
        userId,
        orgId: String(project.orgId),
        projectId,
        role: member.role as RoleType,
      };
    } catch (error) {
      request.log.error(error, "Error in requireOrgOwnerOrProjectRole");
      return reply.code(500).send({ error: "Internal server error" });
    }
  };
}

/**
 * Helper to check if user can assign a role
 */
export function validateRoleAssignment(
  userRole: RoleType,
  targetRole: RoleType
): { valid: boolean; error?: string } {
  if (!canAssignRole(userRole, targetRole)) {
    return {
      valid: false,
      error: `You cannot assign ${targetRole} role. Your role: ${userRole}`,
    };
  }
  return { valid: true };
}

