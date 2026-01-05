import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/$/, "") ||
  "http://localhost:4000";

export default function Login() {
  const [username, setUsername] = useState(""); // ✅ NEW
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if ((!email && !username) || !password) {
      setError("Username/Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_BASE}/api/auth/login`,
        {
          email: email || undefined,
          username: username || undefined,
          password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("token", res.data.token);
      nav("/admin");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Invalid credentials";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen my-[-8%] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-[40%]"
      >
        <div className="rounded-3xl shadow-2xl bg-white/10 backdrop-blur-xl p-6">
          <h2 className="text-2xl font-bold text-center mb-2 text-white drop-shadow">
            Welcome Back
          </h2>
          <p className="text-center text-white/80 mb-6 text-md">
            Login to access the admin panel
          </p>

          <form onSubmit={submit} className="space-y-5">
            {/* USERNAME */}
            <div className="relative w-[70%] mx-auto">
              <User className="absolute left-4 top-3.5 text-white/70" size={20} />
              <input
                className="w-full text-xl text-center px-2 py-2 rounded-2xl bg-gray-700 text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="Username (optional)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            {/* EMAIL */}
            <div className="relative w-[70%] mx-auto">
              <Mail className="absolute left-4 top-3.5 text-white/70" size={20} />
              <input
                type="email"
                className="w-full text-xl text-center px-2 py-2 rounded-2xl bg-gray-700 text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative w-[70%] mx-auto">
              <Lock className="absolute left-4 top-3.5 text-white/70" size={20} />
              <input
                type="password"
                className="w-full text-xl text-center px-2 py-2 rounded-2xl bg-gray-700 text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-red-400 text-center text-sm">{error}</p>
            )}

            {/* BUTTON */}
            <motion.button
              type="submit" // ✅ REQUIRED
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className={`w-[70%] mx-auto block p-3 text-lg rounded-2xl font-semibold shadow-lg transition
                ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90"
                }`}
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

