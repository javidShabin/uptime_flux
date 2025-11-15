import type { FastifyInstance } from "fastify";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";

export default async function routes(app: FastifyInstance) {
  // Register all route modules
  await app.register(authRoutes);
  await app.register(profileRoutes);
}

