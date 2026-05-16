import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Mail, CheckCircle } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pt-16">
      <div className="w-full max-w-md animate-fadeUp">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="mb-7">
            <div className="text-[0.62rem] font-bold tracking-[0.28em] uppercase text-yellow-700 mb-2.5">Khôi Phục</div>
            <h1 className="text-3xl font-normal text-gray-900 leading-tight mb-2 font-serif">Quên Mật Khẩu?</h1>
            {!success && <p className="text-sm text-gray-500">Nhập email của bạn để nhận liên kết khôi phục mật khẩu.</p>}
          </div>

          {success ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <CheckCircle size={52} className="text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">Đã Gửi Email!</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Chúng tôi đã gửi một liên kết khôi phục mật khẩu đến email <strong className="text-gray-800">{email}</strong>. Vui lòng kiểm tra hộp thư (và cả thư mục Spam).
              </p>
              <Link to="/login" className="mt-2 w-full px-4 py-3.5 bg-gray-900 text-white rounded-lg text-[0.82rem] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all hover:bg-gray-800 hover:-translate-y-[1px] hover:shadow-lg">
                Trở về Đăng nhập
              </Link>
            </div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {error && <div className="px-4 py-3 rounded-lg text-[0.82rem] bg-red-50 border border-red-200 text-red-500">{error}</div>}

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.76rem] font-semibold tracking-wide text-gray-600">Địa chỉ Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Nhập email đã đăng ký..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border-[1.5px] border-gray-200 rounded-lg text-[0.88rem] text-gray-900 outline-none transition-all focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <button type="submit" className="mt-2 w-full px-4 py-3.5 bg-gray-900 text-white border-none rounded-lg text-[0.82rem] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all hover:bg-gray-800 hover:-translate-y-[1px] hover:shadow-lg disabled:opacity-55 disabled:cursor-not-allowed" disabled={loading}>
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Đang gửi yêu cầu...</>
                  : 'Gửi Link Khôi Phục'}
              </button>

              <div className="text-center mt-3">
                <Link to="/login" className="text-sm text-gray-900 font-semibold border-b border-current transition-colors hover:text-yellow-700">Quay lại Đăng nhập</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
