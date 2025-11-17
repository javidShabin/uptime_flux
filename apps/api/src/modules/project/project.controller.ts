import type { FastifyRequest, FastifyReply } from "fastify";
import { ProjectService } from "./project.service.js";
import { ProjectError } from "./project.error.js";
import {
  createProjectSchema,
  updateProjectSchema,
  getProjectByIdSchema,
  getProjectsByOrgSchema,
  getProjectsQuerySchema,
  deleteProjectSchema,
} from "./project.schema.js";

export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  private handleError(error: unknown, request: FastifyRequest, reply: FastifyReply) {
    if (error instanceof ProjectError) {
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

    request.log.error(error, "Project error");
    return reply.code(500).send({
      error: "Internal server error",
    });
  }

  /**
   * Create a new project
   */
  createProject = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;
      const params = getProjectsByOrgSchema.parse(request.params);
      const data = createProjectSchema.parse(request.body);
      const project = await this.projectService.createProject(userId, params.orgId, data);
      return reply.code(201).send(project);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };

  /**
   * Get project by ID
   */
  getProjectById = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;
      const params = getProjectByIdSchema.parse(request.params);
      const project = await this.projectService.getProjectById(userId, params.projectId);
      return reply.code(200).send(project);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };

  /**
   * Get projects by organization
   */
  getProjectsByOrg = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;
      const params = getProjectsByOrgSchema.parse(request.params);
      const query = getProjectsQuerySchema.parse(request.query);
      const result = await this.projectService.getProjectsByOrg(userId, params.orgId, query);
      return reply.code(200).send(result);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };

  /**
   * Update project
   */
  updateProject = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;
      const params = getProjectByIdSchema.parse(request.params);
      const data = updateProjectSchema.parse(request.body);
      const project = await this.projectService.updateProject(userId, params.projectId, data);
      return reply.code(200).send(project);
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };

  /**
   * Delete project
   */
  deleteProject = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request.user as { userId: string }).userId;
      const params = deleteProjectSchema.parse(request.params);
      await this.projectService.deleteProject(userId, params.projectId);
      return reply.code(204).send();
    } catch (error) {
      this.handleError(error, request, reply);
    }
  };
}
