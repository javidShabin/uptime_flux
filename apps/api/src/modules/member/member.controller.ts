import type { FastifyRequest, FastifyReply } from "fastify";
import { MemberService } from "./member.service.js";
import { MemberError } from "./member.error.js";
import {
  createMemberSchema,
  updateMemberSchema,
  getMembersByProjectSchema,
  getMembersQuerySchema,
  updateMemberByIdSchema,
  deleteMemberSchema,
} from "./member.schema.js";

export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  private handleError(error: unknown, request: FastifyRequest, reply: FastifyReply) {
    if (error instanceof MemberError) {
      return reply.code(error.statusCode).send({
        error: error.message,
      });
    }

    if (error instanceof Error && error.name === "ZodError") {
      return reply.code(400).send({
        error: "Validation error",
        details: (error as any).errors,
      });
    }

    request.log.error(error, "Member error");
    return reply.code(500).send({
      error: "Internal server error",
    });
  }

  /**
   * Create a new member
   */
  createMember = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;
      const params = getMembersByProjectSchema.parse(request.params);
      const data = createMemberSchema.parse(request.body);
      const member = await this.memberService.createMember(userId, params.projectId, data);
      return reply.code(201).send(member);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };

   /**
   * Get members by project
   */
   getMembers = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;
      const params = getMembersByProjectSchema.parse(request.params);
      const query = getMembersQuerySchema.parse(request.query);
      const result = await this.memberService.getMembersByProject(userId, params.projectId, query);
      return reply.code(200).send(result);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };

  /**
   * Update member role
   */
  updateMember = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;
      const params = updateMemberByIdSchema.parse(request.params);
      const data = updateMemberSchema.parse(request.body);
      const member = await this.memberService.updateMember(
        userId,
        params.projectId,
        params.memberId,
        data
      );
      return reply.code(200).send(member);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };

  /**
   * Delete member
   */
  deleteMember = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;
      const params = deleteMemberSchema.parse(request.params);
      await this.memberService.deleteMember(userId, params.projectId, params.memberId);
      return reply.code(204).send();
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };
}

