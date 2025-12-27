import { Monitor } from "./monitor.model";
import { AppError } from "../../utils/app-error";
import { scheduleMonitorJob } from "../../queues/monitor.queue";

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
  async createMonitor(data: { url: string; interval: number }) {
    // Destructer the url and interval from data
    const { url, interval } = data;

    // Check same url already is present or not
    const existingMonitor = await Monitor.findOne({ url });
    if (existingMonitor) {
      throw new AppError("Monitor with this URL already exists", 409);
    }

    // Create and return monitor
    const monitor = await Monitor.create({
      url: data.url,
      interval: data.interval,
    });

    await scheduleMonitorJob(monitor._id.toString(), monitor.interval)

    return monitor
  }


  // =================================
  // Get all monitors
  // =================================
  async getAllMonitors() {
    // Get all monitors by last add first method
    const allMonitors = await Monitor.find().sort({ createdAt: -1 });

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
    monitorId: string,
    data: Partial<{
      url: string;
      interval: number;
      isActive: boolean;
    }>
  ) {
    const monitor = await Monitor.findByIdAndUpdate(monitorId, data, {
      new: true,
    });

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
  async deleteMonitor(monitorId: string) {
    const monitor = await Monitor.findByIdAndDelete(monitorId);

    if (!monitor) {
      throw new AppError("Monitor not found", 404);
    }

    return monitor;
  }
}
