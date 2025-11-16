import { z } from "zod";
import { Role } from "../rbac/permissions.js";

export const createMemberSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
  role: z.enum([Role.OWNER, Role.MAINTAINER, Role.VIEWER]),
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;

export const updateMemberSchema = z.object({
  role: z.enum([Role.OWNER, Role.MAINTAINER, Role.VIEWER]),
});

export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;

export const getMembersByProjectSchema = z.object({
  projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid project ID"),
});

export type GetMembersByProjectInput = z.infer<typeof getMembersByProjectSchema>;

export const getMembersQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional().default("1").transform((val) => Number(val || "1")),
  limit: z.string().regex(/^\d+$/).optional().default("10").transform((val) => Number(val || "10")),
});

export type GetMembersQueryInput = z.infer<typeof getMembersQuerySchema>;

export const updateMemberByIdSchema = z.object({
  projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid project ID"),
  memberId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid member ID"),
});

export type UpdateMemberByIdInput = z.infer<typeof updateMemberByIdSchema>;

export const deleteMemberSchema = z.object({
  projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid project ID"),
  memberId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid member ID"),
});

export type DeleteMemberInput = z.infer<typeof deleteMemberSchema>;

