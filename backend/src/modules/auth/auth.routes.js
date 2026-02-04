import { Router } from "express";
import { login } from "./auth.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);

router.get("/me", requireAuth, (req, res) => {
  res.json(req.user);
});

export default router;
