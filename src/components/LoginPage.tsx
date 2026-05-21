import { useState } from "react";
import { useAuth } from "../context/AuthContext";

type Props = {
  onEnterStore: () => void;
};

export default function LoginPage({ onEnterStore }: Props) {
  const { login, register, currentUser } = useAuth();
  const [mode, setMode] = useState<"login" | "register" | "admin">("login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto enter store if already logged in
  if (currentUser) {
    setTimeout(() => onEnterStore(), 100);
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
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
          setSuccess("Account created! Logging you in...");
          // Auto login after registration
          setTimeout(() => {
            const loginRes = login(form.email, form.password);
            if (loginRes.success) {
              onEnterStore();
            }
          }, 800);
        }
      } else {
        // Login or Admin
        if (!form.email.trim() || !form.password.trim()) {
          setError("Please enter your email and password");
          setLoading(false);
          return;
        }

        const res = login(form.email, form.password);

        if (!res.success) {
          setError(res.error || "Invalid email or password");
        } else {
          setSuccess(mode === "admin" ? "Welcome, Admin!" : "Login successful!");
          setTimeout(() => {
            onEnterStore();
          }, 600);
        }
      }
      setLoading(false);
    }, 400);
  };

  const switchMode = (m: "login" | "register" | "admin") => {
    setMode(m);
    setError("");
    setSuccess("");
    setForm({ name: "", email: "", phone: "", password: "", confirm: "" });
  };

  const isAdminMode = mode === "admin";

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Realistic Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/32944669/pexels-photo-32944669.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=2000')",
        }}
      >
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/70"></div>
        {/* Warm color overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-red-950/40 via-orange-950/30 to-amber-950/40"></div>
      </div>
      {/* Left Side - Branding */}
      <div className="hidden flex-1 flex-col items-center justify-center p-12 lg:flex">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-7xl shadow-2xl">
            🐙
          </div>
          <h1 className="mb-2 text-5xl font-black text-white">TAKOYAKI</h1>
          <div className="mb-6 text-sm font-bold uppercase tracking-[0.4em] text-white/70">Mini Store</div>
          <p className="mb-8 text-lg text-white/80">
            Fresh, hot, and authentic Osaka-style takoyaki delivered to your door.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center lg:hidden">
            <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-6xl shadow-xl">
              🐙
            </div>
            <h1 className="text-3xl font-black text-slate-900">TAKOYAKI</h1>
            <div className="text-xs font-bold uppercase tracking-[0.4em] text-slate-500">Mini Store</div>
          </div>

          <div className="rounded-3xl bg-white/95 backdrop-blur-xl p-6 shadow-2xl sm:p-8">
            {/* Tabs */}
            <div className="mb-6 flex overflow-hidden rounded-full bg-slate-100 p-1">
              {[
                { id: "login", label: "Sign In" },
                { id: "register", label: "Sign Up" },
                { id: "admin", label: "Admin" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => switchMode(tab.id as "login" | "register" | "admin")}
                  className={`flex-1 rounded-full py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                    mode === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mb-6 text-center">
              <h2 className="text-2xl font-black text-slate-900">
                {isAdminMode ? "Admin Portal" : mode === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {isAdminMode
                  ? "Sign in to manage the store"
                  : mode === "login"
                  ? "Sign in to order and track"
                  : "Join and start ordering"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 font-medium">⚠️ {error}</div>}
              {success && <div className="rounded-xl bg-green-50 p-3 text-sm text-green-600 font-medium">✓ {success}</div>}

              {isAdminMode && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                  <strong>Demo credentials:</strong><br />admin@takoyaki.com / admin123
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

          <p className="mt-6 text-center text-xs text-slate-400">© 2026 Takoyaki Mini Store</p>
        </div>
      </div>
    </div>
  );
}
