import mongoose from "mongoose";

const marksSchema = new mongoose.Schema(
  {
    exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    marks: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Marks", marksSchema);
