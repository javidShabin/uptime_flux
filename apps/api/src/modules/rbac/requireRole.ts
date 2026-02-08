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
    /**
     * Get the projectId from req.params and
     * get the user id from the req.user
     */
    const projectId = req.params.projectId;
    const userId = req.user?.id;

    // Check the membership coming user
    // If the user is not a member return throw the error
    const membership = await Membership.findOne({
      projectId,
      userId,
    });

    if (!membership) return res.status(403).json({ message: "Not a member" });

    if (rolePriority[membership.role] < rolePriority[requiredRole]) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next()
  };
}

// find membership by projectid and userid

// check  the memberhsi

// check role prioriyt
