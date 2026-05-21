import { menuItems } from "../data/menu";

type Props = {
  onOrderNow: () => void;
};

export default function Hero({ onOrderNow }: Props) {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-red-100 via-orange-50 to-amber-100">
      {/* Decorative blurred shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-red-200 opacity-40 blur-3xl"></div>
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-orange-200 opacity-40 blur-3xl"></div>
        <div className="absolute bottom-10 left-1/3 h-48 w-48 rounded-full bg-amber-200 opacity-40 blur-3xl"></div>
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24 lg:px-8">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-600 backdrop-blur">
            <span className="flex h-2 w-2">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </span>
            Open Now · Delivery in 25-35 min
          </div>

          <h1 className="text-6xl font-black leading-[1.05] tracking-[-2px] text-slate-900 sm:text-7xl lg:text-7xl">
            Hot. Crispy.<br />
            <span className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              Irresistible.
            </span>
          </h1>

          <p className="max-w-xl text-lg text-slate-600">
            Handcrafted daily in traditional Osaka-style iron pans. Every piece is 
            perfectly golden outside and irresistibly molten inside.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onOrderNow}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-7 py-4 text-base font-bold text-white shadow-xl shadow-red-200 transition hover:shadow-2xl hover:shadow-red-300 active:scale-95"
            >
              Order Now
              <svg className="h-5 w-5 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button
              onClick={onOrderNow}
              className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-7 py-4 text-base font-bold text-slate-900 transition hover:bg-slate-900 hover:text-white active:scale-95"
            >
              View Menu
            </button>
          </div>

          <div className="flex flex-wrap gap-6 pt-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span>🚚</span>
              <span>Free delivery over ₱25</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⏱️</span>
              <span>Ready in 25-35 min</span>
            </div>
          </div>
        </div>

        {/* Right side — big takoyaki visual */}
        <div className="relative">
          <div className="relative mx-auto aspect-square max-w-md">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-300 via-orange-300 to-amber-200 blur-3xl opacity-60"></div>
            <div className="relative grid aspect-square grid-cols-3 grid-rows-3 gap-3 rounded-[2rem] bg-white/50 p-6 backdrop-blur-sm ring-1 ring-white">
              {menuItems.slice(0, 9).map((item, i) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-amber-100 transition hover:-translate-y-1 hover:shadow-xl"
                  style={{ animation: `float 5s ease-in-out ${i * 0.2}s infinite` }}
                >
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -bottom-4 -left-4 rotate-[-6deg] rounded-2xl bg-white p-3 shadow-xl ring-1 ring-slate-100">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🔥</div>
              <div>
                <div className="text-xs text-slate-500">Best seller</div>
                <div className="text-sm font-bold text-slate-900">Classic Octopus</div>
              </div>
            </div>
          </div>

          <div className="absolute -right-2 -top-4 rotate-[6deg] rounded-2xl bg-white p-3 shadow-xl ring-1 ring-slate-100">
            <div className="flex items-center gap-2">
              <div className="text-2xl">👨‍🍳</div>
              <div>
                <div className="text-xs text-slate-500">Handcrafted</div>
                <div className="text-sm font-bold text-slate-900">Fresh Daily</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </section>
  );
}
