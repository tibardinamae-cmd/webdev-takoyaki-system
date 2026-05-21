import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { menuItems as initialMenuItems, MenuItem } from "../data/menu";
import ItemImage from "./ItemImage";
import { Order } from "../context/CartContext";

type Props = {
  onBackToStore: () => void;
};

type Tab = "overview" | "orders" | "monitoring" | "menu" | "analytics" | "customers" | "settings";

export default function AdminDashboard({ onBackToStore }: Props) {
  const { currentUser, logout, users } = useAuth();
  const { orders, updateOrderStatus, deleteOrder, totalRevenue, todayRevenue, totalOrders } = useOrders();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  if (currentUser?.role !== "admin") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 text-6xl">🔒</div>
        <h2 className="mb-2 text-2xl font-black text-slate-900">Access Denied</h2>
        <p className="mb-6 text-slate-600">You must be signed in as an admin to view this page.</p>
        <button
          onClick={onBackToStore}
          className="rounded-full bg-slate-900 px-6 py-3 font-bold text-white transition hover:bg-slate-800"
        >
          Back to Store
        </button>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "orders", label: "Orders", icon: "📦" },
    { id: "monitoring", label: "Monitoring", icon: "📡" },
    { id: "menu", label: "Menu", icon: "🍱" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "customers", label: "Customers", icon: "👥" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const pendingOrders = orders.filter((o) => o.status !== "delivered").length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const handleSaveItem = (item: MenuItem) => {
    setMenuItems((prev) => {
      const exists = prev.some((m) => m.id === item.id);
      if (exists) return prev.map((m) => (m.id === item.id ? item : m));
      return [...prev, item];
    });
    setEditItem(null);
    setShowAddModal(false);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("Delete this item?")) {
      setMenuItems((prev) => prev.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-2xl text-white shadow-md">
              👨‍🍳
            </div>
            <div>
              <div className="flex items-center gap-2 font-black text-slate-900">
                Admin Dashboard
                <span className="rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Manager
                </span>
              </div>
              <div className="text-xs text-slate-500">
                Welcome, {currentUser.name} · {currentUser.email}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToStore}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">View Store</span>
            </button>
            <button
              onClick={() => {
                logout();
                onBackToStore();
              }}
              className="rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.id === "orders" && pendingOrders > 0 && (
                  <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    {pendingOrders}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {activeTab === "overview" && (
          <OverviewTab
            totalRevenue={totalRevenue}
            todayRevenue={todayRevenue}
            totalOrders={totalOrders}
            pendingOrders={pendingOrders}
            avgOrderValue={avgOrderValue}
            orders={orders}
            menuItems={menuItems}
          />
        )}
        {activeTab === "orders" && (
          <OrdersTab orders={orders} onUpdateStatus={updateOrderStatus} onDelete={deleteOrder} />
        )}
        {activeTab === "monitoring" && (
          <MonitoringTab orders={orders} onUpdateStatus={updateOrderStatus} />
        )}
        {activeTab === "menu" && (
          <MenuTab
            menuItems={menuItems}
            onEdit={setEditItem}
            onDelete={handleDeleteItem}
            onAdd={() => setShowAddModal(true)}
          />
        )}
        {activeTab === "analytics" && <AnalyticsTab orders={orders} menuItems={menuItems} />}
        {activeTab === "customers" && <CustomersTab users={users} orders={orders} />}
        {activeTab === "settings" && <SettingsTab />}
      </div>

      {(editItem || showAddModal) && (
        <MenuEditModal
          item={editItem}
          onClose={() => {
            setEditItem(null);
            setShowAddModal(false);
          }}
          onSave={handleSaveItem}
        />
      )}
    </div>
  );
}

/* ============ OVERVIEW ============ */
function OverviewTab({
  totalRevenue,
  todayRevenue,
  totalOrders,
  pendingOrders,
  avgOrderValue,
  orders,
  menuItems,
}: {
  totalRevenue: number;
  todayRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  avgOrderValue: number;
  orders: Order[];
  menuItems: MenuItem[];
}) {
  const last7Days = useMemo(() => getLast7DaysRevenue(orders), [orders]);
  const maxRevenue = Math.max(...last7Days.map((d) => d.revenue), 1);
  const topItems = useMemo(() => getTopItems(orders, menuItems).slice(0, 5), [orders, menuItems]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Dashboard Overview</h2>
        <p className="text-sm text-slate-500">Monitor your store performance at a glance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={`₱${Math.round(totalRevenue)}`} icon="💰" trend="+12.5%" trendUp accent="bg-green-100 text-green-600" />
        <StatCard label="Today's Revenue" value={`₱${Math.round(todayRevenue)}`} icon="📈" trend="vs yesterday" accent="bg-blue-100 text-blue-600" />
        <StatCard label="Total Orders" value={String(totalOrders)} icon="📦" trend={`${pendingOrders} active`} accent="bg-orange-100 text-orange-600" />
        <StatCard label="Avg Order Value" value={`₱${Math.round(avgOrderValue)}`} icon="💳" trend="per order" accent="bg-purple-100 text-purple-600" />
      </div>

      {/* Revenue Chart */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">Revenue (Last 7 Days)</h3>
            <p className="text-xs text-slate-500">Daily revenue breakdown</p>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Weekly Total</div>
            <div className="text-xl font-black text-slate-900">
              ₱{Math.round(last7Days.reduce((s, d) => s + d.revenue, 0))}
            </div>
          </div>
        </div>

        {last7Days.every((d) => d.revenue === 0) ? (
          <div className="py-10 text-center text-sm text-slate-500">
            📊 Chart will appear once orders are placed
          </div>
        ) : (
          <div className="flex h-48 items-end gap-2">
            {last7Days.map((day) => {
              const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
              return (
                <div key={day.label} className="group flex flex-1 flex-col items-center gap-2">
                  <div className="relative flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-red-500 to-orange-400 transition-all hover:from-red-600 hover:to-orange-500"
                      style={{ height: `${Math.max(height, 2)}%` }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100">
                        ₱{Math.round(day.revenue)}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500">{day.label}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">Recent Orders</h3>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
              {pendingOrders} active
            </span>
          </div>
          {orders.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">No orders yet</div>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-xs font-bold text-white">
                      {order.customer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">#{order.id}</div>
                      <div className="text-xs text-slate-500">
                        {order.customer.name} · {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">₱{Math.round(order.total)}</div>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Items */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <h3 className="mb-4 text-lg font-black text-slate-900">Top Selling Items</h3>
          {topItems.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">No sales data yet</div>
          ) : (
            <div className="space-y-3">
              {topItems.map((item, i) => {
                const maxQty = topItems[0]?.qty || 1;
                const width = (item.qty / maxQty) * 100;
                return (
                  <div key={item.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                          {i + 1}
                        </span>
                        <span className="font-semibold text-slate-900">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">{item.qty} sold</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400"
                        style={{ width: `${width}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============ MONITORING ============ */
function MonitoringTab({
  orders,
  onUpdateStatus,
}: {
  orders: Order[];
  onUpdateStatus: (id: string, status: Order["status"]) => void;
}) {
  const [liveOrders, setLiveOrders] = useState<Order[]>(orders);
  const [activityLog, setActivityLog] = useState<
    { time: string; message: string; type: string }[]
  >([
    { time: "Just now", message: "System monitoring started", type: "system" },
  ]);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update one active order status for demo
      const activeOrders = liveOrders.filter((o) => o.status !== "delivered");
      if (activeOrders.length > 0 && Math.random() > 0.7) {
        const randomOrder = activeOrders[Math.floor(Math.random() * activeOrders.length)];
        const statuses: Order["status"][] = ["preparing", "cooking", "on-the-way"];
        const currentIndex = statuses.indexOf(randomOrder.status);
        if (currentIndex < statuses.length - 1) {
          const nextStatus = statuses[currentIndex + 1];
          onUpdateStatus(randomOrder.id, nextStatus);

          setActivityLog((prev) => [
            {
              time: "Just now",
              message: `Order #${randomOrder.id} moved to ${nextStatus}`,
              type: "update",
            },
            ...prev.slice(0, 9),
          ]);
        }
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [liveOrders, onUpdateStatus]);

  useEffect(() => {
    setLiveOrders(orders);
  }, [orders]);

  const activeOrders = liveOrders.filter((o) => o.status !== "delivered");
  const preparing = liveOrders.filter((o) => o.status === "preparing").length;
  const cooking = liveOrders.filter((o) => o.status === "cooking").length;
  const onTheWay = liveOrders.filter((o) => o.status === "on-the-way").length;

  const avgPrepTime = Math.floor(Math.random() * 8) + 12; // Simulated 12-20 min

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Live Monitoring 📡</h2>
        <p className="text-sm text-slate-500">Real-time order tracking and kitchen operations</p>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Orders</div>
              <div className="text-4xl font-black text-slate-900">{activeOrders.length}</div>
            </div>
            <div className="text-4xl">🔥</div>
          </div>
          <div className="mt-3 text-xs text-green-600">● All systems operational</div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg Prep Time</div>
              <div className="text-4xl font-black text-slate-900">{avgPrepTime} min</div>
            </div>
            <div className="text-4xl">⏱️</div>
          </div>
          <div className="mt-3 text-xs text-blue-600">-2 min from yesterday</div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Kitchen Status</div>
              <div className="text-2xl font-black text-green-600">Open & Active</div>
            </div>
            <div className="text-4xl">👨‍🍳</div>
          </div>
          <div className="mt-3 text-xs text-slate-500">{preparing + cooking} orders in kitchen</div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">On Delivery</div>
              <div className="text-4xl font-black text-orange-600">{onTheWay}</div>
            </div>
            <div className="text-4xl">🛵</div>
          </div>
          <div className="mt-3 text-xs text-slate-500">Drivers currently en route</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Live Order Queue */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">Live Order Queue</h3>
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
              {activeOrders.length} LIVE
            </span>
          </div>

          {activeOrders.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">No active orders at the moment</div>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {activeOrders.slice(0, 8).map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                  <div className="flex items-center gap-3">
                    <div className="font-mono text-sm font-bold text-slate-900">#{order.id}</div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{order.customer.name}</div>
                      <div className="text-xs text-slate-500">{order.items.length} items • ₱{Math.round(order.total)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateStatus(order.id, e.target.value as Order["status"])}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold outline-none focus:border-red-400"
                    >
                      <option value="preparing">Preparing</option>
                      <option value="cooking">Cooking</option>
                      <option value="on-the-way">On the way</option>
                    </select>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Activity Feed */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h3 className="mb-4 text-lg font-black text-slate-900">Live Activity Feed</h3>
          <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1 text-sm">
            {activityLog.length === 0 ? (
              <div className="py-8 text-center text-slate-500">Waiting for activity...</div>
            ) : (
              activityLog.map((log, index) => (
                <div key={index} className="flex gap-3 rounded-xl bg-slate-50 p-3">
                  <div className="mt-1 text-lg">
                    {log.type === "system" ? "⚙️" : log.type === "update" ? "🔄" : "📦"}
                  </div>
                  <div className="flex-1">
                    <div className="text-slate-900">{log.message}</div>
                    <div className="text-xs text-slate-500">{log.time}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h3 className="mb-4 text-lg font-black text-slate-900">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              activeOrders.forEach((o) => onUpdateStatus(o.id, "cooking"));
              setActivityLog((prev) => [{ time: "Just now", message: "All orders set to Cooking", type: "update" }, ...prev]);
            }}
            className="rounded-full bg-amber-100 px-5 py-2 text-sm font-bold text-amber-700 transition hover:bg-amber-200"
          >
            🔥 Mark All as Cooking
          </button>
          <button
            onClick={() => {
              const onWayOrders = liveOrders.filter((o) => o.status === "cooking");
              onWayOrders.forEach((o) => onUpdateStatus(o.id, "on-the-way"));
              setActivityLog((prev) => [{ time: "Just now", message: `${onWayOrders.length} orders dispatched`, type: "update" }, ...prev]);
            }}
            className="rounded-full bg-blue-100 px-5 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-200"
          >
            🛵 Dispatch All Deliveries
          </button>
          <button
            onClick={() => {
              setActivityLog((prev) => [{ time: "Just now", message: "Kitchen status refreshed", type: "system" }, ...prev]);
            }}
            className="rounded-full bg-green-100 px-5 py-2 text-sm font-bold text-green-700 transition hover:bg-green-200"
          >
            🔄 Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============ ORDERS ============ */
function OrdersTab({
  orders,
  onUpdateStatus,
  onDelete,
}: {
  orders: Order[];
  onUpdateStatus: (id: string, status: Order["status"]) => void;
  onDelete: (id: string) => void;
}) {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = orders.filter((o) => {
    const matchesFilter = filter === "all" || o.status === filter;
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.phone.includes(search);
    return matchesFilter && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ["Order ID", "Date", "Customer", "Phone", "Items", "Total", "Status"];
    const rows = filtered.map((o) => [
      o.id,
      new Date(o.createdAt).toLocaleString(),
      o.customer.name,
      o.customer.phone,
      o.items.map((i) => `${i.item.name} x${i.quantity}`).join("; "),
      o.total.toFixed(2),
      o.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${Date.now()}.csv`;
    a.click();
  };

  const counts = {
    all: orders.length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    cooking: orders.filter((o) => o.status === "cooking").length,
    "on-the-way": orders.filter((o) => o.status === "on-the-way").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Orders <span className="text-slate-400">({filtered.length})</span>
          </h2>
          <p className="text-sm text-slate-500">Manage and track all customer orders</p>
        </div>
        <button
          onClick={exportCSV}
          disabled={filtered.length === 0}
          className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID, customer name, or phone..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1 overflow-x-auto rounded-full bg-white p-1 ring-1 ring-slate-200">
        {(["all", "preparing", "cooking", "on-the-way", "delivered"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${
              filter === f ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>{f.replace("-", " ")}</span>
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${filter === f ? "bg-white/20" : "bg-slate-100"}`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-100">
          <div className="mb-2 text-5xl">📭</div>
          <p className="font-semibold text-slate-700">No orders found</p>
          <p className="text-sm text-slate-500">Try adjusting your filters or search</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((order) => (
            <div key={order.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-sm font-bold text-white">
                    {order.customer.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900">#{order.id}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleString()} · {order.items.length} items · ₱{Math.round(order.total)}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-700">
                      {order.customer.name} · {order.customer.phone}
                    </div>
                    <div className="text-xs text-slate-500">
                      {order.customer.address}, {order.customer.city}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order.id, e.target.value as Order["status"])}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold outline-none focus:border-red-400"
                  >
                    <option value="Order Received">Order Received</option>
                    <option value="Order Received">Order Received</option>
                    <option value="preparing">Preparing</option>
                    <option value="cooking">Cooking</option>
                    <option value="on-the-way">On the way</option>
                    <option value="delivered">Delivered</option>
                  </select>
                  <button
                    onClick={() => setSelected(order)}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete order #${order.id}?`)) onDelete(order.id);
                    }}
                    className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">Order #{selected.id}</h3>
              <button onClick={() => setSelected(null)} className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200">
                ×
              </button>
            </div>
            <div className="space-y-3">
              {selected.items.map((ci) => (
                <div key={ci.item.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-3">
                    <ItemImage item={ci.item} size="sm" />
                    <div>
                      <div className="text-sm font-bold">{ci.item.name}</div>
                      <div className="text-xs text-slate-500">× {ci.quantity}</div>
                    </div>
                  </div>
                  <span className="font-bold">₱{ci.item.price * ci.quantity}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1 border-t border-slate-200 pt-4 text-sm">
              <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>₱{Math.round(selected.subtotal)}</span></div>
              <div className="flex justify-between text-slate-600"><span>Delivery</span><span>₱{Math.round(selected.deliveryFee)}</span></div>
              <div className="flex justify-between text-slate-600"><span>Tax</span><span>₱{Math.round(selected.tax)}</span></div>
              <div className="flex justify-between border-t border-dashed border-slate-200 pt-2 text-base font-black text-slate-900">
                <span>Total</span><span>₱{Math.round(selected.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ MENU ============ */
function MenuTab({
  menuItems,
  onEdit,
  onDelete,
  onAdd,
}: {
  menuItems: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filtered = menuItems.filter((m) => {
    const matchesCat = categoryFilter === "all" || m.category === categoryFilter;
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Menu Management <span className="text-slate-400">({menuItems.length})</span>
          </h2>
          <p className="text-sm text-slate-500">Add, edit, or remove menu items</p>
        </div>
        <button
          onClick={onAdd}
          className="rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:shadow-xl"
        >
          Add New Item
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search menu items..."
          className="flex-1 rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
          style={{ minWidth: "200px" }}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-red-400"
        >
          <option value="all">All Categories</option>
          <option value="classic">Classic</option>
          <option value="premium">Premium</option>
          <option value="spicy">Spicy</option>
          <option value="sides">Sides</option>
          <option value="drinks">Drinks</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Tags</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <ItemImage item={item} size="sm" />
                      <div>
                        <div className="text-sm font-bold text-slate-900">{item.name}</div>
                        <div className="text-xs text-slate-500">{item.piecesPerServing} {item.category === "drinks" ? "cup" : "pcs"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold capitalize text-slate-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-900">₱{item.price}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {item.popular && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">POPULAR</span>}
                      {item.spicy && <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600">SPICY</span>}
                      {item.vegetarian && <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-600">VEGGIE</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => onEdit(item)}
                        className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MenuEditModal({
  item,
  onClose,
  onSave,
}: {
  item: MenuItem | null;
  onClose: () => void;
  onSave: (item: MenuItem) => void;
}) {
  const [form, setForm] = useState<MenuItem>(
    item || {
      id: `item-${Date.now()}`,
      name: "",
      description: "",
      price: 5,
      category: "classic",
      image: "https://images.pexels.com/photos/31302984/pexels-photo-31302984.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      ingredients: [],
      piecesPerServing: 6,
    }
  );
  const [ingredientsText, setIngredientsText] = useState(form.ingredients.join(", "));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      ingredients: ingredientsText.split(",").map((s) => s.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900">{item ? "Edit Item" : "Add New Item"}</h3>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200">
            ×
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">Description</label>
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">Price (₱)</label>
            <input
              type="number"
              min="1"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as MenuItem["category"] })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-red-400 focus:bg-white"
            >
              <option value="classic">Classic</option>
              <option value="premium">Premium</option>
              <option value="spicy">Spicy</option>
              <option value="sides">Sides</option>
              <option value="drinks">Drinks</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">Pieces/Serving</label>
            <input
              type="number"
              min="1"
              value={form.piecesPerServing}
              onChange={(e) => setForm({ ...form, piecesPerServing: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">Ingredients (comma-separated)</label>
            <input
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              placeholder="Octopus, Green Onion, Ginger"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">Image URL</label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
            />
          </div>
          <div className="sm:col-span-2 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={!!form.popular}
                onChange={(e) => setForm({ ...form, popular: e.target.checked || undefined })}
                className="h-4 w-4 rounded accent-red-600"
              />
              Popular
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={!!form.spicy}
                onChange={(e) => setForm({ ...form, spicy: e.target.checked || undefined })}
                className="h-4 w-4 rounded accent-red-600"
              />
              Spicy
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={!!form.vegetarian}
                onChange={(e) => setForm({ ...form, vegetarian: e.target.checked || undefined })}
                className="h-4 w-4 rounded accent-red-600"
              />
              Vegetarian
            </label>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border-2 border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-full bg-gradient-to-r from-red-600 to-orange-500 py-3 text-sm font-bold text-white shadow-lg transition hover:shadow-xl"
          >
            {item ? "Save Changes" : "Add Item"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ============ ANALYTICS ============ */
function AnalyticsTab({ orders, menuItems }: { orders: Order[]; menuItems: MenuItem[] }) {
  const categoryStats = useMemo(() => getCategoryStats(orders), [orders]);
  const hourlyData = useMemo(() => getHourlyStats(orders), [orders]);
  const topItems = useMemo(() => getTopItems(orders, menuItems).slice(0, 8), [orders, menuItems]);
  const maxHourly = Math.max(...hourlyData.map((h) => h.count), 1);
  const maxCat = Math.max(...categoryStats.map((c) => c.revenue), 1);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Analytics & Insights</h2>
        <p className="text-sm text-slate-500">Deep dive into your sales performance</p>
      </div>

      {/* Revenue by Category */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h3 className="mb-5 text-lg font-black text-slate-900">Revenue by Category</h3>
        {categoryStats.length === 0 || categoryStats.every((c) => c.revenue === 0) ? (
          <div className="py-10 text-center text-sm text-slate-500">No sales data yet</div>
        ) : (
          <div className="space-y-3">
            {categoryStats.map((cat) => {
              const width = (cat.revenue / maxCat) * 100;
              return (
                <div key={cat.category}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-semibold capitalize text-slate-900">{cat.category}</span>
                    <div className="flex gap-4 text-xs text-slate-500">
                      <span>{cat.count} orders</span>
                      <span className="font-bold text-slate-900">₱{Math.round(cat.revenue)}</span>
                    </div>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${cat.color}`}
                      style={{ width: `${width}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Hourly Orders Heatmap */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">Orders by Hour</h3>
            <p className="text-xs text-slate-500">Peak hours visualization (store hours: 11am - 10pm)</p>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-1">
          {hourlyData.map((h) => {
            const intensity = maxHourly > 0 ? h.count / maxHourly : 0;
            const bg =
              intensity === 0
                ? "bg-slate-100"
                : intensity < 0.33
                ? "bg-red-200"
                : intensity < 0.66
                ? "bg-red-400"
                : "bg-red-600";
            return (
              <div key={h.hour} className="flex flex-col items-center gap-1">
                <div
                  className={`aspect-square w-full rounded ${bg} transition hover:scale-105`}
                  title={`${h.hour}:00 - ${h.count} orders`}
                ></div>
                <div className="text-[9px] font-semibold text-slate-500">{h.hour}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-end gap-2 text-[10px] text-slate-500">
          <span>Less</span>
          <div className="h-3 w-3 rounded bg-slate-100"></div>
          <div className="h-3 w-3 rounded bg-red-200"></div>
          <div className="h-3 w-3 rounded bg-red-400"></div>
          <div className="h-3 w-3 rounded bg-red-600"></div>
          <span>More</span>
        </div>
      </div>

      {/* Top Products with Bars */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h3 className="mb-5 text-lg font-black text-slate-900">Best Selling Products</h3>
        {topItems.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500">No sales data yet</div>
        ) : (
          <div className="space-y-3">
            {topItems.map((item, i) => {
              const maxQty = topItems[0]?.qty || 1;
              const width = (item.qty / maxQty) * 100;
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-700">
                    {i + 1}
                  </div>
                  <ItemImage item={item} size="sm" />
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-900">{item.name}</span>
                      <span className="text-xs text-slate-500">{item.qty} sold · ₱{Math.round(item.revenue)}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400" style={{ width: `${width}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ CUSTOMERS ============ */
function CustomersTab({ users, orders }: { users: any[]; orders: Order[] }) {
  const customers = users.filter((u) => u.role === "customer");

  const customerStats = useMemo(() => {
    const stats: Record<string, { count: number; total: number }> = {};
    orders.forEach((o) => {
      const email = o.customer.email;
      if (!stats[email]) stats[email] = { count: 0, total: 0 };
      stats[email].count++;
      stats[email].total += o.total;
    });
    return stats;
  }, [orders]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-black text-slate-900">
          Customers <span className="text-slate-400">({customers.length})</span>
        </h2>
        <p className="text-sm text-slate-500">Your customer base and their activity</p>
      </div>

      {customers.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-100">
          <div className="mb-2 text-5xl">👥</div>
          <p className="font-semibold text-slate-700">No customers yet</p>
          <p className="text-sm text-slate-500">New customers will appear once they sign up.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Orders</th>
                  <th className="px-4 py-3">Lifetime Value</th>
                  <th className="px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => {
                  const stat = customerStats[c.email] || { count: 0, total: 0 };
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-sm font-bold text-white">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{c.name}</div>
                            <div className="text-xs text-slate-500">{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{c.phone || "—"}</td>
                      <td className="px-4 py-3 text-sm font-bold text-slate-900">{stat.count}</td>
                      <td className="px-4 py-3 text-sm font-bold text-green-600">₱{Math.round(stat.total)}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ SETTINGS ============ */
function SettingsTab() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("takoyaki-settings");
      return saved
        ? JSON.parse(saved)
        : {
            storeName: "Takoyaki Mini Store",
            phone: "09679170070",
            address: "Labrador, Hinunangan, Southern Leyte",
            email: "dinamaetibar05@gmail.com",
            taxRate: 8,
            deliveryFee: 20,
            freeDeliveryMin: 200,
            openTime: "11:00",
            closeTime: "22:00",
            acceptOrders: true,
          };
    } catch {
      return {};
    }
  });
  const [saved, setSaved] = useState(false);

  const save = () => {
    localStorage.setItem("takoyaki-settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Store Settings</h2>
        <p className="text-sm text-slate-500">Configure your store information and policies</p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h3 className="mb-4 text-lg font-black text-slate-900">Store Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">Store Name</label>
            <input
              value={settings.storeName}
              onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-red-400 focus:bg-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">Phone</label>
            <input
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-red-400 focus:bg-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">Email</label>
            <input
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-red-400 focus:bg-white"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">Address</label>
            <input
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-red-400 focus:bg-white"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h3 className="mb-4 text-lg font-black text-slate-900">Pricing & Delivery</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">Tax Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={settings.taxRate}
              onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-red-400 focus:bg-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">Delivery Fee (₱)</label>
            <input
              type="number"
              step="0.01"
              value={settings.deliveryFee}
              onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-red-400 focus:bg-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">Free Delivery Min (₱)</label>
            <input
              type="number"
              value={settings.freeDeliveryMin}
              onChange={(e) => setSettings({ ...settings, freeDeliveryMin: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-red-400 focus:bg-white"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h3 className="mb-4 text-lg font-black text-slate-900">Operating Hours</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">Opens At</label>
            <input
              type="time"
              value={settings.openTime}
              onChange={(e) => setSettings({ ...settings, openTime: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-red-400 focus:bg-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">Closes At</label>
            <input
              type="time"
              value={settings.closeTime}
              onChange={(e) => setSettings({ ...settings, closeTime: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-red-400 focus:bg-white"
            />
          </div>
        </div>
        <label className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <input
            type="checkbox"
            checked={settings.acceptOrders}
            onChange={(e) => setSettings({ ...settings, acceptOrders: e.target.checked })}
            className="h-5 w-5 rounded accent-red-600"
          />
          <div>
            <div className="text-sm font-bold text-slate-900">Accepting Orders</div>
            <div className="text-xs text-slate-500">Toggle off to pause order intake temporarily</div>
          </div>
        </label>
      </div>

      <div className="flex items-center justify-end gap-3">
        {saved && <span className="text-sm font-semibold text-green-600">✓ Settings saved</span>}
        <button
          onClick={save}
          className="rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:shadow-xl"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}

/* ============ HELPERS ============ */
function StatCard({
  label,
  value,
  icon,
  trend,
  trendUp,
  accent,
}: {
  label: string;
  value: string;
  icon: string;
  trend: string;
  trendUp?: boolean;
  accent: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${accent}`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-black text-slate-900 sm:text-3xl">{value}</div>
      {trend && (
        <div className={`mt-1 text-xs font-semibold ${trendUp ? "text-green-600" : "text-slate-500"}`}>
          {trendUp && "↑ "}
          {trend}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    preparing: "bg-slate-100 text-slate-700",
    cooking: "bg-amber-100 text-amber-700",
    "on-the-way": "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
  };
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      {status.replace("-", " ")}
    </span>
  );
}

function getLast7DaysRevenue(orders: Order[]) {
  const days: { label: string; revenue: number }[] = [];
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    const revenue = orders
      .filter((o) => o.createdAt >= date.getTime() && o.createdAt < nextDay.getTime())
      .reduce((sum, o) => sum + o.total, 0);
    days.push({ label: i === 0 ? "Today" : dayLabels[date.getDay()], revenue });
  }
  return days;
}

function getTopItems(orders: Order[], menuItems: MenuItem[]) {
  const counts: Record<string, { qty: number; revenue: number }> = {};
  orders.forEach((o) => {
    o.items.forEach((ci) => {
      if (!counts[ci.item.id]) counts[ci.item.id] = { qty: 0, revenue: 0 };
      counts[ci.item.id].qty += ci.quantity;
      counts[ci.item.id].revenue += ci.item.price * ci.quantity;
    });
  });
  return Object.entries(counts)
    .map(([id, data]) => {
      const mi = menuItems.find((m) => m.id === id);
      return { id, qty: data.qty, revenue: data.revenue, ...(mi || {}) } as MenuItem & { qty: number; revenue: number };
    })
    .sort((a, b) => b.qty - a.qty);
}

function getCategoryStats(orders: Order[]) {
  const stats: Record<string, { count: number; revenue: number }> = {};
  orders.forEach((o) => {
    o.items.forEach((ci) => {
      const cat = ci.item.category;
      if (!stats[cat]) stats[cat] = { count: 0, revenue: 0 };
      stats[cat].count += ci.quantity;
      stats[cat].revenue += ci.item.price * ci.quantity;
    });
  });
  const colors: Record<string, string> = {
    classic: "bg-blue-500",
    premium: "bg-purple-500",
    spicy: "bg-red-500",
    sides: "bg-green-500",
    drinks: "bg-amber-500",
  };
  return Object.entries(stats)
    .map(([category, data]) => ({
      category,
      count: data.count,
      revenue: data.revenue,
      color: colors[category] || "bg-slate-500",
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

function getHourlyStats(orders: Order[]) {
  const hours: { hour: number; count: number }[] = [];
  for (let h = 11; h <= 22; h++) {
    const count = orders.filter((o) => {
      const hour = new Date(o.createdAt).getHours();
      return hour === h;
    }).length;
    hours.push({ hour: h, count });
  }
  return hours;
}
