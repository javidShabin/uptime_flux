import { Membership } from "../memberships/membership.model";
import type { MemberList, removeMembers } from "./membership.types";

/**
 * Membership service
 *
 * Hande core membreship creation logic:
 * -Get all members in a proejct
 *
 */

export class MembershipService {
  // ======================================
  // GET ALL MEMBERS LIST IN THIS PROJEcT
  // ======================================
  async memberList(input: MemberList) {
    const { projectId } = input;

    if (!projectId) throw new Error("Project id is required");

    // Find the list of member in this project
    let membersList = await Membership.find({ projectId }).populate(
      "userId",
      "name email",
    );

    if (!membersList) throw new Error("Not find members list");

    return membersList;
  }

  // =======================================
  // Remove member
  //=======================================
  async removeMember(input: removeMembers) {
    const { projectId, userId } = input;

    if (!projectId || !userId) {
      throw new Error("Project id and user id are required");
    }

    // Find and remove the member frome the project
    const member = await Membership.findOneAndDelete({
      projectId,
      userId,
    });

    if (!member) {
      throw new Error("Member not found in this project");
    }

    return {
      message: "Member removed successfully",
    };
  }
}
