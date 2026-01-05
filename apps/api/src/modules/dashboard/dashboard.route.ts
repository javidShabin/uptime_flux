import { Router } from "express";
import { DashboardController } from "./dashboard.controller.js";
import { requireAuth } from "../auth/auth.middleware.js";

const router = Router();
const controller = new DashboardController();

router.get("/summary", requireAuth, controller.getSummary);
router.get("/graph-summary", requireAuth, controller.getGraphSummary);

export const dashboardRouter = router;
