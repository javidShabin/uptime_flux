import type { Request, Response, NextFunction } from "express";
import { Membership } from "../memberships/membership.model";
// Create role priority
const rolePriority = {
  OWNER: 4,
  ADMIN: 3,
  MEMBER: 2,
  VIEWER: 1,
};

// Create function
export function requireRole(requiredRole: keyof typeof rolePriority) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      /**
       * Get the projectId from req.params and
       * get the user id from the req.user
       */
      const projectId = req.params.projectId;
      const userId = req.user?.id;

      if (!projectId) {
        return res.status(400).json({ message: "Project ID missing" });
      }
      
      // Find the users membership
      const membership = await Membership.findOne({
        projectId,
        userId,
      });

      if (!membership) {
        return res
          .status(403)
          .json({ message: "Not a member of this project" });
      }

      // Check the user membership priority
      if (rolePriority[membership.role] < rolePriority[requiredRole]) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      next();
    } catch (err) {
      return res.status(500).json({ message: "Authorization error" });
    }
  };
  
}
