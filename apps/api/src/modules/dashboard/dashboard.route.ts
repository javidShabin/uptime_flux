import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { requireAuth } from "../auth/auth.middleware";

const router = Router();
const controller = new DashboardController();

router.get("/summary", requireAuth, controller.getSummary);

export const dashboardRouter = router;
