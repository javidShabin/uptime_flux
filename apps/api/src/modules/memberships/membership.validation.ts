
import { z } from "zod";

/**
 * Create membership validation
 *
 */
export const memberListSchema = z.object({
  body: z.object({
    projectId: z.string()
  })
})

export const removeMember = z.object({
  body: z.object({
    userId: z.string(),
    projectId: z.string()
  })
})