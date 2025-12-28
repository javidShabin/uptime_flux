import type { Request, Response } from "express";
import { AuthService } from "./auth.service";

/**
 * AuthController
 *
 * HTTP layer for authentication.
 * Delegates all logic to AuthService.
 */
export class AuthController {
  private authService = new AuthService();

  // ==============================
  // Register
  // ==============================
  async register(req: Request, res: Response) {
    const user = await this.authService.register(req.body);
    res.status(201).json({ data: user });
  }

  // ==============================
  // Login
  // ==============================
  async login(req: Request, res: Response) {
    const user = await this.authService.login(req.body);
    res.json({ data: user });
  }
}
