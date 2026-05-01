import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Heart, Star, Zap, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { cn } from './ui/Skeleton';
import { addToWishlist, removeFromWishlist, checkInWishlist } from '../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

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
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [adding,  setAdding]  = useState(false);

  // Check if product is in wishlist
  const { data: isInWishlist } = useQuery({
    queryKey: ['wishlist-check', product.id],
    queryFn: () => checkInWishlist(product.id).then(r => r.data),
    enabled: !!user,
  });

  const wishlistMutation = useMutation({
    mutationFn: () => {
      if (isInWishlist) return removeFromWishlist(product.id);
      return addToWishlist(product.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist-check', product.id] });
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success(isInWishlist ? 'Đã xóa khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích');
    },
    onError: () => {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  });

  const originalPrice = getOriginalPrice(product.price, product.id);

  const discountPct   = originalPrice
    ? Math.round((1 - product.price / originalPrice) * 100)
    : 0;

  const rating      = product.averageRating ?? (3.5 + (product.id % 3) * 0.5);
  const reviewCount = product.reviewCount    ?? (Math.abs(product.id * 17) % 200 + 12);

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
    if (!user) {
      toast.error('Vui lòng đăng nhập để sử dụng tính năng này');
      return;
    }
    wishlistMutation.mutate();
  };

  const isNew   = product.id % 7 === 0;
  const isHot   = product.id % 5 === 0 && !isNew;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <article 
      className="group bg-white rounded-3xl border border-slate-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1.5 animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'both' }}
    >
      {/* Image Section */}
      <Link to={`/products/${product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-slate-50">
        <img
          src={product.imageUrl || `https://picsum.photos/seed/${product.id}/600/800`}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {discountPct > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-1.5 rounded-xl shadow-lg shadow-rose-500/30 tracking-tight">
              -{discountPct}%
            </span>
          )}
          {isNew && (
            <span className="bg-indigo-600 text-white text-[10px] font-black px-2.5 py-1.5 rounded-xl shadow-lg shadow-indigo-600/30 tracking-widest">
              NEW
            </span>
          )}
          {isHot && (
            <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-1.5 rounded-xl shadow-lg shadow-amber-500/30 flex items-center gap-1 tracking-widest">
              <Zap size={10} fill="currentColor" /> HOT
            </span>
          )}
        </div>

        {/* Stock Status */}
        {product.stock === 0 ? (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[3px] flex items-center justify-center z-20">
            <span className="bg-white/95 text-slate-900 px-5 py-2.5 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase shadow-xl">
              HẾT HÀNG
            </span>
          </div>
        ) : lowStock && (
          <div className="absolute bottom-4 left-4 z-10">
            <span className="bg-white/90 backdrop-blur-md text-rose-600 px-3 py-1.5 rounded-xl text-[10px] font-bold border border-rose-100 shadow-sm">
              Chỉ còn {product.stock}
            </span>
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 z-10">
          <button 
            onClick={handleLike}
            disabled={wishlistMutation.isPending}
            className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-xl backdrop-blur-md",
              isInWishlist ? "bg-rose-500 text-white" : "bg-white/90 text-slate-400 hover:text-rose-500"
            )}
          >
            <Heart size={20} fill={isInWishlist ? "currentColor" : "none"} />
          </button>

          <button className="w-10 h-10 bg-white/90 text-slate-400 hover:text-slate-900 rounded-2xl flex items-center justify-center transition-all shadow-xl backdrop-blur-md">
            <Eye size={20} />
          </button>
        </div>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0 z-20">
           <button 
             onClick={handleAdd}
             disabled={product.stock === 0 || adding}
             className={cn(
               "w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-xs font-black tracking-widest uppercase transition-all shadow-2xl",
               adding 
                ? "bg-emerald-500 text-white scale-95" 
                : "bg-slate-900 text-white hover:bg-slate-800 active:scale-95"
             )}
           >
             {adding ? (
               <><span>ĐÃ THÊM</span></>
             ) : (
               <>
                 <ShoppingBag size={18} />
                 <span>THÊM VÀO GIỎ</span>
               </>
             )}
           </button>
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center gap-2">
          {product.categoryName && (
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {product.categoryName}
            </span>
          )}
          <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-xl border border-amber-100">
            <Star size={12} className="text-amber-500" fill="currentColor" />
            <span className="text-[11px] font-bold text-amber-700">{rating}</span>
            <span className="text-[10px] text-amber-400 font-medium border-l border-amber-200 pl-1.5 ml-0.5">
              {reviewCount}
            </span>
          </div>
        </div>

        <Link to={`/products/${product.id}`} className="block group/title">
          <h3 className="font-bold text-slate-800 leading-snug group-hover/title:text-slate-500 transition-colors line-clamp-2 min-h-[2.8rem] text-sm md:text-base">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-end justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 tracking-tight">
              {formatVND(product.price)}
            </span>
            {originalPrice && (
              <span className="text-xs text-slate-400 line-through font-medium">
                {formatVND(originalPrice)}
              </span>
            )}
          </div>
          
          <button 
            onClick={handleAdd}
            disabled={product.stock === 0 || adding}
            className={cn(
              "md:hidden w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg",
              adding ? "bg-emerald-500 text-white shadow-emerald-200" : "bg-slate-100 text-slate-900 shadow-slate-100"
            )}
          >
            <ShoppingCart size={22} />
          </button>
        </div>
      </div>
    </article>
  );
}
