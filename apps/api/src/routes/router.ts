import { Router } from "express";
import { monitorRouter } from "../modules/monitor/monitor.route";

const v1Router = Router();

/**
 * API v1 Routes
 * All routes are prefixed with /api/v1
 */
v1Router.use("/monitors", monitorRouter);

export { v1Router };