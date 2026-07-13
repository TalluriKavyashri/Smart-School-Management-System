import express from "express";
import {
  markAttendance,
  getAttendance,
  getClassStudents,
  getAttendanceHistory,
} from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ✅ Get students of a class
router.get("/class/:className/students", protect, getClassStudents);

// ✅ Mark or update attendance
router.post("/", protect, allowRoles("teacher", "admin"), markAttendance);

// ✅ Get attendance history for a class
router.get("/class/:className/history", protect, getAttendanceHistory);

// ✅ (Optional) Get all attendance
router.get("/", protect, allowRoles("teacher", "admin"), getAttendance);

export default router;
