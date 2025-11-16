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
      throw new OrgError(400, "Invalid user ID formate");
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

  private toResponse(org: IOrg): OrgResponse {
    return {
      id: (org._id as Types.ObjectId).toString(),
      name: org.name,
      slug: org.slug,
      ownerId: org.ownerId.toString(),
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
    };
  }

  /**
   * Check if user is a member of the organization
   */
  private async isOrgMember(userId: string, orgId: string): Promise<boolean> {
    const member = await MemberModel.findOne({
      userId: new Types.ObjectId(userId),
      orgId: new Types.ObjectId(orgId),
    }).lean();

    return !!member;
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
}
