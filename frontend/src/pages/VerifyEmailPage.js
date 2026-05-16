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
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 pt-16">
      {/* Left panel */}
      <div className="hidden md:flex relative items-end p-14 overflow-hidden bg-gray-900 min-h-[calc(100vh-64px)] group">
        <div className="relative z-20 flex flex-col gap-6">
          <div className="flex items-center gap-2.5 text-white text-lg font-bold tracking-widest">
            <Gem size={22} className="text-yellow-600" />
            <span>LUXE<span className="font-light opacity-60 ml-0.5 tracking-[0.3em] text-[0.7em]">SHOP</span></span>
          </div>
          <h2 className="text-[clamp(2.6rem,4vw,4rem)] font-normal text-white leading-[1.1] font-serif">Xác Thực<br />Email</h2>
          <p className="text-sm text-white/55 leading-relaxed max-w-[320px]">Chỉ một bước nữa để hoàn tất đăng ký tài khoản của bạn.</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/40 to-yellow-700/15 z-10" />
        <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=85" alt="" className="absolute inset-0 w-full h-full object-cover opacity-35 transition-transform duration-[8000ms] group-hover:scale-105" />
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-8 md:p-12 bg-gray-50 overflow-y-auto min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-[420px]">
          <div className="flex items-center justify-center min-h-[300px]">

            {status === 'loading' && (
              <div className="flex flex-col items-center text-center gap-4 max-w-[360px] animate-fadeUp">
                <Loader2 size={48} className="animate-spin text-gray-400" />
                <h2 className="text-3xl font-normal text-gray-900 font-serif">Đang xác thực...</h2>
                <p className="text-sm text-gray-500 leading-relaxed">Vui lòng chờ trong giây lát.</p>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center text-center gap-4 max-w-[360px] animate-fadeUp">
                <CheckCircle size={56} className="text-green-600" />
                <h2 className="text-3xl font-normal text-gray-900 font-serif">Xác Thực Thành Công!</h2>
                <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
                <Link to="/login" className="mt-4 w-full px-4 py-3.5 bg-gray-900 text-white rounded-lg text-[0.82rem] font-bold tracking-widest uppercase inline-flex items-center justify-center gap-2 transition-all hover:bg-gray-800 hover:-translate-y-[1px] hover:shadow-lg">
                  Đăng Nhập Ngay →
                </Link>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center text-center gap-4 max-w-[360px] animate-fadeUp">
                <XCircle size={56} className="text-red-500" />
                <h2 className="text-3xl font-normal text-gray-900 font-serif">Xác Thực Thất Bại</h2>
                <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
                <div className="flex flex-col gap-2.5 w-full mt-2">
                  <Link to="/register" className="w-full px-4 py-3.5 bg-gray-900 text-white rounded-lg text-[0.82rem] font-bold tracking-widest uppercase inline-flex items-center justify-center gap-2 transition-all hover:bg-gray-800 hover:shadow-lg">
                    Đăng Ký Lại
                  </Link>
                  <Link to="/" className="w-full px-4 py-3 border border-gray-200 bg-white text-gray-700 rounded-lg text-[0.82rem] font-semibold inline-flex items-center justify-center gap-2 transition-all hover:border-gray-900 hover:bg-gray-50">
                    Về Trang Chủ
                  </Link>
                </div>
              </div>
            )}

            {status === 'notoken' && (
              <div className="flex flex-col items-center text-center gap-4 max-w-[360px] animate-fadeUp">
                <XCircle size={56} className="text-red-500" />
                <h2 className="text-3xl font-normal text-gray-900 font-serif">Link Không Hợp Lệ</h2>
                <p className="text-sm text-gray-500 leading-relaxed">Không tìm thấy token xác thực. Vui lòng kiểm tra lại link trong email.</p>
                <Link to="/register" className="mt-4 w-full px-4 py-3.5 bg-gray-900 text-white rounded-lg text-[0.82rem] font-bold tracking-widest uppercase inline-flex items-center justify-center gap-2 transition-all hover:bg-gray-800 hover:shadow-lg">
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
