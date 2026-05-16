import React, { useState, useEffect, useRef } from "react";
import { getInventory, updateStock, exportInventory } from "../../services/api";
import {
  Package, AlertTriangle, CheckCircle, Search, Loader2, Download,
  RefreshCw, Edit3, X, Check, WarehouseIcon, TrendingDown,
} from "lucide-react";

/* ─── helpers ─── */
const fmt = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n ?? 0);

const LOW  = 5;
const ZERO = 0;

const stockStatus = (s) => {
  if (s <= ZERO) return { label: "Hết hàng", cls: "bg-red-100 text-red-700 border-red-200" };
  if (s <= LOW)  return { label: "Sắp hết",  cls: "bg-orange-100 text-orange-700 border-orange-200" };
  return               { label: "Còn hàng",  cls: "bg-emerald-100 text-emerald-700 border-emerald-200" };
};

/* ─── inline stock editor ─── */
function StockEditor({ productId, current, onSave, onCancel }) {
  const [val, setVal]     = useState(String(current));
  const [busy, setBusy]   = useState(false);
  const ref               = useRef(null);
  useEffect(() => { ref.current?.focus(); ref.current?.select(); }, []);

  const save = async () => {
    const n = parseInt(val, 10);
    if (isNaN(n) || n < 0) return;
    setBusy(true);
    try   { await updateStock(productId, n); onSave(n); }
    catch  { alert("Lỗi khi cập nhật tồn kho"); }
    finally { setBusy(false); }
  };

  return (
    <div className="flex items-center gap-1.5">
      <input
        ref={ref} type="number" min="0"
        value={val} onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") onCancel(); }}
        className="w-16 px-2 py-1 border-2 border-gray-800 rounded-lg text-sm text-center font-bold focus:outline-none"
      />
      <button onClick={save} disabled={busy}
        className="w-7 h-7 bg-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-gray-700 disabled:opacity-40 transition-colors">
        {busy ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
      </button>
      <button onClick={onCancel}
        className="w-7 h-7 border border-gray-200 text-gray-500 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors">
        <X size={11} />
      </button>
    </div>
  );
}

/* ─── summary card ─── */
function SummaryCard({ label, value, sub, bg, textColor, icon: Icon }) {
  return (
    <div className={`${bg} rounded-2xl p-5 flex items-center gap-4`}>
      <div className="w-11 h-11 bg-white/60 rounded-xl flex items-center justify-center shrink-0">
        <Icon size={20} className={textColor} />
      </div>
      <div>
        <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
        <p className="text-xs text-gray-600 mt-0.5">{label}</p>
        {sub && <p className="text-[10px] text-gray-500">{sub}</p>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */
export default function AdminInventory() {
  const [all,       setAll]       = useState([]);   // always an array
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState("all");
  const [search,    setSearch]    = useState("");
  const [editingId, setEditingId] = useState(null);
  const [exporting, setExporting] = useState(false);

  const safeArray = (data) => {
    if (Array.isArray(data))         return data;
    if (Array.isArray(data?.content)) return data.content;
    return [];
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await getInventory();
      setAll(safeArray(res.data));
    } catch { setAll([]); }
    finally   { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const onSaved = (id, newStock) => {
    setAll(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
    setEditingId(null);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await exportInventory();
      const url = URL.createObjectURL(res.data);
      Object.assign(document.createElement("a"), { href: url, download: "ton_kho.xlsx" }).click();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
    } catch { alert("Lỗi khi xuất file"); }
    finally   { setExporting(false); }
  };

  /* computed */
  const outCount = all.filter(p => (p.stock ?? 0) === 0).length;
  const lowCount = all.filter(p => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= LOW).length;
  const okCount  = all.length - outCount - lowCount;

  const displayed = all.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name?.toLowerCase().includes(q);
    const matchFilter =
      filter === "out" ? (p.stock ?? 0) === 0 :
      filter === "low" ? (p.stock ?? 0) > 0 && (p.stock ?? 0) <= LOW :
      true;
    return matchSearch && matchFilter;
  });

  /* ── row bg ── */
  const rowBg = (s) => {
    if ((s ?? 0) === 0) return "bg-red-50/60";
    if ((s ?? 0) <= LOW) return "bg-amber-50/60";
    return "";
  };

  return (
    <div className="p-6 xl:p-8 min-h-screen bg-gray-50/50">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-bold tracking-[0.25em] uppercase text-amber-600 mb-2 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
            <Package size={10} /> Quản lý tồn kho
          </span>
          <h1 className="text-[2rem] font-serif font-normal text-gray-900 leading-tight">Warehouse</h1>
          <p className="text-sm text-gray-500 mt-0.5">{all.length} sản phẩm · Cập nhật lúc {new Date().toLocaleTimeString("vi-VN")}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={load}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all">
            <RefreshCw size={14} /> Làm mới
          </button>
          <button onClick={handleExport} disabled={exporting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-gray-900 rounded-xl hover:bg-gray-800 disabled:opacity-40 transition-all shadow-sm hover:shadow-md">
            {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            Xuất Excel
          </button>
        </div>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <SummaryCard label="Tổng sản phẩm" value={all.length} bg="bg-white border border-gray-200 shadow-sm" textColor="text-gray-900" icon={Package} />
        <SummaryCard label="Hết hàng"       value={outCount}  bg="bg-red-50 border border-red-100"    textColor="text-red-700"     icon={X}            sub={outCount > 0 ? "Cần nhập ngay" : ""} />
        <SummaryCard label="Sắp hết"        value={lowCount}  bg="bg-amber-50 border border-amber-100" textColor="text-amber-700"   icon={AlertTriangle} sub={`≤ ${LOW} cái`} />
        <SummaryCard label="Còn hàng"       value={okCount}   bg="bg-emerald-50 border border-emerald-100" textColor="text-emerald-700" icon={CheckCircle} />
      </div>

      {/* ── Filters + Search ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-200 rounded-xl shadow-sm">
          {[
            { id: "all", label: "Tất cả",         count: all.length },
            { id: "low", label: "Sắp hết",         count: lowCount },
            { id: "out", label: "Hết hàng",         count: outCount },
          ].map(opt => (
            <button key={opt.id} onClick={() => setFilter(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filter === opt.id
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}>
              {opt.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                filter === opt.id ? "bg-white/20" : "bg-gray-100"
              }`}>{opt.count}</span>
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-900 shadow-sm transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
            <Loader2 size={28} className="animate-spin text-gray-300" />
            <p className="text-sm">Đang tải tồn kho...</p>
          </div>
        ) : displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
            <Package size={40} className="text-gray-200" />
            <p className="text-sm font-medium">Không tìm thấy sản phẩm</p>
            <button onClick={() => { setSearch(""); setFilter("all"); }}
              className="text-xs text-blue-600 hover:underline">Xóa bộ lọc</button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="grid grid-cols-[auto_1fr_120px_100px_100px_56px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <div>#</div>
              <div>Sản phẩm</div>
              <div className="text-right">Giá</div>
              <div className="text-center">Tồn kho</div>
              <div className="text-center">Trạng thái</div>
              <div />
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-50">
              {displayed.map((p, idx) => {
                const st  = stockStatus(p.stock ?? 0);
                const isEditing = editingId === p.id;
                return (
                  <div
                    key={p.id}
                    className={`grid grid-cols-[auto_1fr_120px_100px_100px_56px] gap-4 px-5 py-3.5 items-center transition-colors hover:bg-gray-50/80 ${rowBg(p.stock)}`}
                  >
                    {/* # */}
                    <div className="text-xs text-gray-400 font-mono w-5 text-center">{idx + 1}</div>

                    {/* Product */}
                    <div className="flex items-center gap-3 min-w-0">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover border border-gray-100 shrink-0 shadow-sm" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                          <Package size={15} className="text-gray-300" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                        <p className="text-[11px] text-gray-400 truncate">{p.category?.name ?? "Không rõ danh mục"}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right text-sm font-semibold text-gray-700">{fmt(p.price)}</div>

                    {/* Stock (editable) */}
                    <div className="flex items-center justify-center">
                      {isEditing ? (
                        <StockEditor
                          productId={p.id} current={p.stock ?? 0}
                          onSave={(n) => onSaved(p.id, n)}
                          onCancel={() => setEditingId(null)}
                        />
                      ) : (
                        <span className={`text-lg font-bold ${
                          (p.stock ?? 0) === 0 ? "text-red-600" :
                          (p.stock ?? 0) <= LOW ? "text-amber-600" : "text-gray-800"
                        }`}>
                          {p.stock ?? 0}
                        </span>
                      )}
                    </div>

                    {/* Status badge */}
                    <div className="flex justify-center">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full border font-bold ${st.cls}`}>
                        {st.label}
                      </span>
                    </div>

                    {/* Edit btn */}
                    <div className="flex justify-center">
                      {!isEditing && (
                        <button onClick={() => setEditingId(p.id)}
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"
                          title="Chỉnh số lượng">
                          <Edit3 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ── Alert bar ── */}
      {!loading && (outCount + lowCount > 0) && (
        <div className="mt-5 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl shadow-sm">
          <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
            <AlertTriangle size={16} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-900">Cảnh báo tồn kho</p>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
              {outCount > 0 && <><strong>{outCount}</strong> sản phẩm đã <strong>hết hàng</strong>. </>}
              {lowCount > 0 && <><strong>{lowCount}</strong> sản phẩm <strong>sắp hết</strong> (≤ {LOW} cái). </>}
              Hãy nhập thêm hàng sớm để tránh mất đơn.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
