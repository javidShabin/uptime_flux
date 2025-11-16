import type { FastifyInstance } from "fastify";
import monitorRoutes from "../modules/monitor/monitor.routes.js";

export default async function routes(app: FastifyInstance) {
  await app.register(monitorRoutes, { prefix: "/monitors" });
}

