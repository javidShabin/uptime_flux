import { z } from "zod";

export const healthQuerySchema = z.object({
  query: z.object({
    verbose: z
      .string()
      .optional()
      .transform((v) => v === "true"),
  }),
});

export type HealthQuery = z.infer<typeof healthQuerySchema>;