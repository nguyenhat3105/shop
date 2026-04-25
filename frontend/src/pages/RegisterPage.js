import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Gem, Loader2, UserPlus, Check } from 'lucide-react';
import { register as apiRegister } from '../services/api';
import './AuthPage.css';

const rules = [
  { test: v => v.length >= 8,           label: 'Ít nhất 8 ký tự' },
  { test: v => /[A-Z]/.test(v),         label: 'Có chữ hoa'     },
  { test: v => /[0-9]/.test(v),         label: 'Có số'           },
  { test: v => /[^A-Za-z0-9]/.test(v),  label: 'Có ký tự đặc biệt' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ fullName: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [serverErr, setServerErr] = useState('');

  const validate = () => {
    const e = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2)
      e.fullName = 'Họ tên phải có ít nhất 2 ký tự';
    if (!form.email) e.email = 'Vui lòng nhập email';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email không hợp lệ';
    if (!form.password) e.password = 'Vui lòng nhập mật khẩu';
    else if (form.password.length < 8) e.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    if (!form.confirm) e.confirm = 'Vui lòng xác nhận mật khẩu';
    else if (form.password !== form.confirm) e.confirm = 'Mật khẩu xác nhận không khớp';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerErr('');
    try {
      await apiRegister({
        fullName: form.fullName.trim(),
        email:    form.email.toLowerCase().trim(),
        password: form.password,
      });
      setSuccess(true);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error
        || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
      setServerErr(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Success state ──────────────────────────────────────────
  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-left">
          <div className="auth-left__inner">
            <div className="auth-left__logo"><Gem size={22} /><span>LUXE<span className="auth-left__logo-thin">SHOP</span></span></div>
            <h2 className="auth-left__headline serif">Gần xong rồi!</h2>
            <p className="auth-left__sub">Kiểm tra hộp thư để hoàn tất đăng ký.</p>
          </div>
          <div className="auth-left__img-overlay" />
          <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=85" alt="" className="auth-left__bg" />
        </div>
        <div className="auth-right">
          <div className="auth-form-wrap">
            <div className="auth-success-box">
              <div className="auth-success-icon">
                <Check size={32} strokeWidth={2.5} />
              </div>
              <h2 className="serif">Kiểm tra email của bạn!</h2>
              <p>Chúng tôi đã gửi link xác thực đến</p>
              <strong>{form.email}</strong>
              <p className="auth-success-note">
                Link sẽ hết hạn sau <b>24 giờ</b>. Kiểm tra cả thư mục spam nếu không thấy.
              </p>
              <Link to="/login" className="af-submit" style={{ textDecoration:'none', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                Quay lại Đăng Nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────
  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left__inner">
          <div className="auth-left__logo">
            <Gem size={22} />
            <span>LUXE<span className="auth-left__logo-thin">SHOP</span></span>
          </div>
          <h2 className="auth-left__headline serif">Tham gia cùng<br />chúng tôi</h2>
          <p className="auth-left__sub">Đăng ký để nhận ưu đãi độc quyền và theo dõi đơn hàng.</p>
          <div className="auth-left__perks">
            {['Miễn phí giao hàng từ 299K','Đổi trả trong 30 ngày','Bảo hành chính hãng'].map(p => (
              <div key={p} className="auth-perk"><Check size={13} />{p}</div>
            ))}
          </div>
        </div>
        <div className="auth-left__img-overlay" />
        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85" alt="" className="auth-left__bg" />
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-form__header">
            <div className="auth-form__eyebrow">Đăng Ký</div>
            <h1 className="auth-form__title serif">Tạo Tài Khoản</h1>
            <p className="auth-form__sub">
              Đã có tài khoản? <Link to="/login" className="auth-link">Đăng nhập</Link>
            </p>
          </div>

          {serverErr && <div className="auth-alert auth-alert--error">{serverErr}</div>}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Full name */}
            <div className={`af-field ${errors.fullName ? 'af-field--err' : ''}`}>
              <label className="af-label">Họ và Tên</label>
              <input
                className="af-input" type="text"
                placeholder="Nguyễn Văn An"
                value={form.fullName}
                onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                autoFocus
              />
              {errors.fullName && <p className="af-err">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div className={`af-field ${errors.email ? 'af-field--err' : ''}`}>
              <label className="af-label">Email</label>
              <input
                className="af-input" type="email"
                placeholder="ban@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
              {errors.email && <p className="af-err">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className={`af-field ${errors.password ? 'af-field--err' : ''}`}>
              <label className="af-label">Mật Khẩu</label>
              <div className="af-input-wrap">
                <input
                  className="af-input" type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                />
                <button type="button" className="af-eye" onClick={() => setShowPw(v => !v)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Strength indicator */}
              {form.password && (
                <div className="pw-rules">
                  {rules.map(r => (
                    <span key={r.label} className={`pw-rule ${r.test(form.password) ? 'ok' : ''}`}>
                      <Check size={10} /> {r.label}
                    </span>
                  ))}
                </div>
              )}
              {errors.password && <p className="af-err">{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div className={`af-field ${errors.confirm ? 'af-field--err' : ''}`}>
              <label className="af-label">Xác Nhận Mật Khẩu</label>
              <input
                className="af-input" type="password"
                placeholder="••••••••"
                value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
              />
              {errors.confirm && <p className="af-err">{errors.confirm}</p>}
            </div>

            <button type="submit" className="af-submit" disabled={loading}>
              {loading
                ? <><Loader2 size={16} className="spin" /> Đang xử lý...</>
                : <><UserPlus size={16} /> Tạo Tài Khoản</>
              }
            </button>

            <p className="auth-terms">
              Bằng cách đăng ký, bạn đồng ý với{' '}
              <a href="#!" className="auth-link">Điều khoản dịch vụ</a>{' '}và{' '}
              <a href="#!" className="auth-link">Chính sách bảo mật</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
