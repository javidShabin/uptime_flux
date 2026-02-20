import type { Request, Response } from "express";
import { MembershipService } from "./membership.service";

/**
 * ProjectController
 *
 * Delegated all logic to ProjectService
 *
 */
export class MembershipController {
  private membershipService = new MembershipService();

  // ===============================
  // Member list
  //================================
  async memberList(req: Request, res: Response) {
    try {
      const memberList = await this.membershipService.memberList(req.body);
      res.status(200).json({ data: memberList });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
