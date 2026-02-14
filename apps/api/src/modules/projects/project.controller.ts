import type { Request, Response } from "express";
import { ProjectService } from "./project.service";

/**
 * ProjectController
 *
 * Delegated all logic to ProjectService
 *
 */

export class ProjectController {
  private projectService = new ProjectService();

  // ===========================
  // Create project
  // ===========================
  async create(req: Request, res: Response) {
    try {
        const project = await this.projectService.create(req.body)
        res.status(200).json({data:project})
    } catch (error) {
        res.status(400).json({message: (error as Error).message})
    }
  }

  // ===============================
  // Member list
  //================================
  async memberList(req:Request, res:Response) {
    try {
      const memberList = await this.projectService.memberList(req.body)
      res.status(200).json({data:memberList})
    } catch (error) {
      res.status(400).json({message: (error as Error).message})
    }
  }
}
