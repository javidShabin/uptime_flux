
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
    app.post("/logout", controller.logout);
    app.post("/refresh", controller.refresh);
  }