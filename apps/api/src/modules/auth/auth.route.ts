import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();
const controller = new AuthController();

// Auth routes
router.post("/register", controller.register.bind(controller));
router.post("/login", controller.login.bind(controller));

export const authRouter = router;