import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingBag, ArrowLeft, Star, Truck, Shield, RotateCcw,
  Loader2, Eye, ChevronLeft, ChevronRight, Zap, Tag,
} from 'lucide-react';
import { getProductById, getReviews, addReview, getRelatedProducts, getFrequentlyBoughtTogether } from '../services/api';
import { useCart } from '../context/CartContext';
import { trackProductView } from '../components/RecentlyViewed';


/* ─── Helpers ─── */
const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

/* ════════════════════════════════════════════════════════════════
   ProductDetail
════════════════════════════════════════════════════════════════ */
export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart, openModal } = useCart();

  /* ─ Data ─ */
  const [product, setProduct]   = useState(null);
  const [loading, setLoading]   = useState(true);

  /* ─ Gallery ─ */
  const [activeImage, setActiveImage] = useState('');

  /* ─ Variant selection ─ */
  const [selectedSize,  setSelectedSize]  = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  /* ─ Qty ─ */
  const [qty, setQty]     = useState(1);
  const [added, setAdded] = useState(false);

  /* ─ Reviews ─ */
  const [reviews,          setReviews]          = useState([]);
  const [reviewText,       setReviewText]       = useState('');
  const [rating,           setRating]           = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hoverRating,      setHoverRating]      = useState(0);

  /* ─ Related ─ */
  const [relatedProducts, setRelatedProducts] = useState([]);
  /* ─ Frequently Bought Together ─ */
  const [fbtProducts, setFbtProducts] = useState([]);

  /* ─────────── Fetch ─────────── */
  useEffect(() => {
    setLoading(true);
    setAdded(false);
    setSelectedSize('');
    setSelectedColor('');
    setQty(1);

    Promise.all([
      getProductById(id),
      getReviews(id, 0, 10),
    ])
      .then(([prodRes, revRes]) => {
        const prod = prodRes.data;
        setProduct(prod);
        setActiveImage(prod.imageUrl || '');
        setReviews(revRes.data.content || []);

        // Track recently viewed
        trackProductView(prod.id);

        if (prod.variants?.length > 0) {
          const first = prod.variants[0];
          if (first.size)  setSelectedSize(first.size);
          if (first.color) setSelectedColor(first.color);
        }

        if (prod.categoryId) {
          getRelatedProducts(prod.categoryId, prod.id)
            .then(r => setRelatedProducts(r.data))
            .catch(() => {});
        }

        // Frequently bought together
        getFrequentlyBoughtTogether(prod.id, 4)
          .then(r => setFbtProducts((r.data || []).filter(p => p.id !== prod.id)))
          .catch(() => {});
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  /* ─────────── Derived ─────────── */
  const allImages = product
    ? [product.imageUrl, ...(product.galleryImages || [])].filter(Boolean)
    : [];

  const uniqueSizes  = [...new Set((product?.variants || []).map(v => v.size).filter(Boolean))];
  const uniqueColors = [...new Set((product?.variants || []).map(v => v.color).filter(Boolean))];

  const currentVariant = product?.variants?.find(
    v =>
      (v.size  === selectedSize  || (!v.size  && !selectedSize)) &&
      (v.color === selectedColor || (!v.color && !selectedColor))
  );

  const availableStock = currentVariant
    ? currentVariant.stock
    : (product?.stock ?? 0);

  /* ─────────── Handlers ─────────── */
  const handleAdd = () => {
    if (!product || availableStock === 0) return;
    const cartProduct = {
      ...product,
      selectedVariantId: currentVariant?.id,
      selectedSize,
      selectedColor,
      _addQty: qty,
    };
    addToCart(cartProduct);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await addReview(id, { rating, comment: reviewText });
      setReviews([res.data, ...reviews]);
      setReviewText('');
      setRating(5);
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi khi gửi đánh giá');
    } finally {
      setSubmittingReview(false);
    }
  };

  const prevImage = () => {
    const idx = allImages.indexOf(activeImage);
    setActiveImage(allImages[(idx - 1 + allImages.length) % allImages.length]);
  };
  const nextImage = () => {
    const idx = allImages.indexOf(activeImage);
    setActiveImage(allImages[(idx + 1) % allImages.length]);
  };

  /* ─────────── Loading / Not found ─────────── */
  if (loading) return (
    <div className="min-h-screen pt-[68px] bg-gray-50 flex justify-center items-center">
      <Loader2 size={40} className="animate-spin text-accent" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen pt-[68px] bg-gray-50 flex flex-col items-center pt-16">
      <p className="text-xl text-gray-500 mb-6">Không tìm thấy sản phẩm.</p>
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-gray-600 hover:text-gray-900 transition-colors">
        <ArrowLeft size={16} /> Về trang chủ
      </Link>
    </div>
  );

  const avgRating = product.averageRating || 0;
  const hasVariants = product.variants?.length > 0;

  return (
    <div className="min-h-[100vh] pt-[68px] bg-gray-50 pb-20 animate-fadeUp">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl pt-8">

        {/* ── Back ── */}
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-gray-500 hover:text-gray-900 transition-colors mb-8">
          <ArrowLeft size={15} /> Tiếp tục mua sắm
        </Link>

        {/* ═══════════════════════════════════════
            MAIN GRID: IMAGE | INFO
        ═══════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-start bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">

          {/* ── Left: Gallery ── */}
          <div className="flex flex-col gap-4">
            <div className="relative w-full aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden group">
              <img
                key={activeImage}
                src={activeImage || `https://picsum.photos/seed/${product.id}/600/750`}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Arrow nav for gallery */}
              {allImages.length > 1 && (
                <>
                  <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-white/40 flex items-center justify-center text-gray-700 hover:bg-white hover:text-gray-900 transition-all opacity-0 group-hover:opacity-100 shadow-sm" onClick={prevImage} aria-label="Previous"><ChevronLeft size={20} /></button>
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-white/40 flex items-center justify-center text-gray-700 hover:bg-white hover:text-gray-900 transition-all opacity-0 group-hover:opacity-100 shadow-sm" onClick={nextImage} aria-label="Next"><ChevronRight size={20} /></button>
                </>
              )}
              {/* Badge */}
              {availableStock === 0 && (
                <span className="absolute top-4 left-4 text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-md bg-red-50 text-red-600 border border-red-200">Hết hàng</span>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    className={`aspect-square rounded-lg bg-gray-100 bg-cover bg-center border-2 transition-all cursor-pointer hover:opacity-100 ${activeImage === img ? 'border-gray-900 opacity-100' : 'border-transparent opacity-60'}`}
                    onClick={() => setActiveImage(img)}
                    style={{ backgroundImage: `url(${img})` }}
                    aria-label={`Ảnh ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Info ── */}
          <div className="flex flex-col pt-2">
            {/* Category */}
            {product.categoryName && (
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-3">{product.categoryName}</span>
            )}

            {/* Name */}
            <h1 className="font-serif text-3xl md:text-4xl font-medium text-gray-900 leading-tight mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-5">
              {[1, 2, 3, 4, 5].map(s => (
                <Star
                  key={s} size={15}
                  fill={s <= Math.round(avgRating) ? 'currentColor' : 'none'}
                  className={s <= Math.round(avgRating) ? 'text-yellow-500' : 'text-gray-300'}
                />
              ))}
              <span className="text-sm font-medium text-gray-500 ml-2">({product.reviewCount || 0} đánh giá)</span>
            </div>

            {/* Price — show sale if onSale */}
            {product.onSale ? (
              <div className="flex flex-col gap-1 mb-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    <Zap size={11} /> FLASH SALE
                  </span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Tag size={11} /> Tiết kiệm {Math.round((1 - product.salePrice / product.price) * 100)}%
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-3xl font-bold text-red-600">{formatVND(product.salePrice)}</span>
                  <span className="text-lg text-gray-400 line-through">{formatVND(product.price)}</span>
                </div>
                {product.saleEndAt && (
                  <p className="text-xs text-gray-500">
                    Kết thúc: {new Date(product.saleEndAt).toLocaleString('vi-VN')}
                  </p>
                )}
              </div>
            ) : (
              <div className="font-serif text-2xl md:text-3xl font-semibold text-gray-900">{formatVND(product.price)}</div>
            )}

            <div className="w-full h-px bg-gray-100 my-8" />

            {/* Description */}
            <p className="text-base text-gray-600 leading-relaxed mb-6">
              {product.description || 'Sản phẩm chất lượng cao cấp, được tuyển chọn kỹ lưỡng từ những nguyên liệu tốt nhất.'}
            </p>

            {/* Stock indicator */}
            <p className={`text-sm font-semibold mb-8 ${availableStock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {availableStock > 0
                ? `✓ Còn hàng (${availableStock} sản phẩm)`
                : '✗ Hết hàng'}
            </p>

            {/* ── Variant Selectors ── */}
            {hasVariants && (
              <div className="flex flex-col gap-6 mb-8">
                {uniqueSizes.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Kích cỡ: <strong className="text-gray-900">{selectedSize}</strong>
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {uniqueSizes.map(s => {
                        const variantForSize = product.variants.find(
                          v => v.size === s && (v.color === selectedColor || !selectedColor || !v.color)
                        );
                        const outOfStock = variantForSize ? variantForSize.stock === 0 : false;
                        return (
                          <button
                            key={s}
                            className={`min-w-[3rem] px-3 py-2 border rounded text-sm font-medium transition-colors ${selectedSize === s ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-700 hover:border-gray-400'} ${outOfStock ? 'opacity-40 cursor-not-allowed bg-gray-50 text-gray-400' : ''}`}
                            onClick={() => { if (!outOfStock) { setSelectedSize(s); setQty(1); } }}
                            disabled={outOfStock}
                            title={outOfStock ? 'Hết hàng' : ''}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {uniqueColors.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Màu sắc: <strong className="text-gray-900">{selectedColor}</strong>
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {uniqueColors.map(c => {
                        const variantForColor = product.variants.find(
                          v => v.color === c && (v.size === selectedSize || !selectedSize || !v.size)
                        );
                        const outOfStock = variantForColor ? variantForColor.stock === 0 : false;
                        return (
                          <button
                            key={c}
                            className={`px-4 py-2 border rounded text-sm font-medium transition-colors ${selectedColor === c ? 'border-gray-900 border-2 text-gray-900 bg-gray-50 font-bold' : 'border-gray-200 text-gray-700 hover:border-gray-400'} ${outOfStock ? 'opacity-40 cursor-not-allowed bg-gray-50 text-gray-400' : ''}`}
                            onClick={() => { if (!outOfStock) { setSelectedColor(c); setQty(1); } }}
                            disabled={outOfStock}
                          >
                            {c}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Qty + Add ── */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
              <div className="flex items-center">
                <span className="text-xs font-bold tracking-widest uppercase text-gray-500 mr-4">SL</span>
                <div className="flex items-center border border-gray-200 rounded-lg h-12 w-[120px]">
                  <button
                    className="flex-1 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    onClick={() => setQty(v => Math.max(1, v - 1))}
                    disabled={qty <= 1}
                  >−</button>
                  <span className="w-10 text-center font-semibold text-gray-900">{qty}</span>
                  <button
                    className="flex-1 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    onClick={() => setQty(v => Math.min(availableStock || 99, v + 1))}
                    disabled={qty >= (availableStock || 99)}
                  >+</button>
                </div>
              </div>

              <button
                className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-lg text-sm font-bold tracking-wide uppercase transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${added ? 'bg-green-600 text-white' : 'bg-gray-900 text-white hover:bg-accent hover:-translate-y-0.5'}`}
                onClick={handleAdd}
                disabled={availableStock === 0}
              >
                <ShoppingBag size={17} />
                {added ? '✓ Đã thêm!' : 'Thêm vào giỏ'}
              </button>
            </div>

            {/* View cart prompt */}
            {added && (
              <button className="flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-gray-900 transition-colors mb-8" onClick={openModal}>
                <Eye size={14} /> Xem giỏ hàng →
              </button>
            )}

            {/* Perks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-700">
                  <Truck size={18} />
                </div>
                <span className="text-xs font-medium text-gray-600">Miễn phí giao hàng toàn quốc</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-700">
                  <Shield size={18} />
                </div>
                <span className="text-xs font-medium text-gray-600">Bảo hành 12 tháng chính hãng</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-700">
                  <RotateCcw size={18} />
                </div>
                <span className="text-xs font-medium text-gray-600">Đổi trả miễn phí trong 30 ngày</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            FREQUENTLY BOUGHT TOGETHER
        ═══════════════════════════════════════ */}
        {fbtProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="font-serif text-3xl font-medium text-gray-900 text-center mb-10">Thường mua cùng</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {fbtProducts.map(rp => (
                <Link to={`/products/${rp.id}`} key={rp.id} className="group flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
                    {rp.onSale && (
                      <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        SALE
                      </span>
                    )}
                    <img src={rp.imageUrl || `https://picsum.photos/seed/${rp.id}/400/500`} alt={rp.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-4 flex flex-col gap-1 flex-1 justify-center items-center text-center">
                    <h3 className="font-serif text-base font-medium text-gray-900 line-clamp-1 group-hover:text-accent transition-colors">{rp.name}</h3>
                    {rp.onSale
                      ? <div className="flex gap-2 items-baseline"><span className="text-sm font-bold text-red-600">{formatVND(rp.salePrice)}</span><span className="text-xs text-gray-400 line-through">{formatVND(rp.price)}</span></div>
                      : <p className="text-sm font-semibold text-gray-500">{formatVND(rp.price)}</p>
                    }
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════
            RELATED PRODUCTS
        ═══════════════════════════════════════ */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="font-serif text-3xl font-medium text-gray-900 text-center mb-10">Sản phẩm tương tự</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(rp => (
                <Link to={`/products/${rp.id}`} key={rp.id} className="group flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
                    <img
                      src={rp.imageUrl || `https://picsum.photos/seed/${rp.id}/400/500`}
                      alt={rp.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 flex flex-col gap-1.5 flex-1 justify-center items-center text-center">
                    <h3 className="font-serif text-base font-medium text-gray-900 line-clamp-1 group-hover:text-accent transition-colors">{rp.name}</h3>
                    <p className="text-sm font-semibold text-gray-500">{formatVND(rp.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════
            REVIEWS
        ═══════════════════════════════════════ */}
        <section className="mt-20 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="font-serif text-3xl font-medium text-gray-900 mb-10 text-center">Đánh giá sản phẩm</h2>

          {/* Overall rating */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12 p-8 bg-gray-50 rounded-xl">
            <div className="font-serif text-6xl font-medium text-gray-900 leading-none">{avgRating.toFixed(1)}</div>
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-1 mb-2">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={22}
                    fill={s <= Math.round(avgRating) ? 'currentColor' : 'none'}
                    className={s <= Math.round(avgRating) ? 'text-yellow-500' : 'text-gray-300'}
                  />
                ))}
              </div>
              <p className="text-sm font-medium text-gray-500">{product.reviewCount || 0} lượt đánh giá</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Write review form */}
            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-6 lg:border-r border-gray-100 lg:pr-16">
              <h3 className="text-lg font-semibold text-gray-900">Viết đánh giá của bạn</h3>

              {/* Star picker */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => (
                    <Star
                      key={s} size={28}
                      className={`cursor-pointer transition-all hover:scale-110 ${s <= (hoverRating || rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                      fill={s <= (hoverRating || rating) ? 'currentColor' : 'none'}
                      onClick={() => setRating(s)}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700 w-24">
                  {['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Xuất sắc'][hoverRating || rating]}
                </span>
              </div>

              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all resize-none"
                rows={5}
              />
              <button
                type="submit"
                disabled={submittingReview || !reviewText.trim()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg text-sm font-bold tracking-wide uppercase hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-start"
              >
                {submittingReview ? <><Loader2 size={16} className="animate-spin" /> Đang gửi...</> : 'Gửi đánh giá'}
              </button>
            </form>

            {/* Review list */}
            <div className="flex flex-col gap-8 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
              {reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-60">
                  <Star size={40} className="text-gray-300 mb-4" />
                  <p className="text-gray-600 font-medium">Chưa có đánh giá. Hãy là người đầu tiên!</p>
                </div>
              ) : (
                reviews.map((review, idx) => (
                  <div key={review.id} className={`flex flex-col gap-3 ${idx !== reviews.length - 1 ? 'pb-8 border-b border-gray-100' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-700">
                          {review.userName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <strong className="text-sm font-semibold text-gray-900 block mb-1">{review.userName}</strong>
                          <div className="flex items-center gap-0.5">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} size={11}
                                fill={s <= review.rating ? 'currentColor' : 'none'}
                                className={s <= review.rating ? 'text-yellow-500' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed pl-13">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
