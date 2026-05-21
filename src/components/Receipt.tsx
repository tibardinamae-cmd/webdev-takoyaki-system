import { useRef } from "react";
import { Order } from "../context/CartContext";

type Props = {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function Receipt({ order, isOpen, onClose }: Props) {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Trigger print dialog which allows "Save as PDF"
    window.print();
  };

  const orderDate = new Date(order.createdAt);
  const formattedDate = orderDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = orderDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const paymentLabel: Record<string, string> = {
    card: "Credit / Debit Card",
    wallet: "Digital Wallet",
    cash: "Cash on Delivery",
  };

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/60 p-0 backdrop-blur-sm sm:p-4" onClick={onClose}>
      <div
        className="relative flex h-full max-h-[95vh] w-full max-w-md flex-col overflow-hidden bg-white shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Action header — hidden on print */}
        <div className="no-print flex items-center justify-between border-b border-slate-100 p-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">Your Receipt</h2>
            <p className="text-xs text-slate-500">Order #{order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 transition hover:bg-slate-200"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable receipt content */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-6">
          <div ref={receiptRef} className="receipt-print mx-auto max-w-sm bg-white p-6 shadow-lg sm:p-8">
            {/* Store Header */}
            <div className="border-b-2 border-dashed border-slate-300 pb-4 text-center">
              <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-3xl shadow-md">
                🐙
              </div>
              <h1 className="text-xl font-black text-slate-900">TAKOYAKI MINI STORE</h1>
              <p className="text-[11px] text-slate-500">123 Sakura Street, Downtown</p>
              <p className="text-[11px] text-slate-500">New York, NY 10001 · (555) 123-TAKO</p>
            </div>

            {/* Order Meta */}
            <div className="border-b border-dashed border-slate-200 py-3 text-[11px] text-slate-600">
              <div className="flex justify-between">
                <span className="font-semibold">Order #</span>
                <span className="font-mono font-bold text-slate-900">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Date</span>
                <span>{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Time</span>
                <span>{formattedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Status</span>
                <span className="capitalize font-bold text-slate-900">{order.status.replace("-", " ")}</span>
              </div>
            </div>

            {/* Customer */}
            <div className="border-b border-dashed border-slate-200 py-3 text-[11px] text-slate-600">
              <div className="mb-1 font-bold uppercase tracking-wider text-slate-500">Customer</div>
              <div className="font-semibold text-slate-900">{order.customer.name}</div>
              <div>{order.customer.email}</div>
              <div>{order.customer.phone}</div>
              <div className="mt-1">{order.customer.address}</div>
              <div>{order.customer.city}</div>
            </div>

            {/* Items */}
            <div className="border-b border-dashed border-slate-200 py-3">
              <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">Your Order Details</div>
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="text-slate-500">
                    <th className="pb-1 text-left font-semibold">Item</th>
                    <th className="pb-1 text-center font-semibold">Qty</th>
                    <th className="pb-1 text-right font-semibold">Amt</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((ci) => (
                    <tr key={ci.item.id} className="border-t border-dotted border-slate-200">
                      <td className="py-1.5 pr-2">
                        <div className="font-semibold text-slate-900">{ci.item.name}</div>
                        {ci.notes && (
                          <div className="text-[10px] italic text-slate-500">Note: {ci.notes}</div>
                        )}
                      </td>
                      <td className="py-1.5 text-center text-slate-700">{ci.quantity}</td>
                      <td className="py-1.5 text-right font-semibold text-slate-900">
                        ₱{ci.item.price * ci.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="border-b border-dashed border-slate-200 py-3 text-[12px]">
              <div className="flex justify-between py-0.5 text-slate-600">
                <span>Subtotal</span>
                <span>₱{Math.round(order.subtotal)}</span>
              </div>
              <div className="flex justify-between py-0.5 text-slate-600">
                <span>Delivery</span>
                <span>{order.deliveryFee === 0 ? "FREE" : `₱${Math.round(order.deliveryFee)}`}</span>
              </div>
              <div className="flex justify-between py-0.5 text-slate-600">
                <span>Tax (8%)</span>
                <span>₱{Math.round(order.tax)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t-2 border-solid border-slate-900 pt-2 text-base font-black text-slate-900">
                <span>TOTAL</span>
                <span>₱{Math.round(order.total)}</span>
              </div>
            </div>

            {/* Payment */}
            <div className="border-b border-dashed border-slate-200 py-3 text-[11px] text-slate-600">
              <div className="flex justify-between">
                <span className="font-semibold">Payment</span>
                <span className="font-bold text-slate-900">{paymentLabel[order.customer.paymentMethod] || order.customer.paymentMethod}</span>
              </div>
              {order.customer.paymentMethod !== "cash" && (
                <div className="flex justify-between mt-1">
                  <span className="font-semibold">Transaction</span>
                  <span className="font-mono text-slate-900">TXN-{order.id}</span>
                </div>
              )}
            </div>

            {/* Barcode-style order ID */}
            <div className="border-b border-dashed border-slate-200 py-3 text-center">
              <div className="inline-flex items-center gap-[2px]">
                {order.id.split("").map((ch, i) => {
                  const width = ((ch.charCodeAt(0) + i) % 3) + 1;
                  return (
                    <div
                      key={i}
                      className="bg-slate-900"
                      style={{ width: `${width}px`, height: "32px" }}
                    ></div>
                  );
                })}
                {[2, 1, 3, 1, 2, 1, 3, 2].map((w, i) => (
                  <div
                    key={`b-${i}`}
                    className="bg-slate-900"
                    style={{ width: `${w}px`, height: "32px" }}
                  ></div>
                ))}
              </div>
              <div className="mt-1 font-mono text-[10px] tracking-widest text-slate-500">{order.id}</div>
            </div>

            {/* Thank you */}
            <div className="pt-4 text-center">
              <div className="text-lg font-black text-slate-900">Thank You!</div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-red-600">
                We appreciate your order
              </div>
              <p className="mt-2 text-[10px] italic text-slate-500">
                Hot, crispy, and made just for you. Enjoy your meal!
              </p>

              {/* Email Notification Confirmation */}
              <div className="mx-auto mt-4 max-w-[240px] rounded-xl border border-blue-200 bg-blue-50 p-3 text-left">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                  <span>📧</span>
                  <span>Confirmation email sent to:</span>
                </div>
                <div className="mt-1 truncate text-xs font-semibold text-blue-900">{order.customer.email}</div>
              </div>

              <div className="mt-3 text-[10px] text-slate-400">
                Questions? Call 09679170070 or email dinamaetibar05@gmail.com
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions — hidden on print */}
        <div className="no-print flex gap-2 border-t border-slate-100 bg-white p-4">
          <button
            onClick={handleDownload}
            className="flex-1 rounded-full border-2 border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            📄 Save PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 rounded-full bg-gradient-to-r from-red-600 to-orange-500 py-3 text-sm font-bold text-white shadow-lg transition hover:shadow-xl active:scale-[0.98]"
          >
            🖨️ Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
