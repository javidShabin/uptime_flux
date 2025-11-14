
import type { FastifyInstance } from "fastify";
import { AuthenticationService } from "./auth.service.js";
import { AuthenticationController } from "./auth.controller.js";
import { EmailService } from "./email.service.js";

export default async function authenticationRoutes(app: FastifyInstance) {
    const emailService = new EmailService();
    const service = new AuthenticationService(emailService);
    const controller = new AuthenticationController(service);
  
    app.post("/register", controller.register);
  }