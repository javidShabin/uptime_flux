import { z } from "zod";

/**
 * Create project validation
 *
 */

export const createProjectSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, "Project name must be at least 3 characters")
      .max(100),
  }),
});

export type CreateProjectBody =
  z.infer<typeof createProjectSchema>["body"];