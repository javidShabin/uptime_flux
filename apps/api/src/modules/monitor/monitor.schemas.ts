import { z } from "zod";
import { MonitorType } from "./monitor.model.js";

// Create Monitor Schema
export const createMonitorSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  type: z.nativeEnum(MonitorType),
  target: z.string().min(1).trim(),
  projectId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid project ID")
    .optional(),
  heartbeatToken: z.string().trim().optional(),
  scheduleSec: z.number().int().min(30).max(86400).default(300), // 30s to 24h
  timeoutMs: z.number().int().min(1000).max(60000).default(5000), // 1s to 60s
  expectedStatus: z
    .string()
    .regex(
      /^\d{3}(-\d{3})?$/,
      "Invalid status format (e.g., '200' or '200-399')"
    )
    .optional(),
  verifyTls: z.boolean().default(true),
  tlsThresholdDays: z.number().int().min(1).max(365).optional(),
  tags: z.array(z.string().trim()).default([]),
  isPaused: z.boolean().default(false),
});

export type CreateMonitorInput = z.infer<typeof createMonitorSchema>;

// Update Monitor Schema
export const updateMonitorSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  type: z.nativeEnum(MonitorType).optional(),
  target: z.string().min(1).trim().optional(),
  projectId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid project ID")
    .optional()
    .nullable(),
  heartbeatToken: z.string().trim().optional().nullable(),
  scheduleSec: z.number().int().min(30).max(86400).optional(),
  timeoutMs: z.number().int().min(1000).max(60000).optional(),
  expectedStatus: z
    .string()
    .regex(/^\d{3}(-\d{3})?$/, "Invalid status format")
    .optional()
    .nullable(),
  verifyTls: z.boolean().optional(),
  tlsThresholdDays: z.number().int().min(1).max(365).optional().nullable(),
  tags: z.array(z.string().trim()).optional(),
  isPaused: z.boolean().optional(),
});
export type UpdateMonitorInput = z.infer<typeof updateMonitorSchema>;

// Get Monitor by ID Schema (params)
export const getMonitorByIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid monitor ID"),
});

// Get Monitors Query Schema
export const getMonitorsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).default("1").transform(Number),
  limit: z.string().regex(/^\d+$/).default("10").transform(Number),
  type: z.nativeEnum(MonitorType).optional(),
  isPaused: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  projectId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  tags: z.string().optional(), // Comma-separated tags
  search: z.string().trim().optional(),
});

export type GetMonitorsQueryInput = z.infer<typeof getMonitorsQuerySchema>;

// Delete Monitor Schema (params)
export const deleteMonitorSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid monitor ID"),
});

export type DeleteMonitorInput = z.infer<typeof deleteMonitorSchema>;

// Toggle Pause Schema (params)
export const togglePauseMonitorSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid monitor ID"),
});

export type TogglePauseMonitorInput = z.infer<typeof togglePauseMonitorSchema>;
