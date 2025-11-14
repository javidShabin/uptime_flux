import type { FastifyReply, FastifyRequest } from "fastify";
import {ZodError} from "zod";
import "@fastify/cookie";
import {env} from "../../config/env.js";
import {
    registerSchema,
    loginSchema,
    verifyOtpSchema,
    resendOtpSchema,
    refreshSchema,
  } from "./auth.schemas.js";
  import { AuthenticationService } from "./auth.service.js";
  import { AuthError } from "./auth.errors.js";
  const REFRESH_COOKIE_NAME = "refreshToken";

  export class AuthenticationController {
    constructor(private readonly authService: AuthenticationService) {}

    
    private handleError(error: unknown, request: FastifyRequest, reply: FastifyReply) {
        if (error instanceof ZodError) {
            reply.code(400).send({
                message: "Validation error",
                errors: error.issues,
            });
        } else if (error instanceof AuthError) {
            reply.code(error.statusCode).send({
                message: error.message,
            });
        } else {
            request.log.error(error);
            reply.code(500).send({
                message: "Internal server error",
            });
        }
    }
    register = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const payload = registerSchema.parse(request.body);
            const result = await this.authService.register(request.server, payload);
            reply.code(201).send(result);
        }catch (error) {
            this.handleError(error, request, reply);
        }
    }
  }