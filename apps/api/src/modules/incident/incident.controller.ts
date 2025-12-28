import type { Request, Response } from "express";
import { Incident } from "@uptimeflux/shared";

/**
 * IncidentController
 *
 * Read-only HTTP endpoints for incidents.
 * Incident lifecycle is handled by worker + shared domain.
 */
export class IncidentController {
  // ==================================
  // Get incidents
  // ==================================
  async list(req: Request, res: Response) {
    const {
      monitorId,
      status,
      page = "1",
      limit = "20",
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = {};
    if (monitorId) filter.monitorId = monitorId;
    if (status) filter.status = status;

    const [items, total] = await Promise.all([
      Incident.find(filter)
        .sort({ startedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Incident.countDocuments(filter),
    ]);

    res.json({
      data: items,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  }

  // ==================================
  // Get incident by Id
  // ==================================
  async getById(req: Request, res: Response) {
    const { id } = req.params;

    const incident = await Incident.findById(id).lean();
    if (!incident) {
      return res.status(404).json({ error: "Incident not found" });
    }

    res.json({ data: incident });
  }
}
