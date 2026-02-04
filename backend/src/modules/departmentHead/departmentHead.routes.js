import { Router } from "express";
import { getDepartmentHeadDashboard } from "./departmentHead.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = Router();

router.use(requireAuth);
router.use(allowRoles("DEPARTMENT_HEAD"));

router.get("/dashboard", getDepartmentHeadDashboard);

export default router;
