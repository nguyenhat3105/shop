import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag, ArrowLeft, Star, Truck, Shield, RotateCcw,
  Eye, ChevronLeft, ChevronRight, Heart, Share2, Info, CheckCircle2
} from 'lucide-react';
import { getProductById, getReviews, addReview, getRelatedProducts, addToWishlist, removeFromWishlist, checkInWishlist } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { SkeletonProductDetail } from '../components/SkeletonCard';
import { cn } from '../components/ui/Skeleton';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, openModal } = useCart();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [activeImage, setActiveImage] = useState('');
  const [selectedSize,  setSelectedSize]  = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty]     = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('desc'); // 'desc' | 'reviews'
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  // Fetch Product
  const { data: product, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id).then(r => r.data),
  });

  // Fetch Reviews
  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => getReviews(id, 0, 20).then(r => r.data),
    enabled: !!id,
  });

  // Fetch Related Products
  const { data: relatedProducts } = useQuery({
    queryKey: ['related-products', product?.categoryId, id],
    queryFn: () => getRelatedProducts(product.categoryId, id).then(r => r.data),
    enabled: !!product?.categoryId,
  });

  // Check Wishlist
  const { data: isInWishlist } = useQuery({
    queryKey: ['wishlist-check', id],
    queryFn: () => checkInWishlist(id).then(r => r.data),
    enabled: !!user && !!id,
  });

  const wishlistMutation = useMutation({
    mutationFn: () => {
      if (isInWishlist) return removeFromWishlist(id);
      return addToWishlist(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist-check', id] });
      toast.success(isInWishlist ? 'Đã xóa khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích');
    },
  });

  const reviewMutation = useMutation({
    mutationFn: (data) => addReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
      setReviewText('');
      setRating(5);
      toast.success('Cảm ơn bạn đã đánh giá sản phẩm!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Có lỗi khi gửi đánh giá');
    }
  });

  useEffect(() => {
    if (product) {
      setActiveImage(product.imageUrl || '');
      if (product.variants?.length > 0) {
        const first = product.variants[0];
        if (first.size)  setSelectedSize(first.size);
        if (first.color) setSelectedColor(first.color);
      }
    }
  }, [product]);

  if (productLoading) return <SkeletonProductDetail />;

  if (productError || !product) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <Info size={40} className="text-slate-300" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Không tìm thấy sản phẩm</h2>
      <p className="text-slate-500 mb-8">Sản phẩm này có thể đã bị xóa hoặc không còn tồn tại.</p>
      <Link to="/" className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold transition-all hover:shadow-xl">
        <ArrowLeft size={18} /> Về trang chủ
      </Link>
    </div>
  );

  const allImages = [product.imageUrl, ...(product.galleryImages || [])].filter(Boolean);
  const uniqueSizes  = [...new Set((product?.variants || []).map(v => v.size).filter(Boolean))];
  const uniqueColors = [...new Set((product?.variants || []).map(v => v.color).filter(Boolean))];

  const currentVariant = product?.variants?.find(
    v =>
      (v.size  === selectedSize  || (!v.size  && !selectedSize)) &&
      (v.color === selectedColor || (!v.color && !selectedColor))
  );
  const availableStock = currentVariant ? currentVariant.stock : (product?.stock ?? 0);
  const avgRating = product.averageRating || 0;

  const handleAdd = () => {
    if (availableStock === 0) return;
    addToCart({ ...product, selectedVariantId: currentVariant?.id, selectedSize, selectedColor, _addQty: qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Vui lòng đăng nhập để gửi đánh giá');
      return;
    }
    if (!reviewText.trim()) return;
    reviewMutation.mutate({ rating, comment: reviewText });
  };

  const nextImage = () => {
    const idx = allImages.indexOf(activeImage);
    setActiveImage(allImages[(idx + 1) % allImages.length]);
  };

  const prevImage = () => {
    const idx = allImages.indexOf(activeImage);
    setActiveImage(allImages[(idx - 1 + allImages.length) % allImages.length]);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-700">
      
      {/* Navigation & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <nav className="flex items-center gap-3 text-xs font-black tracking-widest text-slate-400 uppercase">
          <Link to="/" className="hover:text-slate-900 transition-colors">TRANG CHỦ</Link>
          <ChevronRight size={12} />
          {product.categoryName && (
            <>
              <Link to="/categories" className="hover:text-slate-900 transition-colors">{product.categoryName}</Link>
              <ChevronRight size={12} />
            </>
          )}
          <span className="text-slate-900 truncate max-w-[150px] md:max-w-xs">{product.name}</span>
        </nav>

        <Link to="/" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft size={18} />
          Tiếp tục mua sắm
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
        
        {/* Left Column: Gallery */}
        <div className="space-y-6">
          <div className="relative aspect-[4/5] bg-slate-50 rounded-[2.5rem] overflow-hidden group border border-slate-100 shadow-inner">
             <img 
               src={activeImage || `https://picsum.photos/seed/${product.id}/800/1000`} 
               alt={product.name} 
               className="w-full h-full object-cover"
             />
             
             {availableStock === 0 && (
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
                   <span className="bg-white px-8 py-3 rounded-2xl text-slate-900 font-black tracking-[0.3em] shadow-2xl uppercase">HẾT HÀNG</span>
                </div>
             )}

             <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={prevImage} className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl hover:bg-white transition-all transform -translate-x-2 group-hover:translate-x-0">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={nextImage} className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl hover:bg-white transition-all transform translate-x-2 group-hover:translate-x-0">
                  <ChevronRight size={24} />
                </button>
             </div>

             <button 
               onClick={() => wishlistMutation.mutate()}
               className={cn(
                 "absolute top-6 right-6 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all active:scale-90",
                 isInWishlist ? "bg-rose-500 text-white shadow-rose-200" : "bg-white/90 backdrop-blur-md text-slate-400 hover:text-rose-500"
               )}
             >
                <Heart size={24} fill={isInWishlist ? "currentColor" : "none"} />
             </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {allImages.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setActiveImage(img)}
                className={cn(
                  "w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 shadow-sm",
                  activeImage === img ? "border-slate-900 scale-95 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Info */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
             {product.categoryName && (
               <span className="text-[10px] font-black tracking-[0.3em] text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-lg">
                 {product.categoryName}
               </span>
             )}
             <div className="flex items-center gap-4">
                <button className="text-slate-400 hover:text-slate-900 transition-colors"><Share2 size={18} /></button>
             </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-[1.1] mb-4 tracking-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 shadow-sm">
              <div className="flex gap-0.5 mr-2">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14} 
                    fill={s <= Math.round(avgRating) ? '#f59e0b' : 'none'}
                    className={s <= Math.round(avgRating) ? 'text-amber-500' : 'text-amber-200'}
                  />
                ))}
              </div>
              <span className="text-xs font-black text-amber-700">{avgRating.toFixed(1)}</span>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest border-l border-slate-100 pl-4">
              {product.reviewCount || 0} ĐÁNH GIÁ
            </span>
          </div>

          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-4xl font-black text-slate-900 tracking-tight">{formatVND(product.price)}</span>
            {product.id % 4 === 0 && (
               <div className="flex items-center gap-2">
                  <span className="text-xl text-slate-400 line-through font-medium">{formatVND(product.price * 1.25)}</span>
                  <span className="bg-rose-100 text-rose-600 text-xs font-black px-2.5 py-1 rounded-xl uppercase tracking-wider">Tiết kiệm 20%</span>
               </div>
            )}
          </div>

          <p className="text-slate-500 text-lg leading-relaxed mb-10 line-clamp-3">
             {product.description || "Sản phẩm sang trọng với chất liệu cao cấp và kiểu dáng hiện đại. Phù hợp cho nhiều dịp khác nhau, từ công sở đến những buổi tiệc tùng sang trọng."}
          </p>

          <div className="h-px bg-slate-100 w-full mb-10" />

          {/* Variants */}
          <div className="space-y-10 mb-12">
            {uniqueSizes.length > 0 && (
               <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase">Kích Cỡ</h3>
                    <button className="text-[10px] font-black tracking-widest text-indigo-600 uppercase underline decoration-2 underline-offset-4">BẢNG SIZE</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {uniqueSizes.map(s => {
                      const v = product.variants.find(x => x.size === s && (x.color === selectedColor || !selectedColor));
                      const isOos = v ? v.stock === 0 : false;
                      return (
                        <button 
                          key={s}
                          disabled={isOos}
                          onClick={() => { setSelectedSize(s); setQty(1); }}
                          className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-black border transition-all",
                            selectedSize === s ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400",
                            isOos && "opacity-30 cursor-not-allowed border-dashed"
                          )}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
               </div>
            )}

            {uniqueColors.length > 0 && (
               <div className="space-y-4">
                  <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase">Màu Sắc</h3>
                  <div className="flex flex-wrap gap-4">
                    {uniqueColors.map(c => {
                      const v = product.variants.find(x => x.color === c && (x.size === selectedSize || !selectedSize));
                      const isOos = v ? v.stock === 0 : false;
                      return (
                        <button 
                          key={c}
                          disabled={isOos}
                          onClick={() => { setSelectedColor(c); setQty(1); }}
                          className={cn(
                            "group flex items-center gap-3 pr-5 pl-1.5 py-1.5 rounded-2xl border transition-all",
                            selectedColor === c ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200" : "bg-white text-slate-700 border-slate-100 hover:border-slate-300",
                            isOos && "opacity-30 cursor-not-allowed"
                          )}
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-xl shadow-inner flex items-center justify-center",
                            selectedColor === c ? "bg-white/20" : "bg-slate-100"
                          )}>
                             <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c.toLowerCase() }} />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-widest">{c}</span>
                        </button>
                      );
                    })}
                  </div>
               </div>
            )}
          </div>

          {/* Add to Cart Area */}
          <div className="mt-auto space-y-6">
             <div className="flex items-center gap-3">
                <div className="bg-slate-50 p-1.5 rounded-[1.5rem] flex items-center gap-2 border border-slate-100">
                   <button 
                     onClick={() => setQty(v => Math.max(1, v - 1))}
                     disabled={qty <= 1}
                     className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm hover:bg-slate-900 hover:text-white transition-all disabled:opacity-30"
                   >
                     −
                   </button>
                   <span className="w-12 text-center text-lg font-black text-slate-900">{qty}</span>
                   <button 
                     onClick={() => setQty(v => Math.min(availableStock || 99, v + 1))}
                     disabled={qty >= (availableStock || 99)}
                     className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm hover:bg-slate-900 hover:text-white transition-all disabled:opacity-30"
                   >
                     +
                   </button>
                </div>

                <button 
                  onClick={handleAdd}
                  disabled={availableStock === 0 || added}
                  className={cn(
                    "flex-1 h-[3.8rem] rounded-[1.5rem] flex items-center justify-center gap-3 text-sm font-black tracking-widest uppercase transition-all shadow-2xl active:scale-95",
                    added ? "bg-emerald-500 text-white shadow-emerald-100" : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200"
                  )}
                >
                  {added ? (
                    <><CheckCircle2 size={20} /> ĐÃ THÊM VÀO GIỎ</>
                  ) : (
                    <><ShoppingBag size={20} /> THÊM VÀO GIỎ HÀNG</>
                  )}
                </button>
             </div>

             {added && (
               <button onClick={openModal} className="w-full flex items-center justify-center gap-2 text-indigo-600 text-xs font-black tracking-widest uppercase py-2 bg-indigo-50 rounded-xl animate-in slide-in-from-top-2 duration-300">
                 XEM GIỎ HÀNG VÀ THANH TOÁN <ChevronRight size={14} />
               </button>
             )}

             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 flex flex-col items-center text-center gap-2">
                   <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600">
                      <Truck size={18} />
                   </div>
                   <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Free Ship</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 flex flex-col items-center text-center gap-2">
                   <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-amber-600">
                      <Shield size={18} />
                   </div>
                   <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Bảo hành 12th</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 flex flex-col items-center text-center gap-2">
                   <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-rose-600">
                      <RotateCcw size={18} />
                   </div>
                   <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Đổi trả 30 ngày</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-24 space-y-12">
        <div className="flex items-center justify-center gap-10 border-b border-slate-100">
          <button 
            onClick={() => setActiveTab('desc')}
            className={cn(
              "pb-6 text-sm font-black tracking-[0.2em] uppercase transition-all relative",
              activeTab === 'desc' ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Mô tả sản phẩm
            {activeTab === 'desc' && <span className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900 rounded-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={cn(
              "pb-6 text-sm font-black tracking-[0.2em] uppercase transition-all relative",
              activeTab === 'reviews' ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Đánh giá ({product.reviewCount || 0})
            {activeTab === 'reviews' && <span className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900 rounded-full" />}
          </button>
        </div>

        <div className="max-w-4xl mx-auto py-8">
          {activeTab === 'desc' ? (
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-6">
              <p className="text-xl font-medium text-slate-900">Chi tiết sản phẩm</p>
              <p>{product.description || "Đây là mẫu thiết kế mới nhất nằm trong bộ sưu tập Xuân-Hè. Sản phẩm được thiết kế tối giản nhưng không kém phần sang trọng, giúp tôn vinh vẻ đẹp hiện đại và tinh tế của người mặc. Sử dụng chất liệu vải cao cấp, thoáng mát, mang lại cảm giác thoải mái tối đa."}</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                 <li className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                    <span className="font-bold text-sm">Chất liệu cao cấp 100%</span>
                 </li>
                 <li className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                    <span className="font-bold text-sm">Thiết kế form chuẩn</span>
                 </li>
                 <li className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                    <span className="font-bold text-sm">Đường may tinh xảo</span>
                 </li>
                 <li className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                    <span className="font-bold text-sm">Bền màu, dễ giặt ủi</span>
                 </li>
              </ul>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Summary & Form */}
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12 items-start bg-slate-50 p-8 md:p-12 rounded-[3rem] border border-slate-100">
                <div className="text-center space-y-2">
                   <span className="text-7xl font-serif font-bold text-slate-900">{avgRating.toFixed(1)}</span>
                   <div className="flex justify-center gap-0.5">
                     {[1,2,3,4,5].map(s => (
                       <Star key={s} size={16} fill={s <= Math.round(avgRating) ? '#f59e0b' : 'none'} className={s <= Math.round(avgRating) ? 'text-amber-500' : 'text-slate-200'} />
                     ))}
                   </div>
                   <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{product.reviewCount || 0} ĐÁNH GIÁ</p>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-6">
                   <h3 className="text-xl font-bold text-slate-900 tracking-tight">Viết đánh giá của bạn</h3>
                   <div className="flex items-center gap-3">
                     {[1,2,3,4,5].map(s => (
                       <button
                         key={s} type="button"
                         className="transition-transform hover:scale-110 active:scale-95"
                         onClick={() => setRating(s)}
                         onMouseEnter={() => setHoverRating(s)}
                         onMouseLeave={() => setHoverRating(0)}
                       >
                         <Star size={32} fill={(hoverRating || rating) >= s ? '#f59e0b' : 'none'} className={(hoverRating || rating) >= s ? 'text-amber-500' : 'text-slate-200'} />
                       </button>
                     ))}
                     <span className="ml-2 text-xs font-black tracking-widest text-indigo-600 uppercase">
                       {['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Xuất sắc'][hoverRating || rating]}
                     </span>
                   </div>
                   <div className="relative">
                      <textarea 
                        value={reviewText}
                        onChange={e => setReviewText(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                        className="w-full bg-white border border-slate-200 rounded-[2rem] p-6 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all text-slate-700 min-h-[120px]"
                      />
                      <button 
                        type="submit"
                        disabled={reviewMutation.isPending || !reviewText.trim()}
                        className="absolute bottom-4 right-4 bg-slate-900 text-white px-8 py-3 rounded-2xl text-xs font-black tracking-widest uppercase hover:bg-slate-800 transition-all disabled:opacity-50"
                      >
                        {reviewMutation.isPending ? "ĐANG GỬI..." : "GỬI ĐÁNH GIÁ"}
                      </button>
                   </div>
                </form>
              </div>

              {/* Review List */}
              <div className="space-y-8">
                 {reviewsLoading ? (
                    <div className="space-y-6">
                       {[1,2].map(i => <div key={i} className="h-40 bg-slate-50 rounded-3xl animate-pulse" />)}
                    </div>
                 ) : !reviewsData?.content?.length ? (
                    <div className="text-center py-20 space-y-4">
                       <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mx-auto text-slate-200">
                          <Star size={32} />
                       </div>
                       <p className="text-slate-400 font-medium">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                    </div>
                 ) : (
                    <div className="divide-y divide-slate-100">
                       {reviewsData.content.map(review => (
                          <div key={review.id} className="py-10 first:pt-0">
                             <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black">
                                      {review.userName?.[0]?.toUpperCase() || 'U'}
                                   </div>
                                   <div>
                                      <h4 className="font-bold text-slate-900 leading-tight">{review.userName}</h4>
                                      <div className="flex gap-0.5 mt-1">
                                        {[1,2,3,4,5].map(s => (
                                          <Star key={s} size={10} fill={s <= review.rating ? '#f59e0b' : 'none'} className={s <= review.rating ? 'text-amber-500' : 'text-slate-200'} />
                                        ))}
                                      </div>
                                   </div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                   {new Date(review.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </span>
                             </div>
                             <p className="text-slate-600 leading-relaxed pl-16">{review.comment}</p>
                          </div>
                       ))}
                    </div>
                 )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts?.length > 0 && (
        <section className="mt-32 pt-24 border-t border-slate-100">
           <div className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                 <span className="text-[10px] font-black tracking-[0.3em] text-indigo-600 uppercase">Gợi Ý Cho Bạn</span>
                 <h2 className="text-3xl font-serif font-bold text-slate-900">Sản phẩm tương tự</h2>
              </div>
              <Link to="/categories" className="text-xs font-black tracking-widest text-slate-900 uppercase border-b-2 border-slate-900 pb-1">Xem tất cả</Link>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
              {relatedProducts.slice(0, 4).map((rp, i) => (
                <article key={rp.id} className="group space-y-4">
                   <Link to={`/products/${rp.id}`} className="block aspect-[3/4] bg-slate-50 rounded-3xl overflow-hidden relative border border-slate-100 shadow-sm transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-slate-200/50">
                      <img src={rp.imageUrl || `https://picsum.photos/seed/${rp.id}/400/500`} alt={rp.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   </Link>
                   <div className="space-y-1 px-2">
                      <Link to={`/products/${rp.id}`} className="block font-bold text-slate-900 truncate group-hover:text-slate-600 transition-colors">{rp.name}</Link>
                      <p className="text-sm font-black text-slate-900 tracking-tight">{formatVND(rp.price)}</p>
                   </div>
                </article>
              ))}
           </div>
        </section>
      )}

    </main>
  );
}
