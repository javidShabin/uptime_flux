import { z } from "zod";

// Get Incidents Query Schema
export const getIncidentsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).default("1").transform(Number),
  limit: z.string().regex(/^\d+$/).default("10").transform(Number),
  projectId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid project ID")
    .optional(),
});

export type GetIncidentsQueryInput = z.infer<typeof getIncidentsQuerySchema>;

// Acknowledge Incident Schema (params)
export const acknowledgeIncidentSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid incident ID"),
});

export type AcknowledgeIncidentInput = z.infer<typeof acknowledgeIncidentSchema>;

// Resolve Incident Schema (params)
export const resolveIncidentSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid incident ID"),
});

export type ResolveIncidentInput = z.infer<typeof resolveIncidentSchema>;

