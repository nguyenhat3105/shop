import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Clock } from 'lucide-react';
import { getFlashSaleProducts } from '../services/api';

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

function useCountdown(targetDate) {
  const calc = () => {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return { h: 0, m: 0, s: 0, expired: true };
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { h, m, s, expired: false };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  });
  return time;
}

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="bg-gray-900 text-white font-mono font-bold text-lg w-10 h-10 flex items-center justify-center rounded-lg tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] text-gray-500 mt-1 font-medium uppercase tracking-wide">{label}</span>
    </div>
  );
}

function FlashSaleCard({ product }) {
  const { h, m, s, expired } = useCountdown(product.saleEndAt);
  const discount = Math.round((1 - product.salePrice / product.price) * 100);

  return (
    <Link
      to={`/products/${product.id}`}
      className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* Sale badge */}
      <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
        -{discount}%
      </div>

      {/* Product image */}
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        <img
          src={product.imageUrl || `https://picsum.photos/seed/${product.id}/400/300`}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-yellow-700 transition-colors">
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-red-600">{formatVND(product.salePrice)}</span>
          <span className="text-sm text-gray-400 line-through">{formatVND(product.price)}</span>
        </div>

        {/* Countdown */}
        {!expired && (
          <div className="flex items-center gap-2 mt-auto">
            <Clock size={12} className="text-red-500 shrink-0" />
            <span className="text-xs text-gray-500 mr-1">Kết thúc sau</span>
            <div className="flex items-center gap-1">
              <CountdownUnit value={h} label="giờ" />
              <span className="text-gray-400 font-bold mb-3">:</span>
              <CountdownUnit value={m} label="phút" />
              <span className="text-gray-400 font-bold mb-3">:</span>
              <CountdownUnit value={s} label="giây" />
            </div>
          </div>
        )}
        {expired && (
          <p className="text-xs text-gray-400 mt-auto">Flash sale đã kết thúc</p>
        )}
      </div>
    </Link>
  );
}

export default function FlashSaleSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFlashSaleProducts()
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white/10 rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_#ffffff_0%,_transparent_70%)]" />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center animate-pulse">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <div>
              <h2 className="text-white font-serif text-3xl font-medium">Flash Sale</h2>
              <p className="text-gray-400 text-sm mt-0.5">Giá sốc – số lượng có hạn</p>
            </div>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-1"
          >
            Xem tất cả sản phẩm →
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <FlashSaleCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
