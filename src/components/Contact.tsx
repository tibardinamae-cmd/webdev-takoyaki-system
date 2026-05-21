import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: "", email: "", message: "" });
    }, 3000);
  };

  return (
    <section id="contact" className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-red-500">Get in Touch</div>
            <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              We'd love to hear from you 👋
            </h2>
            <p className="mb-8 text-slate-600">
              Questions about catering, franchise opportunities, or just want to say hi? Drop us a line.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-red-50 text-2xl">
                  📍
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Visit Us</div>
                  <div className="font-semibold text-slate-900">123 Sakura Street</div>
                  <div className="text-sm text-slate-600">Downtown, New York, NY 10001</div>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-red-50 text-2xl">
                  📞
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Call Us</div>
                  <div className="font-semibold text-slate-900">(555) 123-TAKO</div>
                  <div className="text-sm text-slate-600">Open daily 11 AM - 10 PM</div>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-red-50 text-2xl">
                  ✉️
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</div>
                  <div className="font-semibold text-slate-900">dinamaetibar05@gmail.com</div>
                  <div className="text-sm text-slate-600">We reply within 24 hours</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100 sm:p-8">
              <h3 className="mb-5 text-xl font-black text-slate-900">Send a message</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Message</label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                    placeholder="How can we help?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sent}
                  className="w-full rounded-full bg-gradient-to-r from-red-600 to-orange-500 py-3.5 text-base font-bold text-white shadow-lg transition hover:shadow-xl active:scale-[0.98] disabled:opacity-80"
                >
                  {sent ? "✓ Message Sent!" : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
