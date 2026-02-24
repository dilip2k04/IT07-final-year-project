import { Router } from "express";
import {
  createMeeting,
  listMeetings,
  updateMeeting,
  deleteMeeting
} from "./meetings.controller.js";

import { requireAuth } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = Router();

router.use(requireAuth);

/* ======================================
   GET MEETINGS
   - CEO → All meetings
   - Others → Only assigned meetings
====================================== */
router.get("/", listMeetings);

/* ======================================
   CREATE
====================================== */
router.post(
  "/",
  allowRoles("CEO", "DEPARTMENT_HEAD", "TEAM_LEAD", "EMPLOYEE"),
  createMeeting
);

/* ======================================
   UPDATE
====================================== */
router.put(
  "/:id",
  allowRoles("CEO", "DEPARTMENT_HEAD", "TEAM_LEAD"),
  updateMeeting
);

/* ======================================
   DELETE
====================================== */
router.delete(
  "/:id",
  allowRoles("CEO", "DEPARTMENT_HEAD", "TEAM_LEAD"),
  deleteMeeting
);

export default router;