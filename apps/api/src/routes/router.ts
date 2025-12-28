import { Router } from "express";
import { monitorRouter } from "../modules/monitor/monitor.route";
import { incidentRouter } from "../modules/incident/incident.route";

const v1Router = Router();

/**
 * API v1 Routes
 * All routes are prefixed with /api/v1
 */
v1Router.use("/monitors", monitorRouter);
v1Router.use("/incidents", incidentRouter);

export { v1Router };