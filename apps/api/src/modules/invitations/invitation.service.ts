import crypto from "crypto";
import { Invitation } from "./invitation.model";
import { sendMail } from "../mail/mail.service";
import type { InvitationInput } from "./invitation.types";
import { Membership } from "../memberships/membership.model";

/**
 * InviatationService
 */
export class InviatationService {
  async invite(input: InvitationInput) {
    const { projectId, email, role, invitedBy } = input;

    const token = crypto.randomBytes(32).toString("hex");

    const existingInvite = await Invitation.findOne({
      projectId,
      email,
      acceptedAt: null
    });

    if (existingInvite) {
      throw new Error("Invitation already sent");
    }

    const invitation = await Invitation.create({
      projectId,
      email,
      role,
      token,
      invitedBy,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    const inviteLink = `${process.env.APP_URL}/invite?token=${token}`;

    await sendMail(
      email,
      "Project Invitation",
      `<p>You have been invited</p>
       <a href="${inviteLink}">Join Project</a>`
    );

    return invitation;
  }

  // Accept invitation
  async acceptInvitation(token:string, userId:string) {
    const invitation = await Invitation.findOne({token})

    if(!invitation) throw new Error("Invalid invitation token");

    if (invitation.acceptedAt) throw new Error("Invitation already accepted");

    if (invitation.expiresAt < new Date()) throw new Error("Invitation expired");

    // Check user already member
    const existing = await Membership.findOne({
      userId,
      projectId: invitation.projectId,
      role: invitation.role
    })

    invitation.acceptedAt = new Date()
    await invitation.save()

    return invitation.projectId
  }
}
