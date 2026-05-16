import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Gem, Loader2, UserPlus, Check } from 'lucide-react';
import { register as apiRegister } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const rules = [
  { test: v => v.length >= 8,           label: 'Ít nhất 8 ký tự' },
  { test: v => /[A-Z]/.test(v),         label: 'Có chữ hoa'     },
  { test: v => /[0-9]/.test(v),         label: 'Có số'           },
  { test: v => /[^A-Za-z0-9]/.test(v),  label: 'Có ký tự đặc biệt' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { loginGoogle } = useAuth();
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
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 pt-16">
        <div className="hidden md:flex relative items-end p-14 overflow-hidden bg-gray-900 min-h-[calc(100vh-64px)] group">
          <div className="relative z-20 flex flex-col gap-6">
            <div className="flex items-center gap-2.5 text-white text-lg font-bold tracking-widest">
              <Gem size={22} className="text-yellow-600" />
              <span>LUXE<span className="font-light opacity-60 ml-0.5 tracking-[0.3em] text-[0.7em]">SHOP</span></span>
            </div>
            <h2 className="text-[clamp(2.6rem,4vw,4rem)] font-normal text-white leading-[1.1] font-serif">Gần xong rồi!</h2>
            <p className="text-sm text-white/55 leading-relaxed max-w-[320px]">Kiểm tra hộp thư để hoàn tất đăng ký.</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/40 to-yellow-700/15 z-10" />
          <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=85" alt="" className="absolute inset-0 w-full h-full object-cover opacity-35 transition-transform duration-[8000ms] group-hover:scale-105" />
        </div>
        <div className="flex items-center justify-center p-8 md:p-12 bg-gray-50 overflow-y-auto min-h-[calc(100vh-64px)]">
          <div className="w-full max-w-[420px] animate-fadeUp">
            <div className="flex flex-col items-center text-center gap-3 py-4">
              <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center text-green-600 mb-2 animate-[popIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_both]">
                <Check size={32} strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl font-normal text-gray-900 leading-[1.2] font-serif">Kiểm tra email của bạn!</h2>
              <p className="text-[0.88rem] text-gray-500 leading-relaxed">Chúng tôi đã gửi link xác thực đến</p>
              <strong className="text-[0.92rem] text-gray-900">{form.email}</strong>
              <p className="px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-[0.78rem] text-gray-500 mt-2">
                Link sẽ hết hạn sau <b className="font-semibold text-gray-700">24 giờ</b>. Kiểm tra cả thư mục spam nếu không thấy.
              </p>
              <Link to="/login" className="mt-2 w-full px-4 py-3.5 bg-gray-900 text-white border-none rounded-lg text-[0.82rem] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all hover:bg-gray-800 hover:-translate-y-[1px] hover:shadow-lg">
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
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 pt-16">
      <div className="hidden md:flex relative items-end p-14 overflow-hidden bg-gray-900 min-h-[calc(100vh-64px)] group">
        <div className="relative z-20 flex flex-col gap-6">
          <div className="flex items-center gap-2.5 text-white text-lg font-bold tracking-widest">
            <Gem size={22} className="text-yellow-600" />
            <span>LUXE<span className="font-light opacity-60 ml-0.5 tracking-[0.3em] text-[0.7em]">SHOP</span></span>
          </div>
          <h2 className="text-[clamp(2.6rem,4vw,4rem)] font-normal text-white leading-[1.1] font-serif">Tham gia cùng<br />chúng tôi</h2>
          <p className="text-sm text-white/55 leading-relaxed max-w-[320px]">Đăng ký để nhận ưu đãi độc quyền và theo dõi đơn hàng.</p>
          <div className="flex flex-col gap-2.5 mt-2">
            {['Miễn phí giao hàng từ 299K','Đổi trả trong 30 ngày','Bảo hành chính hãng'].map(p => (
              <div key={p} className="flex items-center gap-2 text-[0.82rem] text-white/65"><Check size={13} className="text-yellow-600 shrink-0" />{p}</div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/40 to-yellow-700/15 z-10" />
        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85" alt="" className="absolute inset-0 w-full h-full object-cover opacity-35 transition-transform duration-[8000ms] group-hover:scale-105" />
      </div>

      <div className="flex items-center justify-center p-8 md:p-12 bg-gray-50 overflow-y-auto min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-[420px] animate-fadeUp">
          <div className="mb-8">
            <div className="text-[0.62rem] font-bold tracking-[0.28em] uppercase text-yellow-700 mb-2.5">Đăng Ký</div>
            <h1 className="text-[clamp(1.7rem,3vw,2.4rem)] font-normal text-gray-900 leading-[1.15] mb-2 font-serif">Tạo Tài Khoản</h1>
            <p className="text-[0.83rem] text-gray-500">
              Đã có tài khoản? <Link to="/login" className="text-gray-900 font-semibold border-b border-current transition-colors hover:text-yellow-700">Đăng nhập</Link>
            </p>
          </div>

          {serverErr && <div className="px-4 py-3 rounded-lg text-[0.82rem] mb-5 flex items-start gap-2 bg-red-50 border border-red-200 text-red-500 animate-fadeUp">{serverErr}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {/* Full name */}
            <div className={`flex flex-col gap-1.5`}>
              <label className="flex items-center justify-between text-[0.76rem] font-semibold tracking-wide text-gray-600">Họ và Tên</label>
              <input
                className={`w-full px-4 py-3 bg-white border-[1.5px] rounded-lg text-[0.88rem] text-gray-900 outline-none transition-all focus:ring-4 focus:ring-gray-900/5 placeholder:text-gray-400 ${errors.fullName ? 'border-red-400 focus:border-red-400 focus:ring-red-500/10' : 'border-gray-200 focus:border-gray-900'}`} type="text"
                placeholder="Nguyễn Văn An"
                value={form.fullName}
                onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                autoFocus
              />
              {errors.fullName && <p className="text-[0.73rem] text-red-500">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div className={`flex flex-col gap-1.5`}>
              <label className="flex items-center justify-between text-[0.76rem] font-semibold tracking-wide text-gray-600">Email</label>
              <input
                className={`w-full px-4 py-3 bg-white border-[1.5px] rounded-lg text-[0.88rem] text-gray-900 outline-none transition-all focus:ring-4 focus:ring-gray-900/5 placeholder:text-gray-400 ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-500/10' : 'border-gray-200 focus:border-gray-900'}`} type="email"
                placeholder="ban@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
              {errors.email && <p className="text-[0.73rem] text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className={`flex flex-col gap-1.5`}>
              <label className="flex items-center justify-between text-[0.76rem] font-semibold tracking-wide text-gray-600">Mật Khẩu</label>
              <div className="relative">
                <input
                  className={`w-full px-4 py-3 bg-white border-[1.5px] rounded-lg text-[0.88rem] text-gray-900 outline-none transition-all focus:ring-4 focus:ring-gray-900/5 placeholder:text-gray-400 ${errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-500/10' : 'border-gray-200 focus:border-gray-900'}`} type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors flex items-center justify-center" onClick={() => setShowPw(v => !v)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Strength indicator */}
              {form.password && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {rules.map(r => (
                    <span key={r.label} className={`inline-flex items-center gap-1 text-[0.68rem] px-2 py-0.5 rounded-full border transition-all ${r.test(form.password) ? 'bg-green-50 border-green-200 text-green-600' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
                      <Check size={10} className={r.test(form.password) ? 'opacity-100' : 'opacity-30'} /> {r.label}
                    </span>
                  ))}
                </div>
              )}
              {errors.password && <p className="text-[0.73rem] text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div className={`flex flex-col gap-1.5`}>
              <label className="flex items-center justify-between text-[0.76rem] font-semibold tracking-wide text-gray-600">Xác Nhận Mật Khẩu</label>
              <input
                className={`w-full px-4 py-3 bg-white border-[1.5px] rounded-lg text-[0.88rem] text-gray-900 outline-none transition-all focus:ring-4 focus:ring-gray-900/5 placeholder:text-gray-400 ${errors.confirm ? 'border-red-400 focus:border-red-400 focus:ring-red-500/10' : 'border-gray-200 focus:border-gray-900'}`} type="password"
                placeholder="••••••••"
                value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
              />
              {errors.confirm && <p className="text-[0.73rem] text-red-500">{errors.confirm}</p>}
            </div>

            <button type="submit" className="mt-2 w-full px-4 py-3.5 bg-gray-900 text-white border-none rounded-lg text-[0.82rem] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all hover:bg-gray-800 hover:-translate-y-[1px] hover:shadow-lg disabled:opacity-55 disabled:cursor-not-allowed" disabled={loading}>
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Đang xử lý...</>
                : <><UserPlus size={16} /> Tạo Tài Khoản</>
              }
            </button>

            <div className="text-center my-5 text-sm text-gray-500">HOẶC</div>
            <div className="flex justify-center mb-5">
               <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      setLoading(true);
                      await loginGoogle(credentialResponse.credential);
                      navigate('/');
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

            <p className="text-[0.73rem] text-gray-500 text-center leading-relaxed mt-1">
              Bằng cách đăng ký, bạn đồng ý với{' '}
              <a href="#!" className="text-gray-900 font-semibold border-b border-current transition-colors hover:text-yellow-700">Điều khoản dịch vụ</a>{' '}và{' '}
              <a href="#!" className="text-gray-900 font-semibold border-b border-current transition-colors hover:text-yellow-700">Chính sách bảo mật</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
