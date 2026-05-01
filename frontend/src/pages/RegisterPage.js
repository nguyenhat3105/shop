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
      <div className="grid grid-cols-2 min-h-screen pt-16 max-md:grid-cols-1 bg-[#faf9f7]">
        <div className="relative flex items-end p-14 overflow-hidden bg-[#111] min-h-[calc(100vh-4rem)] max-md:hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-[#b8955a]/15 z-10" />
          <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=85" alt="" className="absolute inset-0 w-full h-full object-cover opacity-35 transition-transform duration-[8s] ease-out group-hover:scale-105" />
          <div className="relative z-20 flex flex-col gap-6">
            <div className="flex items-center gap-2.5 text-white text-[1.2rem] font-bold tracking-[0.12em]"><Gem size={22} className="text-[#e2c186]" /><span>LUXE<span className="font-light opacity-60 ml-[2px] tracking-[0.3em] text-[0.7em]">SHOP</span></span></div>
            <h2 className="font-serif text-[clamp(2.6rem,4vw,4rem)] font-normal text-white leading-[1.1]">Gần xong rồi!</h2>
            <p className="text-[0.9rem] text-white/55 leading-[1.7] max-w-[320px]">Kiểm tra hộp thư để hoàn tất đăng ký.</p>
          </div>
        </div>
        <div className="flex items-center justify-center p-12 overflow-y-auto max-sm:p-[2rem_1.25rem] bg-[#faf9f7]">
          <div className="w-full max-w-[420px] animate-in slide-in-from-bottom-4 duration-500 fade-in">
            <div className="flex flex-col items-center text-center gap-3 py-4">
              <div className="w-20 h-20 rounded-full bg-[#3a7d52]/10 border-2 border-[#3a7d52]/25 flex items-center justify-center text-[#3a7d52] animate-in zoom-in duration-500 mb-2">
                <Check size={32} strokeWidth={2.5} />
              </div>
              <h2 className="font-serif text-[1.8rem] font-normal text-[#111] leading-[1.2]">Kiểm tra email của bạn!</h2>
              <p className="text-[0.88rem] text-[#999] leading-[1.6]">Chúng tôi đã gửi link xác thực đến</p>
              <strong className="text-[0.92rem] text-[#111]">{form.email}</strong>
              <p className="p-[0.75rem_1rem] bg-[#f5f3ef] border border-black/10 rounded-md text-[0.78rem] text-[#999] mt-2">
                Link sẽ hết hạn sau <b>24 giờ</b>. Kiểm tra cả thư mục spam nếu không thấy.
              </p>
              <Link to="/login" className="mt-2 w-full p-[0.85rem_1rem] bg-[#111] text-white border-none rounded-md text-[0.82rem] font-bold tracking-[0.1em] uppercase flex items-center justify-center gap-2 transition-all hover:bg-[#222] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
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
    <div className="grid grid-cols-2 min-h-screen pt-16 max-md:grid-cols-1 bg-[#faf9f7]">
      <div className="relative flex items-end p-14 overflow-hidden bg-[#111] min-h-[calc(100vh-4rem)] max-md:hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-[#b8955a]/15 z-10" />
        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85" alt="" className="absolute inset-0 w-full h-full object-cover opacity-35 transition-transform duration-[8s] ease-out group-hover:scale-105" />
        <div className="relative z-20 flex flex-col gap-6">
          <div className="flex items-center gap-2.5 text-white text-[1.2rem] font-bold tracking-[0.12em]">
            <Gem size={22} className="text-[#e2c186]" />
            <span>LUXE<span className="font-light opacity-60 ml-[2px] tracking-[0.3em] text-[0.7em]">SHOP</span></span>
          </div>
          <h2 className="font-serif text-[clamp(2.6rem,4vw,4rem)] font-normal text-white leading-[1.1]">Tham gia cùng<br />chúng tôi</h2>
          <p className="text-[0.9rem] text-white/55 leading-[1.7] max-w-[320px]">Đăng ký để nhận ưu đãi độc quyền và theo dõi đơn hàng.</p>
          <div className="flex flex-col gap-2.5 mt-2">
            {['Miễn phí giao hàng từ 299K','Đổi trả trong 30 ngày','Bảo hành chính hãng'].map(p => (
              <div key={p} className="flex items-center gap-2 text-[0.82rem] text-white/65"><Check size={13} className="text-[#e2c186] shrink-0" />{p}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-12 overflow-y-auto max-sm:p-[2rem_1.25rem] bg-[#faf9f7]">
        <div className="w-full max-w-[420px] animate-in slide-in-from-bottom-4 duration-500 fade-in">
          <div className="mb-8">
            <div className="text-[0.62rem] font-bold tracking-[0.28em] uppercase text-[#b8955a] mb-2.5">Đăng Ký</div>
            <h1 className="font-serif text-[clamp(1.7rem,3vw,2.4rem)] font-normal text-[#111] leading-[1.15] mb-2">Tạo Tài Khoản</h1>
            <p className="text-[0.83rem] text-[#999]">
              Đã có tài khoản? <Link to="/login" className="text-[#111] font-semibold border-b border-current transition-colors hover:text-[#b8955a]">Đăng nhập</Link>
            </p>
          </div>

          {serverErr && <div className="p-[0.75rem_1rem] rounded-md text-[0.82rem] mb-5 flex items-start gap-2 animate-in slide-in-from-top-2 duration-300 bg-[#c0392b]/10 border border-[#c0392b]/25 text-[#c0392b]">{serverErr}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-[1.1rem]" noValidate>
            {/* Full name */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center justify-between text-[0.76rem] font-semibold tracking-[0.04em] text-[#555]">Họ và Tên</label>
              <input
                className={`w-full p-[0.75rem_1rem] bg-white border ${errors.fullName ? 'border-[#c0392b]/50 focus:ring-[#c0392b]/10' : 'border-black/10 focus:border-[#111] focus:ring-black/5'} rounded-md text-[0.88rem] text-[#111] outline-none transition-all focus:ring-4 appearance-none placeholder:text-[#999]`} type="text"
                placeholder="Nguyễn Văn An"
                value={form.fullName}
                onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                autoFocus
              />
              {errors.fullName && <p className="text-[0.73rem] text-[#c0392b]">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center justify-between text-[0.76rem] font-semibold tracking-[0.04em] text-[#555]">Email</label>
              <input
                className={`w-full p-[0.75rem_1rem] bg-white border ${errors.email ? 'border-[#c0392b]/50 focus:ring-[#c0392b]/10' : 'border-black/10 focus:border-[#111] focus:ring-black/5'} rounded-md text-[0.88rem] text-[#111] outline-none transition-all focus:ring-4 appearance-none placeholder:text-[#999]`} type="email"
                placeholder="ban@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
              {errors.email && <p className="text-[0.73rem] text-[#c0392b]">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center justify-between text-[0.76rem] font-semibold tracking-[0.04em] text-[#555]">Mật Khẩu</label>
              <div className="relative">
                <input
                  className={`w-full p-[0.75rem_1rem] bg-white border ${errors.password ? 'border-[#c0392b]/50 focus:ring-[#c0392b]/10' : 'border-black/10 focus:border-[#111] focus:ring-black/5'} rounded-md text-[0.88rem] text-[#111] outline-none transition-all focus:ring-4 appearance-none placeholder:text-[#999]`} type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] flex items-center justify-center transition-colors hover:text-[#111]" onClick={() => setShowPw(v => !v)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Strength indicator */}
              {form.password && (
                <div className="flex flex-wrap gap-[5px] mt-1">
                  {rules.map(r => {
                    const ok = r.test(form.password);
                    return (
                      <span key={r.label} className={`inline-flex items-center gap-1 text-[0.68rem] p-[2px_8px] rounded-full border transition-all ${ok ? 'bg-[#3a7d52]/10 border-[#3a7d52]/25 text-[#3a7d52]' : 'bg-[#f5f3ef] text-[#999] border-black/10'}`}>
                        <Check size={10} className={ok ? 'opacity-100' : 'opacity-30'} /> {r.label}
                      </span>
                    )
                  })}
                </div>
              )}
              {errors.password && <p className="text-[0.73rem] text-[#c0392b]">{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center justify-between text-[0.76rem] font-semibold tracking-[0.04em] text-[#555]">Xác Nhận Mật Khẩu</label>
              <input
                className={`w-full p-[0.75rem_1rem] bg-white border ${errors.confirm ? 'border-[#c0392b]/50 focus:ring-[#c0392b]/10' : 'border-black/10 focus:border-[#111] focus:ring-black/5'} rounded-md text-[0.88rem] text-[#111] outline-none transition-all focus:ring-4 appearance-none placeholder:text-[#999]`} type="password"
                placeholder="••••••••"
                value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
              />
              {errors.confirm && <p className="text-[0.73rem] text-[#c0392b]">{errors.confirm}</p>}
            </div>

            <button type="submit" className="mt-2 w-full p-[0.85rem_1rem] bg-[#111] text-white border-none rounded-md text-[0.82rem] font-bold tracking-[0.1em] uppercase flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-[#222] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] disabled:opacity-55 disabled:cursor-not-allowed" disabled={loading}>
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Đang xử lý...</>
                : <><UserPlus size={16} /> Tạo Tài Khoản</>
              }
            </button>

            <div className="text-center my-5 text-[14px] text-[#666]">HOẶC</div>
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

            <p className="text-[0.73rem] text-[#999] text-center leading-[1.6] mt-1">
              Bằng cách đăng ký, bạn đồng ý với{' '}
              <a href="#!" className="text-[#111] font-semibold border-b border-current transition-colors hover:text-[#b8955a]">Điều khoản dịch vụ</a>{' '}và{' '}
              <a href="#!" className="text-[#111] font-semibold border-b border-current transition-colors hover:text-[#b8955a]">Chính sách bảo mật</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
