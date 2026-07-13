import express from "express";
import { addNotice, getNotices, deleteNotice } from "../controllers/noticeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ✅ Everyone logged in can view
router.get("/", protect, getNotices);

// ✅ Admin only: Add & Delete
router.post("/", protect, allowRoles("admin"), addNotice);
router.delete("/:id", protect, allowRoles("admin"), deleteNotice);

export default router;
