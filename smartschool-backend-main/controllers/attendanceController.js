import Attendance from "../models/attendanceModel.js";
import Student from "../models/studentModel.js";

// ✅ Get students by class
export const getClassStudents = async (req, res) => {
  try {
    const students = await Student.find({ className: req.params.className })
      .sort("rollNo");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Mark or update attendance
export const markAttendance = async (req, res) => {
  try {
    const { className, date, records } = req.body;

    let att = await Attendance.findOne({ className, date });

    if (att) {
      att.records = records;
      await att.save();
      return res.json({ message: "Attendance updated" });
    }

    att = await Attendance.create({ className, date, records });
    res.json({ message: "Attendance marked", attendance: att });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get attendance history (sorted latest first)
export const getAttendanceHistory = async (req, res) => {
  try {
    const list = await Attendance.find({ className: req.params.className })
      .populate("records.student", "name rollNo className")
      .sort({ date: -1 });

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Optional: Get all attendance
export const getAttendance = async (req, res) => {
  try {
    const list = await Attendance.find()
      .populate("records.student", "name rollNo className")
      .sort({ date: -1 });

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
