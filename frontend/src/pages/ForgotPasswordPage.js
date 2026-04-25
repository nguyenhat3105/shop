import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Mail, CheckCircle } from 'lucide-react';
import { forgotPassword } from '../services/api';
import './AuthPage.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Vui lòng nhập địa chỉ email.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container" style={{maxWidth: '400px'}}>
        <div className="auth-header">
          <h1 className="auth-title serif">Quên Mật Khẩu</h1>
          {!success && <p className="auth-subtitle">Nhập email của bạn để nhận liên kết khôi phục mật khẩu.</p>}
        </div>

        {success ? (
          <div className="auth-success-box" style={{textAlign: 'center'}}>
            <CheckCircle size={48} color="#15803d" style={{marginBottom: '16px'}} />
            <h3 style={{fontSize: '18px', marginBottom: '8px', color: '#111'}}>Đã Gửi Email!</h3>
            <p style={{color: '#666', lineHeight: 1.6, marginBottom: '24px'}}>
              Chúng tôi đã gửi một liên kết khôi phục mật khẩu đến email <strong>{email}</strong>. 
              Vui lòng kiểm tra hộp thư của bạn (và cả thư mục Spam).
            </p>
            <Link to="/login" className="af-submit" style={{textDecoration: 'none', textAlign: 'center'}}>
              Trở về Đăng nhập
            </Link>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="af-server-err">{error}</div>}

            <div className="af-group">
              <label>Địa chỉ Email</label>
              <div className="af-input-wrap">
                <Mail size={16} className="af-icon" />
                <input 
                  type="email" 
                  placeholder="Nhập email đã đăng ký..." 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="af-submit" disabled={loading}>
              {loading 
                ? <><Loader2 size={16} className="spin" /> Đang gửi yêu cầu...</> 
                : 'Gửi Link Khôi Phục'}
            </button>

            <div style={{textAlign: 'center', marginTop: '20px'}}>
              <Link to="/login" className="auth-link">Quay lại Đăng nhập</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
