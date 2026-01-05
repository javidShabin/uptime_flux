import { Monitor, Incident } from "@uptimeflux/shared";

/* ===============================
   Lean document types
================================ */
interface LeanMonitor {
  _id: string;
  lastStatus?: "UP" | "DOWN";
  createdAt?: Date;
}

interface LeanIncident {
  startedAt?: Date;
  resolvedAt?: Date;
}

/* ===============================
   Type predicate (CRITICAL)
   This is the real fix for TS2532
================================ */
type IncidentWithStart = LeanIncident & { startedAt: Date };

function hasStartedAt(
  incident: LeanIncident
): incident is IncidentWithStart {
  return incident.startedAt instanceof Date;
}

export class DashboardService {
  /* ===============================
     Dashboard summary
  ================================ */
  async getSummary(userId: string) {
    const monitors = await Monitor.find(
      { userId },
      { _id: 1, lastStatus: 1 }
    ).lean<LeanMonitor[]>();

    const totalMonitors = monitors.length;
    const upMonitors = monitors.filter(m => m.lastStatus === "UP").length;
    const downMonitors = monitors.filter(m => m.lastStatus === "DOWN").length;

    const uptimePercentage =
      totalMonitors === 0
        ? 100
        : Math.round((upMonitors / totalMonitors) * 100);

    const monitorIds = monitors.map(m => String(m._id));

    const recentIncidents = await Incident.find({
      monitorId: { $in: monitorIds },
    })
      .sort({ startedAt: -1 })
      .limit(5)
      .lean<LeanIncident[]>();

    return {
      totalMonitors,
      upMonitors,
      downMonitors,
      uptimePercentage,
      recentIncidents,
    };
  }

  /* ===============================
     Dashboard graphs
  ================================ */
  async getDashboardGraphSummary(userId: string) {
    const monitors = await Monitor.find({ userId })
      .select("_id lastStatus createdAt")
      .lean<LeanMonitor[]>();

    if (monitors.length === 0) {
      return {
        responseTime: [],
        uptime: [],
        incidents: [],
      };
    }

    const monitorIds = monitors.map(m => String(m._id));

    // ⬇️ CRITICAL: narrow incidents ONCE using type predicate
    const incidents = (
      await Incident.find({
        monitorId: { $in: monitorIds },
      })
        .select("startedAt resolvedAt")
        .lean<LeanIncident[]>()
    ).filter(hasStartedAt);

    return {
      responseTime: this.generateResponseTimeData(),
      uptime: this.generateUptimeData(incidents),
      incidents: this.generateIncidentsData(incidents),
    };
  }

  /* ===============================
     Helpers
  ================================ */

  private generateResponseTimeData(): { time: string; value: number }[] {
    const data: { time: string; value: number }[] = [];
    const now = new Date();

    for (let i = 24; i >= 0; i--) {
      const time = new Date(now);
      time.setHours(time.getHours() - i);

      let value = Math.floor(Math.random() * 450) + 50;

      if (Math.random() > 0.7) {
        value = Math.floor(Math.random() * 1000) + 500;
      }

      data.push({
        time: time.toISOString().substring(11, 16),
        value,
      });
    }

    return data;
  }

  private generateUptimeData(
    incidents: IncidentWithStart[]
  ): { time: string; value: number }[] {
    const data: { time: string; value: number }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      const dayStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const dayEnd = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1
      );

      const incidentsForDay = incidents.filter(incident => {
        const d = incident.startedAt;
        return d >= dayStart && d < dayEnd;
      });

      const uptime =
        incidentsForDay.length === 0
          ? 100
          : Math.max(90, 100 - incidentsForDay.length * 2);

      data.push({
        time: date.toLocaleDateString("en-US", { weekday: "short" }),
        value: uptime,
      });
    }

    return data;
  }

  private generateIncidentsData(
    incidents: IncidentWithStart[]
  ): { time: string; value: number }[] {
    const data: { time: string; value: number }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      const dayStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const dayEnd = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1
      );

      const count = incidents.filter(incident => {
        const d = incident.startedAt;
        return d >= dayStart && d < dayEnd;
      }).length;

      data.push({
        time: date.toLocaleDateString("en-US", { weekday: "short" }),
        value: count,
      });
    }

    return data;
  }
}
