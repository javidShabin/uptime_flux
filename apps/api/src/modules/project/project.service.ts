import { Types } from "mongoose";
import { ProjectModel, type IProject } from "./project.model.js";
import { ProjectError } from "./project.error.js";
import { MemberModel } from "../member/member.model.js";
import { Role } from "../rbac/permissions.js";

import type {
  CreateProjectInput,
  UpdateProjectInput,
  GetProjectsQueryInput,
} from "./project.schema.js";



export class ProjectService {
  constructor() {}


}

