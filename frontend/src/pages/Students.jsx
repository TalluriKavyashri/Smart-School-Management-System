import { useEffect, useState } from "react";
import { UserPlus, Trash2 } from "lucide-react";
import api from "../lib/api";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    rollNo: "",
    className: "",
    age: "",
  });

  // Load all students
  const loadStudents = async () => {
    try {
      const data = await api.get("/api/students");
      setStudents(data);
    } catch (err) {
      console.error("Error loading students:", err.message);
    }
  };

  // Add student
  const addStudent = async () => {
    if (!form.name || !form.rollNo || !form.className)
      return alert("Please fill all required fields!");

    try {
      setLoading(true);
      await api.post("/api/students", form);

      setForm({ name: "", rollNo: "", className: "", age: "" });
      loadStudents();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete student
  const deleteStudent = async (id) => {
    if (!confirm("Delete this student?")) return;

    try {
      await api.del(`/api/students/${id}`);
      loadStudents();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">

      {/* 🔷 Add Student Card */}
      <div className="bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
          <UserPlus size={22} />
          Add Student
        </h2>

        <div className="grid sm:grid-cols-5 gap-4">
          <input
            className="inputBox"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="inputBox"
            placeholder="Roll No"
            value={form.rollNo}
            onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
          />

          <input
            className="inputBox"
            placeholder="Class (e.g., 10-A)"
            value={form.className}
            onChange={(e) => setForm({ ...form, className: e.target.value })}
          />

          <input
            type="number"
            className="inputBox"
            placeholder="Age"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
          />

          <button
            onClick={addStudent}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 text-white rounded-xl shadow-md disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>

      {/* 🔷 Students Table */}
      <div className="bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl p-6">

        <h2 className="text-xl font-bold text-gray-800 mb-4">Students List</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-50 text-gray-700">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Roll No</th>
                <th className="p-3 text-left">Class</th>
                <th className="p-3 text-left">Age</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-5 text-gray-500">
                    No students added yet.
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr
                    key={s._id}
                    className="border-b hover:bg-blue-50/50 transition"
                  >
                    <td className="p-3 font-medium">{s.name}</td>
                    <td className="p-3">{s.rollNo}</td>
                    <td className="p-3">{s.className}</td>
                    <td className="p-3">{s.age}</td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => deleteStudent(s._id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
