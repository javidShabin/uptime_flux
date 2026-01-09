import type { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../../utils/jwt.js";

interface JwtPayload {
  userId: string;
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = header.replace("Bearer ", "");

  try {
    const payload = verifyJwt<JwtPayload>(token);
    req.user = { id: payload.userId };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
