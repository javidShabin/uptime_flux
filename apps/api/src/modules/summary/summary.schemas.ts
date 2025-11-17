import { z } from "zod";

// Get Monitor Summary Schema (params)
export const getMonitorSummarySchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid monitor ID"),
});

// Get Monitor Summary Query Schema
export const getMonitorSummaryQuerySchema = z.object({
  from: z.string().datetime().optional().transform((val) => (val ? new Date(val) : undefined)),
  to: z.string().datetime().optional().transform((val) => (val ? new Date(val) : undefined)),
});

export type GetMonitorSummaryQueryInput = z.infer<typeof getMonitorSummaryQuerySchema>;

// Get Project Summary Schema (params)
export const getProjectSummarySchema = z.object({
  projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid project ID"),
});

// Get Project Summary Query Schema
export const getProjectSummaryQuerySchema = z.object({
  from: z.string().datetime().optional().transform((val) => (val ? new Date(val) : undefined)),
  to: z.string().datetime().optional().transform((val) => (val ? new Date(val) : undefined)),
});

export type GetProjectSummaryQueryInput = z.infer<typeof getProjectSummaryQuerySchema>;

// Get Checks Schema (params)
export const getChecksSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid monitor ID"),
});

// Get Checks Query Schema
export const getChecksQuerySchema = z.object({
  limit: z.string().regex(/^\d+$/).default("100").transform(Number),
  from: z.string().datetime().optional().transform((val) => (val ? new Date(val) : undefined)),
  to: z.string().datetime().optional().transform((val) => (val ? new Date(val) : undefined)),
});

export type GetChecksQueryInput = z.infer<typeof getChecksQuerySchema>;

