import express from "express";
import {
  addPayment,
  getPayments,
  updateFeeStatus
} from "../controllers/paymentController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ✅ Add fee
router.post("/", protect, allowRoles("admin"), addPayment);

// ✅ Get all payments
router.get("/", protect, allowRoles("admin"), getPayments);

// ✅ Update status (paid/pending)
router.put("/:id", protect, allowRoles("admin"), updateFeeStatus);

export default router;
