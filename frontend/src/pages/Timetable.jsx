import { useEffect, useState } from "react";
import api from "../lib/api";
import { CalendarDays, Plus, Trash2 } from "lucide-react";

export default function Timetable() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  const [timetable, setTimetable] = useState({
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
  });

  const [subjectsInput, setSubjectsInput] = useState("");

  // Load all classes
  const loadClasses = async () => {
    try {
      const data = await api.get("/api/classes");
      setClasses(data);
    } catch (err) {
      alert("Failed to load classes: " + err.message);
    }
  };

  // Load timetable for class
  const loadTimetable = async (id) => {
    try {
      const data = await api.get(`/api/classes/${id}/timetable`);

      if (data.timetable) {
        setTimetable(data.timetable);
      } else {
        setTimetable({
          Mon: [],
          Tue: [],
          Wed: [],
          Thu: [],
          Fri: [],
          Sat: [],
        });
      }
    } catch (err) {
      alert("Error loading timetable: " + err.message);
    }
  };

  // Save timetable
  const saveTimetable = async () => {
    try {
      await api.post(`/api/classes/update-timetable/${selectedClass._id}`, {
        timetable,
      });

      alert("✨ Timetable saved successfully!");
      loadTimetable(selectedClass._id); // auto refresh
    } catch (err) {
      alert("❌ Save failed: " + err.message);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  return (
    <div className="p-6 space-y-10">

      {/* Header */}
      <div className="flex items-center gap-3">
        <CalendarDays size={34} className="text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Timetable Editor</h1>
      </div>

      {/* Class Selector */}
      <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl border shadow-lg">
        <h2 className="font-semibold text-lg mb-3">Select Class</h2>

        <select
          className="px-4 py-3 bg-white/70 border border-gray-300 rounded-xl shadow-sm 
                     focus:ring-2 focus:ring-blue-400 outline-none w-full sm:w-72"
          onChange={(e) => {
            const cls = classes.find((c) => c._id === e.target.value);
            setSelectedClass(cls);
            if (cls) loadTimetable(cls._id);
          }}
        >
          <option value="">Choose a class</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.className}
            </option>
          ))}
        </select>
      </div>

      {/* Editor */}
      {selectedClass && (
        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border shadow-lg">

          <h2 className="text-xl font-bold mb-5">
            Editing Timetable for {selectedClass.className}
          </h2>

          {Object.keys(timetable).map((day) => (
            <div key={day} className="mb-6">

              <h3 className="font-semibold text-gray-800 mb-2">{day}</h3>

              <div className="flex flex-wrap gap-2">
                {(timetable[day] || []).map((sub, i) => (
                  <span
                    key={i}
                    className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm 
                               flex items-center gap-2 shadow-sm"
                  >
                    {sub}
                    <Trash2
                      size={16}
                      className="cursor-pointer text-red-500"
                      onClick={() => {
                        const updated = { ...timetable };
                        updated[day] = updated[day].filter((_, j) => j !== i);
                        setTimetable(updated);
                      }}
                    />
                  </span>
                ))}
              </div>

              <div className="flex gap-3 mt-3">
                <input
                  placeholder="Add subject"
                  value={subjectsInput}
                  onChange={(e) => setSubjectsInput(e.target.value)}
                  className="px-4 py-2 border rounded-xl w-full
                             bg-white/70 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <button
                  className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-xl shadow
                             hover:bg-green-700 transition"
                  onClick={() => {
                    if (!subjectsInput.trim()) return;

                    const updated = { ...timetable };
                    updated[day] = [...updated[day], subjectsInput.trim()];

                    setTimetable(updated);
                    setSubjectsInput("");
                  }}
                >
                  <Plus size={18} /> Add
                </button>
              </div>
            </div>
          ))}

          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg shadow mt-6
                       hover:bg-blue-700 transition"
            onClick={saveTimetable}
          >
            💾 Save Timetable
          </button>

        </div>
      )}
    </div>
  );
}
