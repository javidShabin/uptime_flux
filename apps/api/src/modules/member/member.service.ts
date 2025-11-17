import { Types } from "mongoose";
import { MemberModel, type IMember } from "./member.model.js";
import { MemberError } from "./member.error.js";
import { ProjectModel } from "../project/project.model.js";
import { OrgModel } from "../orgainization/org.model.js";
import { UserModel } from "../authentication/auth.model.js";
import { Role, canAssignRole } from "../rbac/permissions.js";
import { validateRoleAssignment } from "../rbac/requireRole.js";
import type {
  CreateMemberInput,
  UpdateMemberInput,
  GetMembersQueryInput,
} from "./member.schema.js";
export interface MemberResponse {
  id: string;
  orgId: string;
  projectId: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface MembersListResponse {
  members: MemberResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

type MemberEntity = {
  _id: unknown;
  orgId: Types.ObjectId | string;
  projectId: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

export class MemberService {
  constructor() {}

  /**
   * Create a new member
   */
  async createMember(
    userId: string,
    projectId: string,
    data: CreateMemberInput
  ): Promise<MemberResponse> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(projectId)) {
      throw new MemberError(400, "Invalid ID format");
    }

    if (!Types.ObjectId.isValid(data.userId)) {
      throw new MemberError(400, "Invalid user ID format");
    }

    // Verify project exists
    const project = await ProjectModel.findById(projectId).lean();
    if (!project) {
      throw new MemberError(404, "Project not found");
    }

    // Verify target user exists
    const targetUser = await UserModel.findById(data.userId).select("email firstName lastName").lean();
    if (!targetUser) {
      throw new MemberError(404, "User not found");
    }

    // Check if user is org owner or project owner/maintainer
    const org = await OrgModel.findById(project.orgId).lean();
    if (!org) {
      throw new MemberError(404, "Organization not found");
    }

    const isOrgOwner = String(org.ownerId) === userId;
    let userRole: Role | null = null;

    if (!isOrgOwner) {
      const member = await MemberModel.findOne({
        projectId: new Types.ObjectId(projectId),
        userId: new Types.ObjectId(userId),
      }).lean();

      if (!member) {
        throw new MemberError(403, "You don't have permission to add members to this project");
      }

      userRole = member.role as Role;
    } else {
      userRole = Role.OWNER;
    }

    // Validate role assignment
    const validation = validateRoleAssignment(userRole, data.role);
    if (!validation.valid) {
      throw new MemberError(403, validation.error || "Cannot assign this role");
    }

    // Check if member already exists
    const existingMember = await MemberModel.findOne({
      projectId: new Types.ObjectId(projectId),
      userId: new Types.ObjectId(data.userId),
    }).lean();

    if (existingMember) {
      throw new MemberError(409, "User is already a member of this project");
    }

    // Create member
    const member = await MemberModel.create({
      orgId: project.orgId,
      projectId: new Types.ObjectId(projectId),
      userId: new Types.ObjectId(data.userId),
      role: data.role,
    });

    return this.toResponse(member, targetUser.email, `${targetUser.firstName} ${targetUser.lastName}`);
  }
  
  /**
   * Get members by project
   */
  async getMembersByProject(
    userId: string,
    projectId: string,
    query: GetMembersQueryInput
  ): Promise<MembersListResponse> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(projectId)) {
      throw new MemberError(400, "Invalid ID format");
    }

    // Verify project exists
    const project = await ProjectModel.findById(projectId).lean();
    if (!project) {
      throw new MemberError(404, "Project not found");
    }

    // Check if user has access to project
    const org = await OrgModel.findById(project.orgId).lean();
    if (!org) {
      throw new MemberError(404, "Organization not found");
    }

    const isOrgOwner = String(org.ownerId) === userId;
    const isMember = await MemberModel.findOne({
      projectId: new Types.ObjectId(projectId),
      userId: new Types.ObjectId(userId),
    }).lean();

    if (!isOrgOwner && !isMember) {
      throw new MemberError(403, "You don't have access to this project");
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Get total count
    const total = await MemberModel.countDocuments({
      projectId: new Types.ObjectId(projectId),
    });

    // Get members with user info
    const members = await MemberModel.find({
      projectId: new Types.ObjectId(projectId),
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get user details
    const userIds = members.map((m) => m.userId);
    const users = await UserModel.find({
      _id: { $in: userIds },
    })
      .select("email firstName lastName")
      .lean();

    const userMap = new Map(
      users.map((u) => [String(u._id), { email: u.email, name: `${u.firstName} ${u.lastName}` }])
    );

    return {
      members: members.map((member) => {
        const userInfo = userMap.get(String(member.userId));
        return this.toResponse(member, userInfo?.email, userInfo?.name);
      }),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private toResponse(member: MemberEntity, userEmail?: string, userName?: string): MemberResponse {
    const toIdString = (value: unknown): string => {
      if (typeof value === "string") {
        return value;
      }

      if (value instanceof Types.ObjectId) {
        return value.toString();
      }

      return String(value);
    };

    return {
      id: toIdString(member._id),
      orgId: toIdString(member.orgId),
      projectId: toIdString(member.projectId),
      userId: toIdString(member.userId),
      userEmail,
      userName,
      role: member.role,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };
  }
}

