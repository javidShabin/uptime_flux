import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

export const getProjectByIdSchema = z.object({
  projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid project ID"),
});

export type GetProjectByIdInput = z.infer<typeof getProjectByIdSchema>;

export const getProjectsByOrgSchema = z.object({
  orgId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid organization ID"),
});

export type GetProjectsByOrgInput = z.infer<typeof getProjectsByOrgSchema>;

export const getProjectsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number),
  limit: z.string().regex(/^\d+$/).transform(Number),
});

export type GetProjectsQueryInput = z.infer<typeof getProjectsQuerySchema>;

export const deleteProjectSchema = z.object({
  projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid project ID"),
});

export type DeleteProjectInput = z.infer<typeof deleteProjectSchema>;

