import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Gift, Star, ArrowLeft, History, RefreshCw, Loader2, TrendingUp } from 'lucide-react';
import { getLoyaltyBalance, getLoyaltyHistory, redeemLoyaltyPoints } from '../services/api';
import { useAuth } from '../context/AuthContext';

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const REDEEM_RATE = 100;   // 100 điểm
const REDEEM_VALUE = 10000; // = 10.000đ

function PointBadge({ type }) {
  return type === 'EARN'
    ? <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700">+ Tích điểm</span>
    : <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">- Đổi điểm</span>;
}

export default function LoyaltyPage() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyPage, setHistoryPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redeemPoints, setRedeemPoints] = useState(100);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemResult, setRedeemResult] = useState(null);
  const [error, setError] = useState('');

  const loadData = async (page = 0) => {
    try {
      const [balRes, histRes] = await Promise.all([
        getLoyaltyBalance(),
        getLoyaltyHistory(page, 8),
      ]);
      setBalance(balRes.data);
      setHistory(histRes.data.content || []);
      setTotalPages(histRes.data.totalPages || 0);
      setHistoryPage(page);
    } catch {
      setError('Không thể tải dữ liệu điểm thưởng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleRedeem = async () => {
    if (redeemPoints < 100) return;
    setRedeeming(true);
    setRedeemResult(null);
    setError('');
    try {
      const res = await redeemLoyaltyPoints(redeemPoints);
      setRedeemResult(res.data);
      loadData(); // refresh balance
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Đổi điểm thất bại.');
    } finally {
      setRedeeming(false);
    }
  };

  if (!user) return (
    <div className="min-h-screen pt-[68px] bg-gray-50 flex flex-col items-center justify-center gap-4">
      <Star size={48} className="text-gray-200" />
      <p className="text-gray-500 font-medium">Vui lòng đăng nhập để xem điểm thưởng.</p>
      <Link to="/login" className="btn btn-dark">Đăng nhập</Link>
    </div>
  );

  return (
    <div className="min-h-screen pt-[68px] bg-gray-50 pb-20 animate-fadeUp">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl pt-10">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-gray-500 hover:text-gray-900 transition-colors mb-8">
          <ArrowLeft size={15} /> Quay lại
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[0.62rem] font-bold tracking-[0.28em] uppercase text-yellow-700 mb-2">
            <TrendingUp size={12} /> Chương trình khách hàng thân thiết
          </div>
          <h1 className="text-3xl font-normal text-gray-900 font-serif">Điểm thưởng của bạn</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={36} className="animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: balance + redeem */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              {/* Balance card */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-4 opacity-70">
                  <Star size={14} />
                  <span className="text-xs font-bold uppercase tracking-wider">Tổng điểm</span>
                </div>
                <div className="text-5xl font-bold font-mono mb-1">
                  {balance?.points?.toLocaleString() ?? 0}
                </div>
                <p className="text-sm opacity-60">điểm tích lũy</p>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs opacity-60">Tương đương</p>
                  <p className="text-lg font-semibold text-yellow-400">
                    {formatVND(balance?.equivalentVND ?? 0)}
                  </p>
                </div>
              </div>

              {/* Earn rate info */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
                  <Gift size={16} className="text-yellow-600" /> Tỷ lệ tích điểm
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex justify-between">
                    <span>Mỗi 1.000đ mua hàng</span>
                    <span className="font-semibold text-green-600">+1 điểm</span>
                  </li>
                  <li className="flex justify-between">
                    <span>100 điểm đổi được</span>
                    <span className="font-semibold text-purple-600">{formatVND(REDEEM_VALUE)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Voucher hiệu lực</span>
                    <span className="font-semibold">30 ngày</span>
                  </li>
                </ul>
              </div>

              {/* Redeem form */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 text-sm flex items-center gap-2">
                  <RefreshCw size={16} className="text-purple-600" /> Đổi điểm lấy voucher
                </h3>

                {redeemResult ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <Gift size={28} className="text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-green-800">{redeemResult.message}</p>
                    <div className="mt-3 bg-white border border-green-300 rounded-lg px-4 py-2">
                      <p className="text-xs text-gray-500 mb-1">Mã voucher của bạn</p>
                      <p className="font-mono font-bold text-green-700 text-lg tracking-widest">
                        {redeemResult.couponCode}
                      </p>
                    </div>
                    <button
                      onClick={() => setRedeemResult(null)}
                      className="mt-3 text-xs text-gray-500 hover:text-gray-700"
                    >
                      Đổi thêm
                    </button>
                  </div>
                ) : (
                  <>
                    {error && (
                      <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">{error}</p>
                    )}
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                          Số điểm muốn đổi (bội số của 100)
                        </label>
                        <input
                          type="number"
                          min={100}
                          step={100}
                          max={balance?.points ?? 0}
                          value={redeemPoints}
                          onChange={(e) => setRedeemPoints(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 transition-colors"
                        />
                        <p className="text-xs text-gray-500 mt-1.5">
                          Nhận được: <strong className="text-purple-600">{formatVND(Math.floor(redeemPoints / REDEEM_RATE) * REDEEM_VALUE)}</strong>
                        </p>
                      </div>
                      <button
                        onClick={handleRedeem}
                        disabled={redeeming || redeemPoints < 100 || redeemPoints > (balance?.points ?? 0)}
                        className="w-full btn btn-dark text-sm disabled:opacity-50"
                      >
                        {redeeming ? <><Loader2 size={14} className="animate-spin" /> Đang đổi...</> : 'Đổi ngay'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right: history */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-2.5 p-5 border-b border-gray-100">
                  <History size={16} className="text-gray-500" />
                  <h2 className="font-semibold text-gray-900">Lịch sử điểm</h2>
                </div>

                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                    <Star size={40} className="mb-3 opacity-30" />
                    <p className="text-sm">Chưa có giao dịch nào</p>
                    <Link to="/" className="mt-4 text-sm font-semibold text-gray-700 hover:text-gray-900">
                      Mua sắm ngay →
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="divide-y divide-gray-100">
                      {history.map((tx) => (
                        <div key={tx.id} className="flex items-start justify-between p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col gap-1">
                            <PointBadge type={tx.type} />
                            <p className="text-sm text-gray-700 mt-1">{tx.description}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(tx.createdAt).toLocaleDateString('vi-VN', {
                                year: 'numeric', month: 'long', day: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <span className={`text-base font-bold tabular-nums shrink-0 ml-4 ${tx.points > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {tx.points > 0 ? '+' : ''}{tx.points}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-100">
                        <button
                          disabled={historyPage === 0}
                          onClick={() => loadData(historyPage - 1)}
                          className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:border-gray-900 transition-colors"
                        >
                          ← Trước
                        </button>
                        <span className="text-xs text-gray-500">{historyPage + 1} / {totalPages}</span>
                        <button
                          disabled={historyPage >= totalPages - 1}
                          onClick={() => loadData(historyPage + 1)}
                          className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:border-gray-900 transition-colors"
                        >
                          Sau →
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
