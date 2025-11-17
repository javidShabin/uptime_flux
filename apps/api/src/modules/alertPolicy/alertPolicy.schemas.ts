import { z } from "zod";

// Telegram channel schema
const telegramChannelSchema = z.object({
  botToken: z.string().min(1).trim(),
  chatId: z.string().min(1).trim(),
});

// WhatsApp channel schema
const whatsappChannelSchema = z.object({
  phoneNumber: z.string().min(1).trim(),
  apiKey: z.string().min(1).trim(),
});

// Channels schema
const channelsSchema = z.object({
  email: z.array(z.string().email()).min(1, "At least one email is required"),
  telegram: telegramChannelSchema.optional(),
  whatsapp: whatsappChannelSchema.optional(),
  webhook: z.array(z.string().url()).optional(),
});

// Rules schema
const rulesSchema = z.object({
  failConsecutive: z.number().int().min(1).default(1),
  recoverConsecutive: z.number().int().min(1).default(1),
  escalateAfterMin: z.number().int().min(0).default(0),
});

// Create Alert Policy Schema
export const createAlertPolicySchema = z.object({
  name: z.string().min(1).max(100).trim(),
  rules: rulesSchema,
  channels: channelsSchema,
});

export type CreateAlertPolicyInput = z.infer<typeof createAlertPolicySchema>;

// Update Alert Policy Schema
export const updateAlertPolicySchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  rules: rulesSchema.optional(),
  channels: channelsSchema.optional(),
});

export type UpdateAlertPolicyInput = z.infer<typeof updateAlertPolicySchema>;

// Get Policies by Project Schema (params)
export const getPoliciesByProjectSchema = z.object({
  projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid project ID"),
});

export type GetPoliciesByProjectInput = z.infer<typeof getPoliciesByProjectSchema>;

// Update Policy by ID Schema (params)
export const updatePolicyByIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid policy ID"),
});

export type UpdatePolicyByIdInput = z.infer<typeof updatePolicyByIdSchema>;

// Delete Policy by ID Schema (params)
export const deletePolicyByIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid policy ID"),
});

export type DeletePolicyByIdInput = z.infer<typeof deletePolicyByIdSchema>;

