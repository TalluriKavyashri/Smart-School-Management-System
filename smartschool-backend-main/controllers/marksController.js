import Marks from "../models/marksModel.js";

// ✅ Add marks for a student
export const addMarks = async (req, res) => {
  try {
    const marks = await Marks.create(req.body);
    res.status(201).json(marks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Get marks of a student for an exam
export const getStudentMarks = async (req, res) => {
  try {
    const { studentId, examId } = req.query;

    const marks = await Marks.find({ student: studentId, exam: examId })
      .populate("student")
      .populate("exam");

    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get class result for exam
export const getClassResult = async (req, res) => {
  try {
    const { className, examId } = req.query;

    const marks = await Marks.find({ exam: examId })
      .populate("student")
      .populate("exam");

    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
