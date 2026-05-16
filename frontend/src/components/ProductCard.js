import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Heart, Star, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const getOriginalPrice = (price, id) => {
  const discounts = [0, 0, 0, 10, 15, 20, 0, 25, 0, 30, 0, 0];
  const discount = discounts[id % discounts.length];
  if (discount === 0) return null;
  return Math.round(price / (1 - discount / 100) / 1000) * 1000;
};

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const [liked, setLiked] = useState(false);
  const [adding, setAdding] = useState(false);

  const originalPrice = getOriginalPrice(product.price, product.id);
  const discountPct = originalPrice
    ? Math.round((1 - product.price / originalPrice) * 100)
    : 0;

  const rating = product.averageRating ?? (3.5 + (product.id % 3) * 0.5);
  const reviewCount = product.reviewCount ?? (Math.abs(product.id * 17) % 200 + 12);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0 || adding) return;
    setAdding(true);
    addToCart(product);
    setTimeout(() => setAdding(false), 900);
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(v => !v);
  };

  const isNew = product.id % 7 === 0;
  const isHot = product.id % 5 === 0 && !isNew;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <article
      className="card-base group hover:shadow-lg hover:-translate-y-1"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* ── Image Block ── */}
      <Link
        to={`/products/${product.id}`}
        className="relative block overflow-hidden aspect-product bg-gray-100"
      >
        <img
          src={product.imageUrl || `https://picsum.photos/seed/${product.id}/400/520`}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {discountPct > 0 && (
            <span className="badge badge-sale">-{discountPct}%</span>
          )}
          {isNew && <span className="badge badge-new">Mới</span>}
          {isHot && (
            <span className="badge badge-hot flex items-center">
              <Zap size={10} /> Hot
            </span>
          )}
        </div>

        {/* Bottom badge */}
        {lowStock && (
          <span className="absolute bottom-2.5 left-2.5 bg-orange-500/90 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded z-10">
            Còn {product.stock} SP
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute bottom-2.5 left-2.5 bg-black/70 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded z-10">
            Hết hàng
          </span>
        )}

        {/* Hover actions */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-250 z-10">
          <Link
            to={`/products/${product.id}`}
            onClick={(e) => e.stopPropagation()}
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur border border-black/5 flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-all hover:scale-110"
            title="Xem chi tiết"
          >
            <Eye size={16} />
          </Link>
          <button
            onClick={handleLike}
            className={`w-9 h-9 rounded-full backdrop-blur border flex items-center justify-center transition-all hover:scale-110 ${
              liked
                ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-500 hover:text-white'
                : 'bg-white/90 border-black/5 text-gray-900 hover:bg-gray-900 hover:text-white'
            }`}
            title={liked ? 'Đã yêu thích' : 'Yêu thích'}
          >
            <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </Link>

      {/* ── Card Body ── */}
      <div className="p-3.5 flex flex-col gap-1.5">
        {product.categoryName && (
          <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-600">
            {product.categoryName}
          </span>
        )}

        <Link
          to={`/products/${product.id}`}
          className="text-sm font-medium text-gray-900 leading-snug line-clamp-2 hover:text-amber-600 transition-colors"
        >
          {product.name}
        </Link>

        {/* Stars + Reviews */}
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={11}
                fill={s <= Math.round(rating) ? 'currentColor' : 'none'}
                className={s <= Math.round(rating) ? 'text-amber-400' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-[11px] text-gray-500">({reviewCount})</span>
        </div>

        {/* Price + Add button */}
        <div className="flex items-center justify-between gap-2 mt-1">
          <div className="flex flex-col">
            <span className="text-base font-bold text-gray-900 tracking-tight">
              {formatVND(product.price)}
            </span>
            {originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                {formatVND(originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={product.stock === 0 || adding}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              adding
                ? 'bg-green-500 text-white'
                : product.stock === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-amber-600 hover:scale-105'
            }`}
          >
            <ShoppingBag size={14} />
            <span>{adding ? '✓' : 'Thêm'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
