import { useState, useEffect } from "react";
import { useCart, CustomerInfo, Order } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";
import { useAuth } from "../context/AuthContext";

export default function Checkout({ onRequireAuth }: { onRequireAuth: () => void }) {
  const { state, dispatch, subtotal, deliveryFee, tax, total } = useCart();
  const { currentUser } = useAuth();
  const { addOrder } = useOrders();

  const [formData, setFormData] = useState<CustomerInfo>({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
    paymentMethod: "card",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (currentUser && state.isCheckoutOpen) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || currentUser.name,
        email: prev.email || currentUser.email,
        phone: prev.phone || currentUser.phone,
      }));
    }
  }, [currentUser, state.isCheckoutOpen]);

  if (!state.isCheckoutOpen) return null;

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-3xl">
            🔐
          </div>
          <h2 className="mb-2 text-xl font-black text-slate-900">Sign in to checkout</h2>
          <p className="mb-5 text-sm text-slate-600">Please sign in to complete your order.</p>
          <div className="space-y-2">
            <button
              onClick={() => {
                dispatch({ type: "TOGGLE_CHECKOUT", payload: false });
                onRequireAuth();
              }}
              className="w-full rounded-full bg-gradient-to-r from-red-600 to-orange-500 py-3 text-sm font-bold text-white"
            >
              Sign In
            </button>
            <button
              onClick={() => dispatch({ type: "TOGGLE_CHECKOUT", payload: false })}
              className="w-full rounded-full py-2 text-sm font-semibold text-slate-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const update = (field: keyof CustomerInfo, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validate()) return;

    const order: Order = {
      id: `TKY-${Date.now().toString().slice(-6)}`,
      items: state.items,
      subtotal,
      deliveryFee,
      tax,
      total,
      customer: formData,
      status: "Order Received",
      createdAt: Date.now(),
      estimatedMinutes: 30,
    };

    addOrder(order);
    dispatch({ type: "PLACE_ORDER", payload: order });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => dispatch({ type: "TOGGLE_CHECKOUT", payload: false })}>
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">Checkout</h2>
            <p className="text-xs text-slate-500">Signed in as {currentUser.name}</p>
          </div>
          <button
            onClick={() => dispatch({ type: "TOGGLE_CHECKOUT", payload: false })}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Customer Info */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-2">Customer Information</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Full Name"
                className={`w-full rounded-xl border p-3 text-sm ${errors.name ? "border-red-400" : "border-slate-200"}`}
              />
              {errors.name && <p className="text-red-500 text-xs -mt-2">{errors.name}</p>}

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="Phone"
                  className={`w-full rounded-xl border p-3 text-sm ${errors.phone ? "border-red-400" : "border-slate-200"}`}
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="Email"
                  className={`w-full rounded-xl border p-3 text-sm ${errors.email ? "border-red-400" : "border-slate-200"}`}
                />
              </div>
              {(errors.phone || errors.email) && (
                <p className="text-red-500 text-xs -mt-2">{errors.phone || errors.email}</p>
              )}
            </div>
          </div>

          {/* Delivery Info */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-2">Delivery Address</h3>
            <div className="space-y-3">
              <textarea
                value={formData.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="Street Address"
                rows={2}
                className={`w-full rounded-xl border p-3 text-sm resize-y ${errors.address ? "border-red-400" : "border-slate-200"}`}
              />
              {errors.address && <p className="text-red-500 text-xs -mt-2">{errors.address}</p>}

              <input
                type="text"
                value={formData.city}
                onChange={(e) => update("city", e.target.value)}
                placeholder="City / Municipality"
                className={`w-full rounded-xl border p-3 text-sm ${errors.city ? "border-red-400" : "border-slate-200"}`}
              />
              {errors.city && <p className="text-red-500 text-xs -mt-2">{errors.city}</p>}

              <textarea
                value={formData.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Delivery notes (optional)"
                rows={2}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm resize-y"
              />
            </div>
          </div>

          {/* Payment */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-2">Payment Method</h3>
            <div className="flex gap-2">
              {[
                { id: "card", label: "Card", icon: "💳" },
                { id: "wallet", label: "Wallet", icon: "📱" },
                { id: "cash", label: "Cash", icon: "💵" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => update("paymentMethod", m.id)}
                  className={`flex-1 rounded-xl border py-2 text-sm font-semibold transition ${
                    formData.paymentMethod === m.id
                      ? "border-red-500 bg-red-50 text-red-600"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-slate-50 rounded-2xl p-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">Subtotal</span>
              <span>₱{Math.round(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">Delivery</span>
              <span>{deliveryFee === 0 ? "FREE" : `₱${Math.round(deliveryFee)}`}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">Tax</span>
              <span>₱{Math.round(tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>₱{Math.round(total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex gap-3">
          <button
            onClick={() => dispatch({ type: "TOGGLE_CHECKOUT", payload: false })}
            className="flex-1 rounded-full border py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePlaceOrder}
            className="flex-1 rounded-full bg-gradient-to-r from-red-600 to-orange-500 py-3 text-sm font-bold text-white"
          >
            Place Order • ₱{Math.round(total)}
          </button>
        </div>
      </div>
    </div>
  );
}
