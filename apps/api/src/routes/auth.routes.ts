import type { FastifyInstance } from "fastify";
import authenticationRoutes from "../modules/authentication/auth.routes.js";

export default async function authRoutes(app: FastifyInstance) {
  await app.register(authenticationRoutes, { prefix: "/auth" });
}

