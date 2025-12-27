import { Incident } from "./incident.model";

/**
 * IncidentService
 *
 * Handles incident lifecycle:
 * - Create incident on DOWN
 * - Resolve incident on recovery
 * - Fetch open incidents
 */

export class IncidentService {
  // ================================
  // Create incident (UP → DOWN)
  // ================================
  async createIncident(monitorId: string) {
    return Incident.create({
      monitorId,
      status: "OPEN",
      startedAt: new Date(),
    });
  }

  // ================================
  // Resolve incident (DOWN → UP)
  // ================================
  async resolveIncident(monitorId: string) {
    return Incident.findByIdAndUpdate(
      { monitorId, status: "OPEN" },
      {
        status: "RESOLVED",
        resolvedAt: new Date(),
      },
      { new: true }
    );
  }

  // ================================
  // Get active incident for monitor
  // ================================
  async getOpenIncident(monitorId: string) {
    return Incident.findOne({
      monitorId,
      status: "OPEN",
    });
  }
}
