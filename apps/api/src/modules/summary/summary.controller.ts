import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { SummaryService } from "./summary.service.js";
import { SummaryError } from "./summary.errors.js";
import {
  getMonitorSummarySchema,
  getMonitorSummaryQuerySchema,
  getProjectSummarySchema,
  getProjectSummaryQuerySchema,
  getChecksSchema,
  getChecksQuerySchema,
} from "./summary.schemas.js";

export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  private handleError(error: unknown, request: FastifyRequest, reply: FastifyReply) {
    if (error instanceof SummaryError) {
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

    request.log.error(error, "Summary error");
    return reply.code(500).send({
      error: "Internal server error",
    });
  }

  /**
   * Get monitor summary
   */
  getMonitorSummary = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const params = getMonitorSummarySchema.parse(request.params);
      const query = getMonitorSummaryQuerySchema.parse(request.query);
      const summary = await this.summaryService.getMonitorSummary(params.id, {
        from: query.from,
        to: query.to,
      });
      return reply.code(200).send(summary);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };

  /**
   * Get project summary
   */
  getProjectSummary = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const params = getProjectSummarySchema.parse(request.params);
      const query = getProjectSummaryQuerySchema.parse(request.query);
      const summary = await this.summaryService.getProjectSummary(params.projectId, {
        from: query.from,
        to: query.to,
      });
      return reply.code(200).send(summary);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };

  /**
   * Get checks for a monitor
   */
  getChecks = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const params = getChecksSchema.parse(request.params);
      const query = getChecksQuerySchema.parse(request.query);
      const checks = await this.summaryService.getLastNChecks(params.id, query.limit);
      return reply.code(200).send({ checks });
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };
}

