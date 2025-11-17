import { Types } from "mongoose";
import { IncidentModel, type IIncident, IncidentStatus } from "./incident.model.js";
import { MonitorModel, type IMonitor } from "./monitor.model.js";
import { CheckModel } from "./check.model.js";
import { MonitorError } from "./monitor.errors.js";

export interface IncidentResponse {
  id: string;
  monitorId: string;
  projectId?: string;
  status: IncidentStatus;
  reason?: string;
  openedAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  acknowledgedBy?: string;
  resolvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IncidentsListResponse {
  incidents: IncidentResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ICheck {
  monitorId?: any;
  status: "up" | "down" | "degraded";
  latencyMs?: number | null;
  httpStatus?: number | null;
  errorText?: string | null;
  region?: string;
  ts?: Date;
}

export class IncidentService {
  constructor() {}

  /**
   * Get open incident for a monitor
   */
  async getOpenIncident(monitorId: string): Promise<IncidentResponse | null> {
    if (!Types.ObjectId.isValid(monitorId)) {
      throw new MonitorError(400, "Invalid monitor ID format");
    }

    const incident = await IncidentModel.findOne({
      monitorId: new Types.ObjectId(monitorId),
      status: { $in: [IncidentStatus.OPEN, IncidentStatus.ACKNOWLEDGED] },
    });

    if (!incident) {
      return null;
    }

    return this.toResponse(incident);
  }

  /**
   * Open a new incident for a monitor
   */
  async openIncident(monitor: IMonitor, check: ICheck): Promise<IncidentResponse> {
    // Check if there's already an open incident
    const existingIncident = await IncidentModel.findOne({
      monitorId: monitor._id,
      status: { $in: [IncidentStatus.OPEN, IncidentStatus.ACKNOWLEDGED] },
    });

    if (existingIncident) {
      // Update existing incident if needed
      if (!existingIncident.reason && check.errorText) {
        existingIncident.reason = check.errorText;
        await existingIncident.save();
      }
      return this.toResponse(existingIncident);
    }

    // Create new incident
    const incident = await IncidentModel.create({
      monitorId: monitor._id,
      projectId: monitor.projectId,
      status: IncidentStatus.OPEN,
      reason: check.errorText || undefined,
      openedAt: new Date(),
    });

    return this.toResponse(incident);
  }

  /**
   * Acknowledge an incident
   */
  async acknowledgeIncident(
    incidentId: string,
    userId: string
  ): Promise<IncidentResponse> {
    if (!Types.ObjectId.isValid(incidentId) || !Types.ObjectId.isValid(userId)) {
      throw new MonitorError(400, "Invalid ID format");
    }

    const incident = await IncidentModel.findById(incidentId);

    if (!incident) {
      throw new MonitorError(404, "Incident not found");
    }

    if (incident.status === IncidentStatus.RESOLVED) {
      throw new MonitorError(400, "Cannot acknowledge a resolved incident");
    }

    if (incident.status === IncidentStatus.ACKNOWLEDGED) {
      return this.toResponse(incident);
    }

    incident.status = IncidentStatus.ACKNOWLEDGED;
    incident.acknowledgedAt = new Date();
    incident.acknowledgedBy = new Types.ObjectId(userId);
    await incident.save();

    return this.toResponse(incident);
  }

  /**
   * Resolve an incident by monitor (used by worker)
   */
  async resolveIncident(
    monitor: IMonitor,
    userId?: string
  ): Promise<IncidentResponse | null> {
    const incident = await IncidentModel.findOne({
      monitorId: monitor._id,
      status: { $in: [IncidentStatus.OPEN, IncidentStatus.ACKNOWLEDGED] },
    });

    if (!incident) {
      return null;
    }

    incident.status = IncidentStatus.RESOLVED;
    incident.resolvedAt = new Date();
    if (userId) {
      incident.resolvedBy = new Types.ObjectId(userId);
    }
    await incident.save();

    return this.toResponse(incident);
  }

  /**
   * Resolve an incident by ID (used by API)
   */
  async resolveIncidentById(
    incidentId: string,
    userId: string
  ): Promise<IncidentResponse> {
    if (!Types.ObjectId.isValid(incidentId) || !Types.ObjectId.isValid(userId)) {
      throw new MonitorError(400, "Invalid ID format");
    }

    const incident = await IncidentModel.findById(incidentId);

    if (!incident) {
      throw new MonitorError(404, "Incident not found");
    }

    if (incident.status === IncidentStatus.RESOLVED) {
      throw new MonitorError(400, "Incident is already resolved");
    }

    incident.status = IncidentStatus.RESOLVED;
    incident.resolvedAt = new Date();
    incident.resolvedBy = new Types.ObjectId(userId);
    await incident.save();

    return this.toResponse(incident);
  }

  /**
   * Evaluate incident based on check result (used by monitor worker)
   */
  async evaluate(monitor: IMonitor, check: ICheck): Promise<{
    type: "opened" | "resolved" | null;
    incident?: IncidentResponse;
  }> {
    // Find current open/acknowledged incident
    const existingIncident = await IncidentModel.findOne({
      monitorId: monitor._id,
      status: { $in: [IncidentStatus.OPEN, IncidentStatus.ACKNOWLEDGED] },
    });

    // === OPEN INCIDENT ===
    if (check.status === "down" && !existingIncident) {
      const incident = await this.openIncident(monitor, check);
      return { type: "opened", incident };
    }

    // === RESOLVE INCIDENT ===
    if (check.status === "up" && existingIncident) {
      const incident = await this.resolveIncident(monitor);
      if (incident) {
        return { type: "resolved", incident };
      }
    }

    return { type: null };
  }

  /**
   * Get incidents list with pagination and filters
   */
  async getIncidents(
    userId: string,
    query: { projectId?: string; page?: number; limit?: number }
  ): Promise<IncidentsListResponse> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new MonitorError(400, "Invalid user ID format");
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Build filter - get monitors owned by user first
    const userMonitors = await MonitorModel.find({
      userId: new Types.ObjectId(userId),
    }).select("_id");

    const monitorIds = userMonitors.map((m) => m._id);

    const filter: any = {
      monitorId: { $in: monitorIds },
    };

    if (query.projectId) {
      if (!Types.ObjectId.isValid(query.projectId)) {
        throw new MonitorError(400, "Invalid project ID format");
      }
      filter.projectId = new Types.ObjectId(query.projectId);
    }

    // Get total count
    const total = await IncidentModel.countDocuments(filter);

    // Get incidents
    const incidents = await IncidentModel.find(filter)
      .sort({ openedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("monitorId", "name target type")
      .populate("acknowledgedBy", "firstName lastName email")
      .populate("resolvedBy", "firstName lastName email");

    return {
      incidents: incidents.map((incident) => this.toResponse(incident)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Convert incident document to response format
   */
  private toResponse(incident: IIncident): IncidentResponse {
    return {
      id: incident.id,
      monitorId: incident.monitorId.toString(),
      projectId: incident.projectId?.toString(),
      status: incident.status,
      reason: incident.reason,
      openedAt: incident.openedAt,
      acknowledgedAt: incident.acknowledgedAt,
      resolvedAt: incident.resolvedAt,
      acknowledgedBy: incident.acknowledgedBy?.toString(),
      resolvedBy: incident.resolvedBy?.toString(),
      createdAt: incident.createdAt,
      updatedAt: incident.updatedAt,
    };
  }
}

// Export function for backward compatibility with monitor.worker.ts
export async function evaluateIncident(monitor: IMonitor, check: ICheck) {
  const service = new IncidentService();
  return service.evaluate(monitor, check);
}
