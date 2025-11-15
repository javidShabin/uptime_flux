import type { FastifyInstance } from "fastify";
import profileRoutes from "../modules/profile/profile.routes.js";

export default async function profileRoutesHandler(app: FastifyInstance) {
  await app.register(profileRoutes, { prefix: "/profile" });
}

