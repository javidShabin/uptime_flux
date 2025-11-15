import { FastifyInstance } from "fastify";

export function generateAccessToken(app: FastifyInstance, userId: string) {
  return app.jwt.sign({ userId });
}

export function verifyAccessToken(app: FastifyInstance, token: string) {
  return app.jwt.verify(token);
}
