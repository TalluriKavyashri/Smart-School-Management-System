import { useEffect, useState } from "react";
import api from "../lib/api";
import { Wallet, IndianRupee, CheckCircle, Clock } from "lucide-react";

export default function Fees() {
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [form, setForm] = useState({ studentId: "", amount: "" });

  const load = async () => {
    const s = await api.get("/api/students");
    setStudents(s);

    const f = await api.get("/api/payments");
    setFees(f);
  };

  const addFee = async () => {
    if (!form.studentId || !form.amount) return alert("Fill all fields");

    await api.post("/api/payments", {
      student: form.studentId,
      amount: Number(form.amount),
      method: "cash",
      date: new Date().toISOString().slice(0, 10),
    });

    setForm({ studentId: "", amount: "" });
    load();
  };

  const toggleStatus = async (id, status) => {
    await api.put(`/api/payments/${id}`, { status });
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6 space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Wallet size={34} className="text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Fees Management</h1>
      </div>

      {/* Add Fee */}
      <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-200 shadow-lg">

        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <IndianRupee size={20} className="text-green-600" />
          Add Fee Payment
        </h2>

        <div className="grid sm:grid-cols-3 gap-4">
          {/* Student Dropdown */}
          <select
            className="px-4 py-3 bg-white/70 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.studentId}
            onChange={(e) => setForm({ ...form, studentId: e.target.value })}
          >
            <option value="">Select student</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.className})
              </option>
            ))}
          </select>

          {/* Amount */}
          <input
            type="number"
            className="px-4 py-3 bg-white/70 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Amount (₹)"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />

          {/* Add Button */}
          <button
            onClick={addFee}
            className="px-5 py-3 rounded-xl bg-blue-600 text-white shadow hover:bg-blue-700 transition"
          >
            Add Payment
          </button>
        </div>
      </div>

      {/* Fee Records */}
      <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-200 shadow-lg">

        <h2 className="font-semibold mb-4">Fee Records</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600 border-b">
                <th className="p-3 text-left">Student</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {fees.map((f) => (
                <tr key={f._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">
                    {f.student?.name} ({f.student?.className})
                  </td>

                  <td className="p-3 text-green-700 font-semibold">
                    ₹{f.amount}
                  </td>

                  <td className="p-3">
                    {f.status === "paid" ? (
                      <span className="flex items-center gap-1 text-green-600 font-medium">
                        <CheckCircle size={16} />
                        Paid
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-yellow-600 font-medium">
                        <Clock size={16} />
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    {f.status === "pending" ? (
                      <button
                        className="px-4 py-2 rounded-xl bg-green-600 text-white shadow hover:bg-green-700 transition"
                        onClick={() => toggleStatus(f._id, "paid")}
                      >
                        Mark Paid
                      </button>
                    ) : (
                      <button
                        className="px-4 py-2 rounded-xl bg-yellow-500 text-white shadow hover:bg-yellow-600 transition"
                        onClick={() => toggleStatus(f._id, "pending")}
                      >
                        Mark Pending
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {/* No Records */}
              {fees.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-5 text-gray-500">
                    No fee records available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
