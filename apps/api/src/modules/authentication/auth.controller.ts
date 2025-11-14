import type { FastifyReply, FastifyRequest } from "fastify";
import {ZodError} from "zod";
import "@fastify/cookie";
import jwt from "jsonwebtoken";
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
            // Log the full error for debugging
            console.error("❌ Unhandled error:", error);
            request.log.error(error);
            reply.code(500).send({
                message: "Internal server error",
                error: process.env.NODE_ENV === "development" ? String(error) : undefined,
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

    verifyOtp = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const payload = verifyOtpSchema.parse(request.body);
            const result = await this.authService.verifyOtp(request.server, payload);
            reply.code(200).send(result);
        } catch (error) {
            this.handleError(error, request, reply);
        }
    }

    login = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const payload = loginSchema.parse(request.body);
            const result = await this.authService.login(request.server, payload);
            
            // Set refresh token as HTTP-only cookie
            reply.setCookie(REFRESH_COOKIE_NAME, result.tokens.refreshToken, {
                httpOnly: true,
                secure: env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                expires: result.tokens.refreshTokenExpiresAt,
            });

            reply.code(200).send({
                user: result.user,
                accessToken: result.tokens.accessToken,
            });
        } catch (error) {
            this.handleError(error, request, reply);
        }
    }

    resendOtp = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const payload = resendOtpSchema.parse(request.body);
            const result = await this.authService.resendOtp(request.server, payload);
            reply.code(200).send(result);
        } catch (error) {
            this.handleError(error, request, reply);
        }
    }

    logout = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            // Get refresh token from cookie or request body
            const refreshToken = request.cookies[REFRESH_COOKIE_NAME] || 
                                (request.body as { refreshToken?: string })?.refreshToken;

            if (!refreshToken) {
                throw new AuthError(400, "Refresh token is required");
            }

            // Verify refresh token to get userId
            let decoded: { userId: string; tokenId: string };
            try {
                decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { userId: string; tokenId: string };
            } catch (error) {
                // If token is invalid, just clear the cookie and return success
                reply.clearCookie(REFRESH_COOKIE_NAME, {
                    httpOnly: true,
                    secure: env.NODE_ENV === "production",
                    sameSite: "strict",
                    path: "/",
                });
                return reply.code(200).send({ message: "Logged out successfully" });
            }

            // Logout user
            const result = await this.authService.logout(request.server, refreshToken, decoded.userId);

            // Clear refresh token cookie
            reply.clearCookie(REFRESH_COOKIE_NAME, {
                httpOnly: true,
                secure: env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
            });

            reply.code(200).send(result);
        } catch (error) {
            this.handleError(error, request, reply);
        }
    }
  }