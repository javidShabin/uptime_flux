import { Types } from "mongoose";
import { MonitorModel, type IMonitor, MonitorType } from "./monitor.model.js";
import { MonitorError } from "./monitor.errors.js";
import type {
  CreateMonitorInput,
  UpdateMonitorInput,
  GetMonitorsQueryInput,
} from "./monitor.schemas.js";

export interface MonitorResponse {
  id: string;
  userId: string;
  projectId?: string;
  name: string;
  type: MonitorType;
  target: string;
  heartbeatToken?: string;
  scheduleSec: number;
  timeoutMs: number;
  expectedStatus?: string;
  verifyTls: boolean;
  tlsThresholdDays?: number;
  tags: string[];
  isPaused: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MonitorsListResponse {
  monitors: MonitorResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class MonitorService {
  constructor() {}

  /**
   * Create a new monitor
   */
  async createMonitor(
    userId: string,
    data: CreateMonitorInput
  ): Promise<MonitorResponse> {
    // Validate user Id
    if (!Types.ObjectId.isValid(userId)) {
      throw new MonitorError(400, "Invalid user ID format");
    }

    // Create monitor
    const monitor = await MonitorModel.create({
      userId: new Types.ObjectId(userId),
      projectId: data.projectId
        ? new Types.ObjectId(data.projectId)
        : undefined,
      name: data.name,
      type: data.type,
      target: data.target,
      heartbeatToken: data.heartbeatToken,
      scheduleSec: data.scheduleSec,
      timeoutMs: data.timeoutMs,
      expectedStatus: data.expectedStatus,
      verifyTls: data.verifyTls,
      tlsThresholdDays: data.tlsThresholdDays,
      tags: data.tags || [],
      isPaused: data.isPaused || false,
    });
    return this.toResponse(monitor);
  }

  /**
   * Convert monitor document to response format
   */
  private toResponse(monitor: IMonitor): MonitorResponse {
    return {
      id: monitor.id,
      userId: monitor.userId.toString(),
      projectId: monitor.projectId?.toString(),
      name: monitor.name,
      type: monitor.type,
      target: monitor.target,
      heartbeatToken: monitor.heartbeatToken,
      scheduleSec: monitor.scheduleSec,
      timeoutMs: monitor.timeoutMs,
      expectedStatus: monitor.expectedStatus,
      verifyTls: monitor.verifyTls ?? true,
      tlsThresholdDays: monitor.tlsThresholdDays,
      tags: monitor.tags,
      isPaused: monitor.isPaused,
      createdAt: monitor.createdAt,
      updatedAt: monitor.updatedAt,
    };
  }

  /**
   * Get monitor by ID (with user ownership check)
   */

  async getMonitorById(userId: string, id: string): Promise<MonitorResponse> {
    // Validate IDs
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(id)) {
      throw new MonitorError(400, "Invalid ID format");
    }

    const monitor = await MonitorModel.findOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });

    if (!monitor) {
      throw new MonitorError(404, "Monitor not found");
    }

    return this.toResponse(monitor);
  }

  /**
   * Get monitors list with pagination and filters
   */

  async getMonitors(
    userId: string,
    query: GetMonitorsQueryInput
  ): Promise<MonitorsListResponse> {
    // Validate user ID
    if (!Types.ObjectId.isValid(userId)) {
      throw new MonitorError(400, "Invalid user ID format");
    }
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {
      userId: new Types.ObjectId(userId),
    };
    if (query.type) {
      filter.type = query.type;
    }

    if (query.isPaused !== undefined) {
      filter.isPaused = query.isPaused;
    }

    if (query.projectId) {
      filter.projectId = new Types.ObjectId(query.projectId);
    }

    if (query.tags) {
      const tagsArray = query.tags.split(",").map((tag) => tag.trim());
      filter.tags = { $in: tagsArray };
    }

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: "i" } },
        { target: { $regex: query.search, $options: "i" } },
      ];
    }

    // Get total count
    const total = await MonitorModel.countDocuments(filter);

    // Get monitors
    const monitors = await MonitorModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      monitors: monitors.map((monitor) => this.toResponse(monitor)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update monitor (with user ownership check)
   */
  async updateMonitor(
    userId: string,
    monitorId: string,
    data: UpdateMonitorInput
  ): Promise<MonitorResponse> {
    // Validate IDs
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(monitorId)) {
      throw new MonitorError(400, "Invalid ID format");
    }

    // Find monitor and verify ownership
    const monitor = await MonitorModel.findOne({
      _id: new Types.ObjectId(monitorId),
      userId: new Types.ObjectId(userId),
    });

    if (!monitor) {
      throw new MonitorError(404, "Monitor not found");
    }

    // Update fields
    if (data.name !== undefined) monitor.name = data.name;
    if (data.type !== undefined) monitor.type = data.type;
    if (data.target !== undefined) monitor.target = data.target;
    if (data.projectId !== undefined) {
      monitor.projectId = data.projectId
        ? new Types.ObjectId(data.projectId)
        : undefined;
    }
    if (data.heartbeatToken !== undefined) {
      monitor.heartbeatToken = data.heartbeatToken || undefined;
    }
    if (data.scheduleSec !== undefined) monitor.scheduleSec = data.scheduleSec;
    if (data.timeoutMs !== undefined) monitor.timeoutMs = data.timeoutMs;
    if (data.expectedStatus !== undefined) {
      monitor.expectedStatus = data.expectedStatus || undefined;
    }
    if (data.verifyTls !== undefined) monitor.verifyTls = data.verifyTls;
    if (data.tlsThresholdDays !== undefined) {
      monitor.tlsThresholdDays = data.tlsThresholdDays || undefined;
    }
    if (data.tags !== undefined) monitor.tags = data.tags;
    if (data.isPaused !== undefined) monitor.isPaused = data.isPaused;

    await monitor.save();

    return this.toResponse(monitor);
  }

  /**
   * Delete monitor (with user ownership check)
   */
  async deleteMonitor(userId: string, monitorId: string): Promise<void> {
    // Validate IDs
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(monitorId)) {
      throw new MonitorError(400, "Invalid ID format");
    }

    const result = await MonitorModel.deleteOne({
      _id: new Types.ObjectId(monitorId),
      userId: new Types.ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      throw new MonitorError(404, "Monitor not found");
    }
  }

  /**
   * Toggle pause status (with user ownership check)
   */
  async togglePauseMonitor(
    userId: string,
    monitorId: string
  ): Promise<MonitorResponse> {
    // Validate IDs
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(monitorId)) {
      throw new MonitorError(400, "Invalid ID format");
    }

    const monitor = await MonitorModel.findOne({
      _id: new Types.ObjectId(monitorId),
      userId: new Types.ObjectId(userId),
    });

    if (!monitor) {
      throw new MonitorError(404, "Monitor not found");
    }

    monitor.isPaused = !monitor.isPaused;
    await monitor.save();

    return this.toResponse(monitor);
  }
}
