import { useEffect, useState } from "react";
import api from "../lib/api";
import {
  CalendarDays,
  Users,
  CheckSquare,
  History,
} from "lucide-react";

export default function Attendance() {
  const [className, setClassName] = useState("");
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [history, setHistory] = useState([]);

  const loadStudents = async () => {
    try {
      if (!className) return;
      const data = await api.get(`/api/attendance/class/${className}/students`);
      setStudents(data);
      setRecords(data.map((s) => ({ student: s._id, present: true })));
    } catch (err) {
      alert("Error loading students: " + err.message);
    }
  };

  const submitAttendance = async () => {
    try {
      await api.post("/api/attendance", { className, date, records });
      alert("Attendance saved!");
      loadHistory();
    } catch (err) {
      alert("Error saving attendance: " + err.message);
    }
  };

  const loadHistory = async () => {
    try {
      if (!className) return;
      const data = await api.get(`/api/attendance/class/${className}/history`);
      setHistory(data);
    } catch {}
  };

  useEffect(() => {
    if (className) loadStudents();
  }, [className]);

  return (
    <div className="p-6 space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3">
        <CalendarDays size={32} className="text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Attendance</h1>
      </div>

      {/* Select Class */}
      <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-200 shadow-lg">

        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Users size={20} className="text-blue-600" />
          Select Class
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="px-4 py-3 bg-white/70 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Example: 10-A"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />

          <button
            onClick={loadStudents}
            className="px-5 py-3 rounded-xl bg-blue-600 text-white shadow hover:bg-blue-700 transition flex items-center gap-2"
          >
            Load
          </button>
        </div>
      </div>

      {/* Mark Attendance */}
      {students.length > 0 && (
        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-200 shadow-lg">

          <h2 className="font-semibold mb-5 flex items-center gap-2">
            <CheckSquare size={20} className="text-green-600" />
            Mark Attendance — {date}
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-600 border-b">
                  <th className="p-3 text-left">Student</th>
                  <th className="p-3 text-left">Roll</th>
                  <th className="p-3 text-left">Present</th>
                </tr>
              </thead>

              <tbody>
                {students.map((s, i) => (
                  <tr
                    key={s._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{s.name}</td>
                    <td className="p-3">{s.rollNo}</td>

                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={records[i]?.present}
                        onChange={(e) => {
                          const updated = [...records];
                          updated[i].present = e.target.checked;
                          setRecords(updated);
                        }}
                        className="w-5 h-5 accent-green-600"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={submitAttendance}
            className="mt-5 px-5 py-3 rounded-xl bg-green-600 text-white shadow hover:bg-green-700 transition"
          >
            Save Attendance
          </button>

        </div>
      )}

      {/* Attendance History */}
      <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-200 shadow-lg">

        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <History size={20} className="text-indigo-600" />
          Attendance History
        </h2>

        {history.length === 0 && (
          <div className="text-gray-500">No history available</div>
        )}

        <div className="space-y-3">
          {history.map((h) => (
            <div
              key={h._id}
              className="border bg-white/70 p-4 rounded-xl shadow hover:shadow-md transition"
            >
              <div className="font-semibold text-gray-800">
                {new Date(h.date).toLocaleDateString()}
              </div>

              <div className="text-gray-600 text-sm">
                {h.records.filter((r) => r.present).length} / {h.records.length}{" "}
                present
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
