import { Types } from "mongoose";
import { OrgModel, type IOrg } from "./org.model.js";
import { OrgError } from "./org.errors.js";
import { MemberModel } from "../member/member.model.js";
import { ProjectModel } from "../project/project.model.js";
import type { CreateOrgInput, UpdateOrgInput, GetOrgsQueryInput } from "./org.schema.js";

export class OrgService {
  constructor() {}

}
