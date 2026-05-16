import React, { useState, useEffect } from 'react';

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
  const [sessionExpired, setSessionExpired] = useState('');

  useEffect(() => {
    const msg = sessionStorage.getItem('sessionExpiredMsg');
    if (msg) {
      setSessionExpired(msg);
      sessionStorage.removeItem('sessionExpiredMsg');
    }
  }, []);

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
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 pt-16">
      {/* Left panel — decorative */}
      <div className="hidden md:flex relative items-end p-14 overflow-hidden bg-gray-900 min-h-[calc(100vh-64px)] group">
        <div className="relative z-20 flex flex-col gap-6">
          <div className="flex items-center gap-2.5 text-white text-lg font-bold tracking-widest">
            <Gem size={22} className="text-yellow-600" />
            <span>LUXE<span className="font-light opacity-60 ml-0.5 tracking-[0.3em] text-[0.7em]">SHOP</span></span>
          </div>
          <h2 className="text-[clamp(2.6rem,4vw,4rem)] font-normal text-white leading-[1.1] font-serif">
            Chào mừng<br />trở lại
          </h2>
          <p className="text-sm text-white/55 leading-relaxed max-w-[320px]">
            Đăng nhập để tiếp tục khám phá hàng nghìn sản phẩm cao cấp.
          </p>
          <div className="flex gap-3 py-4 px-5 bg-white/5 border border-white/10 border-l-[3px] border-l-yellow-600 rounded-lg mt-2">
            <span className="font-serif text-5xl leading-none text-yellow-600 opacity-50 shrink-0 -mt-2">"</span>
            <p className="text-[0.83rem] text-white/60 italic leading-relaxed">Phong cách không phải là điều bạn mặc, đó là cách bạn sống.</p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/40 to-yellow-700/15 z-10" />
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=900&q=85"
          alt="Fashion"
          className="absolute inset-0 w-full h-full object-cover opacity-35 transition-transform duration-[8000ms] group-hover:scale-105"
        />
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center p-8 md:p-12 bg-gray-50 overflow-y-auto min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-[420px] animate-fadeUp">
          {/* Header */}
          <div className="mb-8">
            <div className="text-[0.62rem] font-bold tracking-[0.28em] uppercase text-yellow-700 mb-2.5">Đăng Nhập</div>
            <h1 className="text-[clamp(1.7rem,3vw,2.4rem)] font-normal text-gray-900 leading-[1.15] mb-2 font-serif">Tài Khoản Của Bạn</h1>
            <p className="text-[0.83rem] text-gray-500">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-gray-900 font-semibold border-b border-current transition-colors hover:text-yellow-700">Đăng ký miễn phí</Link>
            </p>
          </div>

          {/* Session expired banner */}
          {sessionExpired && (
            <div className="px-4 py-3 rounded-lg text-[0.82rem] mb-5 flex items-start gap-2.5 bg-orange-50 border border-orange-200 text-orange-700 animate-fadeUp">
              <span className="text-lg leading-none">⏱</span>
              <span>{sessionExpired}</span>
            </div>
          )}

          {/* Server error */}
          {serverErr && (
            <div className="px-4 py-3 rounded-lg text-[0.82rem] mb-5 flex items-start gap-2 bg-red-50 border border-red-200 text-red-500 animate-fadeUp">{serverErr}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {/* Email */}
            <div className={`flex flex-col gap-1.5`}>
              <label className="flex items-center justify-between text-[0.76rem] font-semibold tracking-wide text-gray-600">Email</label>
              <input
                type="email"
                className={`w-full px-4 py-3 bg-white border-[1.5px] rounded-lg text-[0.88rem] text-gray-900 outline-none transition-all focus:ring-4 focus:ring-gray-900/5 placeholder:text-gray-400 ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-500/10' : 'border-gray-200 focus:border-gray-900'}`}
                placeholder="ban@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                autoComplete="email"
                autoFocus
              />
              {errors.email && <p className="text-[0.73rem] text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className={`flex flex-col gap-1.5`}>
              <label className="flex items-center justify-between text-[0.76rem] font-semibold tracking-wide text-gray-600">
                Mật Khẩu
                <Link to="/forgot-password" className="text-[0.72rem] font-normal text-gray-400 border-b border-transparent transition-all hover:text-yellow-700 hover:border-yellow-700">Quên mật khẩu?</Link>
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  className={`w-full px-4 py-3 bg-white border-[1.5px] rounded-lg text-[0.88rem] text-gray-900 outline-none transition-all focus:ring-4 focus:ring-gray-900/5 placeholder:text-gray-400 ${errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-500/10' : 'border-gray-200 focus:border-gray-900'}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  autoComplete="current-password"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors flex items-center justify-center" onClick={() => setShow(v => !v)}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-[0.73rem] text-red-500">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button type="submit" className="mt-2 w-full px-4 py-3.5 bg-gray-900 text-white border-none rounded-lg text-[0.82rem] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all hover:bg-gray-800 hover:-translate-y-[1px] hover:shadow-lg disabled:opacity-55 disabled:cursor-not-allowed" disabled={loading}>
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Đang đăng nhập...</>
                : <><LogIn size={16} /> Đăng Nhập</>
              }
            </button>
          </form>

          <div className="text-center my-5 text-sm text-gray-500">HOẶC</div>
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
          <div className="mt-7 px-4 py-3.5 bg-gray-100 border border-dashed border-gray-300 rounded-lg flex flex-col gap-1">
            <span className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-yellow-700">Tài khoản demo</span>
            <code className="text-[0.8rem] text-gray-600 font-mono">admin@luxeshop.vn / Admin@12345</code>
          </div>
        </div>
      </div>
    </div>
  );
}
