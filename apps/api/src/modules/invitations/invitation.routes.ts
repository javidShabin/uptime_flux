import { Router } from "express";
import { InviatationController } from "./inviatation.controller";
import { requireAuth } from "../auth/auth.middleware";
import { requireRole } from "../rbac/requireRole";
import { validate } from "../../validation/validate";
import { inviteMemberSchema } from "./invitation.validation";

const router = Router();
const controller = new InviatationController();

router.use(requireAuth);

router.post(
  "/:projectId/invite",
  requireRole("ADMIN"),
  validate(inviteMemberSchema),
  controller.invite.bind(controller),
);

export const invitationRouter = router;
