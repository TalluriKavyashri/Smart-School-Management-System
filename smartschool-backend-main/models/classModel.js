import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    className: { type: String, required: true },       // e.g., "10-A"
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }, // class teacher
    subjects: [String],                                // ["Math", "Science", "English"]
    timetable: {
      Mon: [String],
      Tue: [String],
      Wed: [String],
      Thu: [String],
      Fri: [String],
      Sat: [String],
    }
  },
  { timestamps: true }
);

export default mongoose.model("Classroom", classSchema);
