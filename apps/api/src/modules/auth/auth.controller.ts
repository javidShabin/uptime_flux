import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";

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

  // ===============================
  // Verify Email
  // ===============================
  async verifyEmail(req: Request, res: Response) {
    const result = await this.authService.verifyEmail(req.body);
    res.json({ data: result });
  }

  // ==============================
  // Login
  // ==============================
  async login(req: Request, res: Response) {
    const user = await this.authService.login(req.body);

    // Set the access token as an HTTP-only cookie
    res.cookie("accessToken", user.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    // Return user data with token (for immediate client-side use)
    res.json({ user });
  }
}
