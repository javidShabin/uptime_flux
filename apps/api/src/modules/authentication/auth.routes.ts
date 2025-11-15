
import type { FastifyInstance } from "fastify";
import { AuthenticationService } from "./auth.service.js";
import { AuthenticationController } from "./auth.controller.js";
import { EmailService } from "./email.service.js";

export default async function authenticationRoutes(app: FastifyInstance) {
    const emailService = new EmailService();
    const service = new AuthenticationService(emailService);
    const controller = new AuthenticationController(service);
  
    app.post("/register", controller.register);
    app.post("/verify-otp", controller.verifyOtp);
    app.post("/resend-otp", controller.resendOtp);
    app.post("/login", controller.login);
    app.post("/logout", { preHandler: [app.authenticate] }, controller.logout);
    app.post("/refresh", controller.refresh);
    app.post("/forgot-password", controller.forgotPassword);
    app.post("/verify-forgot-password-otp", controller.verifyForgotPasswordOtp);
    app.post("/reset-password", controller.resetPassword);
    app.post("/request-change-email", { preHandler: [app.authenticate] }, controller.requestChangeEmail);
    app.post("/verify-change-email", { preHandler: [app.authenticate] }, controller.verifyChangeEmail);
  }