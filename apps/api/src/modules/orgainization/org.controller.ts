import type { FastifyRequest, FastifyReply } from "fastify";
import { OrgService } from "./org.service.js";
import { OrgError } from "./org.errors.js";
import {
  createOrgSchema,
  updateOrgSchema,
  getOrgByIdSchema,
  getOrgsQuerySchema,
  deleteOrgSchema,
} from "./org.schema.js";

export class OrgController {
  constructor(private readonly orgService: OrgService) {}

  private handleError(error: unknown, request: FastifyRequest, reply: FastifyReply) {
    if (error instanceof OrgError) {
      return reply.code(error.statusCode).send({
        error: error.message,
      });
    }

    if (error instanceof Error && error.name === "ZodError") {
      return reply.code(400).send({
        error: "Validation error",
        details: (error as any).errors
      });
    }
  }

  /**
   * Create a new organization
   */
  createOrg = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as {userId: string}).userId;
      const data = createOrgSchema.parse(request.body);
      const org = await this.orgService.createOrg(userId, data);
      return reply.code(201).send(org);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  }

  /**
   * Get org by id
   */
  getOrgById = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as {userId: string}).userId;
      const params = getOrgByIdSchema.parse(request.params);
      const org = await this.orgService.getOrgById(userId, params.id);
      return reply.code(200).send(org);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  }

  /**
   * Get organizations list
   */
  getOrgs = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;
      const query = getOrgsQuerySchema.parse(request.query);
      const result = await this.orgService.getOrgs(userId, query);
      return reply.code(200).send(result);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };
}

