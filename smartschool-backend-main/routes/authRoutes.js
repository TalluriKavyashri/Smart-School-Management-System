import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ TEMPORARY ROUTE TO RESET ADMIN PASSWORD
router.get("/reset-admin", async (req, res) => {
  const hash = await bcrypt.hash("admin123", 10);
  await User.updateOne(
    { email: "admin@gmail.com" },
    { $set: { password: hash } }
  );

  res.send("✅ Admin password reset to admin123");
});

export default router;
