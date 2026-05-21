import { useCart } from "../context/CartContext";

type Props = {
  onBackHome: () => void;
  onShowReceipt?: () => void;
};

export default function OrderTracking({ onBackHome, onShowReceipt }: Props) {
  const { state, dispatch } = useCart();
  const order = state.activeOrder;

  if (!order) {
    return (
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-xl px-4 text-center">
          <div className="mb-4 text-7xl">📭</div>
          <h2 className="mb-2 text-3xl font-black text-slate-900">No active order</h2>
          <p className="mb-6 text-slate-600">Place an order to track its status here.</p>
          <button
            onClick={onBackHome}
            className="rounded-full bg-slate-900 px-6 py-3 font-bold text-white transition hover:bg-slate-800"
          >
            Browse Menu
          </button>
        </div>
      </section>
    );
  }

  const steps = [
    { key: "Order Received", label: "Order Received", icon: "📝", desc: "Your order has been confirmed" },
    { key: "preparing", label: "Preparing", icon: "👨‍🍳", desc: "Our chef is preparing your takoyaki" },
    { key: "cooking", label: "Cooking", icon: "🔥", desc: "Your takoyaki is being cooked" },
    { key: "on-the-way", label: "On the Way", icon: "🛵", desc: "Driver is heading to you" },
    { key: "delivered", label: "Delivered", icon: "✅", desc: "Enjoy your meal!" },
  ] as const;

  const currentIndex = steps.findIndex((s) => s.key === order.status);
  const elapsedMin = Math.floor((Date.now() - order.createdAt) / 60000);
  const remainingMin = Math.max(0, order.estimatedMinutes - elapsedMin);

  return (
    <section id="track" className="bg-gradient-to-b from-slate-50 to-white py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">Order Tracking 📍</h2>
            <p className="text-sm text-slate-500">Order #{order.id}</p>
          </div>
          <div className="flex gap-2">
            {onShowReceipt && (
              <button
                onClick={onShowReceipt}
                className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
              >
                🧾 Receipt
              </button>
            )}
            <button
              onClick={() => dispatch({ type: "CLEAR_ORDER" })}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-red-300 hover:text-red-500"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Status card */}
        <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-red-500 via-orange-500 to-amber-500 p-6 text-white shadow-xl sm:p-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider opacity-90">Status</div>
              <div className="text-2xl font-black sm:text-3xl">
                {steps[currentIndex].icon} {steps[currentIndex].label}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold uppercase tracking-wider opacity-90">
                {order.status === "delivered" ? "Arrived" : "Est. arrival"}
              </div>
              <div className="text-2xl font-black sm:text-3xl">
                {order.status === "delivered" ? "Now!" : `${remainingMin} min`}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative h-2 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-all duration-700"
              style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-6 rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-100">
          <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-slate-500">Progress</h3>
          <div className="space-y-0">
            {steps.map((s, i) => {
              const isActive = i === currentIndex;
              const isCompleted = i < currentIndex;
              return (
                <div key={s.key} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < steps.length - 1 && (
                    <div className={`absolute left-[18px] top-10 h-[calc(100%-20px)] w-0.5 ${isCompleted ? "bg-green-500" : "bg-slate-200"}`}></div>
                  )}
                  <div
                    className={`relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-lg shadow-md ${
                      isActive
                        ? "bg-gradient-to-br from-red-500 to-orange-500 text-white ring-4 ring-red-100"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isCompleted ? "✓" : s.icon}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className={`font-bold ${isActive ? "text-slate-900" : isCompleted ? "text-slate-600" : "text-slate-400"}`}>
                      {s.label}
                    </div>
                    <div className="text-xs text-slate-500">{s.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order details */}
        <div className="mb-6 rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-100">
          <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-slate-500">Your Order</h3>
          <div className="space-y-3">
            {order.items.map((ci) => (
              <div key={ci.item.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <div className="flex items-center gap-3">
                  <img src={ci.item.image} alt={ci.item.name} className="h-12 w-12 flex-shrink-0 rounded-lg object-cover" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">{ci.item.name}</div>
                    <div className="text-xs text-slate-500">Qty: {ci.quantity}</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-slate-900">₱{ci.item.price * ci.quantity}</div>
              </div>
            ))}
            <div className="space-y-1 pt-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₱{Math.round(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span>{order.deliveryFee === 0 ? "FREE" : `₱${Math.round(order.deliveryFee)}`}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax</span>
                <span>₱{Math.round(order.tax)}</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-slate-200 pt-2 text-lg font-black text-slate-900">
                <span>Total paid</span>
                <span>₱{Math.round(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery info */}
        <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-100">
          <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-slate-500">Delivering To</h3>
          <div className="flex gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-50 text-xl">
              📍
            </div>
            <div>
              <div className="font-bold text-slate-900">{order.customer.name}</div>
              <div className="text-sm text-slate-600">{order.customer.address}</div>
              <div className="text-sm text-slate-600">{order.customer.city}</div>
              <div className="mt-1 text-xs text-slate-500">{order.customer.phone} · {order.customer.email}</div>
              {order.customer.notes && (
                <div className="mt-2 rounded-lg bg-slate-50 p-2 text-xs italic text-slate-600">"{order.customer.notes}"</div>
              )}
            </div>
          </div>
        </div>

        {/* Email Notification Status */}
        <div className="mt-4 rounded-3xl border border-blue-200 bg-blue-50 p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-2xl">📧</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-900">Email Notifications Enabled</span>
                <span className="rounded-full bg-green-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">Active</span>
              </div>
              <p className="mt-1 text-sm text-blue-700">
                You will receive real-time updates about your order at <span className="font-semibold">{order.customer.email}</span>
              </p>
              <div className="mt-3 space-y-1 text-xs text-blue-600">
                <div className="flex items-center gap-2">✓ Order confirmation sent</div>
                <div className="flex items-center gap-2">✓ Status updates via email</div>
                <div className="flex items-center gap-2">✓ Delivery notification when on the way</div>
              </div>
            </div>
          </div>
        </div>

        {order.status === "delivered" && (
          <button
            onClick={onBackHome}
            className="mt-6 w-full rounded-full bg-gradient-to-r from-red-600 to-orange-500 py-4 text-base font-bold text-white shadow-lg transition hover:shadow-xl active:scale-[0.98]"
          >
            Order Again 🐙
          </button>
        )}
      </div>
    </section>
  );
}
