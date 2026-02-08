import { Router } from "express";
import { ProjectController } from "./project.controller";
import { requireAuth } from "../auth/auth.middleware";

const router = Router()
const controller = new ProjectController()

router.use(requireAuth)

router.post("/", controller.create)

export const projectRouter = router