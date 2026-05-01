import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Gem, Loader2, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

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
    <div className="grid grid-cols-2 min-h-screen pt-16 max-md:grid-cols-1 bg-[#faf9f7]">
      {/* Left panel — decorative */}
      <div className="relative flex items-end p-14 overflow-hidden bg-[#111] min-h-[calc(100vh-4rem)] max-md:hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-[#b8955a]/15 z-10" />
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=900&q=85"
          alt="Fashion"
          className="absolute inset-0 w-full h-full object-cover opacity-35 transition-transform duration-[8s] ease-out group-hover:scale-105"
        />
        <div className="relative z-20 flex flex-col gap-6">
          <div className="flex items-center gap-2.5 text-white text-[1.2rem] font-bold tracking-[0.12em]">
            <Gem size={22} className="text-[#e2c186]" />
            <span>LUXE<span className="font-light opacity-60 ml-[2px] tracking-[0.3em] text-[0.7em]">SHOP</span></span>
          </div>
          <h2 className="font-serif text-[clamp(2.6rem,4vw,4rem)] font-normal text-white leading-[1.1]">
            Chào mừng<br />trở lại
          </h2>
          <p className="text-[0.9rem] text-white/55 leading-[1.7] max-w-[320px]">
            Đăng nhập để tiếp tục khám phá hàng nghìn sản phẩm cao cấp.
          </p>
          <div className="flex gap-3 p-[1.1rem_1.25rem] bg-white/5 border border-white/10 border-l-[3px] border-l-[#e2c186] rounded-md mt-2">
            <span className="font-serif text-[3rem] leading-none text-[#e2c186] opacity-50 shrink-0 -mt-2">"</span>
            <p className="text-[0.83rem] text-white/60 italic leading-[1.6]">
              Phong cách không phải là điều bạn mặc, đó là cách bạn sống.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center p-12 overflow-y-auto max-sm:p-[2rem_1.25rem] bg-[#faf9f7]">
        <div className="w-full max-w-[420px] animate-in slide-in-from-bottom-4 duration-500 fade-in">
          {/* Header */}
          <div className="mb-8">
            <div className="text-[0.62rem] font-bold tracking-[0.28em] uppercase text-[#b8955a] mb-2.5">Đăng Nhập</div>
            <h1 className="font-serif text-[clamp(1.7rem,3vw,2.4rem)] font-normal text-[#111] leading-[1.15] mb-2">Tài Khoản Của Bạn</h1>
            <p className="text-[0.83rem] text-[#999]">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-[#111] font-semibold border-b border-current transition-colors hover:text-[#b8955a]">Đăng ký miễn phí</Link>
            </p>
          </div>

          {/* Server error */}
          {serverErr && (
            <div className="p-[0.75rem_1rem] rounded-md text-[0.82rem] mb-5 flex items-start gap-2 animate-in slide-in-from-top-2 duration-300 bg-[#c0392b]/10 border border-[#c0392b]/25 text-[#c0392b]">
              {serverErr}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-[1.1rem]" noValidate>
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center justify-between text-[0.76rem] font-semibold tracking-[0.04em] text-[#555]">Email</label>
              <input
                type="email"
                className={`w-full p-[0.75rem_1rem] bg-white border ${errors.email ? 'border-[#c0392b]/50 focus:ring-[#c0392b]/10' : 'border-black/10 focus:border-[#111] focus:ring-black/5'} rounded-md text-[0.88rem] text-[#111] outline-none transition-all focus:ring-4 appearance-none placeholder:text-[#999]`}
                placeholder="ban@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                autoComplete="email"
                autoFocus
              />
              {errors.email && <p className="text-[0.73rem] text-[#c0392b]">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center justify-between text-[0.76rem] font-semibold tracking-[0.04em] text-[#555]">
                Mật Khẩu
                <Link to="/forgot-password" className="text-[0.72rem] font-normal text-[#999] border-b border-transparent transition-all hover:text-[#b8955a] hover:border-[#b8955a]">Quên mật khẩu?</Link>
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  className={`w-full p-[0.75rem_1rem] bg-white border ${errors.password ? 'border-[#c0392b]/50 focus:ring-[#c0392b]/10' : 'border-black/10 focus:border-[#111] focus:ring-black/5'} rounded-md text-[0.88rem] text-[#111] outline-none transition-all focus:ring-4 appearance-none placeholder:text-[#999]`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  autoComplete="current-password"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] flex items-center justify-center transition-colors hover:text-[#111]" onClick={() => setShow(v => !v)}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-[0.73rem] text-[#c0392b]">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button type="submit" className="mt-2 w-full p-[0.85rem_1rem] bg-[#111] text-white border-none rounded-md text-[0.82rem] font-bold tracking-[0.1em] uppercase flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-[#222] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] disabled:opacity-55 disabled:cursor-not-allowed" disabled={loading}>
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Đang đăng nhập...</>
                : <><LogIn size={16} /> Đăng Nhập</>
              }
            </button>
          </form>

          <div className="text-center my-5 text-[14px] text-[#666]">HOẶC</div>
          <div className="flex justify-center">
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
          <div className="mt-7 p-[0.85rem_1rem] bg-[#f5f3ef] border border-dashed border-[#ddd] rounded-md flex flex-col gap-1">
            <span className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#b8955a]">Tài khoản demo</span>
            <code className="text-[0.8rem] text-[#555] font-mono">admin@luxeshop.vn / Admin@12345</code>
          </div>
        </div>
      </div>
    </div>
  );
}
