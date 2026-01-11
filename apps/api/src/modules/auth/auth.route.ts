import { Router } from "express";
import { AuthController } from "./auth.controller.js";

const router = Router();
const controller = new AuthController();

// Auth routes
router.post("/register", controller.register.bind(controller));
router.post("/verify-email", controller.verifyEmail.bind(controller))
router.post("/login", controller.login.bind(controller));
router.post("/logout", controller.logout.bind(controller));

export const authRouter = router;