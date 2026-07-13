import Student from "../models/studentModel.js";
import Teacher from "../models/teacherModel.js";
import ClassModel from "../models/classModel.js";
import Attendance from "../models/attendanceModel.js";
import Exam from "../models/examModel.js";
import Notice from "../models/noticeModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Count students
    const totalStudents = await Student.countDocuments();

    // Count teachers
    const totalTeachers = await Teacher.countDocuments();

    // Count classes
    const totalClasses = await ClassModel.countDocuments();

    // Pending fees count (students with feesDue > 0)
    const pendingFees = await Student.countDocuments({ feesDue: { $gt: 0 } });

    // Exams count
    const totalExams = await Exam.countDocuments();

    // Notices count
    const totalNotices = await Notice.countDocuments();

    // Today’s attendance entries
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const todayAttendance = await Attendance.countDocuments({ date: today });

    res.json({
      totalStudents,
      totalTeachers,
      totalClasses,
      pendingFees,
      todayAttendance,
      totalExams,
      totalNotices
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
