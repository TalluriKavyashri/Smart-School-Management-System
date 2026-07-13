import express from "express";
import {
  addTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Everyone logged in can view teachers
router.get("/", protect, getTeachers);
router.get("/:id", protect, getTeacherById);

// Only admin can modify teachers
router.post("/", protect, allowRoles("admin"), addTeacher);
router.put("/:id", protect, allowRoles("admin"), updateTeacher);
router.delete("/:id", protect, allowRoles("admin"), deleteTeacher);

export default router;
