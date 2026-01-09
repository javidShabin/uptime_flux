import { Router } from "express";
import { IncidentController } from "./incident.controller.js";

const router = Router();
const controller = new IncidentController();

router.get("/", controller.list.bind(controller));
router.get("/:id", controller.getById.bind(controller));

export const incidentRouter = router;
