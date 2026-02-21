import { Router } from "express";

import { requireAuth } from "../auth/auth.middleware";
import { requireRole } from "../rbac/requireRole";
import { validate } from "../../validation/validate";
import { MembershipController } from "./membership.controller";
import { memberListSchema, removeMember } from "./membership.validation";

const router = Router();
const controller = new MembershipController();

router.use(requireAuth);

router.get(
  "/member-list",
  requireRole("OWNER"),
  validate(memberListSchema),
  controller.memberList.bind(controller),
);

router.delete(
  "/remove-member",
  requireRole("OWNER"),
  validate(removeMember),
  controller.removeMember.bind(controller),
);

export const membershipRouter = router;
