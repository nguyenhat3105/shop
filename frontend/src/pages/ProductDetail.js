import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Star, Truck, Shield, RotateCcw, Loader2, Eye } from 'lucide-react';
import { getProductById } from '../services/api';
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

  useEffect(() => {
    setLoading(true);
    setAdded(false);
    getProductById(id)
      .then(r => setProduct(r.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    if (!product) return;
    // Add qty times (or just add once and update — here we add once with quantity adjustment)
    addToCart({ ...product, _addQty: qty });
    // Since context adds 1 per call, call multiple times
    for (let i = 1; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleAddAndView = () => {
    handleAdd();
    setTimeout(openModal, 400);
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

  return (
    <div className="pd-page">
      <div className="pd-container">
        <Link to="/" className="back-link"><ArrowLeft size={16}/> Tiếp tục mua sắm</Link>

        <div className="pd-grid">
          {/* Image */}
          <div className="pd-img-wrap">
            <img
              src={product.imageUrl || `https://picsum.photos/seed/${product.id}/600/500`}
              alt={product.name}
            />
            <div className="pd-img-shine" />
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
                  fill={i < 4 ? 'currentColor' : 'none'}
                  style={{ color: i < 4 ? 'var(--gold)' : 'var(--border)' }}
                />
              ))}
              <span>(128 đánh giá)</span>
            </div>

            <div className="pd-price">{formatVND(product.price)}</div>

            <p className="pd-desc">
              {product.description || 'Sản phẩm chất lượng cao cấp, được tuyển chọn kỹ lưỡng.'}
            </p>

            <div className={`pd-stock ${product.stock === 0 ? 'out' : ''}`}>
              {product.stock > 0 ? `✓ Còn hàng (${product.stock} sản phẩm)` : '✗ Hết hàng'}
            </div>

            {/* Qty + Actions */}
            <div className="pd-actions">
              <div className="qty-wrap">
                <button onClick={() => setQty(v => Math.max(1, v - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(v => Math.min(product.stock || 99, v + 1))}>+</button>
              </div>
              <button
                className={`pd-add-btn ${added ? 'added' : ''}`}
                onClick={handleAdd}
                disabled={product.stock === 0}
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
      </div>
    </div>
  );
}
