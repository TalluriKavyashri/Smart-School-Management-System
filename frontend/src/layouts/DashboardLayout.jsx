import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  User,
  CalendarDays,
  ClipboardList,
  CreditCard,
  ListChecks,
  Bell,
  Menu,
  X,
} from "lucide-react";

export default function DashboardLayout() {
  const [open, setOpen] = useState(true);

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Students", path: "/students", icon: Users },
    { name: "Teachers", path: "/teachers", icon: User },
    { name: "Classes", path: "/timetable", icon: CalendarDays },
    { name: "Attendance", path: "/attendance", icon: ClipboardList },
    { name: "Fees", path: "/fees", icon: CreditCard },
    { name: "Results", path: "/results", icon: ListChecks },
    { name: "Notices", path: "/notices", icon: Bell },
  ];

  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* ---------------- Sidebar ---------------- */}
      <div
        className={`${open ? "w-64" : "w-20"}
          bg-white border-r shadow-sm flex flex-col
          transition-all duration-300 fixed h-screen overflow-y-auto
          md:static z-40`}
      >
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between p-4 border-b">
          <h1
            className={`text-xl font-bold transition-all 
              ${open ? "opacity-100" : "opacity-0 hidden"}`}
          >
            SmartSchool
          </h1>

          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded hover:bg-gray-200 md:block hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-3 space-y-2">
            {menuItems.map(({ name, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg group transition 
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-blue-50"
                    }`
                }
              >
                <Icon size={20} />
                {open && <span>{name}</span>}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* -------------- Main Content -------------- */}
      <div
        className={`flex-1 transition-all duration-300 
          ${open ? "md:ml-64" : "md:ml-20"} ml-20`}
      >
        {/* Top Navbar */}
        <div className="p-4 bg-white border-b shadow-sm flex justify-between items-center">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded hover:bg-gray-100 md:hidden block"
          >
            <Menu size={22} />
          </button>

          <h2 className="text-xl font-semibold">Smart School Admin</h2>

          <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-semibold">
            A
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
