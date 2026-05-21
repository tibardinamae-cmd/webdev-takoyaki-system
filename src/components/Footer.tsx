export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-2xl shadow-md">
                🐙
              </div>
              <div>
                <div className="font-black text-red-600 leading-none">TAKOYAKI</div>
                <div className="text-[10px] font-semibold tracking-[0.2em] text-slate-500">MINI STORE</div>
              </div>
            </div>
            <p className="text-sm text-slate-600">
              Authentic Osaka-style takoyaki, delivered hot to your door.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-900">Menu</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#menu" className="hover:text-red-600">All Flavors</a></li>
              <li><a href="#menu" className="hover:text-red-600">Classic</a></li>
              <li><a href="#menu" className="hover:text-red-600">Premium</a></li>
              <li><a href="#menu" className="hover:text-red-600">Spicy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-900">Company</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#about" className="hover:text-red-600">About Us</a></li>
              <li><a href="#contact" className="hover:text-red-600">Contact</a></li>
              <li><a href="#" className="hover:text-red-600">Careers</a></li>
              <li><a href="#" className="hover:text-red-600">Franchise</a></li>
              <li>
                <button
                  onClick={() => {
                    const event = new CustomEvent("open-admin-login");
                    window.dispatchEvent(event);
                  }}
                  className="inline-flex items-center gap-1 hover:text-red-600"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Admin Login
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-900">Hours</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex justify-between"><span>Mon - Thu</span><span className="font-medium text-slate-900">11am - 10pm</span></li>
              <li className="flex justify-between"><span>Fri - Sat</span><span className="font-medium text-slate-900">11am - 12am</span></li>
              <li className="flex justify-between"><span>Sunday</span><span className="font-medium text-slate-900">12pm - 9pm</span></li>
            </ul>
            <div className="mt-4 flex gap-2">
              {["📸", "📘", "🐦", "📹"].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg transition hover:bg-red-50"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-xs text-slate-500 sm:flex-row">
          <div>© 2026 Takoyaki Mini Store. Made with 🐙 in Osaka.</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-red-600">Privacy</a>
            <a href="#" className="hover:text-red-600">Terms</a>
            <a href="#" className="hover:text-red-600">Allergens</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
