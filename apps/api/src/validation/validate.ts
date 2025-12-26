import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export const validate =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.validated = parsed;
      next();
    } catch (err) {
      next(err);
    }
  };
