import type { FastifyInstance } from "fastify";
import projectRoutes from "../modules/project/project.routes.js";

export default async function routes(app: FastifyInstance) {
  await app.register(projectRoutes, { prefix: "/projects" });
}

