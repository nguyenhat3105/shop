import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Star, Truck, Shield, RotateCcw, Loader2, Eye } from 'lucide-react';
import { getProductById, getReviews, addReview, getRelatedProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart, openModal } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty]         = useState(1);
  const [added, setAdded]     = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Related products state
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    setLoading(true);
    setAdded(false);
    Promise.all([
      getProductById(id),
      getReviews(id, 0, 10)
    ])
      .then(([prodRes, revRes]) => {
        const prod = prodRes.data;
        setProduct(prod);
        setActiveImage(prod.imageUrl);
        setReviews(revRes.data.content);
        
        // Mặc định chọn size và color đầu tiên
        if (prod.variants && prod.variants.length > 0) {
          const defaultVariant = prod.variants[0];
          if (defaultVariant.size) setSelectedSize(defaultVariant.size);
          if (defaultVariant.color) setSelectedColor(defaultVariant.color);
        }
        
        // Fetch related products
        if (prodRes.data.categoryId) {
          getRelatedProducts(prodRes.data.categoryId, prodRes.data.id)
            .then(relRes => setRelatedProducts(relRes.data))
            .catch(() => {});
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    try {
      setSubmittingReview(true);
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

  // Tìm variant đang được chọn để lấy stock chính xác
  const currentVariant = product?.variants?.find(
    v => (v.size === selectedSize || (!v.size && !selectedSize)) && 
         (v.color === selectedColor || (!v.color && !selectedColor))
  );

  const availableStock = currentVariant ? currentVariant.stock : (product?.stock || 0);

  const handleAdd = () => {
    if (!product) return;
    
    // Tạo product copy với thông tin variant
    const cartProduct = {
      ...product,
      selectedVariantId: currentVariant?.id,
      selectedSize,
      selectedColor
    };

    addToCart({ ...cartProduct, _addQty: qty });
    
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  if (loading) return (
    <div className="pd-loading">
      <Loader2 size={40} className="spin" />
    </div>
  );

  if (!product) return (
    <div className="pd-loading">
      <p>Không tìm thấy sản phẩm.</p>
      <Link to="/" className="back-link"><ArrowLeft size={16}/> Về trang chủ</Link>
    </div>
  );

  const allImages = [product.imageUrl, ...(product.galleryImages || [])].filter(Boolean);

  return (
    <div className="pd-page">
      <div className="pd-container">
        <Link to="/" className="back-link"><ArrowLeft size={16}/> Tiếp tục mua sắm</Link>

        <div className="pd-grid">
          {/* Image Gallery */}
          <div className="pd-gallery">
            <div className="pd-img-wrap">
              <img
                src={activeImage || `https://picsum.photos/seed/${product.id}/600/500`}
                alt={product.name}
              />
              <div className="pd-img-shine" />
            </div>
            {allImages.length > 1 && (
              <div className="pd-thumbnails" style={{ display: 'flex', gap: '10px', marginTop: '15px', overflowX: 'auto' }}>
                {allImages.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt="Thumbnail" 
                    onClick={() => setActiveImage(img)}
                    style={{ 
                      width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer',
                      border: activeImage === img ? '2px solid var(--gold)' : '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="pd-info">
            {product.categoryName && (
              <span className="pd-category">{product.categoryName}</span>
            )}
            <h1 className="pd-name">{product.name}</h1>

            <div className="pd-rating">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14}
                  fill={i < Math.round(product.averageRating || 0) ? 'currentColor' : 'none'}
                  style={{ color: i < Math.round(product.averageRating || 0) ? 'var(--gold)' : 'var(--border)' }}
                />
              ))}
              <span>({product.reviewCount || 0} đánh giá)</span>
            </div>

            <div className="pd-price">{formatVND(product.price)}</div>

            <p className="pd-desc">
              {product.description || 'Sản phẩm chất lượng cao cấp, được tuyển chọn kỹ lưỡng.'}
            </p>

            <div className={`pd-stock ${availableStock === 0 ? 'out' : ''}`}>
              {availableStock > 0 ? `✓ Còn hàng (${availableStock} sản phẩm)` : '✗ Hết hàng'}
            </div>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="pd-variants">
                {/* Size Selector */}
                {Array.from(new Set(product.variants.map(v => v.size).filter(Boolean))).length > 0 && (
                  <div className="variant-group">
                    <h4>Kích cỡ:</h4>
                    <div className="variant-options">
                      {Array.from(new Set(product.variants.map(v => v.size).filter(Boolean))).map(s => (
                        <button 
                          key={s} 
                          className={`variant-btn ${selectedSize === s ? 'active' : ''}`}
                          onClick={() => { setSelectedSize(s); setQty(1); }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selector */}
                {Array.from(new Set(product.variants.map(v => v.color).filter(Boolean))).length > 0 && (
                  <div className="variant-group" style={{ marginTop: '15px' }}>
                    <h4>Màu sắc:</h4>
                    <div className="variant-options">
                      {Array.from(new Set(product.variants.map(v => v.color).filter(Boolean))).map(c => (
                        <button 
                          key={c} 
                          className={`variant-btn ${selectedColor === c ? 'active' : ''}`}
                          onClick={() => { setSelectedColor(c); setQty(1); }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Qty + Actions */}
            <div className="pd-actions" style={{ marginTop: '20px' }}>
              <div className="qty-wrap">
                <button onClick={() => setQty(v => Math.max(1, v - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(v => Math.min(availableStock || 99, v + 1))}>+</button>
              </div>
              <button
                className={`pd-add-btn ${added ? 'added' : ''}`}
                onClick={handleAdd}
                disabled={availableStock === 0}
              >
                <ShoppingBag size={18} />
                {added ? '✓ Đã thêm vào giỏ!' : 'Thêm vào giỏ hàng'}
              </button>
            </div>

            {/* View cart CTA */}
            {added && (
              <button className="pd-view-cart-btn" onClick={openModal}>
                <Eye size={15} /> Xem giỏ hàng →
              </button>
            )}

            <div className="pd-perks">
              <div className="perk"><Truck size={16}/><span>Miễn phí giao hàng toàn quốc</span></div>
              <div className="perk"><Shield size={16}/><span>Bảo hành 12 tháng chính hãng</span></div>
              <div className="perk"><RotateCcw size={16}/><span>Đổi trả trong vòng 30 ngày</span></div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="pd-related-section" style={{ marginTop: '60px', borderTop: '1px solid #eee', paddingTop: '40px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '30px', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>Sản phẩm Tương tự</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '30px' }}>
              {relatedProducts.map(rp => (
                <Link to={`/products/${rp.id}`} key={rp.id} style={{ textDecoration: 'none', color: 'inherit', display: 'block', transition: 'transform 0.3s' }} className="related-card">
                  <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px', marginBottom: '15px' }}>
                    <img src={rp.imageUrl || `https://picsum.photos/seed/${rp.id}/400/400`} alt={rp.name} style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rp.name}</h3>
                  <p style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{formatVND(rp.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="pd-reviews-section" style={{ marginTop: '60px', borderTop: '1px solid #eee', paddingTop: '40px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px', fontFamily: 'var(--font-serif)' }}>Đánh giá Sản phẩm</h2>
          
          <form onSubmit={handleReviewSubmit} style={{ marginBottom: '40px', background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '15px' }}>Viết đánh giá của bạn</h3>
            <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={20} 
                  onClick={() => setRating(star)}
                  style={{ cursor: 'pointer', color: star <= rating ? 'var(--gold)' : '#ccc' }}
                  fill={star <= rating ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <textarea 
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', minHeight: '80px', marginBottom: '15px', fontFamily: 'inherit' }}
            />
            <button 
              type="submit" 
              disabled={submittingReview}
              style={{ padding: '10px 20px', background: '#111', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
            >
              {submittingReview ? 'Đang gửi...' : 'Gửi Đánh Giá'}
            </button>
          </form>

          <div className="pd-reviews-list">
            {reviews.length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>Chưa có đánh giá nào cho sản phẩm này.</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <strong>{review.userName}</strong>
                    <div style={{ display: 'flex' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < review.rating ? 'var(--gold)' : 'none'} color={i < review.rating ? 'var(--gold)' : '#ccc'} />
                      ))}
                    </div>
                    <span style={{ color: '#999', fontSize: '12px', marginLeft: 'auto' }}>
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <p style={{ color: '#444', lineHeight: 1.5 }}>{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
