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
  constructor() {}

}

