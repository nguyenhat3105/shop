import React, { useState, useEffect } from 'react';
import {
  Loader2, Eye, X, MapPin, Phone, Mail, User, Clock,
  CreditCard, ShoppingBag, Search, RefreshCw, ChevronDown,
  Package, CheckCircle, Truck, Ban, Download, TrendingUp,
  Filter, ArrowUpRight,
} from 'lucide-react';
import { getAllOrders, updateOrderStatus, exportOrders } from '../../services/api';
import toast from 'react-hot-toast';

/* ─── helpers ─── */
const fmt = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n ?? 0);

const formatDateTime = (dt) => {
  const d = new Date(dt);
  return {
    date: d.toLocaleDateString('vi-VN'),
    time: d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    full: d.toLocaleString('vi-VN'),
  };
};

const STATUS_CONFIG = {
  PENDING:   { label: 'Chờ xử lý',  cls: 'bg-amber-100 text-amber-800 border-amber-200',      dot: 'bg-amber-400',    icon: Clock },
  CONFIRMED: { label: 'Đã xác nhận',cls: 'bg-blue-100 text-blue-800 border-blue-200',          dot: 'bg-blue-400',     icon: CheckCircle },
  SHIPPING:  { label: 'Đang giao',  cls: 'bg-violet-100 text-violet-800 border-violet-200',    dot: 'bg-violet-400',   icon: Truck },
  SHIPPED:   { label: 'Đang giao',  cls: 'bg-violet-100 text-violet-800 border-violet-200',    dot: 'bg-violet-400',   icon: Truck },
  DELIVERED: { label: 'Đã giao',    cls: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-400',  icon: CheckCircle },
  CANCELLED: { label: 'Đã huỷ',    cls: 'bg-red-100 text-red-800 border-red-200',             dot: 'bg-red-400',      icon: Ban },
};

const STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const STATUS_LABELS = {
  PENDING: 'Chờ xử lý', CONFIRMED: 'Đã xác nhận',
  SHIPPED: 'Đang giao', DELIVERED: 'Đã giao', CANCELLED: 'Đã huỷ',
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border font-bold ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

/* ─── Skeleton row ─── */
function SkeletonRow() {
  return (
    <div className="grid grid-cols-[60px_1fr_120px_130px_140px_100px_48px] gap-3 px-5 py-4 items-center border-b border-gray-50 animate-pulse">
      <div className="h-4 w-10 bg-gray-100 rounded" />
      <div className="space-y-2">
        <div className="h-3.5 w-36 bg-gray-100 rounded" />
        <div className="h-3 w-24 bg-gray-50 rounded" />
      </div>
      <div className="h-4 w-20 bg-gray-100 rounded ml-auto" />
      <div className="space-y-1 flex flex-col items-center">
        <div className="h-3 w-20 bg-gray-100 rounded" />
        <div className="h-3 w-14 bg-gray-50 rounded" />
      </div>
      <div className="h-6 w-24 bg-gray-100 rounded-full mx-auto" />
      <div className="h-7 w-20 bg-gray-100 rounded-lg mx-auto" />
      <div className="h-7 w-7 bg-gray-100 rounded-xl mx-auto" />
    </div>
  );
}

/* ─── Stat Card ─── */
function StatCard({ label, value, icon: Icon, gradient, textColor, sub }) {
  return (
    <div className={`${gradient} rounded-2xl p-5 relative overflow-hidden group cursor-default`}>
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
          <p className="text-xs text-gray-600 mt-1 font-medium">{label}</p>
          {sub && <p className="text-[10px] text-gray-500 mt-0.5">{sub}</p>}
        </div>
        <div className="w-10 h-10 bg-white/60 rounded-xl flex items-center justify-center shrink-0">
          <Icon size={18} className={textColor} />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════ */
export default function AdminOrders() {
  const [orders,        setOrders]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus,  setFilterStatus]  = useState('all');
  const [search,        setSearch]        = useState('');
  const [updatingId,    setUpdatingId]    = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await getAllOrders(0, 200);
      const arr = Array.isArray(data) ? data : (data?.content ?? []);
      setOrders(arr);
    } catch {
      toast.error('Lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Đã cập nhật trạng thái đơn #${orderId}`);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId)
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    } catch {
      toast.error('Lỗi khi cập nhật trạng thái');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExport = async () => {
    try {
      const from = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
      const to   = new Date().toISOString().split('T')[0];
      const res  = await exportOrders(from, to);
      const url  = URL.createObjectURL(res.data);
      Object.assign(document.createElement('a'), { href: url, download: `don_hang_${from}.xlsx` }).click();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
      toast.success('Đã xuất file Excel');
    } catch { toast.error('Lỗi khi xuất Excel'); }
  };

  /* computed */
  const counts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  const displayed = orders.filter(o => {
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch = !q || o.customerName?.toLowerCase().includes(q)
      || o.customerEmail?.toLowerCase().includes(q)
      || String(o.id).includes(q);
    return matchStatus && matchSearch;
  });

  const totalRevenue = orders.reduce((s, o) => s + (Number(o.totalAmount) || 0), 0);

  return (
    <div className="p-6 xl:p-8 min-h-screen bg-gray-50/60">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-bold tracking-[0.25em] uppercase text-amber-600 mb-2 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
            <ShoppingBag size={10} /> Quản lý đơn hàng
          </span>
          <h1 className="text-[2rem] font-serif font-normal text-gray-900 leading-tight">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
            <span>{orders.length} đơn hàng</span>
            <span className="text-gray-300">·</span>
            <span className="font-semibold text-gray-700">{fmt(totalRevenue)}</span>
            <ArrowUpRight size={13} className="text-emerald-500" />
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchOrders}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl hover:bg-white hover:border-gray-400 hover:shadow-sm transition-all">
            <RefreshCw size={14} /> Làm mới
          </button>
          <button onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all shadow-sm hover:shadow-md">
            <Download size={14} /> Xuất Excel
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <StatCard label="Tổng đơn"   value={orders.length}         gradient="bg-white border border-gray-200 shadow-sm" textColor="text-gray-900" icon={ShoppingBag} />
        <StatCard label="Chờ xử lý"  value={counts.PENDING ?? 0}   gradient="bg-amber-50 border border-amber-100"   textColor="text-amber-700"   icon={Clock} />
        <StatCard label="Đang giao"  value={counts.SHIPPED ?? 0}   gradient="bg-violet-50 border border-violet-100" textColor="text-violet-700" icon={Truck} />
        <StatCard label="Đã giao"    value={counts.DELIVERED ?? 0} gradient="bg-emerald-50 border border-emerald-100" textColor="text-emerald-700" icon={CheckCircle} />
        <StatCard label="Đã huỷ"    value={counts.CANCELLED ?? 0} gradient="bg-red-50 border border-red-100"       textColor="text-red-700"   icon={Ban} />
      </div>

      {/* ── Filter + Search ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-xl shadow-sm flex-wrap">
          {[{ id: 'all', label: 'Tất cả', count: orders.length }, ...STATUSES.map(s => ({ id: s, label: STATUS_LABELS[s], count: counts[s] ?? 0 }))].map(opt => (
            <button key={opt.id} onClick={() => setFilterStatus(opt.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filterStatus === opt.id ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}>
              {opt.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${filterStatus === opt.id ? 'bg-white/20' : 'bg-gray-100'}`}>{opt.count}</span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm tên, email, mã đơn..."
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-900 shadow-sm transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
              <X size={13} />
            </button>
          )}
        </div>
        {(filterStatus !== 'all' || search) && (
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Filter size={11} /> {displayed.length} kết quả
          </span>
        )}
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Sticky header */}
        <div className="grid grid-cols-[60px_1fr_130px_130px_140px_110px_48px] gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400 sticky top-0 z-10">
          <div>Mã</div>
          <div>Khách hàng</div>
          <div className="text-right">Tổng tiền</div>
          <div className="text-center">Ngày đặt</div>
          <div className="text-center">Trạng thái</div>
          <div className="text-center">Cập nhật</div>
          <div />
        </div>

        {loading ? (
          <div>
            {[...Array(6)].map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
            <ShoppingBag size={40} className="text-gray-200" />
            <p className="text-sm font-medium">Không có đơn hàng nào</p>
            {(filterStatus !== 'all' || search) && (
              <button onClick={() => { setFilterStatus('all'); setSearch(''); }}
                className="text-xs text-blue-600 hover:underline">Xóa bộ lọc</button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {displayed.map(order => {
              const dt = formatDateTime(order.createdAt);
              return (
                <div key={order.id}
                  className="grid grid-cols-[60px_1fr_130px_130px_140px_110px_48px] gap-3 px-5 py-3.5 items-center hover:bg-gray-50/70 transition-colors group">

                  <div className="text-sm font-bold text-gray-900">#{order.id}</div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{order.customerName}</p>
                    <p className="text-[11px] text-gray-400 truncate">{order.customerEmail}</p>
                  </div>

                  <div className="text-right text-sm font-bold text-gray-900">{fmt(order.totalAmount)}</div>

                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-700">{dt.date}</p>
                    <p className="text-[11px] text-gray-400">{dt.time}</p>
                  </div>

                  <div className="flex justify-center">
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="flex justify-center">
                    {updatingId === order.id ? (
                      <Loader2 size={16} className="animate-spin text-gray-400" />
                    ) : (
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={e => handleStatusChange(order.id, e.target.value)}
                          className="appearance-none text-[11px] font-bold py-1.5 pl-2.5 pr-6 border border-gray-200 rounded-lg bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:border-gray-900 cursor-pointer transition-colors"
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                        </select>
                        <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <button onClick={() => setSelectedOrder(order)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all opacity-60 group-hover:opacity-100">
                      <Eye size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer count */}
        {!loading && displayed.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/50 text-[11px] text-gray-400 flex items-center justify-between">
            <span>Hiển thị {displayed.length} / {orders.length} đơn hàng</span>
            <span className="font-semibold text-gray-700">{fmt(displayed.reduce((s, o) => s + (Number(o.totalAmount) || 0), 0))}</span>
          </div>
        )}
      </div>

      {/* ══ Detail Modal ══ */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
            style={{ animation: 'scaleUp 0.2s ease' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-amber-600 mb-1">Chi tiết đơn hàng</p>
                <h2 className="text-xl font-serif text-gray-900">Đơn #{selectedOrder.id}</h2>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={selectedOrder.status} />
                <button onClick={() => setSelectedOrder(null)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[72vh]">
              {/* Info grid */}
              <div className="grid grid-cols-2 gap-5 px-7 py-5 border-b border-gray-50">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Khách hàng</p>
                  <div className="space-y-2.5">
                    {[
                      { icon: User,   text: selectedOrder.customerName },
                      { icon: Mail,   text: selectedOrder.customerEmail },
                      { icon: Phone,  text: selectedOrder.phone || 'Chưa cung cấp' },
                      { icon: MapPin, text: selectedOrder.address, multiline: true },
                    ].map(({ icon: Icon, text, multiline }) => (
                      <div key={text} className={`flex gap-2.5 ${multiline ? 'items-start' : 'items-center'}`}>
                        <Icon size={14} className="text-gray-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Đơn hàng</p>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <Clock size={14} className="text-gray-400 shrink-0" />
                      <p className="text-sm text-gray-700">{formatDateTime(selectedOrder.createdAt).full}</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CreditCard size={14} className="text-gray-400 shrink-0" />
                      <p className="text-sm text-gray-700">
                        {selectedOrder.paymentMethod === 'VNPAY' ? 'VNPay' : 'COD (Thanh toán khi nhận)'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Cập nhật trạng thái</p>
                    <select
                      value={selectedOrder.status}
                      onChange={e => handleStatusChange(selectedOrder.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-gray-900 transition-colors"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="px-7 py-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Sản phẩm đã đặt</p>
                <div className="space-y-2.5">
                  {(selectedOrder.items ?? []).map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <img
                        src={item.productImageUrl || `https://picsum.photos/seed/${item.id}/48/48`}
                        alt={item.productName}
                        className="w-11 h-11 rounded-xl object-cover border border-gray-200 shrink-0"
                        onError={e => { e.target.src = `https://picsum.photos/seed/${item.id}/48/48`; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{item.productName}</p>
                        {(item.size || item.color) && (
                          <p className="text-[11px] text-gray-400">
                            {[item.size && `Size: ${item.size}`, item.color && `Màu: ${item.color}`].filter(Boolean).join(' · ')}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-gray-400">x{item.quantity}</p>
                        <p className="text-sm font-bold text-gray-900">{fmt(item.unitPrice * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-500">Tổng giá trị đơn hàng</p>
                  <p className="text-xl font-bold text-gray-900">{fmt(selectedOrder.totalAmount)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
