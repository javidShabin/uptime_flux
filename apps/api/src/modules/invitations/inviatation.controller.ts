import type { Request, Response } from "express";
import { InviatationService } from "./invitation.service";

/**
 * InviatationController
 *
 * Delegates all logic to InviteService.
 */

export class InviatationController {
  private inviteService = new InviatationService();

  //===============================
  // Invitation
  // ==============================

  async invite(req: Request, res: Response) {
  try {
    const { email, role } = req.body;
    const { projectId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    const invite = await this.inviteService.invite({
      projectId, // now guaranteed string
      email,
      role,
      invitedBy: userId,
    });

    res.json({ message: "Invitation sent", data: invite });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

}

