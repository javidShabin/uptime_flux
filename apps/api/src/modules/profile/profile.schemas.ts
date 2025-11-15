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

export const setupTwoFactorSchema = z.object({});

export const verifyTwoFactorSchema = z.object({
  token: z.string().regex(/^\d{6}$/, "Token must be 6 digits"),
});

export const disableTwoFactorSchema = z.object({
  token: z.string().regex(/^\d{6}$/, "Token must be 6 digits"),
});

export type SetupTwoFactorInput = z.infer<typeof setupTwoFactorSchema>;
export type VerifyTwoFactorInput = z.infer<typeof verifyTwoFactorSchema>;
export type DisableTwoFactorInput = z.infer<typeof disableTwoFactorSchema>;

