import type { ZodTypeAny } from "zod";

declare global {
  namespace Express {
    interface Request {
      validated?: unknown;
      user?: {
        id: string;
      };
    }
  }
}

export {};
