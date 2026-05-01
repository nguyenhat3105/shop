import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getOrdersByEmail } from '../services/api';

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchOrders(0, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchOrders = async (pageNum, reset = false) => {
    try {
      setLoading(true);
      const { data } = await getOrdersByEmail(user.email, pageNum, 5); // size = 5
      
      if (reset) {
        setOrders(data.content);
      } else {
        setOrders(prev => [...prev, ...data.content]);
      }
      
      setHasMore(!data.last);
      setPage(pageNum);
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    fetchOrders(page + 1);
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'PENDING': return 'Đang xử lý';
      case 'SHIPPED': return 'Đang giao';
      case 'DELIVERED': return 'Đã giao';
      case 'CANCELLED': return 'Đã huỷ';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'bg-[#fff3cd] text-[#856404]';
      case 'SHIPPED': return 'bg-[#cce5ff] text-[#004085]';
      case 'DELIVERED': return 'bg-[#d4edda] text-[#155724]';
      case 'CANCELLED': return 'bg-[#f8d7da] text-[#721c24]';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading && orders.length === 0) {
    return (
      <div className="py-[60px] bg-[#f9f9f9] min-h-[calc(100vh-80px)] flex justify-center items-center">
        <Loader2 className="animate-spin text-[#b8955a]" size={32} />
      </div>
    );
  }

  return (
    <div className="py-[60px] bg-[#f9f9f9] min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="font-serif text-[32px] font-medium text-[#111] mb-2">Lịch Sử Mua Hàng</h1>
          <p className="text-[15px] text-[#666]">Theo dõi và quản lý các đơn đặt hàng của bạn</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center p-[60px_20px] bg-white rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col items-center">
            <Package size={48} color="#ccc" />
            <h3 className="text-[20px] font-medium text-[#111] mt-4 mb-2">Bạn chưa có đơn hàng nào</h3>
            <p className="text-[#666] mb-6">Hãy khám phá các bộ sưu tập của chúng tôi và tìm cho mình những món đồ ưng ý nhé.</p>
            <Link to="/" className="inline-flex items-center justify-center px-6 py-3 bg-[#1a1a1a] text-white rounded font-medium transition-all hover:bg-black hover:-translate-y-0.5">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-[0_2px_15px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="p-[20px_24px] bg-[#fafafa] border-b border-[#eee] flex justify-between items-center flex-wrap gap-4">
                  <div className="flex gap-8 max-sm:gap-4 max-sm:flex-col">
                    <div>
                      <span className="block text-[12px] text-[#888] uppercase tracking-[0.5px] mb-1">Mã đơn hàng</span>
                      <strong className="text-[15px] text-[#111] font-medium">#{order.id}</strong>
                    </div>
                    <div>
                      <span className="block text-[12px] text-[#888] uppercase tracking-[0.5px] mb-1">Ngày đặt</span>
                      <strong className="text-[15px] text-[#111] font-medium">{formatDate(order.createdAt)}</strong>
                    </div>
                    <div>
                      <span className="block text-[12px] text-[#888] uppercase tracking-[0.5px] mb-1">Tổng tiền</span>
                      <strong className="text-[15px] text-[#111] font-medium">{formatPrice(order.totalAmount)}</strong>
                    </div>
                  </div>
                  <div className={`px-[14px] py-[6px] rounded-full text-[13px] font-semibold tracking-[0.5px] ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </div>
                </div>

                <div className="p-[24px]">
                  {order.items.map(item => (
                    <div key={item.id} className="flex gap-4 pb-4 mb-4 border-b border-[#f0f0f0] last:border-b-0 last:mb-0 last:pb-0 max-sm:flex-col max-sm:items-center max-sm:text-center">
                      <img src={item.productImageUrl || 'https://via.placeholder.com/80'} alt={item.productName} className="w-[80px] h-[80px] object-cover rounded-md bg-[#f5f5f5] shrink-0" />
                      <div className="flex-1 flex flex-col justify-center">
                        <Link to={`/products/${item.productId}`} className="font-medium text-[15px] text-[#111] mb-1 hover:underline">
                          {item.productName}
                        </Link>
                        <div className="text-[14px] text-[#666]">
                          Số lượng: {item.quantity}
                          {(item.size || item.color) && (
                            <span className="ml-2.5 text-[#666]">
                              ({item.size && `Size: ${item.size}`}{item.size && item.color && ', '}{item.color && `Màu: ${item.color}`})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="font-semibold text-[#111] flex items-center shrink-0">
                        {formatPrice(item.unitPrice)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button 
                  className="px-6 py-2.5 border border-[#ddd] bg-white rounded-full cursor-pointer font-medium transition-all hover:border-[#111] hover:bg-[#fafafa] disabled:opacity-50 disabled:cursor-not-allowed" 
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? 'Đang tải...' : 'Xem thêm đơn hàng cũ'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
