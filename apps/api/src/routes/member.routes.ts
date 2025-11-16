import type { FastifyInstance } from "fastify";
import memberRoutes from "../modules/member/member.routes.js";

export default async function routes(app: FastifyInstance) {
  await app.register(memberRoutes, { prefix: "/members" });
}

