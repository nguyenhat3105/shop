import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Loader2, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { resetPassword } from '../services/api';
import './AuthPage.css';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Token không hợp lệ hoặc bị thiếu.');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    if (password !== confirm) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra hoặc token đã hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <h1 className="auth-title serif">Liên kết không hợp lệ</h1>
            <p className="auth-subtitle" style={{color: '#b91c1c'}}>Vui lòng yêu cầu lại link đặt lại mật khẩu từ trang Quên Mật Khẩu.</p>
            <div style={{marginTop: '20px'}}>
              <Link to="/forgot-password" className="auth-link">Đến trang Quên Mật Khẩu</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container" style={{maxWidth: '400px'}}>
        <div className="auth-header">
          <h1 className="auth-title serif">Thiết Lập Mật Khẩu Mới</h1>
        </div>

        {success ? (
          <div className="auth-success-box" style={{textAlign: 'center'}}>
            <CheckCircle size={48} color="#15803d" style={{marginBottom: '16px'}} />
            <h3 style={{fontSize: '18px', marginBottom: '8px', color: '#111'}}>Thành Công!</h3>
            <p style={{color: '#666', lineHeight: 1.6, marginBottom: '24px'}}>
              Mật khẩu của bạn đã được cập nhật thành công.
            </p>
            <Link to="/login" className="af-submit" style={{textDecoration: 'none', textAlign: 'center'}}>
              Đăng nhập ngay
            </Link>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="af-server-err">{error}</div>}

            <div className="af-group">
              <label>Mật Khẩu Mới</label>
              <div className="af-input-wrap">
                <Lock size={16} className="af-icon" />
                <input 
                  type={showPw ? 'text' : 'password'} 
                  placeholder="Nhập mật khẩu mới..." 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" className="af-eye" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="af-group">
              <label>Xác Nhận Mật Khẩu</label>
              <div className="af-input-wrap">
                <Lock size={16} className="af-icon" />
                <input 
                  type={showPw ? 'text' : 'password'} 
                  placeholder="Nhập lại mật khẩu mới..." 
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="af-submit" disabled={loading}>
              {loading 
                ? <><Loader2 size={16} className="spin" /> Đang cập nhật...</> 
                : 'Cập Nhật Mật Khẩu'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
