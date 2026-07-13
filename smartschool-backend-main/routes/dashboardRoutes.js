import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

// Models
import Student from "../models/studentModel.js";
import Teacher from "../models/teacherModel.js";
import ClassModel from "../models/classModel.js";
import Payment from "../models/paymentModel.js";
import Exam from "../models/examModel.js";
import Notice from "../models/noticeModel.js";
import Attendance from "../models/attendanceModel.js";

const router = express.Router();

// GET /api/dashboard (Admin only)
router.get("/", protect, allowRoles("admin"), async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const [
      totalStudents,
      totalTeachers,
      totalClasses,
      totalExams,
      totalNotices,
      pendingFeesAggregate,
      todayAttendancePresent,
    ] = await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments(),
      ClassModel.countDocuments(),
      Exam.countDocuments(),
      Notice.countDocuments(),
      Payment.aggregate([
        { $match: { status: { $in: ["pending", "due"] } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Attendance.countDocuments({
        date: { $gte: start, $lte: end },
        status: "present",
      }),
    ]);

    const pendingFees =
      pendingFeesAggregate?.[0]?.total ? pendingFeesAggregate[0].total : 0;

    res.json({
      totalStudents,
      totalTeachers,
      totalClasses,
      totalExams,
      totalNotices,
      pendingFees,
      todayAttendance: todayAttendancePresent,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
});

export default router;
