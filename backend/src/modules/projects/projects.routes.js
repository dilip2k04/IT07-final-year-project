import { Router } from "express";
import {
  listProjects,
  create,
  update,
  remove,
  getProjectById, // ✅ MUST MATCH EXPORT NAME
} from "./projects.controller.js";

import { requireAuth } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = Router();

router.use(requireAuth);

// LIST
router.get(
  "/",
  allowRoles("CEO", "DEPARTMENT_HEAD", "TEAM_LEAD", "EMPLOYEE"),
  listProjects
);

// GET ONE ✅
router.get(
  "/:id",
  allowRoles("CEO", "DEPARTMENT_HEAD", "TEAM_LEAD", "EMPLOYEE"),
  getProjectById
);


// CREATE
router.post("/", allowRoles("CEO", "DEPARTMENT_HEAD"), create);

// UPDATE
router.put("/:id", allowRoles("CEO", "DEPARTMENT_HEAD"), update);

// DELETE
router.delete("/:id", allowRoles("CEO", "DEPARTMENT_HEAD"), remove);

export default router;
