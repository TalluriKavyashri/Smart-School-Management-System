import { useEffect, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { UserPlus, Edit, Trash2, Users } from "lucide-react";

export default function Teachers() {
  const { profile } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    phone: "",
    classAssigned: "",
  });
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const data = await api.get("/api/teachers");
    setTeachers(data);
  };

  const addOrUpdateTeacher = async () => {
    if (!form.name || !form.email || !form.subject)
      return alert("Please fill all required fields");

    if (editId) {
      await api.put(`/api/teachers/${editId}`, form);
      alert("Teacher updated!");
      setEditId(null);
    } else {
      await api.post("/api/teachers", form);
      alert("Teacher added!");
    }

    setForm({ name: "", email: "", subject: "", phone: "", classAssigned: "" });
    load();
  };

  const editTeacher = (t) => {
    setEditId(t._id);
    setForm({
      name: t.name,
      email: t.email,
      subject: t.subject,
      phone: t.phone,
      classAssigned: t.classAssigned,
    });
  };

  const delTeacher = async (id) => {
    if (!confirm("Delete this teacher?")) return;
    await api.del(`/api/teachers/${id}`);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6 space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
          <Users size={30} className="text-blue-600" />
          Teachers Management
        </h1>

        {profile?.role === "admin" && (
          <button
            onClick={() => setEditId(null)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white shadow hover:bg-blue-700 transition"
          >
            <UserPlus size={20} />
            Add Teacher
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {profile?.role === "admin" && (
        <div className="bg-white/60 backdrop-blur-xl border border-gray-200 p-6 rounded-2xl shadow-lg">

          <h2 className="text-lg font-semibold mb-4">
            {editId ? "Edit Teacher" : "Add Teacher"}
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["name", "email", "subject", "phone", "classAssigned"].map((key) => (
              <input
                key={key}
                placeholder={key.replace(/([A-Z])/g, " $1")}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="px-4 py-3 bg-white/60 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
            ))}
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={addOrUpdateTeacher}
              className="px-5 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
            >
              {editId ? "Update" : "Add"}
            </button>

            {editId && (
              <button
                onClick={() => {
                  setEditId(null);
                  setForm({
                    name: "",
                    email: "",
                    subject: "",
                    phone: "",
                    classAssigned: "",
                  });
                }}
                className="px-5 py-2 border rounded-xl hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            )}
          </div>

        </div>
      )}

      {/* Teachers Table */}
      <div className="bg-white/60 backdrop-blur-xl border border-gray-200 p-6 rounded-2xl shadow-lg">

        <h2 className="font-semibold mb-4">Teacher List</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b text-gray-600">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Class</th>
                {profile?.role === "admin" && (
                  <th className="p-3 text-left">Actions</th>
                )}
              </tr>
            </thead>

            <tbody>
              {teachers.map((t) => (
                <tr key={t._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">{t.name}</td>
                  <td className="p-3">{t.email}</td>
                  <td className="p-3">{t.subject}</td>
                  <td className="p-3">{t.phone}</td>
                  <td className="p-3">{t.classAssigned}</td>

                  {profile?.role === "admin" && (
                    <td className="p-3 flex gap-3">
                      <button
                        onClick={() => editTeacher(t)}
                        className="p-2 bg-yellow-400 text-white rounded-xl hover:bg-yellow-500 transition"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => delTeacher(t._id)}
                        className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}

              {teachers.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center p-5 text-gray-500"
                  >
                    No teachers found.
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
