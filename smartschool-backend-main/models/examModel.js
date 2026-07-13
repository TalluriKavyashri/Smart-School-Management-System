import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },    // "Unit Test", "Final Exam"
    className: { type: String, required: true }, // "10-A"
    subject: { type: String, required: true },  // "Maths"
    date: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Exam", examSchema);
