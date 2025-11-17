import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AlertPolicyService } from "./alertPolicy.service.js";
import { AlertPolicyError } from "./alertPolicy.errors.js";
import {
  createAlertPolicySchema,
  updateAlertPolicySchema,
  getPoliciesByProjectSchema,
  updatePolicyByIdSchema,
  deletePolicyByIdSchema,
} from "./alertPolicy.schemas.js";

export class AlertPolicyController {
  constructor(private readonly alertPolicyService: AlertPolicyService) {}

  private handleError(error: unknown, request: FastifyRequest, reply: FastifyReply) {
    if (error instanceof AlertPolicyError) {
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

    request.log.error(error, "Alert policy error");
    return reply.code(500).send({
      error: "Internal server error",
    });
  }

  /**
   * Get all policies for a project
   */
  getPolicies = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const params = getPoliciesByProjectSchema.parse(request.params);
      const policies = await this.alertPolicyService.getPolicies(params.projectId);
      return reply.code(200).send({ policies });
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };

  /**
   * Create a new alert policy
   */
  createPolicy = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const params = getPoliciesByProjectSchema.parse(request.params);
      const data = createAlertPolicySchema.parse(request.body);
      const policy = await this.alertPolicyService.createPolicy(
        params.projectId,
        data
      );
      return reply.code(201).send(policy);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };

  /**
   * Update an alert policy
   */
  updatePolicy = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const params = updatePolicyByIdSchema.parse(request.params);
      const data = updateAlertPolicySchema.parse(request.body);
      const policy = await this.alertPolicyService.updatePolicy(params.id, data);
      return reply.code(200).send(policy);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };

  /**
   * Delete an alert policy
   */
  deletePolicy = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const params = deletePolicyByIdSchema.parse(request.params);
      await this.alertPolicyService.deletePolicy(params.id);
      return reply.code(204).send();
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };
}

