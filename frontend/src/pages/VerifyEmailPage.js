import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Gem } from 'lucide-react';
import { verifyEmail } from '../services/api';
import './AuthPage.css';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('loading'); // loading | success | error | notoken
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) { setStatus('notoken'); return; }

    verifyEmail(token)
      .then(res => {
        setMessage(res.data?.message || 'Xác thực thành công!');
        setStatus('success');
      })
      .catch(err => {
        const msg = err.response?.data?.message
          || err.response?.data?.error
          || 'Link xác thực không hợp lệ hoặc đã hết hạn.';
        setMessage(msg);
        setStatus('error');
      });
  }, [token]);

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-left__inner">
          <div className="auth-left__logo"><Gem size={22} /><span>LUXE<span className="auth-left__logo-thin">SHOP</span></span></div>
          <h2 className="auth-left__headline serif">Xác Thực<br />Email</h2>
          <p className="auth-left__sub">Chỉ một bước nữa để hoàn tất đăng ký tài khoản của bạn.</p>
        </div>
        <div className="auth-left__img-overlay" />
        <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=85" alt="" className="auth-left__bg" />
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="verify-box">

            {status === 'loading' && (
              <div className="verify-state">
                <Loader2 size={48} className="spin verify-icon verify-icon--loading" />
                <h2 className="serif">Đang xác thực...</h2>
                <p>Vui lòng chờ trong giây lát.</p>
              </div>
            )}

            {status === 'success' && (
              <div className="verify-state">
                <CheckCircle size={56} className="verify-icon verify-icon--success" />
                <h2 className="serif">Xác Thực Thành Công!</h2>
                <p>{message}</p>
                <Link to="/login" className="af-submit" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8, marginTop:'1.5rem' }}>
                  Đăng Nhập Ngay →
                </Link>
              </div>
            )}

            {status === 'error' && (
              <div className="verify-state">
                <XCircle size={56} className="verify-icon verify-icon--error" />
                <h2 className="serif">Xác Thực Thất Bại</h2>
                <p>{message}</p>
                <div className="verify-actions">
                  <Link to="/register" className="af-submit" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8 }}>
                    Đăng Ký Lại
                  </Link>
                  <Link to="/" className="af-ghost" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8 }}>
                    Về Trang Chủ
                  </Link>
                </div>
              </div>
            )}

            {status === 'notoken' && (
              <div className="verify-state">
                <XCircle size={56} className="verify-icon verify-icon--error" />
                <h2 className="serif">Link Không Hợp Lệ</h2>
                <p>Không tìm thấy token xác thực. Vui lòng kiểm tra lại link trong email.</p>
                <Link to="/register" className="af-submit" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8, marginTop:'1.5rem' }}>
                  Đăng Ký Lại
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
