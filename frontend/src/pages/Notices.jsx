import { useEffect, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Megaphone, PlusCircle, Trash2 } from "lucide-react";

export default function Notices() {
  const { profile } = useAuth();
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState({ title: "", message: "" });

  const load = async () => {
    const data = await api.get("/api/notices");
    setNotices(data);
  };

  const addNotice = async () => {
    if (!form.title || !form.message) return alert("Please fill all fields");
    await api.post("/api/notices", form);
    setForm({ title: "", message: "" });
    load();
  };

  const delNotice = async (id) => {
    if (!confirm("Delete this notice?")) return;
    await api.del(`/api/notices/${id}`);
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
          <Megaphone size={32} className="text-blue-600" />
          Notices & Announcements
        </h1>
      </div>

      {/* Add Notice (Admin only) */}
      {profile?.role === "admin" && (
        <div className="bg-white/60 backdrop-blur-xl border border-gray-200 p-6 rounded-2xl shadow-lg">

          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PlusCircle size={20} className="text-blue-600" />
            Add Notice
          </h2>

          <div className="grid sm:grid-cols-3 gap-4">
            <input
              className="px-4 py-3 bg-white/60 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <input
              className="px-4 py-3 bg-white/60 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
              placeholder="Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />

            <button
              onClick={addNotice}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl shadow hover:bg-blue-700 transition"
            >
              <PlusCircle size={18} />
              Add
            </button>
          </div>

        </div>
      )}

      {/* Notices List */}
      <div className="bg-white/60 backdrop-blur-xl border border-gray-200 p-6 rounded-2xl shadow-lg">

        <h2 className="font-semibold mb-4">Recent Notices</h2>

        {notices.length === 0 ? (
          <div className="text-gray-500">No notices yet</div>
        ) : (
          <div className="space-y-4">

            {notices.map((n) => (
              <div
                key={n._id}
                className="flex justify-between items-center bg-white/70 rounded-xl border p-4 shadow hover:shadow-md transition"
              >
                {/* Notice Info */}
                <div className="space-y-1">
                  <div className="text-lg font-semibold text-gray-800">
                    {n.title}
                  </div>

                  <div className="text-gray-600 text-sm">{n.message}</div>

                  <div className="text-xs text-gray-400">
                    Posted by {n.postedBy || "Admin"} •{" "}
                    {new Date(n.date).toLocaleDateString()}
                  </div>
                </div>

                {/* Delete (Admin only) */}
                {profile?.role === "admin" && (
                  <button
                    onClick={() => delNotice(n._id)}
                    className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}
