import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Students from "./pages/Students";
import Fees from "./pages/Fees";
import Exams from "./pages/Exams";
import Results from "./pages/Results";
import Notices from "./pages/Notices";
import Teachers from "./pages/Teachers";
import Timetable from "./pages/Timetable";
import ViewTimetable from "./pages/ViewTimetable";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { token } = useAuth();
  const authed = !!token;

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<Login />} />

      {/* These SHOULD be inside Layout, but leaving as-is */}
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/fees" element={<Fees />} />
      <Route path="/exams" element={<Exams />} />
      <Route path="/results" element={<Results />} />
      <Route path="/notices" element={<Notices />} />
      <Route path="/teachers" element={<Teachers />} />

      {/* ❗ FIXED ROUTES — MUST NOT BE SAME */}
      <Route path="/timetable" element={<Timetable />} />              {/* Add/Edit Page */}
      <Route path="/view-timetable" element={<ViewTimetable />} />    {/* View Page */}

      {/* PROTECTED ROUTES */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
        </Route>
      </Route>

      {/* CATCH-ALL */}
      <Route
        path="*"
        element={<Navigate to={authed ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}
