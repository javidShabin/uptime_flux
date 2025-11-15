import { z } from "zod";

export const profileSchema = z.object({});

export type ProfileInput = z.infer<typeof profileSchema>;

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  name: z.string().min(1).max(100).optional(),
  timezone: z.string().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const getProfileByIdSchema = z.object({
  id: z.string().min(1),
});

export type GetProfileByIdInput = z.infer<typeof getProfileByIdSchema>;

