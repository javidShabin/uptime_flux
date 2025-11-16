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
  constructor() {}

}
