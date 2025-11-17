import { Types } from "mongoose";
import { MonitorModel } from "../monitor/monitor.model.js";
import { CheckModel } from "../monitor/check.model.js";
import { IncidentModel, IncidentStatus } from "../monitor/incident.model.js";
import { RollupModel } from "./rollup.model.js";
import { SummaryError } from "./summary.errors.js";

export interface MonitorSummary {
  monitorId: string;
  uptimePercent: number;
  avgLatencyMs: number | null;
  checksCount: number;
  downCount: number;
  lastCheck: any | null;
  currentIncident: any | null;
}

export interface ProjectSummary {
  projectId: string;
  totalMonitors: number;
  upCount: number;
  downCount: number;
  openIncidents: number;
  avgLatencyMs: number | null;
}

export class SummaryService {
  /**
   * Get monitor summary
   */
  async getMonitorSummary(
    monitorId: string,
    opts?: { from?: Date; to?: Date }
  ): Promise<MonitorSummary> {
    if (!Types.ObjectId.isValid(monitorId)) {
      throw new SummaryError(400, "Invalid monitor ID format");
    }

    const monitor = await MonitorModel.findById(monitorId);
    if (!monitor) {
      throw new SummaryError(404, "Monitor not found");
    }

    const to = opts?.to || new Date();
    const from = opts?.from || new Date(to.getTime() - 24 * 60 * 60 * 1000); // Default 24h

    // Get checks in the time window
    const checks = await CheckModel.find({
      monitorId: new Types.ObjectId(monitorId),
      ts: { $gte: from, $lte: to },
    })
      .sort({ ts: -1 })
      .lean();

    const checksCount = checks.length;
    const downCount = checks.filter((c) => c.status === "down").length;

    // Compute uptime percent
    const windowMs = to.getTime() - from.getTime();
    const uptimePercent = this.computeUptimePercent(checks, windowMs, monitor.scheduleSec * 1000);

    // Compute average latency
    const latencies = checks
      .map((c) => c.latencyMs)
      .filter((l): l is number => l !== null && l !== undefined);
    const avgLatencyMs =
      latencies.length > 0
        ? Math.round((latencies.reduce((a, b) => a + b, 0) / latencies.length) * 100) / 100
        : null;

    // Get last check
    const lastCheck = checks.length > 0 ? checks[0] : null;

    // Get current incident
    const currentIncident = await IncidentModel.findOne({
      monitorId: new Types.ObjectId(monitorId),
      status: { $in: [IncidentStatus.OPEN, IncidentStatus.ACKNOWLEDGED] },
    }).lean();

    return {
      monitorId: String(monitor._id),
      uptimePercent: Math.round(uptimePercent * 100) / 100,
      avgLatencyMs,
      checksCount,
      downCount,
      lastCheck,
      currentIncident,
    };
  }

  /**
   * Get project summary
   */
  async getProjectSummary(
    projectId: string,
    opts?: { from?: Date; to?: Date }
  ): Promise<ProjectSummary> {
    if (!Types.ObjectId.isValid(projectId)) {
      throw new SummaryError(400, "Invalid project ID format");
    }

    const to = opts?.to || new Date();
    const from = opts?.from || new Date(to.getTime() - 24 * 60 * 60 * 1000); // Default 24h

    // Get all monitors in project
    const monitors = await MonitorModel.find({
      projectId: new Types.ObjectId(projectId),
    }).select("_id");

    const totalMonitors = monitors.length;
    const monitorIds = monitors.map((m) => m._id);

    if (totalMonitors === 0) {
      return {
        projectId,
        totalMonitors: 0,
        upCount: 0,
        downCount: 0,
        openIncidents: 0,
        avgLatencyMs: null,
      };
    }

    // Get recent checks for all monitors
    const checks = await CheckModel.find({
      monitorId: { $in: monitorIds },
      ts: { $gte: from, $lte: to },
    }).lean();

    // Get last check per monitor to determine current status
    const lastChecksByMonitor = new Map<string, any>();
    for (const check of checks) {
      const mid = String(check.monitorId);
      if (!lastChecksByMonitor.has(mid) || check.ts > lastChecksByMonitor.get(mid).ts) {
        lastChecksByMonitor.set(mid, check);
      }
    }

    let upCount = 0;
    let downCount = 0;
    const latencies: number[] = [];

    for (const check of lastChecksByMonitor.values()) {
      if (check.status === "up") {
        upCount++;
      } else {
        downCount++;
      }
      if (check.latencyMs !== null && check.latencyMs !== undefined) {
        latencies.push(check.latencyMs);
      }
    }

    // Get open incidents
    const openIncidents = await IncidentModel.countDocuments({
      projectId: new Types.ObjectId(projectId),
      status: { $in: [IncidentStatus.OPEN, IncidentStatus.ACKNOWLEDGED] },
    });

    const avgLatencyMs =
      latencies.length > 0
        ? Math.round((latencies.reduce((a, b) => a + b, 0) / latencies.length) * 100) / 100
        : null;

    return {
      projectId,
      totalMonitors,
      upCount,
      downCount,
      openIncidents,
      avgLatencyMs,
    };
  }

  /**
   * Compute uptime percent from checks
   */
  computeUptimePercent(checks: any[], windowMs: number, scheduleMs: number): number {
    if (checks.length === 0) {
      return 100; // No checks = assume up
    }

    if (windowMs <= 0) {
      return 100;
    }

    // Simple ratio-based calculation
    const upCount = checks.filter((c) => c.status === "up").length;
    const totalCount = checks.length;

    if (totalCount === 0) {
      return 100;
    }

    // Ratio of up checks
    const uptimeRatio = upCount / totalCount;
    return uptimeRatio * 100;
  }

  /**
   * Get last N checks for a monitor
   */
  async getLastNChecks(monitorId: string, n: number = 100): Promise<any[]> {
    if (!Types.ObjectId.isValid(monitorId)) {
      throw new SummaryError(400, "Invalid monitor ID format");
    }

    const checks = await CheckModel.find({
      monitorId: new Types.ObjectId(monitorId),
    })
      .sort({ ts: -1 })
      .limit(n)
      .lean();

    return checks;
  }
}

