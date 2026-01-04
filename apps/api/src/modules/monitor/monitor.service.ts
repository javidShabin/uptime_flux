import { Monitor } from "@uptimeflux/shared";
import { AppError } from "../../utils/app-error";
<<<<<<< HEAD
=======
import { scheduleMonitorJob } from "../../queues/monitor.queue";
>>>>>>> dev

/**
 * MonitorService
 *
 * Business logic for monitor operations:
 * - Create monitors
 * - Fetch all monitors
 * - Update monitor
 * - Delete monitors from a project
 *
 * This module serves as the core of UptimeFlux,
 * managing all monitor-related rules.
 */

export class MonitorService {
  // =================================
  // Create monitor
  // =================================
  async createMonitor(userId: string, data: { url: string; interval: number }) {
    // Destructer the url and interval from data
    const { url, interval } = data;

    if (!url || !interval) {
      throw new Error("URL and interval are required");
    }
 



    // Check same url already is present or not
    const existingMonitor = await Monitor.findOne({ userId, url });
    if (existingMonitor) {
      throw new AppError("Monitor with this URL already exists", 409);
    }

    // Create and return monitor
    const monitor = await Monitor.create({
      userId,
      url: data.url,
      interval: data.interval,
    });

    await scheduleMonitorJob(monitor._id.toString(), monitor.interval);

    return monitor;
  }

  // =================================
  // Get all monitors
  // =================================
  async getAllMonitors(userId: string) {
    // Get all monitors by last add first method
    const allMonitors = await Monitor.find({ userId }).sort({ createdAt: -1 });

    if (!allMonitors || allMonitors.length == 0) {
      throw new AppError("Monitors not exists", 404);
    }

    // Return the monitors
    return allMonitors;
  }

  // =================================
  // Update monitor
  // =================================
  async updateMonitor(
    userId: string,
    monitorId: string,
    data: Partial<{
      url: string;
      interval: number;
      isActive: boolean;
    }>
  ) {
    const monitor = await Monitor.findOneAndUpdate(
      { _id: monitorId, userId },
      data,
      { new: true }
    );

    // Check any monitor is available with the monitorId
    if (!monitor) {
      throw new AppError("Monitor not found", 404);
    }

    // Return monitor
    return monitor;
  }

  // =================================
  // Delete monitor
  // =================================
  async deleteMonitor(userId: string, monitorId: string) {
    const monitor = await Monitor.findOneAndDelete({
      _id: monitorId,
      userId,
    });

    if (!monitor) {
      throw new AppError("Monitor not found", 404);
    }

    return monitor;
  }
}
