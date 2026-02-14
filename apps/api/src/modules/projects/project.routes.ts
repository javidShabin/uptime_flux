import { Router } from "express";
import { ProjectController } from "./project.controller";
import { requireAuth } from "../auth/auth.middleware";
import { requireRole } from "../rbac/requireRole";
import { validate } from "../../validation/validate";
import { createProjectSchema, memberListSchema } from "./project.validation";

const router = Router();
const controller = new ProjectController();

router.use(requireAuth);

router.post(
  "/create",
  validate(createProjectSchema),
  controller.create.bind(controller),
);

router.get(
  "/member-list",
  requireRole('OWNER'),
  validate(memberListSchema),
  controller.memberList.bind(controller),
);

export const projectRouter = router;
