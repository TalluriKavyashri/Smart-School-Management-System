import express from "express";
import { addMarks, getStudentMarks, getClassResult } from "../controllers/marksController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ✅ Admin & Teacher can add marks
router.post("/", protect, allowRoles("admin", "teacher"), addMarks);

// ✅ Everyone logged in can view their marks
router.get("/student", protect, allowRoles("admin", "teacher", "student", "parent"), getStudentMarks);

// ✅ Class results only for teacher/admin
router.get("/class", protect, allowRoles("admin", "teacher"), getClassResult);

export default router;
