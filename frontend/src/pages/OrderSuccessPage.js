import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ShoppingBag, Star, ArrowRight, Home } from 'lucide-react';
import { getLoyaltyBalance } from '../services/api';
import { useAuth } from '../context/AuthContext';

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [balance, setBalance] = useState(null);
  const orderData = JSON.parse(sessionStorage.getItem('lastOrder') || '{}');

  useEffect(() => {
    // Nếu không có data đơn hàng, về trang chủ
    if (!orderData.orderId && !orderData.total) {
      navigate('/');
      return;
    }
    // Load điểm thưởng mới
    if (user) {
      getLoyaltyBalance()
        .then(res => setBalance(res.data.points))
        .catch(() => {});
    }
    // Xóa data sau 5 phút
    const timer = setTimeout(() => sessionStorage.removeItem('lastOrder'), 300_000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen pt-[68px] bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-fadeUp">
        {/* Success card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Green header */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 flex flex-col items-center gap-3 text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle size={36} className="text-white" />
            </div>
            <h1 className="text-2xl font-serif font-medium">Đặt hàng thành công!</h1>
            <p className="text-sm text-white/80 text-center">
              Cảm ơn bạn đã mua sắm tại LuxeShop. Chúng tôi sẽ xử lý đơn hàng sớm nhất.
            </p>
          </div>

          {/* Order details */}
          <div className="p-6 flex flex-col gap-4">
            {orderData.orderId && (
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  <Package size={15} className="text-gray-400" /> Mã đơn hàng
                </span>
                <span className="font-mono font-semibold text-gray-900">#{orderData.orderId}</span>
              </div>
            )}

            {orderData.total && (
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Tổng thanh toán</span>
                <span className="font-bold text-gray-900 text-lg">{formatVND(orderData.total)}</span>
              </div>
            )}

            {orderData.paymentMethod && (
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Phương thức</span>
                <span className="font-semibold text-gray-700">
                  {orderData.paymentMethod === 'cod' ? '💵 Thanh toán khi nhận hàng' :
                   orderData.paymentMethod === 'vnpay' ? '💳 VNPay' : '🏦 Chuyển khoản'}
                </span>
              </div>
            )}

            {orderData.earnedPoints > 0 && (
              <div className="flex items-center justify-between py-3 bg-yellow-50 border border-yellow-100 rounded-xl px-4">
                <span className="text-sm text-yellow-800 flex items-center gap-2">
                  <Star size={14} className="fill-yellow-500 text-yellow-500" />
                  Điểm tích lũy được
                </span>
                <span className="font-bold text-yellow-700">+{orderData.earnedPoints} điểm</span>
              </div>
            )}

            {balance !== null && (
              <div className="text-xs text-center text-gray-500 -mt-1">
                Tổng điểm hiện tại:{' '}
                <Link to="/loyalty" className="font-bold text-yellow-700 hover:underline">
                  {balance.toLocaleString()} điểm
                </Link>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="px-6 pb-6 flex flex-col gap-3">
            <Link
              to="/orders"
              className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-bold tracking-wide text-center flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
            >
              <ShoppingBag size={16} /> Xem lịch sử đơn hàng
            </Link>
            <Link
              to="/"
              className="w-full py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold text-center flex items-center justify-center gap-2 hover:border-gray-900 hover:bg-gray-50 transition-all"
            >
              <Home size={16} /> Tiếp tục mua sắm <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Estimated delivery */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Đơn hàng sẽ được giao trong <strong className="text-gray-600">1–5 ngày làm việc</strong> tùy khu vực.
        </p>
      </div>
    </div>
  );
}
