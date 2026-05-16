import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Loader2, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
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
    if (!token) { setError('Token không hợp lệ hoặc bị thiếu.'); return; }
    if (password.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự.'); return; }
    if (password !== confirm) { setError('Mật khẩu xác nhận không khớp.'); return; }

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pt-16">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center animate-fadeUp">
          <h1 className="text-2xl font-normal text-gray-900 mb-3 font-serif">Liên kết không hợp lệ</h1>
          <p className="text-sm text-red-600 mb-6">Vui lòng yêu cầu lại link đặt lại mật khẩu từ trang Quên Mật Khẩu.</p>
          <Link to="/forgot-password" className="text-gray-900 font-semibold border-b border-current transition-colors hover:text-yellow-700">Đến trang Quên Mật Khẩu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pt-16">
      <div className="w-full max-w-md animate-fadeUp">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="mb-7">
            <div className="text-[0.62rem] font-bold tracking-[0.28em] uppercase text-yellow-700 mb-2.5">Đặt Lại</div>
            <h1 className="text-3xl font-normal text-gray-900 leading-tight mb-2 font-serif">Thiết Lập Mật Khẩu Mới</h1>
          </div>

          {success ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <CheckCircle size={52} className="text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">Thành Công!</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Mật khẩu của bạn đã được cập nhật thành công.</p>
              <Link to="/login" className="mt-2 w-full px-4 py-3.5 bg-gray-900 text-white rounded-lg text-[0.82rem] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all hover:bg-gray-800 hover:-translate-y-[1px] hover:shadow-lg">
                Đăng nhập ngay
              </Link>
            </div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {error && <div className="px-4 py-3 rounded-lg text-[0.82rem] bg-red-50 border border-red-200 text-red-500">{error}</div>}

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.76rem] font-semibold tracking-wide text-gray-600">Mật Khẩu Mới</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu mới..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-white border-[1.5px] border-gray-200 rounded-lg text-[0.88rem] text-gray-900 outline-none transition-all focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5 placeholder:text-gray-400"
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.76rem] font-semibold tracking-wide text-gray-600">Xác Nhận Mật Khẩu</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu mới..."
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border-[1.5px] border-gray-200 rounded-lg text-[0.88rem] text-gray-900 outline-none transition-all focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <button type="submit" className="mt-2 w-full px-4 py-3.5 bg-gray-900 text-white border-none rounded-lg text-[0.82rem] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all hover:bg-gray-800 hover:-translate-y-[1px] hover:shadow-lg disabled:opacity-55 disabled:cursor-not-allowed" disabled={loading}>
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
