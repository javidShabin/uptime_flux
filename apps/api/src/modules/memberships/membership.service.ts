import { Membership } from "../memberships/membership.model";
import type { MemberList } from "./membership.types";

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
}
