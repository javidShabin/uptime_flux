import type { Request, Response } from "express";
import { MembershipService } from "./membership.service";
import type { tryCatch } from "bullmq";

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

  // Remove member from project
  async removeMember(req:Request, res:Response) {
    try {
      const removeMessage = await this.membershipService.removeMember(req.body)
      res.status(200).json({message: removeMessage})
    } catch (error) {
      res.status(400).json({message: (error as Error).message})
    }
  }
}
