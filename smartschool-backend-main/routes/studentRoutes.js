import express from "express";
import {
  addStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ✅ Only admin can create, update, delete
router.post("/", protect, allowRoles("admin"), addStudent);
router.put("/:id", protect, allowRoles("admin"), updateStudent);
router.delete("/:id", protect, allowRoles("admin"), deleteStudent);

// ✅ Everyone logged in can view
router.get("/", protect, getStudents);
router.get("/:id", protect, getStudentById);

export default router;
