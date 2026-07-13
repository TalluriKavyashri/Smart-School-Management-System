import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "SCHOOL_SECRET", {
    expiresIn: "30d",
  });
};

// ✅ Register User (No change needed, it's fine)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ ✅ FIXED LOGIN (MATCHES FRONTEND EXACTLY)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // missing fields
    if (!email || !password)
      return res.status(400).json({ message: "Email & Password required" });

    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword)
      return res.status(401).json({ message: "Invalid email or password" });

    // ✅ final response exactly as frontend expects
    return res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role),
    });
  } catch (err) {
    console.error("🔥 Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
