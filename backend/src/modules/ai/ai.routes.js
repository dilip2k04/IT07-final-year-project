// ai.routes.js
import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { askAIController } from "./ai.controller.js";

const router = Router();

// Protect all AI routes
router.use(requireAuth);

// POST /api/ai/chat
router.post("/chat", askAIController);

export default router;