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

  // ===============================
  // Get dashboard graph summary
  // ================================
  async getDashboardGraphSummary(userId: string) {
    // Get all monitors for the user
    const monitors = await Monitor.find({ userId }).select("_id lastStatus createdAt").lean();
    
    if (monitors.length === 0) {
      return {
        responseTime: [],
        uptime: [],
        incidents: []
      };
    }
    
    const monitorIds = monitors.map(m => String(m._id));
    
    // Get incidents for the user's monitors
    const incidents = await Incident.find({
      monitorId: { $in: monitorIds }
    }).select("startedAt resolvedAt").lean();
    
    // Generate response time data
    // Since we don't have historical response time data, we'll simulate it based on monitor status changes
    const responseTimeData = this.generateResponseTimeData(monitors, incidents);
    
    // Generate uptime data
    // Since we don't have historical uptime data, we'll simulate it
    const uptimeData = this.generateUptimeData(monitors, incidents);
    
    // Generate incidents data - count incidents per day
    const incidentsData = this.generateIncidentsData(incidents);
    
    return {
      responseTime: responseTimeData,
      uptime: uptimeData,
      incidents: incidentsData
    };
  }

  private generateResponseTimeData(monitors: any[], incidents: any[]): { time: string; value: number }[] {
    // Generate mock response time data for the last 24 hours
    const data = [];
    const now = new Date();
    
    for (let i = 24; i >= 0; i--) {
      const time = new Date(now);
      time.setHours(time.getHours() - i);
      
      // Simulate response time between 50ms and 500ms, with occasional spikes
      let value = Math.floor(Math.random() * 450) + 50;
      
      // Add occasional spikes based on incidents
      if (incidents.length > 0 && Math.random() > 0.7) {
        value = Math.floor(Math.random() * 1000) + 500; // Spike between 500-1500ms
      }
      
      data.push({
        time: time.toISOString().split('T')[1].substring(0, 5), // Format as HH:MM
        value: value
      });
    }
    
    return data;
  }

  private generateUptimeData(monitors: any[], incidents: any[]): { time: string; value: number }[] {
    // Generate mock uptime data for the last 7 days
    const data = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Calculate uptime percentage based on incidents
      let uptime = 100;
      
      // If there were incidents on this day, reduce uptime
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      
      const incidentsForDay = incidents.filter(incident => {
        const incidentDate = new Date(incident.startedAt);
        return incidentDate >= dayStart && incidentDate < dayEnd;
      });
      
      // Reduce uptime based on number of incidents
      if (incidentsForDay.length > 0) {
        uptime = Math.max(90, 100 - (incidentsForDay.length * 2));
      }
      
      data.push({
        time: date.toLocaleDateString('en-US', { weekday: 'short' }), // Format as Mon, Tue, etc.
        value: uptime
      });
    }
    
    return data;
  }

  private generateIncidentsData(incidents: any[]): { time: string; value: number }[] {
    // Generate incidents count per day for the last 7 days
    const data = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      
      const incidentsForDay = incidents.filter(incident => {
        const incidentDate = new Date(incident.startedAt);
        return incidentDate >= dayStart && incidentDate < dayEnd;
      });
      
      data.push({
        time: date.toLocaleDateString('en-US', { weekday: 'short' }), // Format as Mon, Tue, etc.
        value: incidentsForDay.length
      });
    }
    
    return data;
  }
}
