import { Types } from "mongoose";
import { ProjectModel, type IProject } from "./project.model.js";
import { ProjectError } from "./project.error.js";
import { MemberModel } from "../member/member.model.js";
import { Role } from "../rbac/permissions.js";
import { OrgModel } from "../orgainization/org.model.js";

import type {
  CreateProjectInput,
  UpdateProjectInput,
  GetProjectsQueryInput,
} from "./project.schema.js";

export interface ProjectResponse {
  id: string;
  orgId: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectsListResponse {
  projects: ProjectResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Generate slug from name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generate unique slug within organization
 */
async function generateUniqueSlug(orgId: Types.ObjectId, baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (
    await ProjectModel.findOne({
      orgId,
      slug,
    }).lean()
  ) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

type ProjectEntity = {
  _id: unknown;
  orgId: Types.ObjectId | string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

export class ProjectService {
  constructor() {}

  /**
   * Check if user can manage project (org owner or project maintainer/owner)
   */
  async canManageProject(userId: string, projectId: string): Promise<boolean> {
    const project = await ProjectModel.findById(projectId).lean();
    if (!project) {
      return false;
    }

    // Check if user is org owner
    const org = await OrgModel.findById(project.orgId).lean();
    if (!org) {
      return false;
    }

    if (String(org.ownerId) === userId) {
      return true;
    }

    // Check if user is project member with maintainer/owner role
    const member = await MemberModel.findOne({
      projectId: new Types.ObjectId(projectId),
      userId: new Types.ObjectId(userId),
    }).lean();

    if (!member) {
      return false;
    }

    return member.role === Role.OWNER || member.role === Role.MAINTAINER;
  }

  /**
   * Check if user can delete project (only org owner or project owner)
   */
  async canDeleteProject(userId: string, projectId: string): Promise<boolean> {
    const project = await ProjectModel.findById(projectId).lean();
    if (!project) {
      return false;
    }

    // Check if user is org owner
    const org = await OrgModel.findById(project.orgId).lean();
    if (!org) {
      return false;
    }

    if (String(org.ownerId) === userId) {
      return true;
    }

    // Check if user is project owner
    const member = await MemberModel.findOne({
      projectId: new Types.ObjectId(projectId),
      userId: new Types.ObjectId(userId),
    }).lean();

    return member?.role === Role.OWNER;
  }

  /**
   * Check if user has access to project (org owner or project member)
   */
  async hasProjectAccess(userId: string, projectId: string): Promise<boolean> {
    const project = await ProjectModel.findById(projectId).lean();
    if (!project) {
      return false;
    }

    // Check if user is org owner
    const org = await OrgModel.findById(project.orgId).lean();
    if (!org) {
      return false;
    }

    if (String(org.ownerId) === userId) {
      return true;
    }

    // Check if user is project member
    const member = await MemberModel.findOne({
      projectId: new Types.ObjectId(projectId),
      userId: new Types.ObjectId(userId),
    }).lean();

    return !!member;
  }

  /**
   * Create a new project
   */
  async createProject(
    userId: string,
    orgId: string,
    data: CreateProjectInput
  ): Promise<ProjectResponse> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(orgId)) {
      throw new ProjectError(400, "Invalid ID format");
    }

    // Verify organization exists
    const org = await OrgModel.findById(orgId).lean();
    if (!org) {
      throw new ProjectError(404, "Organization not found");
    }

    // Check if user is org owner or member
    const isOwner = String(org.ownerId) === userId;
    if (!isOwner) {
      // Check if user is member of any project in org
      const projects = await ProjectModel.find({ orgId: new Types.ObjectId(orgId) })
        .select("_id")
        .lean();
      const projectIds = projects.map((p) => p._id as Types.ObjectId);

      const member = await MemberModel.findOne({
        userId: new Types.ObjectId(userId),
        projectId: { $in: projectIds },
      }).lean();

      if (!member) {
        throw new ProjectError(403, "You must be a member of the organization to create projects");
      }
    }

    // Generate slug if not provided
    let slug = data.slug || generateSlug(data.name);
    slug = await generateUniqueSlug(new Types.ObjectId(orgId), slug);

    const project = await ProjectModel.create({
      orgId: new Types.ObjectId(orgId),
      name: data.name,
      slug,
    });

    // If user is org owner, create owner member record
    if (isOwner) {
      await MemberModel.create({
        orgId: new Types.ObjectId(orgId),
        projectId: project._id,
        userId: new Types.ObjectId(userId),
        role: Role.OWNER,
      });
    }

    return this.toResponse(project as ProjectEntity);
  }

  /**
   * Get project by ID
   */
  async getProjectById(userId: string, projectId: string): Promise<ProjectResponse> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(projectId)) {
      throw new ProjectError(400, "Invalid ID format");
    }

    const project = await ProjectModel.findById(projectId).lean();

    if (!project) {
      throw new ProjectError(404, "Project not found");
    }

    // Check access
    const hasAccess = await this.hasProjectAccess(userId, projectId);
    if (!hasAccess) {
      throw new ProjectError(403, "You don't have access to this project");
    }

    return this.toResponse(project as ProjectEntity);
  }

  /**
   * Get projects by organization
   */
  async getProjectsByOrg(
    userId: string,
    orgId: string,
    query: GetProjectsQueryInput
  ): Promise<ProjectsListResponse> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(orgId)) {
      throw new ProjectError(400, "Invalid ID format");
    }

    // Verify organization exists
    const org = await OrgModel.findById(orgId).lean();
    if (!org) {
      throw new ProjectError(404, "Organization not found");
    }

    // Check if user is org owner or member
    const isOwner = String(org.ownerId) === userId;
    if (!isOwner) {
      const projects = await ProjectModel.find({ orgId: new Types.ObjectId(orgId) })
        .select("_id")
        .lean();
      const projectIds = projects.map((p) => p._id as Types.ObjectId);

      const member = await MemberModel.findOne({
        userId: new Types.ObjectId(userId),
        projectId: { $in: projectIds },
      }).lean();

      if (!member) {
        throw new ProjectError(403, "You don't have access to this organization");
      }
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Get projects user has access to
    let accessibleProjectIds: Types.ObjectId[];

    if (isOwner) {
      // Org owner can see all projects
      const allProjects = await ProjectModel.find({ orgId: new Types.ObjectId(orgId) })
        .select("_id")
        .lean();
      accessibleProjectIds = allProjects.map((p) => p._id as Types.ObjectId);
    } else {
      // Get projects where user is member
      const memberRecords = await MemberModel.find({
        userId: new Types.ObjectId(userId),
      })
        .select("projectId")
        .lean();

      const userProjectIds = memberRecords.map((m) => m.projectId as Types.ObjectId);

      // Filter to only projects in this org
      const orgProjects = await ProjectModel.find({
        orgId: new Types.ObjectId(orgId),
        _id: { $in: userProjectIds },
      })
        .select("_id")
        .lean();

      accessibleProjectIds = orgProjects.map((p) => p._id as Types.ObjectId);
    }

    // Get total count
    const total = accessibleProjectIds.length;

    // Get projects
    const projects = await ProjectModel.find({
      _id: { $in: accessibleProjectIds },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      projects: projects.map((project) => this.toResponse(project as ProjectEntity)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update project
   */
  async updateProject(
    userId: string,
    projectId: string,
    data: UpdateProjectInput
  ): Promise<ProjectResponse> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(projectId)) {
      throw new ProjectError(400, "Invalid ID format");
    }

    const project = await ProjectModel.findById(projectId);

    if (!project) {
      throw new ProjectError(404, "Project not found");
    }

    // Check if user can manage project
    const canManage = await this.canManageProject(userId, projectId);
    if (!canManage) {
      throw new ProjectError(403, "You don't have permission to update this project");
    }

    // Update fields
    if (data.name !== undefined) {
      project.name = data.name;
    }

    if (data.slug !== undefined) {
      // Validate slug
      if (!/^[a-z0-9-]+$/.test(data.slug)) {
        throw new ProjectError(400, "Invalid slug format");
      }

      // Check if slug is already taken in this org
      const existingProject = await ProjectModel.findOne({
        orgId: project.orgId,
        slug: data.slug,
        _id: { $ne: projectId },
      }).lean();

      if (existingProject) {
        throw new ProjectError(409, "Slug already taken in this organization");
      }

      project.slug = data.slug;
    }

    await project.save();

    return this.toResponse(project as ProjectEntity);
  }

  /**
   * Delete project
   */
  async deleteProject(userId: string, projectId: string): Promise<void> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(projectId)) {
      throw new ProjectError(400, "Invalid ID format");
    }

    const project = await ProjectModel.findById(projectId).lean();

    if (!project) {
      throw new ProjectError(404, "Project not found");
    }

    // Check if user can delete project
    const canDelete = await this.canDeleteProject(userId, projectId);
    if (!canDelete) {
      throw new ProjectError(403, "Only organization owner or project owner can delete projects");
    }

    // Delete all members
    await MemberModel.deleteMany({
      projectId: new Types.ObjectId(projectId),
    });

    // Delete project
    await ProjectModel.deleteOne({ _id: new Types.ObjectId(projectId) });
  }

  /**
   * Convert project document to response format
   */
  private toResponse(project: ProjectEntity): ProjectResponse {
    return {
      id: String(project._id),
      orgId: String(project.orgId),
      name: project.name,
      slug: project.slug,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}

