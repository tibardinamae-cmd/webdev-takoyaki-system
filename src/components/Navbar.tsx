import { useState, useRef, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

type Props = {
  onNavigate: (section: string) => void;
  onOpenAuth: (mode?: "login" | "register" | "admin") => void;
};

export default function Navbar({ onNavigate, onOpenAuth }: Props) {
  const { itemCount, dispatch, state } = useCart();
  const { currentUser, logout, isAdmin, isAdminView, setAdminView } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const links = [
    { id: "home", label: "Home" },
    { id: "menu", label: "Menu" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-red-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-3 transition hover:opacity-80"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 text-3xl shadow-lg">
            🐙
          </div>
          <div className="text-left">
            <div className="font-black text-red-600 text-xl tracking-[-1px] leading-none">TAKOYAKI</div>
            <div className="text-[9px] font-semibold tracking-[0.3em] text-slate-500 -mt-0.5">MINI STORE</div>
          </div>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => onNavigate(l.id)}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-red-50 hover:text-red-600"
            >
              {l.label}
            </button>
          ))}
          {state.activeOrder && !isAdminView && (
            <button
              onClick={() => onNavigate("track")}
              className="rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100"
            >
              📍 Track Order
            </button>
          )}
          {isAdmin && !isAdminView && (
            <button
              onClick={() => setAdminView(true)}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              ⚙️ Admin
            </button>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {/* User button */}
          {currentUser && !isAdmin ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-xs font-black text-white">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">{currentUser.name.split(" ")[0]}</span>
                {currentUser.role === "admin" && (
                  <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                    Admin
                  </span>
                )}
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
                  <div className="border-b border-slate-100 p-3">
                    <div className="font-bold text-slate-900">{currentUser.name}</div>
                    <div className="text-xs text-slate-500">{currentUser.email}</div>
                    <div className="mt-1">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${currentUser.role === "admin" ? "bg-slate-900 text-white" : "bg-red-100 text-red-600"}`}>
                        {currentUser.role}
                      </span>
                    </div>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setAdminView(!isAdminView);
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <span>⚙️</span>
                      <span>{isAdminView ? "Back to Store" : "Admin Dashboard"}</span>
                    </button>
                  )}

                  {state.activeOrder && !isAdminView && (
                    <>
                      <button
                        onClick={() => {
                          onNavigate("track");
                          setMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <span>📍</span>
                        <span>Track Order</span>
                      </button>
                      <button
                        onClick={() => {
                          // Open receipt
                          const event = new CustomEvent("open-receipt");
                          window.dispatchEvent(event);
                          setMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <span>🧾</span>
                        <span>View Receipt</span>
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <span>🚪</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            !isAdmin && (
              <button
                onClick={() => onOpenAuth("login")}
                className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:flex"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 17v4a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h4m6 0V3a1 1 0 011-1h4a1 1 0 011 1v4m-6 0h6m-3-3v12" />
                </svg>
                Sign In
              </button>
            )
          )}

          {!isAdmin && (
            <button
              onClick={() => dispatch({ type: "TOGGLE_CART", payload: true })}
              className="relative flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 active:scale-95"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white ring-2 ring-white">
                  {itemCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
