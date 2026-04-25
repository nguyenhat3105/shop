import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function VNPayReturnPage() {
  const location = useLocation();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Send the query string to backend to verify
    const verifyPayment = async () => {
      try {
        const queryParams = location.search;
        await api.get(`/payment/vnpay-return${queryParams}`);
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data || 'Giao dịch không thành công hoặc chữ ký không hợp lệ.');
      }
    };

    if (location.search) {
      verifyPayment();
    } else {
      setStatus('error');
      setMessage('Không tìm thấy thông tin thanh toán.');
    }
  }, [location]);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '400px' }}>
        
        {status === 'loading' && (
          <>
            <Loader2 size={48} className="spin" style={{ color: 'var(--gold)', margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Đang xác thực thanh toán...</h2>
            <p style={{ color: '#666' }}>Vui lòng không đóng trình duyệt.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle size={48} style={{ color: 'var(--success)', margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: 'var(--success)' }}>Thanh toán Thành công!</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được ghi nhận và thanh toán thành công qua VNPay.</p>
            <Link to="/order-history" style={{ display: 'inline-block', background: 'var(--gold)', color: '#fff', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontWeight: 500 }}>
              Xem lịch sử đơn hàng
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle size={48} style={{ color: '#ff4d4f', margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#ff4d4f' }}>Thanh toán Thất bại!</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>{message}</p>
            <Link to="/" style={{ display: 'inline-block', background: '#111', color: '#fff', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontWeight: 500 }}>
              Quay về Trang chủ
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
