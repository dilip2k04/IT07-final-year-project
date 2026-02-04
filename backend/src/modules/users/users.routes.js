import { Router } from "express";
import { listUsers, create, update, remove } from "./users.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = Router();

router.use(requireAuth);
router.use(allowRoles("CEO"));

router.get("/", listUsers);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
