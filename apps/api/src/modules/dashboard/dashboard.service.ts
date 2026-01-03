import { Monitor, Incident } from "@uptimeflux/shared";

export class DashboardService {
  // ===============================
  // Get monitor summer by user id
  // ================================
  async getSummary(userId: string) {
    // Monitor owned by user
    const monitors = await Monitor.find(
      { userId },
      { _id: 1, lastStatus: 1 }
    ).lean();

    /**
     * Filtering Monitors
     * total monitors
     * total UP / DOWN montors
     * Find uptime percentage
     */
    // Get total monitors count
    const totalMonitors = monitors.length;

    // Get total of UP status monitors
    const upMonitors = monitors.filter((m) => m.lastStatus === "UP").length;

    // Get total of DOWN status monitors
    const downMonitors = monitors.filter((m) => m.lastStatus === "DOWN").length;

    // Uptime percentage
    const uptimePercentage =
      totalMonitors === 0
        ? 100
        : Math.round((upMonitors / totalMonitors) * 100);

    // Get the all monitors ID's
    const monitorIds: string[] = monitors.map((m) => String(m._id));

    /**
     * Get All recent incidents
     * Get by monitor id's
     */

    const recentIncidents = await Incident.find({
      monitorId: { $in: monitorIds },
    })
      .sort({ startedAt: -1 })
      .limit(5)
      .lean();

      return {
      totalMonitors,
      upMonitors,
      downMonitors,
      uptimePercentage,
      recentIncidents,
    };
  }
}
