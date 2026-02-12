import { Router } from "express";
import {
  createMeeting,
  listMyMeetings,
  listMeetings,
  updateMeeting,      // ⭐
  deleteMeeting      // ⭐
} from "./meetings.controller.js";

import { requireAuth } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = Router();

router.use(requireAuth);

/* ======================================
   CRUD ROUTES
====================================== */

// used by useCrud()
router.get("/", listMeetings);

router.post(
  "/",
  allowRoles("CEO", "DEPARTMENT_HEAD", "TEAM_LEAD"),
  createMeeting
);

// ⭐ ADD THESE TWO
router.put(
  "/:id",
  allowRoles("CEO", "DEPARTMENT_HEAD", "TEAM_LEAD"),
  updateMeeting
);

router.delete(
  "/:id",
  allowRoles("CEO", "DEPARTMENT_HEAD", "TEAM_LEAD"),
  deleteMeeting
);

router.get("/my", listMyMeetings);

export default router;
