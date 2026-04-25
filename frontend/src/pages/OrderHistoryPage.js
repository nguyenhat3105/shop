import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getOrdersByEmail } from '../services/api';
import './OrderHistoryPage.css';

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
      <div className="order-history-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Loader2 className="spin" size={32} color="#b8955a" />
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <div className="container">
        <div className="oh-header">
          <h1 className="oh-title serif">Lịch Sử Mua Hàng</h1>
          <p className="oh-subtitle">Theo dõi và quản lý các đơn đặt hàng của bạn</p>
        </div>

        {orders.length === 0 ? (
          <div className="oh-empty">
            <Package size={48} color="#ccc" />
            <h3>Bạn chưa có đơn hàng nào</h3>
            <p>Hãy khám phá các bộ sưu tập của chúng tôi và tìm cho mình những món đồ ưng ý nhé.</p>
            <Link to="/" className="oh-btn">Tiếp tục mua sắm</Link>
          </div>
        ) : (
          <div className="oh-list">
            {orders.map(order => (
              <div key={order.id} className="oh-card">
                <div className="oh-card-header">
                  <div className="oh-card-info">
                    <div className="oh-info-block">
                      <span>Mã đơn hàng</span>
                      <strong>#{order.id}</strong>
                    </div>
                    <div className="oh-info-block">
                      <span>Ngày đặt</span>
                      <strong>{formatDate(order.createdAt)}</strong>
                    </div>
                    <div className="oh-info-block">
                      <span>Tổng tiền</span>
                      <strong>{formatPrice(order.totalAmount)}</strong>
                    </div>
                  </div>
                  <div className={`oh-status ${order.status.toLowerCase()}`}>
                    {getStatusText(order.status)}
                  </div>
                </div>

                <div className="oh-card-body">
                  {order.items.map(item => (
                    <div key={item.id} className="oh-item">
                      <img src={item.productImageUrl || 'https://via.placeholder.com/80'} alt={item.productName} className="oh-item-img" />
                      <div className="oh-item-details">
                        <Link to={`/products/${item.productId}`} className="oh-item-name">
                          {item.productName}
                        </Link>
                        <div className="oh-item-meta">
                          Số lượng: {item.quantity}
                        </div>
                      </div>
                      <div className="oh-item-price">
                        {formatPrice(item.unitPrice)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {hasMore && (
              <div className="oh-footer">
                <button 
                  className="oh-load-more" 
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
