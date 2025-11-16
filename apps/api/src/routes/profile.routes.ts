import type { FastifyInstance } from "fastify";
import profileRoutes from "../modules/profile/profile.routes.js";

export default async function routes(app: FastifyInstance) {
  await app.register(profileRoutes, { prefix: "/profile" });
}

