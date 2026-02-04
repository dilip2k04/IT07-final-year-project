import { Router } from "express";
import { ROLES } from "../../utils/roles.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import Department from "../../models/Department.js";   // ✅ FIX
import User from "../../models/User.js";               // ✅ FIX

const router = Router();

/* GET all roles */
router.get("/roles", requireAuth, (req, res) => {
  res.json(Object.values(ROLES));
});

/* GET all departments */
router.get("/departments", requireAuth, async (req, res) => {
  try {
    const depts = await Department.find().select("_id name");
    res.json(depts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET users by department / role (for dropdowns) */
router.get("/users", requireAuth, async (req, res) => {
  try {
    const { departmentId, role } = req.query;

    const filter = {};
    if (departmentId) filter.departmentId = departmentId;
    if (role) filter.role = role;

    const users = await User.find(filter).select("_id name role departmentId");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
