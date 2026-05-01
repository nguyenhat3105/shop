import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Gem } from 'lucide-react';
import { verifyEmail } from '../services/api';

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
          <h2 className="font-serif text-[clamp(2.6rem,4vw,4rem)] font-normal text-white leading-[1.1]">Xác Thực<br />Email</h2>
          <p className="text-[0.9rem] text-white/55 leading-[1.7] max-w-[320px]">Chỉ một bước nữa để hoàn tất đăng ký tài khoản của bạn.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-12 overflow-y-auto max-sm:p-[2rem_1.25rem] bg-[#faf9f7]">
        <div className="w-full max-w-[420px] animate-in slide-in-from-bottom-4 duration-500 fade-in">
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem-6rem)]">

            {status === 'loading' && (
              <div className="flex flex-col items-center text-center gap-[0.85rem] max-w-[360px]">
                <Loader2 size={48} className="animate-spin text-[#999] mb-2" />
                <h2 className="font-serif text-[1.8rem] font-normal text-[#111] leading-[1.2]">Đang xác thực...</h2>
                <p className="text-[0.88rem] text-[#999] leading-[1.65]">Vui lòng chờ trong giây lát.</p>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center text-center gap-[0.85rem] max-w-[360px]">
                <CheckCircle size={56} className="text-[#3a7d52] animate-in zoom-in duration-500 mb-2" />
                <h2 className="font-serif text-[1.8rem] font-normal text-[#111] leading-[1.2]">Xác Thực Thành Công!</h2>
                <p className="text-[0.88rem] text-[#999] leading-[1.65]">{message}</p>
                <Link to="/login" className="mt-6 w-full p-[0.85rem_1rem] bg-[#111] text-white border-none rounded-md text-[0.82rem] font-bold tracking-[0.1em] uppercase flex items-center justify-center gap-2 transition-all hover:bg-[#222] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                  Đăng Nhập Ngay →
                </Link>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center text-center gap-[0.85rem] max-w-[360px]">
                <XCircle size={56} className="text-[#c0392b] animate-in zoom-in duration-500 mb-2" />
                <h2 className="font-serif text-[1.8rem] font-normal text-[#111] leading-[1.2]">Xác Thực Thất Bại</h2>
                <p className="text-[0.88rem] text-[#999] leading-[1.65]">{message}</p>
                <div className="flex flex-col gap-2 w-full mt-4">
                  <Link to="/register" className="w-full p-[0.85rem_1rem] bg-[#111] text-white border-none rounded-md text-[0.82rem] font-bold tracking-[0.1em] uppercase flex items-center justify-center gap-2 transition-all hover:bg-[#222] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                    Đăng Ký Lại
                  </Link>
                  <Link to="/" className="mt-2 w-full p-[0.75rem_1rem] bg-transparent text-[#555] border-[1.5px] border-black/10 rounded-md text-[0.82rem] font-semibold tracking-[0.08em] uppercase flex items-center justify-center gap-2 transition-all hover:border-black/20 hover:text-[#111] hover:bg-[#f5f3ef]">
                    Về Trang Chủ
                  </Link>
                </div>
              </div>
            )}

            {status === 'notoken' && (
              <div className="flex flex-col items-center text-center gap-[0.85rem] max-w-[360px]">
                <XCircle size={56} className="text-[#c0392b] animate-in zoom-in duration-500 mb-2" />
                <h2 className="font-serif text-[1.8rem] font-normal text-[#111] leading-[1.2]">Link Không Hợp Lệ</h2>
                <p className="text-[0.88rem] text-[#999] leading-[1.65]">Không tìm thấy token xác thực. Vui lòng kiểm tra lại link trong email.</p>
                <Link to="/register" className="mt-6 w-full p-[0.85rem_1rem] bg-[#111] text-white border-none rounded-md text-[0.82rem] font-bold tracking-[0.1em] uppercase flex items-center justify-center gap-2 transition-all hover:bg-[#222] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
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
