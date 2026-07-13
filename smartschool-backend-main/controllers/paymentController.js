import Payment from "../models/paymentModel.js";
import Student from "../models/studentModel.js";

// ✅ Create Payment
export const addPayment = async (req, res) => {
  try {
    const { student, amount, date, method } = req.body;

    const payment = await Payment.create({
      student,
      amount,
      date,
      method,
      status: "pending"
    });

    // reduce pending fees of student
    const stu = await Student.findById(student);
    if (stu) {
      stu.feesDue = Math.max(0, (stu.feesDue || 0) - amount);
      await stu.save();
    }

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update fee status paid/pending
export const updateFeeStatus = async (req, res) => {
  try {
    const updated = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all payments
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("student", "name className");

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
