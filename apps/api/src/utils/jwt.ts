import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export function signJwt(payload: object) {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyJwt<T>(token: string): T {
  return jwt.verify(token, env.JWT_SECRET) as T;
}
