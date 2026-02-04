import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = Router();

/* ===========================
   STORAGE SETUP
=========================== */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const { projectId } = req.params;
    const dir = `uploads/projects/${projectId}`;

    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },

  filename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.use(requireAuth);

/* ===========================
   LIST DOCUMENTS
=========================== */
router.get(
  "/:projectId",
  allowRoles("CEO", "DEPARTMENT_HEAD", "TEAM_LEAD", "EMPLOYEE"),
  (req, res) => {
    const dir = `uploads/projects/${req.params.projectId}`;

    if (!fs.existsSync(dir)) return res.json([]);

    const files = fs.readdirSync(dir).map((f) => ({
      name: f,
      url: `/uploads/projects/${req.params.projectId}/${f}`,
    }));

    res.json(files);
  }
);

/* ===========================
   UPLOAD DOCUMENT
=========================== */
router.post(
  "/:projectId",
  allowRoles("CEO", "DEPARTMENT_HEAD", "TEAM_LEAD", "EMPLOYEE"),
  upload.single("file"),
  (req, res) => {
    res.json({
      message: "Uploaded",
      file: req.file.filename,
    });
  }
);

export default router;
