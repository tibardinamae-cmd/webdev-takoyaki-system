import { useState } from "react";
import { useAuth } from "../context/AuthContext";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register" | "admin";
};

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: Props) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register" | "admin">(initialMode);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setForm({ name: "", email: "", phone: "", password: "", confirm: "" });
    setError("");
    setSuccess("");
  };

  const switchMode = (m: "login" | "register" | "admin") => {
    setMode(m);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    setTimeout(() => {
      if (mode === "register") {
        if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
          setError("Please fill in all required fields");
          setLoading(false);
          return;
        }
        if (form.password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }
        if (form.password !== form.confirm) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        const res = register({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        });

        if (!res.success) {
          setError(res.error || "Registration failed");
        } else {
          setSuccess("Account created successfully! Welcome!");
          setTimeout(() => {
            onClose();
            resetForm();
          }, 1200);
        }
      } else {
        // Login or Admin Login
        if (!form.email.trim() || !form.password.trim()) {
          setError("Please fill in email and password");
          setLoading(false);
          return;
        }

        const res = login(form.email, form.password);

        if (!res.success) {
          setError(res.error || "Login failed. Please check your credentials.");
        } else {
          setSuccess(mode === "admin" ? "Admin login successful!" : "Login successful! Welcome back!");
          setTimeout(() => {
            onClose();
            resetForm();
          }, 1000);
        }
      }
      setLoading(false);
    }, 600);
  };

  const isAdminMode = mode === "admin";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
        >
          ✕
        </button>

        {/* Header */}
        <div className={`p-8 text-center text-white ${isAdminMode ? "bg-gradient-to-br from-slate-800 to-slate-900" : "bg-gradient-to-br from-red-500 to-orange-500"}`}>
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-4xl backdrop-blur">
            {isAdminMode ? "👨‍🍳" : "🐙"}
          </div>
          <h2 className="text-2xl font-black">
            {isAdminMode ? "Admin Portal" : mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="mt-1 text-sm opacity-90">
            {isAdminMode
              ? "Sign in to manage your store"
              : mode === "login"
              ? "Sign in to order and track delivery"
              : "Join us to start ordering delicious takoyaki"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50">
          {[
            { id: "login", label: "Sign In" },
            { id: "register", label: "Sign Up" },
            { id: "admin", label: "Admin" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchMode(tab.id as "login" | "register" | "admin")}
              className={`flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wider transition ${
                mode === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Juan Dela Cruz"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={isAdminMode ? "admin@takoyaki.com" : "you@example.com"}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="09679170070"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={isAdminMode ? "admin123" : "••••••••"}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Confirm Password</label>
              <input
                type="password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
              />
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 font-medium">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl bg-green-50 p-3 text-sm text-green-600 font-medium">
              ✓ {success}
            </div>
          )}

          {isAdminMode && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
              <strong>Demo credentials:</strong> admin@takoyaki.com / admin123
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-full py-3.5 text-base font-bold text-white shadow-lg transition active:scale-[0.98] disabled:opacity-70 ${
              isAdminMode ? "bg-gradient-to-r from-slate-700 to-slate-900" : "bg-gradient-to-r from-red-600 to-orange-500"
            }`}
          >
            {loading ? "Please wait..." : isAdminMode ? "Sign In as Admin" : mode === "login" ? "Sign In" : "Create Account"}
          </button>

          {!isAdminMode && mode === "login" && (
            <p className="text-center text-xs text-slate-500">
              New here?{" "}
              <button type="button" onClick={() => switchMode("register")} className="font-bold text-red-600 hover:underline">
                Create an account
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
