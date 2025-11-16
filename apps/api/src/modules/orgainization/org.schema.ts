import { z } from "zod";

export const createOrgSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
});

export type CreateOrgInput = z.infer<typeof createOrgSchema>;

export const updateOrgSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
});

export type UpdateOrgInput = z.infer<typeof updateOrgSchema>;

export const getOrgByIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid organization ID"),
});

export type GetOrgByIdInput = z.infer<typeof getOrgByIdSchema>;

export const getOrgsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number),
  limit: z.string().regex(/^\d+$/).transform(Number),
});

export type GetOrgsQueryInput = z.infer<typeof getOrgsQuerySchema>;

export const deleteOrgSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid organization ID"),
});

export type DeleteOrgInput = z.infer<typeof deleteOrgSchema>;

