import Exam from "../models/examModel.js";
import Student from "../models/studentModel.js";
import Marks from "../models/marksModel.js";

// ✅ Add new exam
export const addExam = async (req, res) => {
  try {
    const exam = await Exam.create(req.body);
    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get exams
export const getExams = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ createdAt: -1 });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get students for class
export const getClassStudents = async (req, res) => {
  try {
    const stu = await Student.find({ className: req.params.className }).sort("rollNo");
    res.json(stu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Submit marks
export const submitMarks = async (req, res) => {
  try {
    const { examId, records } = req.body;

    // delete previous marks of this exam
    await Marks.deleteMany({ exam: examId });

    // insert new
    const result = await Marks.insertMany(
      records.map(r => ({ exam: examId, student: r.student, marks: r.marks }))
    );

    res.json({ message: "Marks saved", result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get result sheet
export const getResults = async (req, res) => {
  try {
    const marks = await Marks.find({ exam: req.params.examId })
      .populate("student", "name rollNo className")
      .populate("exam");

    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

};
// ✅ Delete exam (and related marks)
export const deleteExam = async (req, res) => {
  try {
    const examId = req.params.id;

    // delete exam
    const deletedExam = await Exam.findByIdAndDelete(examId);
    if (!deletedExam) return res.status(404).json({ message: "Exam not found" });

    // delete related marks
    await Marks.deleteMany({ exam: examId });

    res.json({ message: "Exam and its marks deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

