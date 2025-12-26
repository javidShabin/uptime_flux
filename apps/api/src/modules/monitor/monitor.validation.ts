import { z } from "zod";

/**
 * Create monitor validation
 */
export const createMonitorSchema = z.object({
  url: z.string().url(),
  interval: z.number().min(30),
});

/**
 * Update monitor validation
 */
export const updateMonitorSchema = z.object({
  url: z.string().url().optional(),
  interval: z.number().min(30).optional(),
  isActive: z.boolean().optional(),
});
