import express from "express";
import {
  addExam,
  getExams,
  getClassStudents,
  submitMarks,
  getResults,
  deleteExam,
} from "../controllers/examController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ✅ Create exam
router.post("/", protect, allowRoles("admin", "teacher"), addExam);

// ✅ List exams
router.get("/", protect, getExams);

// ✅ Get students of a class
router.get("/class/:className/students", protect, getClassStudents);

// ✅ Submit marks
router.post("/marks", protect, allowRoles("admin", "teacher"), submitMarks);

// ✅ View result sheet of exam
router.get("/:examId/results", protect, getResults);

// ✅ Delete exam (admin or teacher)
router.delete("/:id", protect, allowRoles("admin", "teacher"), deleteExam);

export default router;
