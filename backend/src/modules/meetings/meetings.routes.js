import { Router } from "express";
import {
  createMeeting,
  getMyMeetings,
  removeMeeting,
} from "./meetings.controller.js";

import { requireAuth } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", getMyMeetings);

router.post(
  "/",
  allowRoles("CEO", "DEPARTMENT_HEAD", "TEAM_LEAD"),
  createMeeting
);

router.delete(
  "/:id",
  allowRoles("CEO", "DEPARTMENT_HEAD", "TEAM_LEAD"),
  removeMeeting
);

export default router;
