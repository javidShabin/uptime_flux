import type { FastifyInstance } from "fastify";
import { ProfileService } from "./profile.service.js";
import { ProfileController } from "./profile.controller.js";

export default async function profileRoutes(app: FastifyInstance) {
  const service = new ProfileService();
  const controller = new ProfileController(service);

  // Get current user's profile
  app.get("/me", { preHandler: [app.authenticate] }, controller.getMyProfile);

  // Get profile by user ID
  app.get("/:id", { preHandler: [app.authenticate] }, controller.getProfileById);

  // Update current user's profile (supports multipart/form-data for avatar upload)
  app.put("/me", { preHandler: [app.authenticate] }, controller.updateProfile);

  // 2FA endpoints
  app.post("/2fa/setup", { preHandler: [app.authenticate] }, controller.setupTwoFactor);
  app.post("/2fa/verify", { preHandler: [app.authenticate] }, controller.verifyTwoFactor);
  app.post("/2fa/disable", { preHandler: [app.authenticate] }, controller.disableTwoFactor);
}

