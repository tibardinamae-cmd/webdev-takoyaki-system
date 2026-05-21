import { useRef, useEffect, useState } from "react";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { OrdersProvider } from "./context/OrdersContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import OrderTracking from "./components/OrderTracking";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import AdminDashboard from "./components/AdminDashboard";
import Receipt from "./components/Receipt";
import LoginPage from "./components/LoginPage";
import { useCart } from "./context/CartContext";

function AppContent() {
  const { state } = useCart();
  const { currentUser, isAdmin, isAdminView, setAdminView } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register" | "admin">("login");
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [enteredStore, setEnteredStore] = useState(false);

  const openAuth = (mode: "login" | "register" | "admin" = "login") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleNavigate = (section: string) => {
    if (section === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (section === "menu") {
      menuRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (section === "track") {
      trackRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Auto-scroll to tracking and show receipt when order is placed
  useEffect(() => {
    if (state.activeOrder && state.items.length === 0) {
      setReceiptOpen(true);
      setTimeout(() => {
        trackRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, [state.activeOrder, state.items.length]);

  // Listen for admin login requests from footer
  useEffect(() => {
    const handler = () => openAuth("admin");
    window.addEventListener("open-admin-login", handler);
    return () => window.removeEventListener("open-admin-login", handler);
  }, []);

  // Listen for receipt open requests from navbar
  useEffect(() => {
    const handler = () => setReceiptOpen(true);
    window.addEventListener("open-receipt", handler);
    return () => window.removeEventListener("open-receipt", handler);
  }, []);

  // If not logged in, show login page
  if (!currentUser || !enteredStore) {
    return <LoginPage onEnterStore={() => setEnteredStore(true)} />;
  }

  return (
    <>
      {isAdminView && isAdmin ? (
        <AdminDashboard
          onBackToStore={() => {
            setAdminView(false);
            window.scrollTo({ top: 0 });
          }}
        />
      ) : (
        <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
          <Navbar onNavigate={handleNavigate} onOpenAuth={openAuth} />
          <main>
            <Hero onOrderNow={() => handleNavigate("menu")} />
            <div ref={menuRef}>
              <Menu />
            </div>
            <div ref={trackRef}>
              <OrderTracking
                onBackHome={() => handleNavigate("home")}
                onShowReceipt={() => setReceiptOpen(true)}
              />
            </div>
            <About />
            <Contact />
          </main>
          <Footer />
          {!isAdmin && (
            <>
              <Cart />
              <Checkout onRequireAuth={() => openAuth("login")} />
              <Receipt
                order={state.activeOrder}
                isOpen={receiptOpen}
                onClose={() => setReceiptOpen(false)}
              />
            </>
          )}
        </div>
      )}

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
      />

      {/* Welcome toast for signed-in user */}
      {currentUser && <WelcomeToast />}
    </>
  );
}

function WelcomeToast() {
  const { currentUser } = useAuth();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(t);
  }, [currentUser?.id]);

  if (!show || !currentUser) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[70] -translate-x-1/2 animate-[slideUp_0.4s_ease-out]">
      <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-2xl">
        <span className="text-lg">👋</span>
        <span>
          Welcome{currentUser.role === "admin" ? ", Chef" : ""}, {currentUser.name.split(" ")[0]}!
        </span>
      </div>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <OrdersProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </OrdersProvider>
    </AuthProvider>
  );
}
