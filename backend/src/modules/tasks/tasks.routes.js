import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

import {
  create,
  projectTasks,
  myTasks,
  updateStatus,
} from "./tasks.controller.js";

const router = Router();
router.use(requireAuth);

/* TEAM LEAD */
router.post("/", allowRoles("TEAM_LEAD"), create);
router.get(
  "/project/:projectId",
  allowRoles("TEAM_LEAD"),
  projectTasks
);

/* EMPLOYEE */
router.get("/my", allowRoles("EMPLOYEE"), myTasks);
router.put(
  "/:id/status",
  allowRoles("EMPLOYEE"),
  updateStatus
);

export default router;
