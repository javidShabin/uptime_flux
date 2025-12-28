import type { IncidentDTO } from "@uptimeflux/shared";

export function toIncidentResponse(doc: any): IncidentDTO {
  return {
    id: doc._id.toString(),
    monitorId: doc.monitorId,
    status: doc.status,
    startedAt: doc.startedAt,
    resolvedAt: doc.resolvedAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
