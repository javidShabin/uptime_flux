import { Types } from "mongoose";
import { OrgModel, type IOrg } from "./org.model.js";
import { OrgError } from "./org.errors.js";
import { MemberModel } from "../member/member.model.js";
import { ProjectModel } from "../project/project.model.js";
import type {
  CreateOrgInput,
  UpdateOrgInput,
  GetOrgsQueryInput,
} from "./org.schema.js";

export interface OrgResponse {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrgsListResponse {
  orgs: OrgResponse[];
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
 * Generate unique slug
 */
async function generateUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let count = 1;

  while (await OrgModel.findOne({ slug }).lean()) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
}
export class OrgService {
  constructor() {}

  /**
   * Create a new organization
   */
  async createOrg(userId: string, data: CreateOrgInput): Promise<OrgResponse> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new OrgError(400, "Invalid user ID format");
    }

    // Generate slug if not provided
    let slug = data.slug || generateSlug(data.name);
    slug = await generateUniqueSlug(slug);

    // Check if slug is valid
    if (!/^[a-z0-9-]+$/.test(slug)) {
      throw new OrgError(400, "Invalid slug format");
    }

    const org = await OrgModel.create({
      name: data.name,
      slug,
      ownerId: new Types.ObjectId(userId),
    });

    return this.toResponse(org);
  }

  /**
   * Get organization by Id (with ownership checking)
   */
  async getOrgById(userId: string, orgId: string): Promise<OrgResponse> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(orgId)) {
      throw new OrgError(400, "Invalid ID format");
    }

    const org = await OrgModel.findById(orgId);

    if (!org) {
      throw new OrgError(404, "Organization not found");
    }

    const isOwner = String(org.ownerId) === userId;
    const isMember = await this.isOrgMember(userId, orgId);
    if (!isOwner && !isMember) {
      throw new OrgError(403, "You don't have access to this organization");
    }

    return this.toResponse(org);
  }

  /**
   * Get organizations where user is owner or member
   */
  async getOrgs(userId: string, query: GetOrgsQueryInput): Promise<OrgsListResponse> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new OrgError(400, "Invalid user ID format");
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Get orgs where user is owner
    const ownedOrgs = await OrgModel.find({ ownerId: new Types.ObjectId(userId) })
      .select("_id")
      .lean();

    const ownedOrgIds = ownedOrgs.map((org) => org._id);

    // Get orgs where user is a member (through projects)
    const memberRecords = await MemberModel.find({
      userId: new Types.ObjectId(userId),
    })
      .select("projectId")
      .lean();

    const projectIds = memberRecords.map((m) => m.projectId);
    const projects = await ProjectModel.find({
      _id: { $in: projectIds },
    })
      .select("orgId")
      .lean();

    const memberOrgIds = [...new Set(projects.map((p) => String(p.orgId)))];

    // Combine and get unique org IDs
    const allOrgIds = [
      ...ownedOrgIds.map((id) => String(id)),
      ...memberOrgIds,
    ];
    const uniqueOrgIds = [...new Set(allOrgIds)].map((id) => new Types.ObjectId(id));

    // Get total count
    const total = await OrgModel.countDocuments({
      _id: { $in: uniqueOrgIds },
    });

    // Get orgs
    const orgs = await OrgModel.find({
      _id: { $in: uniqueOrgIds },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      orgs: orgs.map((org: any) => ({
        id: String(org._id),
        name: org.name,
        slug: org.slug,
        ownerId: String(org.ownerId),
        createdAt: org.createdAt,
        updatedAt: org.updatedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  /**
   * Update organization (only owner can update)
   */
  async updateOrg(userId: string, orgId: string, data: UpdateOrgInput): Promise<OrgResponse> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(orgId)) {
      throw new OrgError(400, "Invalid ID format");
    }

    const org = await OrgModel.findById(orgId);

    if (!org) {
      throw new OrgError(404, "Organization not found");
    }

    // Check ownership
    if (String(org.ownerId) !== userId) {
      throw new OrgError(403, "Only organization owner can update");
    }

    // Update fields
    if (data.name !== undefined) {
      org.name = data.name;
    }

    if (data.slug !== undefined) {
      // Validate slug
      if (!/^[a-z0-9-]+$/.test(data.slug)) {
        throw new OrgError(400, "Invalid slug format");
      }

      // Check if slug is already taken
      const existingOrg = await OrgModel.findOne({
        slug: data.slug,
        _id: { $ne: orgId },
      }).lean();

      if (existingOrg) {
        throw new OrgError(409, "Slug already taken");
      }

      org.slug = data.slug;
    }

    await org.save();

    return this.toResponse(org);
  }

  /**
   * Delete organization (only owner can delete)
   */
  async deleteOrg(userId: string, orgId: string): Promise<void> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(orgId)) {
      throw new OrgError(400, "Invalid ID format");
    }

    const org = await OrgModel.findById(orgId).lean();

    if (!org) {
      throw new OrgError(404, "Organization not found");
    }

    // Check ownership
    if (String(org.ownerId) !== userId) {
      throw new OrgError(403, "Only organization owner can delete");
    }

    // Check if org has projects
    const projectCount = await ProjectModel.countDocuments({
      orgId: new Types.ObjectId(orgId),
    });

    if (projectCount > 0) {
      throw new OrgError(400, "Cannot delete organization with existing projects. Please delete projects first.");
    }

    await OrgModel.deleteOne({ _id: new Types.ObjectId(orgId) });
  }

  /**
   * Check if user is a member of organization (through projects)
   */
  async isOrgMember(userId: string, orgId: string): Promise<boolean> {
    // Get all projects in org
    const projects = await ProjectModel.find({
      orgId: new Types.ObjectId(orgId),
    })
      .select("_id")
      .lean();

    if (projects.length === 0) {
      return false;
    }

    const projectIds = projects.map((p) => p._id);

    // Check if user is member of any project
    const member = await MemberModel.findOne({
      userId: new Types.ObjectId(userId),
      projectId: { $in: projectIds },
    }).lean();

    return !!member;
  }

  /**
   * Convert org document to response format
   */
  private toResponse(org: IOrg): OrgResponse {
    return {
      id: String(org._id),
      name: org.name,
      slug: org.slug,
      ownerId: String(org.ownerId),
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
    };
  }
}

