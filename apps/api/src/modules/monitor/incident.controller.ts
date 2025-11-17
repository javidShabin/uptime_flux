import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { IncidentService } from "./incident.service.js";
import { MonitorError } from "./monitor.errors.js";
import {
  getIncidentsQuerySchema,
  acknowledgeIncidentSchema,
  resolveIncidentSchema,
} from "./incident.schemas.js";

export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  private handleError(error: unknown, request: FastifyRequest, reply: FastifyReply) {
    if (error instanceof MonitorError) {
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

    request.log.error(error, "Incident error");
    return reply.code(500).send({
      error: "Internal server error",
    });
  }

  /**
   * Get incidents list with pagination and filters
   */
  getIncidents = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;
      const query = getIncidentsQuerySchema.parse(request.query);
      const result = await this.incidentService.getIncidents(userId, query);
      return reply.code(200).send(result);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };

  /**
   * Acknowledge an incident
   */
  acknowledgeIncident = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;
      const params = acknowledgeIncidentSchema.parse(request.params);
      const incident = await this.incidentService.acknowledgeIncident(
        params.id,
        userId
      );
      return reply.code(200).send(incident);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };

  /**
   * Resolve an incident
   */
  resolveIncident = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;
      const params = resolveIncidentSchema.parse(request.params);
      const incident = await this.incidentService.resolveIncidentById(
        params.id,
        userId
      );
      return reply.code(200).send(incident);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };
}

