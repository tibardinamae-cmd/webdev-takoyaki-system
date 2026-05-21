import { useCart } from "../context/CartContext";
import ItemImage from "./ItemImage";

export default function Cart() {
  const { state, dispatch, itemCount, subtotal, deliveryFee, tax, total } = useCart();

  if (!state.isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={() => dispatch({ type: "TOGGLE_CART", payload: false })}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div
        className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="text-xl font-black text-slate-900">Your Cart 🛒</h2>
            <p className="text-xs text-slate-500">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            onClick={() => dispatch({ type: "TOGGLE_CART", payload: false })}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition hover:bg-slate-200"
            aria-label="Close cart"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        {state.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
            <div className="mb-4 text-7xl">🐙</div>
            <h3 className="mb-2 text-lg font-bold text-slate-900">Your cart is empty</h3>
            <p className="mb-6 text-sm text-slate-500">Add some delicious takoyaki to get started!</p>
            <button
              onClick={() => dispatch({ type: "TOGGLE_CART", payload: false })}
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="space-y-3">
                {state.items.map((ci) => (
                  <div key={ci.item.id} className="flex gap-3 rounded-2xl bg-slate-50 p-3">
                    <ItemImage item={ci.item} size="md" />
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="text-sm font-bold leading-tight text-slate-900">{ci.item.name}</h4>
                          <p className="text-xs text-slate-500">
                            ₱{ci.item.price} × {ci.quantity}
                          </p>
                          {ci.notes && (
                            <p className="mt-1 rounded-md bg-white px-2 py-1 text-[10px] text-slate-500 italic">
                              "{ci.notes}"
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => dispatch({ type: "REMOVE_ITEM", payload: ci.item.id })}
                          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                          aria-label={`Remove ${ci.item.name}`}
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 7V4a1 1 0 011-1h2a1 1 0 011 1v3" />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200">
                          <button
                            onClick={() =>
                              dispatch({
                                type: "UPDATE_QUANTITY",
                                payload: { id: ci.item.id, quantity: ci.quantity - 1 },
                              })
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-slate-600 transition hover:bg-slate-100"
                          >
                            −
                          </button>
                          <span className="min-w-[1.5ch] text-center text-sm font-bold">{ci.quantity}</span>
                          <button
                            onClick={() =>
                              dispatch({
                                type: "UPDATE_QUANTITY",
                                payload: { id: ci.item.id, quantity: ci.quantity + 1 },
                              })
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-slate-600 transition hover:bg-slate-100"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-sm font-black text-slate-900">
                          ₱{ci.item.price * ci.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {subtotal < 25 && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                  <strong>💡 Tip:</strong> Add ₱{Math.round(25 - subtotal)} more for free delivery!
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 bg-white p-5">
              <div className="mb-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₱{Math.round(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? <span className="font-semibold text-green-600">FREE</span> : `₱${Math.round(deliveryFee)}`}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax (8%)</span>
                  <span>₱{Math.round(tax)}</span>
                </div>
                <div className="my-2 border-t border-dashed border-slate-200"></div>
                <div className="flex justify-between text-lg font-black text-slate-900">
                  <span>Total</span>
                  <span>₱{Math.round(total)}</span>
                </div>
              </div>

              <button
                onClick={() => dispatch({ type: "TOGGLE_CHECKOUT", payload: true })}
                className="w-full rounded-full bg-gradient-to-r from-red-600 to-orange-500 py-4 text-base font-bold text-white shadow-lg transition hover:shadow-xl active:scale-[0.98]"
              >
                Checkout · ₱{Math.round(total)}
              </button>

              <button
                onClick={() => dispatch({ type: "CLEAR_CART" })}
                className="mt-2 w-full rounded-full py-2 text-xs font-semibold text-slate-500 transition hover:text-red-500"
              >
                Clear cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
