import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingBag, ArrowLeft, Star, Truck, Shield, RotateCcw,
  Loader2, Eye, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { getProductById, getReviews, addReview, getRelatedProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

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

        // Default variant selection
        if (prod.variants?.length > 0) {
          const first = prod.variants[0];
          if (first.size)  setSelectedSize(first.size);
          if (first.color) setSelectedColor(first.color);
        }

        // Fetch related
        if (prod.categoryId) {
          getRelatedProducts(prod.categoryId, prod.id)
            .then(r => setRelatedProducts(r.data))
            .catch(() => {});
        }
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
    <div className="pd-page">
      <div className="pd-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 size={40} className="spin" style={{ color: 'var(--accent)' }} />
      </div>
    </div>
  );

  if (!product) return (
    <div className="pd-page">
      <div className="pd-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-2)', marginBottom: '1.5rem' }}>Không tìm thấy sản phẩm.</p>
        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> Về trang chủ
        </Link>
      </div>
    </div>
  );

  const avgRating = product.averageRating || 0;
  const hasVariants = product.variants?.length > 0;

  return (
    <div className="pd-page">
      <div className="pd-container">

        {/* ── Back ── */}
        <Link to="/" className="back-link">
          <ArrowLeft size={15} /> Tiếp tục mua sắm
        </Link>

        {/* ═══════════════════════════════════════
            MAIN GRID: IMAGE | INFO
        ═══════════════════════════════════════ */}
        <div className="pd-layout">

          {/* ── Left: Gallery ── */}
          <div className="pd-gallery-col">
            <div className="pd-img-wrap">
              <img
                key={activeImage}
                src={activeImage || `https://picsum.photos/seed/${product.id}/600/750`}
                alt={product.name}
                className="pd-img"
              />
              {/* Arrow nav for gallery */}
              {allImages.length > 1 && (
                <>
                  <button className="pd-arrow pd-arrow--left"  onClick={prevImage} aria-label="Previous"><ChevronLeft size={20} /></button>
                  <button className="pd-arrow pd-arrow--right" onClick={nextImage} aria-label="Next"><ChevronRight size={20} /></button>
                </>
              )}
              {/* Badge */}
              {availableStock === 0 && (
                <span className="pd-badge-soldout">Hết hàng</span>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="pd-thumbs">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    className={`pd-thumb ${activeImage === img ? 'active' : ''}`}
                    onClick={() => setActiveImage(img)}
                    style={{ backgroundImage: `url(${img})` }}
                    aria-label={`Ảnh ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Info ── */}
          <div className="pd-info">
            {/* Category */}
            {product.categoryName && (
              <span className="pd-category">{product.categoryName}</span>
            )}

            {/* Name */}
            <h1 className="pd-name">{product.name}</h1>

            {/* Rating */}
            <div className="pd-rating">
              {[1, 2, 3, 4, 5].map(s => (
                <Star
                  key={s} size={14}
                  fill={s <= Math.round(avgRating) ? 'currentColor' : 'none'}
                  className={s <= Math.round(avgRating) ? 'star-on' : 'star-off'}
                />
              ))}
              <span>({product.reviewCount || 0} đánh giá)</span>
            </div>

            {/* Price */}
            <div className="pd-price">{formatVND(product.price)}</div>

            <div className="pd-divider" />

            {/* Description */}
            <p className="pd-desc">
              {product.description || 'Sản phẩm chất lượng cao cấp, được tuyển chọn kỹ lưỡng từ những nguyên liệu tốt nhất.'}
            </p>

            {/* Stock indicator */}
            <p className="pd-stock" style={{ color: availableStock > 0 ? 'var(--success)' : '#e53e3e', fontWeight: 500 }}>
              {availableStock > 0
                ? `✓ Còn hàng (${availableStock} sản phẩm)`
                : '✗ Hết hàng'}
            </p>

            {/* ── Variant Selectors ── */}
            {hasVariants && (
              <div className="pd-variants-section">
                {uniqueSizes.length > 0 && (
                  <div className="pd-variant-group">
                    <p className="pd-variant-label">
                      Kích cỡ: <strong>{selectedSize}</strong>
                    </p>
                    <div className="pd-variant-options">
                      {uniqueSizes.map(s => {
                        const variantForSize = product.variants.find(
                          v => v.size === s && (v.color === selectedColor || !selectedColor || !v.color)
                        );
                        const outOfStock = variantForSize ? variantForSize.stock === 0 : false;
                        return (
                          <button
                            key={s}
                            className={`pd-variant-btn ${selectedSize === s ? 'active' : ''} ${outOfStock ? 'disabled' : ''}`}
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
                  <div className="pd-variant-group">
                    <p className="pd-variant-label">
                      Màu sắc: <strong>{selectedColor}</strong>
                    </p>
                    <div className="pd-variant-options">
                      {uniqueColors.map(c => {
                        const variantForColor = product.variants.find(
                          v => v.color === c && (v.size === selectedSize || !selectedSize || !v.size)
                        );
                        const outOfStock = variantForColor ? variantForColor.stock === 0 : false;
                        return (
                          <button
                            key={c}
                            className={`pd-variant-btn pd-color-btn ${selectedColor === c ? 'active' : ''} ${outOfStock ? 'disabled' : ''}`}
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
            <div className="pd-actions-row">
              <div className="pd-qty-wrap">
                <span className="pd-qty-label">SL</span>
                <div className="pd-qty">
                  <button
                    className="pd-qty__btn"
                    onClick={() => setQty(v => Math.max(1, v - 1))}
                    disabled={qty <= 1}
                  >−</button>
                  <span className="pd-qty__val">{qty}</span>
                  <button
                    className="pd-qty__btn"
                    onClick={() => setQty(v => Math.min(availableStock || 99, v + 1))}
                    disabled={qty >= (availableStock || 99)}
                  >+</button>
                </div>
              </div>

              <button
                className={`pd-add-btn ${added ? 'added' : ''}`}
                onClick={handleAdd}
                disabled={availableStock === 0}
              >
                <ShoppingBag size={17} />
                {added ? '✓ Đã thêm!' : 'Thêm vào giỏ'}
              </button>
            </div>

            {/* View cart prompt */}
            {added && (
              <button className="pd-view-cart" onClick={openModal}>
                <Eye size={14} /> Xem giỏ hàng →
              </button>
            )}

            {/* Perks */}
            <div className="pd-perks">
              <div className="pd-perk"><Truck size={15} /><span>Miễn phí giao hàng toàn quốc</span></div>
              <div className="pd-perk"><Shield size={15} /><span>Bảo hành 12 tháng chính hãng</span></div>
              <div className="pd-perk"><RotateCcw size={15} /><span>Đổi trả miễn phí trong 30 ngày</span></div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            RELATED PRODUCTS
        ═══════════════════════════════════════ */}
        {relatedProducts.length > 0 && (
          <section className="pd-related">
            <h2 className="pd-section-title">Sản phẩm tương tự</h2>
            <div className="pd-related-grid">
              {relatedProducts.map(rp => (
                <Link to={`/products/${rp.id}`} key={rp.id} className="pd-related-card">
                  <div className="pd-related-img-wrap">
                    <img
                      src={rp.imageUrl || `https://picsum.photos/seed/${rp.id}/400/500`}
                      alt={rp.name}
                      className="pd-related-img"
                    />
                  </div>
                  <div className="pd-related-info">
                    <h3 className="pd-related-name">{rp.name}</h3>
                    <p className="pd-related-price">{formatVND(rp.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════
            REVIEWS
        ═══════════════════════════════════════ */}
        <section className="pd-reviews">
          <h2 className="pd-section-title">Đánh giá sản phẩm</h2>

          {/* Overall rating */}
          <div className="pd-rating-summary">
            <div className="pd-rating-big">{avgRating.toFixed(1)}</div>
            <div>
              <div className="pd-rating" style={{ gap: '3px', marginBottom: '6px' }}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={18}
                    fill={s <= Math.round(avgRating) ? 'currentColor' : 'none'}
                    className={s <= Math.round(avgRating) ? 'star-on' : 'star-off'}
                  />
                ))}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{product.reviewCount || 0} lượt đánh giá</p>
            </div>
          </div>

          {/* Write review form */}
          <form onSubmit={handleReviewSubmit} className="pd-review-form">
            <h3 className="pd-review-form-title">Viết đánh giá của bạn</h3>

            {/* Star picker */}
            <div className="pd-star-picker">
              {[1,2,3,4,5].map(s => (
                <Star
                  key={s} size={26}
                  className={`pd-star-pick ${s <= (hoverRating || rating) ? 'active' : ''}`}
                  fill={s <= (hoverRating || rating) ? 'currentColor' : 'none'}
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
              <span className="pd-star-label">
                {['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Xuất sắc'][hoverRating || rating]}
              </span>
            </div>

            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
              className="pd-review-textarea"
              rows={4}
            />
            <button
              type="submit"
              disabled={submittingReview || !reviewText.trim()}
              className="pd-review-submit"
            >
              {submittingReview ? <><Loader2 size={15} className="spin" /> Đang gửi...</> : 'Gửi đánh giá'}
            </button>
          </form>

          {/* Review list */}
          <div className="pd-review-list">
            {reviews.length === 0 ? (
              <p className="pd-review-empty">Chưa có đánh giá. Hãy là người đầu tiên!</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="pd-review-item">
                  <div className="pd-review-header">
                    <div className="pd-review-avatar">
                      {review.userName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="pd-review-meta">
                      <strong className="pd-review-author">{review.userName}</strong>
                      <div className="pd-rating" style={{ gap: '2px' }}>
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={12}
                            fill={s <= review.rating ? 'currentColor' : 'none'}
                            className={s <= review.rating ? 'star-on' : 'star-off'}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="pd-review-date">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <p className="pd-review-text">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
