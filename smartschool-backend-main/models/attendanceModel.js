import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },      // "2025-02-08"
    className: { type: String, required: true }, // <-- FIXED
    records: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          required: true,
        },
        present: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
