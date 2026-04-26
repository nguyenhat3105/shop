import React, { useState, useEffect } from 'react';
import { Loader2, Eye, X, MapPin, Phone, Mail, User, Clock, CreditCard } from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders(0);
  }, []);

  const fetchOrders = async (pageNum) => {
    try {
      setLoading(true);
      const { data } = await getAllOrders(pageNum, 50);
      setOrders(data.content);
    } catch (err) {
      toast.error('Lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Đã cập nhật trạng thái đơn #${orderId}`);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading && orders.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <Loader2 className="spin" size={40} color="var(--accent)" />
      </div>
    );
  }

  return (
    <div className="admin-orders-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Quản lý Đơn hàng</h1>
        <p className="admin-page-subtitle">Xem và cập nhật trạng thái các đơn hàng trong hệ thống</p>
      </div>

      <div className="admin-table-container" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã Đơn</th>
              <th>Khách Hàng</th>
              <th>Tổng Tiền</th>
              <th>Ngày Đặt</th>
              <th>Trạng Thái</th>
              <th style={{ textAlign: 'right' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td><strong>#{order.id}</strong></td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600 }}>{order.customerName}</span>
                    <span style={{ fontSize: '12px', color: '#888' }}>{order.customerEmail}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 600, color: 'var(--accent)' }}>{formatPrice(order.totalAmount)}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                    <span style={{ fontSize: '11px', color: '#aaa' }}>{new Date(order.createdAt).toLocaleTimeString('vi-VN')}</span>
                  </div>
                </td>
                <td>
                  <select 
                    value={order.status} 
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`admin-status-select ${order.status.toLowerCase()}`}
                    style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid #ddd', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    <option value="PENDING">Chờ xử lý</option>
                    <option value="SHIPPED">Đang giao</option>
                    <option value="DELIVERED">Đã giao</option>
                    <option value="CANCELLED">Huỷ bỏ</option>
                  </select>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    className="admin-action-btn"
                    onClick={() => setSelectedOrder(order)}
                    style={{ background: '#f5f5f5', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '60px', color: '#999' }}>Chưa có đơn hàng nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="admin-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal-content" style={{ background: '#fff', width: '100%', maxWidth: '800px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.2)', animation: 'scaleUp 0.3s ease' }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header" style={{ padding: '20px 25px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'var(--font-serif)' }}>Chi Tiết Đơn Hàng #{selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}><X size={24} /></button>
            </div>
            
            <div className="admin-modal-body" style={{ padding: '25px', maxHeight: '70vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                <div className="order-info-section">
                  <h4 style={{ textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.1em', color: '#888', marginBottom: '15px' }}>Thông tin khách hàng</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                      <User size={16} color="#666" /> <strong>{selectedOrder.customerName}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                      <Mail size={16} color="#666" /> {selectedOrder.customerEmail}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                      <Phone size={16} color="#666" /> {selectedOrder.phone || 'Chưa cung cấp'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px' }}>
                      <MapPin size={16} color="#666" style={{ marginTop: '3px' }} /> {selectedOrder.address}
                    </div>
                  </div>
                </div>
                <div className="order-status-section">
                  <h4 style={{ textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.1em', color: '#888', marginBottom: '15px' }}>Trạng thái & Thanh toán</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                      <Clock size={16} color="#666" /> {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                      <CreditCard size={16} color="#666" /> {selectedOrder.paymentMethod === 'VNPAY' ? 'Thanh toán qua VNPay' : 'Thanh toán khi nhận hàng (COD)'}
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <select 
                        value={selectedOrder.status} 
                        onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                        className={`admin-status-select ${selectedOrder.status.toLowerCase()}`}
                        style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #ddd', fontSize: '13px', fontWeight: 700, width: '100%' }}
                      >
                        <option value="PENDING">Chờ xử lý</option>
                        <option value="SHIPPED">Đang giao</option>
                        <option value="DELIVERED">Đã giao</option>
                        <option value="CANCELLED">Huỷ bỏ</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-items-section">
                <h4 style={{ textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.1em', color: '#888', marginBottom: '15px' }}>Sản phẩm đã đặt</h4>
                <div style={{ border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f9f9f9', borderBottom: '1px solid #eee' }}>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '12px 15px', fontSize: '12px' }}>Sản phẩm</th>
                        <th style={{ textAlign: 'center', padding: '12px 15px', fontSize: '12px' }}>SL</th>
                        <th style={{ textAlign: 'right', padding: '12px 15px', fontSize: '12px' }}>Đơn giá</th>
                        <th style={{ textAlign: 'right', padding: '12px 15px', fontSize: '12px' }}>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map(item => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '12px 15px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <img src={item.productImageUrl || 'https://via.placeholder.com/40'} alt={item.productName} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '14px', fontWeight: 600 }}>{item.productName}</span>
                                {(item.size || item.color) && (
                                  <span style={{ fontSize: '11px', color: '#888' }}>
                                    {item.size && `Size: ${item.size}`}{item.size && item.color && ' | '}{item.color && `Màu: ${item.color}`}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td style={{ textAlign: 'center', padding: '12px 15px', fontSize: '14px' }}>{item.quantity}</td>
                          <td style={{ textAlign: 'right', padding: '12px 15px', fontSize: '14px' }}>{formatPrice(item.unitPrice)}</td>
                          <td style={{ textAlign: 'right', padding: '12px 15px', fontSize: '14px', fontWeight: 600 }}>{formatPrice(item.unitPrice * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot style={{ background: '#fdfbf7' }}>
                      <tr>
                        <td colSpan="3" style={{ textAlign: 'right', padding: '15px', fontWeight: 600 }}>Tổng giá trị đơn hàng:</td>
                        <td style={{ textAlign: 'right', padding: '15px', fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent)' }}>{formatPrice(selectedOrder.totalAmount)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .admin-action-btn:hover {
          background: #eee !important;
          color: var(--accent);
        }
        .admin-status-select.pending { background: #fff7e6; border-color: #ffd591; color: #fa8c16; }
        .admin-status-select.shipped { background: #e6f7ff; border-color: #91d5ff; color: #1890ff; }
        .admin-status-select.delivered { background: #f6ffed; border-color: #b7eb8f; color: #52c41a; }
        .admin-status-select.cancelled { background: #fff1f0; border-color: #ffa39e; color: #f5222d; }
      `}</style>
    </div>
  );
}
