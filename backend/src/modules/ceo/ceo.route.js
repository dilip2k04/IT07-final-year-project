import { Router } from "express";
import { getCeoDashboard } from "./ceo.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = Router();

router.use(requireAuth);
router.use(allowRoles("CEO"));

router.get("/dashboard", getCeoDashboard);

export default router;
