import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({
    className: "",
    teacher: "",
    subjects: "",
  });

  const load = async () => {
    const c = await api.get("/api/classes");
    const t = await api.get("/api/teachers");
    setClasses(c);
    setTeachers(t);
  };

  const addClass = async () => {
    if (!form.className) return alert("Enter class name");
    await api.post("/api/classes", {
      ...form,
      subjects: form.subjects.split(",").map((s) => s.trim()),
    });
    setForm({ className: "", teacher: "", subjects: "" });
    load();
  };

  const deleteClass = async (id) => {
    if (!confirm("Delete this class?")) return;
    await api.del(`/api/classes/${id}`);
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-4 space-y-6">
      <h1 className="font-bold text-xl">🏫 Class Management</h1>

      {/* ✅ Create Class */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="font-semibold mb-3">Create New Class</div>
        <div className="grid sm:grid-cols-3 gap-3">
          <input
            className="border px-3 py-2 rounded"
            placeholder="Class Name (10-A)"
            value={form.className}
            onChange={(e) => setForm({ ...form, className: e.target.value })}
          />
          <select
            className="border px-3 py-2 rounded"
            value={form.teacher}
            onChange={(e) => setForm({ ...form, teacher: e.target.value })}
          >
            <option>Select Teacher</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>
          <input
            className="border px-3 py-2 rounded"
            placeholder="Subjects (comma separated)"
            value={form.subjects}
            onChange={(e) => setForm({ ...form, subjects: e.target.value })}
          />
          <button
            onClick={addClass}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* ✅ Class List */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="font-semibold mb-3">Class List</div>
        {classes.map((c) => (
          <div key={c._id} className="border-b py-2">
            <div className="flex justify-between items-center">
              <div>
                <b>{c.className}</b> — {c.teacher ? c.teacher.name : "No teacher"}
                <div className="text-sm text-gray-600">
                  Subjects: {c.subjects?.join(", ") || "—"}
                </div>
              </div>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => deleteClass(c._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {classes.length === 0 && (
          <div className="text-gray-500 text-center py-4">No classes yet</div>
        )}
      </div>
    </div>
  );
}
