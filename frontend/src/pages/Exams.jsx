import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Exams() {
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);

  const [form, setForm] = useState({
    name: "",
    className: "",
    subject: "",
    date: new Date().toISOString().slice(0, 10),
  });

  // ✅ Load all exams
  const loadExams = async () => {
    try {
      const data = await api.get("/api/exams");
      setExams(data);
    } catch (err) {
      console.error("Error loading exams:", err.message);
    }
  };

  // ✅ Add a new exam
  const addExam = async () => {
    try {
      if (!form.name || !form.className || !form.subject)
        return alert("Please fill all fields");

      await api.post("/api/exams", form);
      setForm({
        name: "",
        className: "",
        subject: "",
        date: new Date().toISOString().slice(0, 10),
      });
      loadExams();
    } catch (err) {
      alert("Error adding exam: " + err.message);
    }
  };

  // ✅ Select exam and load students for marks entry
  const selectExam = async (exam) => {
    setSelectedExam(exam);
    const stu = await api.get(`/api/exams/class/${exam.className}/students`);
    setStudents(stu);
    setMarks(
      stu.map((s) => ({ student: s._id, name: s.name, rollNo: s.rollNo, marks: 0 }))
    );
  };

  // ✅ Submit marks for the selected exam
  const submitMarks = async () => {
    try {
      await api.post("/api/exams/marks", {
        examId: selectedExam._id,
        records: marks.map((m) => ({
          student: m.student,
          marks: Number(m.marks),
        })),
      });
      alert("✅ Marks saved!");
    } catch (err) {
      alert("❌ Failed to save marks: " + err.message);
    }
  };

  // ✅ Delete exam + related marks
  const deleteExam = async (id) => {
    if (!confirm("Delete this exam and all marks?")) return;
    try {
      await api.del(`/api/exams/${id}`);
      alert("✅ Exam deleted");
      loadExams(); // refresh the list
    } catch (err) {
      alert("❌ Failed to delete exam: " + err.message);
      console.error(err);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h1 className="font-bold text-xl">Exams & Marks</h1>

      {/* ✅ Add Exam */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="font-semibold mb-3">Add Exam</div>
        <div className="grid sm:grid-cols-4 gap-3">
          <input
            className="border rounded px-3 py-2"
            placeholder="Exam Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Class (10-A)"
            value={form.className}
            onChange={(e) => setForm({ ...form, className: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
          <button
            className="bg-black text-white px-4 py-2 rounded"
            onClick={addExam}
          >
            Add
          </button>
        </div>
      </div>

      {/* ✅ Exam List */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="font-semibold mb-3">Available Exams</div>

        {exams.map((ex) => (
          <div
            key={ex._id}
            className="border-b p-2 flex justify-between items-center"
          >
            <span>
              {ex.name} — {ex.className} — {ex.subject}
            </span>
            <div className="flex gap-2">
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded"
                onClick={() => selectExam(ex)}
              >
                Enter Marks
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => deleteExam(ex._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {exams.length === 0 && (
          <div className="text-gray-500">No exams</div>
        )}
      </div>

      {/* ✅ Marks Entry */}
      {selectedExam && (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="font-semibold mb-3">
            Enter Marks: {selectedExam.name} ({selectedExam.className})
          </h2>

          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Roll</th>
                <th className="p-2 text-left">Marks</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((m, i) => (
                <tr key={m.student} className="border-b">
                  <td className="p-2">{m.name}</td>
                  <td className="p-2">{m.rollNo}</td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={m.marks}
                      onChange={(e) => {
                        const updated = [...marks];
                        updated[i].marks = e.target.value;
                        setMarks(updated);
                      }}
                      className="border rounded px-2 py-1 w-20"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="bg-green-600 text-white px-4 py-2 rounded mt-3"
            onClick={submitMarks}
          >
            Save Marks
          </button>
        </div>
      )}
    </div>
  );
}
