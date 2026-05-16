import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Loader2, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getOrdersByEmail } from '../services/api';

const STATUS_MAP = {
  PENDING:   { label: 'Đang xử lý',  cls: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  SHIPPED:   { label: 'Đang giao',   cls: 'bg-blue-100 text-blue-800 border-blue-200' },
  DELIVERED: { label: 'Đã giao',     cls: 'bg-green-100 text-green-800 border-green-200' },
  CANCELLED: { label: 'Đã huỷ',     cls: 'bg-red-100 text-red-800 border-red-200' },
};

const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
const formatDate  = (d) => new Date(d).toLocaleDateString('vi-VN', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });

function OrderSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse">
      <div className="p-5 flex flex-wrap gap-4 items-center justify-between border-b border-gray-100">
        <div className="flex gap-6">
          {[80, 100, 90].map((w, i) => (
            <div key={i}>
              <div className={`h-3 w-${w === 80 ? '20' : w === 100 ? '24' : '20'} bg-gray-200 rounded mb-1.5`} />
              <div className="h-4 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
        <div className="h-7 w-24 bg-gray-200 rounded-full" />
      </div>
      <div className="p-5 space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-3/4 bg-gray-200 rounded" />
              <div className="h-3 w-1/3 bg-gray-200 rounded" />
            </div>
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (user?.email) fetchOrders(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchOrders = async (pageNum, reset = false) => {
    try {
      if (pageNum === 0) setLoading(true);
      else setLoadingMore(true);
      const { data } = await getOrdersByEmail(user.email, pageNum, 5);
      if (reset) setOrders(data.content);
      else setOrders(prev => [...prev, ...data.content]);
      setHasMore(!data.last);
      setPage(pageNum);
    } catch (err) {
      console.error('Lỗi khi tải đơn hàng', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="mb-8">
            <div className="h-8 w-56 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-72 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex flex-col gap-5">
            {[1, 2, 3].map(i => <OrderSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8 animate-fadeUp">
          <h1 className="text-3xl font-normal text-gray-900 font-serif mb-1">Lịch Sử Mua Hàng</h1>
          <p className="text-sm text-gray-500">Theo dõi và quản lý các đơn đặt hàng của bạn</p>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center gap-5 py-24 text-gray-400 animate-fadeUp">
            <Package size={52} className="text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-700">Bạn chưa có đơn hàng nào</h3>
            <p className="text-sm text-gray-500 text-center max-w-xs">Hãy khám phá các bộ sưu tập của chúng tôi và tìm cho mình những món đồ ưng ý nhé.</p>
            <Link to="/" className="px-6 py-3 bg-gray-900 text-white rounded-lg text-sm font-bold tracking-wider uppercase transition-all hover:bg-gray-800 hover:shadow-lg">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {orders.map(order => {
              const statusInfo = STATUS_MAP[order.status] || { label: order.status, cls: 'bg-gray-100 text-gray-700 border-gray-200' };
              return (
                <div key={order.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow animate-fadeUp">
                  {/* Card header */}
                  <div className="px-5 py-4 flex flex-wrap gap-4 items-center justify-between border-b border-gray-100 bg-gray-50/50">
                    <div className="flex flex-wrap gap-6">
                      <div>
                        <span className="text-[0.68rem] font-bold tracking-widest uppercase text-gray-400">Mã đơn hàng</span>
                        <p className="font-semibold text-gray-900 text-sm">#{order.id}</p>
                      </div>
                      <div>
                        <span className="text-[0.68rem] font-bold tracking-widest uppercase text-gray-400">Ngày đặt</span>
                        <p className="font-semibold text-gray-900 text-sm">{formatDate(order.createdAt)}</p>
                      </div>
                      <div>
                        <span className="text-[0.68rem] font-bold tracking-widest uppercase text-gray-400">Tổng tiền</span>
                        <p className="font-bold text-gray-900 text-sm">{formatPrice(order.totalAmount)}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.cls}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="p-5 space-y-4">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center gap-4">
                        <img
                          src={item.productImageUrl || 'https://via.placeholder.com/80'}
                          alt={item.productName}
                          className="w-16 h-16 rounded-xl object-cover border border-gray-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <Link to={`/products/${item.productId}`} className="text-sm font-semibold text-gray-900 hover:text-yellow-700 transition-colors line-clamp-2">
                            {item.productName}
                          </Link>
                          <div className="text-xs text-gray-500 mt-0.5 flex flex-wrap gap-2">
                            <span>Số lượng: {item.quantity}</span>
                            {(item.size || item.color) && (
                              <span>
                                ({item.size && `Size: ${item.size}`}{item.size && item.color && ', '}{item.color && `Màu: ${item.color}`})
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-sm font-bold text-gray-900 shrink-0">{formatPrice(item.unitPrice)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {hasMore && (
              <div className="text-center pt-2">
                <button
                  onClick={() => fetchOrders(page + 1)}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 px-7 py-3 border border-gray-200 bg-white text-gray-700 rounded-xl text-sm font-semibold transition-all hover:border-gray-900 hover:bg-gray-50 disabled:opacity-50"
                >
                  {loadingMore ? <><Loader2 size={16} className="animate-spin" /> Đang tải...</> : <><ChevronDown size={16} /> Xem thêm đơn hàng cũ</>}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
