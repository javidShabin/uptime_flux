import { Router } from "express";
import { InviatationController } from "./inviatation.controller";
import { requireAuth } from "../auth/auth.middleware";

const router = Router()
const controller = new InviatationController()

router.use(requireAuth)

router.post("/", controller.invite)

export const projectRouter = router