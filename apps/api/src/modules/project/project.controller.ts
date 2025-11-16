import type { FastifyRequest, FastifyReply } from "fastify";
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
  constructor() {}

  
}
