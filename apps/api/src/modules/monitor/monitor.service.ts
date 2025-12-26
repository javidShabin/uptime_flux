import { Monitor } from "./monitor.model";
import { AppError } from "../../utils/app-error";

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
    return Monitor.create({
      url: data.url,
      interval: data.interval,
    });
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
    return allMonitors
  }
}
