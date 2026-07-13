import Classroom from "../models/classModel.js";
import Teacher from "../models/teacherModel.js";

// ✅ Create class
export const addClass = async (req, res) => {
  try {
    const { className, teacher, subjects, timetable } = req.body;

    const exists = await Classroom.findOne({ className });
    if (exists) return res.status(400).json({ message: "Class already exists" });

    const newClass = await Classroom.create({ className, teacher, subjects, timetable });
    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all classes with teacher populated
export const getClasses = async (req, res) => {
  try {
    const classes = await Classroom.find()
      .populate("teacher", "name email subject phone");
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Assign teacher to class
export const assignTeacher = async (req, res) => {
  try {
    const { classId, teacherId } = req.body;

    const updated = await Classroom.findByIdAndUpdate(
      classId,
      { teacher: teacherId },
      { new: true }
    ).populate("teacher", "name email subject");

    res.json({ message: "Teacher assigned successfully", class: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update subjects or timetable
export const updateClass = async (req, res) => {
  try {
    const updated = await Classroom.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Class not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Delete class
export const deleteClass = async (req, res) => {
  try {
    const deleted = await Classroom.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Class not found" });
    res.json({ message: "Class deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update timetable only (used by route /update-timetable/:id)
export const updateTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    const { timetable } = req.body;

    const cls = await Classroom.findByIdAndUpdate(
      id,
      { timetable },
      { new: true }
    );

    if (!cls) return res.status(404).json({ message: "Class not found" });

    res.json({ message: "Timetable updated successfully", class: cls });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
