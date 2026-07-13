import { useEffect, useState } from "react";
import api from "../lib/api";
import { CalendarDays, BookOpen } from "lucide-react";

export default function ViewTimetable() {
  const [classes, setClasses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [timetable, setTimetable] = useState(null);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    (async () => {
      const data = await api.get("/api/classes");
      setClasses(data);
    })();
  }, []);

  const loadTimetable = async (id) => {
    const data = await api.get(`/api/classes/${id}/timetable`);
    setTimetable(data.timetable);
    setSelected(data.className);
  };

  return (
    <div className="p-6 space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3">
        <CalendarDays size={34} className="text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">View Timetable</h1>
      </div>

      {/* Class Selector */}
      <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-200 shadow-lg">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <BookOpen size={20} className="text-purple-600" />
          Select Class
        </h2>

        <select
          className="px-4 py-3 bg-white/70 border border-gray-300 rounded-xl shadow-sm
                     focus:ring-2 focus:ring-blue-400 outline-none w-full sm:w-64"
          onChange={(e) => loadTimetable(e.target.value)}
        >
          <option value="">Choose Class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.className}
            </option>
          ))}
        </select>
      </div>

      {/* Timetable Display */}
      {timetable ? (
        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-200 shadow-lg">
          <h2 className="text-xl font-bold mb-5 text-gray-800">
            Timetable for {selected}
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-600 border-b">
                  <th className="p-3 text-left w-32">Day</th>
                  <th className="p-3 text-left">Subjects</th>
                </tr>
              </thead>

              <tbody>
                {days.map((day) => (
                  <tr key={day} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3 font-medium">{day}</td>
                    <td className="p-3">
                      {timetable[day]?.length > 0 ? (
                        <div className="flex gap-2 flex-wrap">
                          {timetable[day].map((sub, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-xl text-sm shadow-sm"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">— No Subjects —</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 italic">
          Select a class to view its timetable.
        </div>
      )}
    </div>
  );
}
