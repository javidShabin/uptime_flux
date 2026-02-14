/**
 * Project service
 *
 * Hande core project creation logic:
 * -Create proejct
 * -Update project
 * -Deactivate project
 *
 */

import { Membership } from "../memberships/membership.model";
import { Project } from "./project.model";
import type { CreateInput, MemberList } from "./project.types";

export class ProjectService {
  //===========================
  // Create project
  //===========================

  async create(input: CreateInput) {
    // Destructer data from input
    const { userId, name } = input;

    if (!userId || !name) {
      throw new Error("user id and name is required");
    }

    const project = await Project.create({
      name,
      createdBy: userId,
    });

    await Membership.create({
      userId,
      projectId: project._id,
      role: "OWNER",
    });

    return project;
  }

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
