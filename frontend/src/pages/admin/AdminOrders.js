import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders(0);
  }, []);

  const fetchOrders = async (pageNum) => {
    try {
      setLoading(true);
      const { data } = await getAllOrders(pageNum, 50); // Get up to 50 for admin view
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
      // Cập nhật local state
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading && orders.length === 0) {
    return <div style={{display:'flex', justifyContent:'center'}}><Loader2 className="spin" /></div>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Quản lý Đơn hàng</h1>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã Đơn</th>
              <th>Khách Hàng</th>
              <th>Email</th>
              <th>Tổng Tiền</th>
              <th>Ngày Đặt</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td><strong>#{order.id}</strong></td>
                <td>{order.customerName}</td>
                <td>{order.customerEmail}</td>
                <td>{formatPrice(order.totalAmount)}</td>
                <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                <td>
                  <select 
                    value={order.status} 
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`admin-status-select ${order.status.toLowerCase()}`}
                  >
                    <option value="PENDING">Chờ xử lý</option>
                    <option value="SHIPPED">Đang giao</option>
                    <option value="DELIVERED">Đã giao</option>
                    <option value="CANCELLED">Huỷ bỏ</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" style={{textAlign: 'center', padding: '40px'}}>Chưa có đơn hàng nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
