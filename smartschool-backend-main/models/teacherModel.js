import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    phone: { type: String },
    classAssigned: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);
