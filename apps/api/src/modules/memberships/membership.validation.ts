
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