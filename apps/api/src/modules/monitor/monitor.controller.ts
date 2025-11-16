import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { MonitorService } from "./monitor.service.js";
import { MonitorError } from "./monitor.errors.js";
import {
  createMonitorSchema,
  updateMonitorSchema,
  getMonitorByIdSchema,
  getMonitorsQuerySchema,
  deleteMonitorSchema,
  togglePauseMonitorSchema,
} from "./monitor.schemas.js";

export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

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

    request.log.error(error, "Monitor error");
    return reply.code(500).send({
      error: "Internal server error",
    });
  }

  /**
   * Create a new monitor
   */
  createMonitor = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;
      const data = createMonitorSchema.parse(request.body);
      const monitor = await this.monitorService.createMonitor(userId, data);
      return reply.code(201).send(monitor);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };

  /**
   * Get monitor by ID
   */
  getMonitorById = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;
      const params = getMonitorByIdSchema.parse(request.params);
      const monitor = await this.monitorService.getMonitorById(userId, params.id);
      return reply.code(200).send(monitor);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };

  /**
   * Get monitors list with pagination and filters
   */
  getMonitors = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;
      const query = getMonitorsQuerySchema.parse(request.query);
      const result = await this.monitorService.getMonitors(userId, query);
      return reply.code(200).send(result);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };

  /**
   * Update monitor
   */
  updateMonitor = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;
      const params = getMonitorByIdSchema.parse(request.params);
      const data = updateMonitorSchema.parse(request.body);
      const monitor = await this.monitorService.updateMonitor(userId, params.id, data);
      return reply.code(200).send(monitor);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };

  /**
   * Delete monitor
   */
  deleteMonitor = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;
      const params = deleteMonitorSchema.parse(request.params);
      await this.monitorService.deleteMonitor(userId, params.id);
      return reply.code(204).send();
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };

  /**
   * Toggle pause status
   */
  togglePauseMonitor = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;
      const params = togglePauseMonitorSchema.parse(request.params);
      const monitor = await this.monitorService.togglePauseMonitor(userId, params.id);
      return reply.code(200).send(monitor);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };
}

