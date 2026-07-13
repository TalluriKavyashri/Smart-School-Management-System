import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      nav("/");
    } catch (err) {
      console.log("LOGIN FAILED:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-blue-100">

      {/* ---------- LEFT SIDE ---------- */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 p-16">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4 leading-tight">
          Smart School <br /> Management System
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          “Where technology meets education for a smarter tomorrow.”
        </p>

        <img
          src="https://cdn-icons-png.flaticon.com/512/201/201614.png"
          alt="School Illustration"
          className="w-72 opacity-90"
        />
      </div>

      {/* ---------- RIGHT SIDE (LOGIN BOX) ---------- */}
      <div className="flex flex-1 justify-center items-center p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white/30 backdrop-blur-xl shadow-2xl border border-white/40 rounded-3xl p-8"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Welcome Back 👋
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Login to access your dashboard
          </p>

          {/* Input */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-700">Email</label>
              <input
                className="w-full mt-1 px-4 py-3 border rounded-xl bg-white/60 shadow-sm 
                focus:ring-2 focus:ring-blue-400 outline-none transition"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Password</label>
              <input
                className="w-full mt-1 px-4 py-3 border rounded-xl bg-white/60 shadow-sm 
                focus:ring-2 focus:ring-blue-400 outline-none transition"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-600 text-sm mt-3 text-center">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow 
            transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
