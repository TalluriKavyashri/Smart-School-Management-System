import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
    method: { type: String, default: "cash" }
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
