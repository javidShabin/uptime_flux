import { Types } from "mongoose";
import { MemberModel, type IMember } from "./member.model.js";
import { MemberError } from "./member.error.js";
import { ProjectModel } from "../project/project.model.js";
import { OrgModel } from "../org/org.model.js";
import { UserModel } from "../authentication/auth.model.js";
import { Role, canAssignRole } from "../rbac/permissions.js";
import { validateRoleAssignment } from "../rbac/requireRole.js";
import type {
  CreateMemberInput,
  UpdateMemberInput,
  GetMembersQueryInput,
} from "./member.schema.js";

export class MemberService {
  constructor() {}

}

