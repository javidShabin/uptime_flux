import { z } from "zod";

/**
 * Create monitor validation
 */
export const createMonitorSchema = z.object({
  body: z.object({
    url: z.string().url(),
    interval: z.number().min(30),
  }),
});

export type CreateMonitorBody = z.infer<typeof createMonitorSchema>["body"];

/**
 * Update monitor validation
 */
export const updateMonitorSchema = z.object({
  body: z.object({
    url: z.string().url().optional(),
    interval: z.number().min(30).optional(),
    isActive: z.boolean().optional(),
  }),
});

export type UpdateMonitorBody = z.infer<typeof updateMonitorSchema>["body"];
