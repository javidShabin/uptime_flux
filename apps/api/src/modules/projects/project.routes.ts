import { Router } from "express";
import { ProjectController } from "./project.controller";
import { requireAuth } from "../auth/auth.middleware";
import { validate } from "../../validation/validate";
import { createProjectSchema } from "./project.validation";

const router = Router();
const controller = new ProjectController();

router.use(requireAuth);

router.post(
  "/create",
  validate(createProjectSchema),
  controller.create.bind(controller),
);

export const projectRouter = router;
