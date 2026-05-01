import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Loader2, Lock, Eye, EyeOff, CheckCircle, Gem } from 'lucide-react';
import { resetPassword } from '../services/api';

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
            <h2 className="font-serif text-[clamp(2.6rem,4vw,4rem)] font-normal text-white leading-[1.1]">Thiết Lập Mật Khẩu Mới</h2>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex items-center justify-center p-12 overflow-y-auto max-sm:p-[2rem_1.25rem] bg-[#faf9f7]">
          <div className="w-full max-w-[420px] animate-in slide-in-from-bottom-4 duration-500 fade-in">
            <div className="mb-8">
              <h1 className="font-serif text-[clamp(1.7rem,3vw,2.4rem)] font-normal text-[#111] leading-[1.15] mb-2">Liên kết không hợp lệ</h1>
              <p className="text-[0.83rem] text-[#b91c1c]">Vui lòng yêu cầu lại link đặt lại mật khẩu từ trang Quên Mật Khẩu.</p>
              <div className="mt-5">
                <Link to="/forgot-password" className="text-[#111] font-semibold border-b border-current transition-colors hover:text-[#b8955a]">Đến trang Quên Mật Khẩu</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <h2 className="font-serif text-[clamp(2.6rem,4vw,4rem)] font-normal text-white leading-[1.1]">Thiết Lập Mật Khẩu Mới</h2>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-12 overflow-y-auto max-sm:p-[2rem_1.25rem] bg-[#faf9f7]">
        <div className="w-full max-w-[420px] animate-in slide-in-from-bottom-4 duration-500 fade-in">
          <div className="mb-8">
            <h1 className="font-serif text-[clamp(1.7rem,3vw,2.4rem)] font-normal text-[#111] leading-[1.15] mb-2">Thiết Lập Mật Khẩu Mới</h1>
          </div>

          {success ? (
            <div className="flex flex-col items-center text-center gap-3">
              <CheckCircle size={48} className="text-[#3a7d52] mb-2" />
              <h3 className="font-serif text-[1.8rem] font-normal text-[#111] leading-[1.2]">Thành Công!</h3>
              <p className="text-[0.88rem] text-[#999] leading-[1.6]">
                Mật khẩu của bạn đã được cập nhật thành công.
              </p>
              <Link to="/login" className="mt-4 w-full p-[0.85rem_1rem] bg-[#111] text-white border-none rounded-md text-[0.82rem] font-bold tracking-[0.1em] uppercase flex items-center justify-center gap-2 transition-all hover:bg-[#222] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                Đăng nhập ngay
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-[1.1rem]">
              {error && <div className="p-[0.75rem_1rem] rounded-md text-[0.82rem] mb-2 flex items-start gap-2 animate-in slide-in-from-top-2 duration-300 bg-[#c0392b]/10 border border-[#c0392b]/25 text-[#c0392b]">{error}</div>}

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.76rem] font-semibold tracking-[0.04em] text-[#555]">Mật Khẩu Mới</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
                  <input 
                    type={showPw ? 'text' : 'password'} 
                    placeholder="Nhập mật khẩu mới..." 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-[0.75rem] bg-white border border-black/10 focus:border-[#111] focus:ring-[#111]/5 rounded-md text-[0.88rem] text-[#111] outline-none transition-all focus:ring-4 appearance-none placeholder:text-[#999]"
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] flex items-center justify-center transition-colors hover:text-[#111]" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.76rem] font-semibold tracking-[0.04em] text-[#555]">Xác Nhận Mật Khẩu</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
                  <input 
                    type={showPw ? 'text' : 'password'} 
                    placeholder="Nhập lại mật khẩu mới..." 
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full pl-10 pr-10 py-[0.75rem] bg-white border border-black/10 focus:border-[#111] focus:ring-[#111]/5 rounded-md text-[0.88rem] text-[#111] outline-none transition-all focus:ring-4 appearance-none placeholder:text-[#999]"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="mt-2 w-full p-[0.85rem_1rem] bg-[#111] text-white border-none rounded-md text-[0.82rem] font-bold tracking-[0.1em] uppercase flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-[#222] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] disabled:opacity-55 disabled:cursor-not-allowed">
                {loading 
                  ? <><Loader2 size={16} className="animate-spin" /> Đang cập nhật...</> 
                  : 'Cập Nhật Mật Khẩu'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
