import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight, Info, Trash2, ChevronRight } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWishlist, removeFromWishlist } from '../services/api';
import ProductCard from '../components/ProductCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import { toast } from 'react-hot-toast';

export default function WishlistPage() {
  const queryClient = useQueryClient();

  const { data: wishlist, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => getWishlist().then(r => r.data),
  });

  const removeMutation = useMutation({
    mutationFn: (id) => removeFromWishlist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Đã xóa khỏi danh sách yêu thích');
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 min-h-[80vh]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-1">
          <span className="text-[10px] font-black tracking-[0.3em] text-rose-500 uppercase">BST Của Bạn</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight">Danh sách yêu thích</h1>
          <p className="text-slate-500 text-sm max-w-md font-medium">Lưu giữ những món đồ bạn yêu thích để dễ dàng mua sắm sau này.</p>
        </div>
        
        {wishlist?.length > 0 && (
           <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 flex items-center gap-3">
              <Heart size={20} className="text-rose-500" fill="currentColor" />
              <span className="text-sm font-bold text-slate-900">{wishlist.length} SẢN PHẨM</span>
           </div>
        )}
      </div>

      {isLoading ? (
        <SkeletonGrid count={4} />
      ) : !wishlist || wishlist.length === 0 ? (
        <div className="bg-slate-50 rounded-[3rem] py-32 text-center border-2 border-dashed border-slate-200">
           <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 flex items-center justify-center mx-auto mb-8">
             <Heart size={40} className="text-rose-100" />
           </div>
           <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Chưa có sản phẩm yêu thích</h2>
           <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">Có vẻ như bạn chưa lưu sản phẩm nào. Hãy khám phá cửa hàng và chọn những món đồ ưng ý nhé!</p>
           <Link 
             to="/"
             className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl text-xs font-black tracking-widest uppercase hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-300 transition-all active:scale-95"
           >
             KHÁM PHÁ NGAY <ArrowRight size={18} />
           </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlist.map((product, i) => (
            <div key={product.id} className="relative group">
               <ProductCard product={product} index={i} />
               <button 
                 onClick={() => removeMutation.mutate(product.id)}
                 className="absolute top-4 right-4 z-30 w-10 h-10 bg-white/90 backdrop-blur-md text-rose-500 rounded-2xl flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                 title="Xóa khỏi yêu thích"
               >
                 <Trash2 size={18} />
               </button>
            </div>
          ))}
        </div>
      )}

      {/* Recommended Section for empty state */}
      {!isLoading && wishlist?.length === 0 && (
         <div className="mt-20 pt-20 border-t border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-8 text-center uppercase tracking-widest">Gợi ý dành cho bạn</h3>
            {/* We could fetch some random products here */}
            <div className="flex justify-center">
               <Link to="/categories" className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2">
                 Xem tất cả danh mục <ChevronRight size={16} />
               </Link>
            </div>
         </div>
      )}
    </div>
  );
}
