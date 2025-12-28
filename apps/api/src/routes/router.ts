import { Router } from "express";
import { monitorRouter } from "../modules/monitor/monitor.route";
import { incidentRouter } from "../modules/incident/incident.route";
import { authRouter } from "../modules/auth/auth.route";

const v1Router = Router();

/**
 * API v1 Routes
 * All routes are prefixed with /api/v1
 */
v1Router.use("/monitors", monitorRouter);
v1Router.use("/incidents", incidentRouter);
v1Router.use("/auth", authRouter);

export { v1Router };