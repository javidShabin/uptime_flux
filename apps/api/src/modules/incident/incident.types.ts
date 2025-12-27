/**
 * Incident domain types
 *
 * Defines the contract for incident handling.
 * Used by services, workers, and later APIs/UI.
 */

/**
 * Incident lifecycle states
 */
export type IncidentStatus = "OPEN" | "RESOLVED";

/**
 * Incident shape (API-level representation)
 */
export interface Incident {
  id: string;
  monitorId: string;
  status: IncidentStatus;
  startedAt: Date;
  resolvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input for creating an incident
 */

export interface CreateIncidentInput {
  monitorId: string;
}

/**
 * Input for resolving an incident
 */
export interface ResolveIncidentInput {
  monitorId: string;
}