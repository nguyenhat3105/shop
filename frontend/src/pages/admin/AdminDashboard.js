import React, { useEffect, useState, useCallback } from "react";
import {
  getAnalytics, getDailyRevenue, getTopProducts, getOrderStatus, exportOrders, exportInventory,
} from "../../services/api";
import {
  DollarSign, ShoppingBag, Package, Users, TrendingUp, Loader2,
  Download, RefreshCw, AlertCircle, Bell,
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useWebSocket } from "../../hooks/useWebSocket";

/* ── helpers ── */
const fmtVND = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n ?? 0);
const fmtShort = (v) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `${(v / 1_000).toFixed(0)}K`;
  return v;
};

const STATUS_COLORS = {
  PENDING:    "#f59e0b",
  CONFIRMED:  "#3b82f6",
  SHIPPING:   "#8b5cf6",
  DELIVERED:  "#10b981",
  CANCELLED:  "#ef4444",
};
const PIE_FALLBACK = ["#6366f1","#f59e0b","#10b981","#ef4444","#3b82f6","#8b5cf6"];

const RANGE_OPTIONS = [
  { label: "7 ngày", value: 7 },
  { label: "30 ngày", value: 30 },
  { label: "90 ngày", value: 90 },
];

/* ── download helper ── */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

/* ── skeleton ── */
function Skeleton({ className }) {
  return <div className={`bg-gray-100 rounded-xl animate-pulse ${className}`} />;
}

/* ── notification toast ── */
function OrderToast({ notifications, onDismiss }) {
  if (!notifications.length) return null;
  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="pointer-events-auto flex items-start gap-3 bg-white border border-gray-200 shadow-xl rounded-2xl px-4 py-3 min-w-[280px] animate-fadeUp"
        >
          <div className="w-9 h-9 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
            <Bell size={16} className="text-yellow-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900">🛒 Đơn hàng mới #{n.orderId}</p>
            <p className="text-xs text-gray-500 truncate">{n.customerName} — {fmtVND(n.total)}</p>
          </div>
          <button onClick={() => onDismiss(n.id)} className="text-gray-400 hover:text-gray-700 transition-colors text-xs shrink-0">✕</button>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const [summary,     setSummary]     = useState(null);
  const [daily,       setDaily]       = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [statusDist,  setStatusDist]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [range,       setRange]       = useState(30);
  const [exporting,   setExporting]   = useState(false);
  const [notifications, setNotifications] = useState([]);

  // ── WebSocket: nhận thông báo đơn mới ──
  const handleNewOrder = useCallback((payload) => {
    const toast = { ...payload, id: Date.now() };
    setNotifications((prev) => [toast, ...prev].slice(0, 5));
    // Auto-dismiss sau 8 giây
    setTimeout(() => dismissToast(toast.id), 8000);
    // Refresh summary
    loadSummary();
  }, []); // eslint-disable-line

  useWebSocket("/topic/admin/orders", handleNewOrder, true);

  const dismissToast = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const safeArr = (v) => (Array.isArray(v) ? v : Array.isArray(v?.content) ? v.content : []);

  const loadSummary = async () => {
    try {
      const res = await getAnalytics();
      setSummary(res.data);
      setStatusDist(
        safeArr(res.data?.orderStatusDist).map((s) => ({
          name:  s.status ?? s.name ?? "N/A",
          value: Number(s.count ?? s.value ?? 0),
        }))
      );
    } catch { /* silent */ }
  };

  const loadDaily = async (days) => {
    try {
      const res = await getDailyRevenue(days);
      setDaily(safeArr(res.data));
    } catch { /* silent */ }
  };

  const loadTopProducts = async () => {
    try {
      const res = await getTopProducts(5);
      setTopProducts(safeArr(res.data));
    } catch { /* silent */ }
  };

  useEffect(() => {
    Promise.all([loadSummary(), loadTopProducts()])
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line

  useEffect(() => { loadDaily(range); }, [range]);

  // ── Export handlers ──
  const handleExportOrders = async () => {
    setExporting(true);
    try {
      const from = new Date(Date.now() - range * 86400000).toISOString().split("T")[0];
      const to   = new Date().toISOString().split("T")[0];
      const res  = await exportOrders(from, to);
      downloadBlob(res.data, `don_hang_${from}_to_${to}.xlsx`);
    } catch { alert("Lỗi khi xuất Excel."); }
    finally   { setExporting(false); }
  };

  const handleExportInventory = async () => {
    setExporting(true);
    try {
      const res = await exportInventory();
      downloadBlob(res.data, "ton_kho.xlsx");
    } catch { alert("Lỗi khi xuất tồn kho."); }
    finally   { setExporting(false); }
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Skeleton className="xl:col-span-2 h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  /* ── Stat cards data ── */
  const STATS = [
    { label: "Tổng doanh thu",   value: fmtVND(summary?.totalRevenue),     icon: DollarSign, color: "blue"   },
    { label: "Doanh thu hôm nay",value: fmtVND(summary?.todayRevenue),      icon: TrendingUp, color: "green"  },
    { label: "Đơn hàng",         value: summary?.totalOrders?.toLocaleString(), icon: ShoppingBag, color: "orange" },
    { label: "Khách hàng",       value: summary?.totalUsers?.toLocaleString(),  icon: Users,  color: "purple" },
  ];
  const COLORS = {
    blue:   { bg: "bg-blue-50",   text: "text-blue-600"   },
    green:  { bg: "bg-green-50",  text: "text-green-600"  },
    orange: { bg: "bg-orange-50", text: "text-orange-600" },
    purple: { bg: "bg-purple-50", text: "text-purple-600" },
  };

  return (
    <div className="p-6 xl:p-8 space-y-8">
      {/* WS Notifications */}
      <OrderToast notifications={notifications} onDismiss={dismissToast} />

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[0.62rem] font-bold tracking-[0.28em] uppercase text-yellow-700 mb-1">
            <TrendingUp size={12} /> Quản trị
          </div>
          <h1 className="text-3xl font-normal text-gray-900 font-serif">Tổng quan hệ thống</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportOrders}
            disabled={exporting}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:border-gray-900 hover:bg-gray-50 transition-all disabled:opacity-40"
          >
            {exporting ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            Xuất đơn hàng
          </button>
          <button
            onClick={handleExportInventory}
            disabled={exporting}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:border-gray-900 hover:bg-gray-50 transition-all disabled:opacity-40"
          >
            <Download size={15} /> Xuất tồn kho
          </button>
          <button
            onClick={() => { loadSummary(); loadTopProducts(); loadDaily(range); }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all"
          >
            <RefreshCw size={15} /> Làm mới
          </button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {STATS.map(({ label, value, icon: Icon, color }) => {
          const { bg, text } = COLORS[color];
          return (
            <div key={label} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon size={20} className={text} />
                </div>
                <div className="min-w-0">
                  <p className="text-[0.7rem] text-gray-500 mb-0.5 truncate">{label}</p>
                  <h3 className="text-lg font-bold text-gray-900 truncate">{value ?? "—"}</h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Main charts row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Line chart — daily revenue */}
        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h2 className="text-base font-bold text-gray-900">Doanh thu theo ngày</h2>
            <div className="flex gap-1.5">
              {RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setRange(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    range === opt.value
                      ? "bg-gray-900 text-white"
                      : "border border-gray-200 text-gray-600 hover:border-gray-900"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={daily} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => {
                  const dt = new Date(d);
                  return `${dt.getDate()}/${dt.getMonth() + 1}`;
                }}
                axisLine={false} tickLine={false}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                interval={Math.floor(daily.length / 7)}
              />
              <YAxis
                axisLine={false} tickLine={false}
                tickFormatter={fmtShort}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                width={50}
              />
              <Tooltip
                formatter={(v) => [fmtVND(v), "Doanh thu"]}
                labelFormatter={(d) => {
                  const dt = new Date(d);
                  return `${dt.getDate()}/${dt.getMonth() + 1}/${dt.getFullYear()}`;
                }}
                contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }}
              />
              <Line
                type="monotone" dataKey="revenue"
                stroke="#1a1a1a" strokeWidth={2}
                dot={false} activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart — order status */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">Trạng thái đơn hàng</h2>
          {statusDist.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Không có dữ liệu</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusDist} cx="50%" cy="50%"
                  innerRadius={55} outerRadius={90}
                  paddingAngle={3} dataKey="value"
                >
                  {statusDist.map((entry, idx) => (
                    <Cell
                      key={entry.name}
                      fill={STATUS_COLORS[entry.name] ?? PIE_FALLBACK[idx % PIE_FALLBACK.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(v, name) => [v, name]} contentStyle={{ borderRadius: "10px", fontSize: "12px" }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Bottom row: top products + monthly bar ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top 5 sản phẩm */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-5">Top 5 sản phẩm bán chạy</h2>
          {topProducts.length === 0 ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-8 justify-center">
              <AlertCircle size={16} /> Chưa có dữ liệu bán hàng
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topProducts} layout="vertical" margin={{ left: 0, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} tickFormatter={fmtShort} />
                <YAxis
                  type="category" dataKey="name" width={130}
                  axisLine={false} tickLine={false}
                  tick={{ fontSize: 11, fill: "#374151" }}
                  tickFormatter={(name) => name?.length > 18 ? name.substring(0, 18) + "…" : name}
                />
                <Tooltip
                  formatter={(v, name) => [name === "totalSold" ? `${v} cái` : fmtVND(v), name === "totalSold" ? "Đã bán" : "Doanh thu"]}
                  contentStyle={{ borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                />
                <Bar dataKey="totalSold" fill="#1a1a1a" radius={[0, 4, 4, 0]} maxBarSize={20} name="Đã bán" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar chart — monthly revenue */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-5">Doanh thu theo tháng</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={safeArr(summary?.monthlyRevenue)} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tickFormatter={(m) => `T${m}`}
                axisLine={false} tickLine={false}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
              />
              <YAxis
                axisLine={false} tickLine={false}
                tickFormatter={fmtShort}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                width={50}
              />
              <Tooltip
                formatter={(v) => [fmtVND(v), "Doanh thu"]}
                labelFormatter={(m) => `Tháng ${m}`}
                contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                cursor={{ fill: "#f9fafb" }}
              />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
