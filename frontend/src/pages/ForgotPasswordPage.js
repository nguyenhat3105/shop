import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Mail, CheckCircle, Gem } from 'lucide-react';
import { forgotPassword } from '../services/api';

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
    <div className="grid grid-cols-2 min-h-screen pt-16 max-md:grid-cols-1 bg-[#faf9f7]">
      {/* Left panel */}
      <div className="relative flex items-end p-14 overflow-hidden bg-[#111] min-h-[calc(100vh-4rem)] max-md:hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-[#b8955a]/15 z-10" />
        <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=85" alt="" className="absolute inset-0 w-full h-full object-cover opacity-35 transition-transform duration-[8s] ease-out group-hover:scale-105" />
        <div className="relative z-20 flex flex-col gap-6">
          <div className="flex items-center gap-2.5 text-white text-[1.2rem] font-bold tracking-[0.12em]">
            <Gem size={22} className="text-[#e2c186]" />
            <span>LUXE<span className="font-light opacity-60 ml-[2px] tracking-[0.3em] text-[0.7em]">SHOP</span></span>
          </div>
          <h2 className="font-serif text-[clamp(2.6rem,4vw,4rem)] font-normal text-white leading-[1.1]">Quên Mật Khẩu</h2>
          <p className="text-[0.9rem] text-white/55 leading-[1.7] max-w-[320px]">Nhập email của bạn để nhận liên kết khôi phục mật khẩu.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-12 overflow-y-auto max-sm:p-[2rem_1.25rem] bg-[#faf9f7]">
        <div className="w-full max-w-[420px] animate-in slide-in-from-bottom-4 duration-500 fade-in">
          <div className="mb-8">
            <h1 className="font-serif text-[clamp(1.7rem,3vw,2.4rem)] font-normal text-[#111] leading-[1.15] mb-2">Quên Mật Khẩu</h1>
            {!success && <p className="text-[0.83rem] text-[#999]">Nhập email của bạn để nhận liên kết khôi phục mật khẩu.</p>}
          </div>

          {success ? (
            <div className="flex flex-col items-center text-center gap-3">
              <CheckCircle size={48} className="text-[#3a7d52] mb-2" />
              <h3 className="font-serif text-[1.8rem] font-normal text-[#111] leading-[1.2]">Đã Gửi Email!</h3>
              <p className="text-[0.88rem] text-[#999] leading-[1.6]">
                Chúng tôi đã gửi một liên kết khôi phục mật khẩu đến email <strong>{email}</strong>. 
                Vui lòng kiểm tra hộp thư của bạn (và cả thư mục Spam).
              </p>
              <Link to="/login" className="mt-4 w-full p-[0.85rem_1rem] bg-[#111] text-white border-none rounded-md text-[0.82rem] font-bold tracking-[0.1em] uppercase flex items-center justify-center gap-2 transition-all hover:bg-[#222] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                Trở về Đăng nhập
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-[1.1rem]">
              {error && <div className="p-[0.75rem_1rem] rounded-md text-[0.82rem] mb-2 flex items-start gap-2 animate-in slide-in-from-top-2 duration-300 bg-[#c0392b]/10 border border-[#c0392b]/25 text-[#c0392b]">{error}</div>}

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.76rem] font-semibold tracking-[0.04em] text-[#555]">Địa chỉ Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
                  <input 
                    type="email" 
                    placeholder="Nhập email đã đăng ký..." 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-[0.75rem] bg-white border border-black/10 focus:border-[#111] focus:ring-[#111]/5 rounded-md text-[0.88rem] text-[#111] outline-none transition-all focus:ring-4 appearance-none placeholder:text-[#999]"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="mt-2 w-full p-[0.85rem_1rem] bg-[#111] text-white border-none rounded-md text-[0.82rem] font-bold tracking-[0.1em] uppercase flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-[#222] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] disabled:opacity-55 disabled:cursor-not-allowed">
                {loading 
                  ? <><Loader2 size={16} className="animate-spin" /> Đang gửi yêu cầu...</> 
                  : 'Gửi Link Khôi Phục'}
              </button>

              <div className="text-center mt-5">
                <Link to="/login" className="text-[#111] font-semibold border-b border-current transition-colors hover:text-[#b8955a]">Quay lại Đăng nhập</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
