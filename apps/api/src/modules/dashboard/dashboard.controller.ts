import type { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";

export class DashboardController {
  private service = new DashboardService();

  getSummary = async (req: Request, res: Response) => {
    const data = await this.service.getSummary(req.user!.id);
    res.json({ data });
  };
}