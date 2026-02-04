import { Router } from "express";
import { list, create, update, remove } from "./departments.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = Router();
router.use(requireAuth, allowRoles("CEO"));

router.get("/", list);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
