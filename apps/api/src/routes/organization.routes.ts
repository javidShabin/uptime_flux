import type { FastifyInstance } from "fastify";
import organizationRoutes from "../modules/orgainization/org.routes.js";

export default async function routes(app: FastifyInstance) {
  await app.register(organizationRoutes, { prefix: "/organizations" });
}

