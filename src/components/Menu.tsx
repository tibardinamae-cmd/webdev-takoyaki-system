import { useState } from "react";
import { menuItems, categories, MenuItem } from "../data/menu";
import { useCart } from "../context/CartContext";

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const { dispatch } = useCart();

  const filtered = menuItems.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="menu" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-red-500">Our Menu</div>
          <h2 className="text-5xl font-black tracking-[-1px] text-slate-900 sm:text-6xl">
            Choose your flavor
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-600">
            Freshly made to order with premium ingredients. Every piece comes with our signature sauce, 
            creamy mayo, bonito flakes, and aonori.
          </p>
        </div>

        <div className="mx-auto mb-6 max-w-xl">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search our menu..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
            />
          </div>
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                activeCategory === cat.id
                  ? "bg-slate-900 text-white shadow-lg"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mb-4 text-6xl">🤔</div>
            <p className="text-lg font-semibold text-slate-700">No items found</p>
            <p className="text-slate-500">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((item) => (
              <article
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30"></div>

                  <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                    {item.popular && (
                      <span className="rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow">
                        Popular
                      </span>
                    )}
                    {item.vegetarian && (
                      <span className="rounded-full bg-green-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow">
                        Veggie
                      </span>
                    )}
                  </div>
                  {item.spicy && (
                    <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-red-600 shadow backdrop-blur">
                      🌶️ Spicy
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedItem(item)}
                    className="absolute inset-x-3 bottom-3 translate-y-2 rounded-xl bg-white/95 py-2 text-xs font-bold text-slate-700 opacity-0 shadow-md backdrop-blur transition group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    View Details →
                  </button>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="mb-2 text-sm font-bold leading-tight text-slate-900">{item.name}</h3>
                  <p className="mb-4 line-clamp-2 flex-1 text-xs text-slate-600">{item.description}</p>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-black text-slate-900">₱{item.price}</div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400">
                        {item.piecesPerServing} {item.category === "drinks" ? "cup" : "pcs"}
                      </div>
                    </div>
                    <button
                      onClick={() => dispatch({ type: "ADD_ITEM", payload: { item } })}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-lg transition-all hover:from-red-700 hover:to-orange-600 active:scale-95"
                      aria-label={`Add ${item.name} to cart`}
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {selectedItem && <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </section>
  );
}

function ItemDetailModal({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  const handleAdd = () => {
    dispatch({ type: "ADD_ITEM", payload: { item, quantity, notes: notes || undefined } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition hover:bg-white"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        </div>

        <div className="p-6">
          <h3 className="mb-2 text-2xl font-black text-slate-900">{item.name}</h3>
          <p className="mb-5 text-slate-600">{item.description}</p>

          <div className="mb-5">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Ingredients</div>
            <div className="flex flex-wrap gap-2">
              {item.ingredients.map((ing) => (
                <span key={ing} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Special requests
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. extra bonito flakes, no mayo..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg font-bold shadow-sm transition hover:bg-slate-100"
              >
                −
              </button>
              <div className="min-w-[2ch] text-center text-lg font-black">{quantity}</div>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg font-bold shadow-sm transition hover:bg-slate-100"
              >
                +
              </button>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Total</div>
              <div className="text-xl font-black text-slate-900">₱{item.price * quantity}</div>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="mt-4 w-full rounded-full bg-gradient-to-r from-red-600 to-orange-500 py-4 text-base font-bold text-white shadow-lg transition hover:shadow-xl active:scale-[0.98]"
          >
            Add {quantity} to cart · ₱{item.price * quantity}
          </button>
        </div>
      </div>
    </div>
  );
}
