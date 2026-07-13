import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/api";
import StatCard from "../components/StatCard";
import { CalendarDays, Eye } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get("/api/dashboard");
        setStats(data);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!stats) return <div className="p-4">Loading dashboard…</div>;

  const items = [
    ["Students", stats.totalStudents],
    ["Teachers", stats.totalTeachers],
    ["Classes", stats.totalClasses],
    [
      "Pending Fees",
      `₹${Number(stats.pendingFees || 0).toLocaleString("en-IN")}`,
    ],
    ["Today's Attendance", stats.todayAttendance],
    ["Exams", stats.totalExams],
    ["Notices", stats.totalNotices],
  ];

  return (
    <div className="p-6 space-y-6"> {/* FIXED: removed the big empty space */}

      {/* ---------- Navbar ---------- */}
      <div className="flex gap-6 text-blue-600 font-medium flex-wrap">
        <Link to="/" className="hover:underline">Dashboard</Link>
        <Link to="/students" className="hover:underline">Students</Link>
        <Link to="/attendance" className="hover:underline">Attendance</Link>
        <Link to="/fees" className="hover:underline">Fees</Link>
        <Link to="/results" className="hover:underline">Results</Link>
        <Link to="/notices" className="hover:underline">Notices</Link>
        <Link to="/teachers" className="hover:underline">Teachers</Link>
        <Link to="/timetable" className="hover:underline">Timetable</Link>
        <Link to="/view-timetable" className="hover:underline">View Timetable</Link>
      </div>

      {/* ---------- Heading ---------- */}
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* ---------- Stats Grid ---------- */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(([title, value]) => (
          <StatCard key={title} title={title} value={value} />
        ))}
      </div>

      {/* ---------- Timetable Options ---------- */}
      <h2 className="text-xl font-semibold text-gray-700 mt-4">
        Timetable Options
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Add/Edit Timetable */}
        <Link
          to="/timetable"
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 
                     hover:shadow-xl transition block"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Add or Edit</p>
              <p className="text-2xl font-bold mt-1">Timetable</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
              <CalendarDays size={28} />
            </div>
          </div>
        </Link>

        {/* View Timetable */}
        <Link
          to="/view-timetable"
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 
                     hover:shadow-xl transition block"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">View</p>
              <p className="text-2xl font-bold mt-1">Timetable</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <Eye size={28} />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
