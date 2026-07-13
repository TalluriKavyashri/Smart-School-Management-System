import express from "express";
import {
  addClass,
  getClasses,
  assignTeacher,
  updateClass,
  deleteClass,
  updateTimetable,
} from "../controllers/classController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import Classroom from "../models/classModel.js";

const router = express.Router();

/* ---------------------- ADMIN ROUTES ---------------------- */

router.post("/", protect, allowRoles("admin"), addClass);
router.put("/:id", protect, allowRoles("admin"), updateClass);
router.delete("/:id", protect, allowRoles("admin"), deleteClass);
router.post("/assign-teacher", protect, allowRoles("admin"), assignTeacher);

// MUST COME BEFORE "/:id"
router.post(
  "/update-timetable/:id",
  protect,
  allowRoles("admin"),
  updateTimetable
);

/* ---------------------- PUBLIC ROUTES ---------------------- */

// Get all classes
router.get("/", protect, getClasses);

// MUST COME BEFORE "/:id"
router.get("/:id/timetable", protect, async (req, res) => {
  try {
    // 🚫 Disable caching so timetable refresh works
    res.set("Cache-Control", "no-store");

    const cls = await Classroom.findById(req.params.id)
      .populate("teacher", "name email")
      .select("className timetable teacher");

    if (!cls) return res.status(404).json({ message: "Class not found" });

    res.json(cls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Single class (fallback)
router.get("/:id", protect, async (req, res) => {
  try {
    const cls = await Classroom.findById(req.params.id);
    res.json(cls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
