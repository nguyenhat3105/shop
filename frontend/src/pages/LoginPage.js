import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Gem, Loader2, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import './AuthPage.css';

export default function LoginPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login, loginGoogle } = useAuth();
  const from      = location.state?.from?.pathname || '/';

  const [form, setForm]     = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [show, setShow]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverErr, setServerErr] = useState('');

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = 'Vui lòng nhập email';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email không hợp lệ';
    if (!form.password) e.password = 'Vui lòng nhập mật khẩu';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerErr('');
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error
        || 'Email hoặc mật khẩu không đúng.';
      setServerErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left panel — decorative */}
      <div className="auth-left">
        <div className="auth-left__inner">
          <div className="auth-left__logo">
            <Gem size={22} />
            <span>LUXE<span className="auth-left__logo-thin">SHOP</span></span>
          </div>
          <h2 className="auth-left__headline serif">
            Chào mừng<br />trở lại
          </h2>
          <p className="auth-left__sub">
            Đăng nhập để tiếp tục khám phá hàng nghìn sản phẩm cao cấp.
          </p>
          <div className="auth-left__quote">
            <span className="quote-mark">"</span>
            <p>Phong cách không phải là điều bạn mặc, đó là cách bạn sống.</p>
          </div>
        </div>
        <div className="auth-left__img-overlay" />
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=900&q=85"
          alt="Fashion"
          className="auth-left__bg"
        />
      </div>

      {/* Right panel — form */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          {/* Header */}
          <div className="auth-form__header">
            <div className="auth-form__eyebrow">Đăng Nhập</div>
            <h1 className="auth-form__title serif">Tài Khoản Của Bạn</h1>
            <p className="auth-form__sub">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="auth-link">Đăng ký miễn phí</Link>
            </p>
          </div>

          {/* Server error */}
          {serverErr && (
            <div className="auth-alert auth-alert--error">{serverErr}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Email */}
            <div className={`af-field ${errors.email ? 'af-field--err' : ''}`}>
              <label className="af-label">Email</label>
              <input
                type="email"
                className="af-input"
                placeholder="ban@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                autoComplete="email"
                autoFocus
              />
              {errors.email && <p className="af-err">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className={`af-field ${errors.password ? 'af-field--err' : ''}`}>
              <label className="af-label">
                Mật Khẩu
                <Link to="/forgot-password" className="af-label-link">Quên mật khẩu?</Link>
              </label>
              <div className="af-input-wrap">
                <input
                  type={show ? 'text' : 'password'}
                  className="af-input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  autoComplete="current-password"
                />
                <button type="button" className="af-eye" onClick={() => setShow(v => !v)}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="af-err">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button type="submit" className="af-submit" disabled={loading}>
              {loading
                ? <><Loader2 size={16} className="spin" /> Đang đăng nhập...</>
                : <><LogIn size={16} /> Đăng Nhập</>
              }
            </button>
          </form>

          <div style={{ textAlign: 'center', margin: '20px 0', fontSize: '14px', color: '#666' }}>HOẶC</div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
             <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    setLoading(true);
                    await loginGoogle(credentialResponse.credential);
                    navigate(from, { replace: true });
                  } catch (err) {
                    setServerErr("Đăng nhập Google thất bại.");
                  } finally {
                    setLoading(false);
                  }
                }}
                onError={() => {
                  setServerErr("Đăng nhập Google thất bại.");
                }}
             />
          </div>

          {/* Admin hint */}
          <div className="auth-demo-hint" style={{ marginTop: '30px' }}>
            <span className="demo-label">Tài khoản demo</span>
            <code>admin@luxeshop.vn / Admin@12345</code>
          </div>
        </div>
      </div>
    </div>
  );
}
