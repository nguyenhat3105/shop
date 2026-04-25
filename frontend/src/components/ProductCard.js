import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Heart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const [liked,  setLiked]  = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addToCart(product);          // ← triggers toast automatically via context
    setTimeout(() => setAdding(false), 900);
  };

  return (
    <article className="card" style={{ animationDelay: `${index * 0.07}s` }}>

      {/* Image */}
      <Link to={`/products/${product.id}`} className="card__img-wrap">
        <img
          src={product.imageUrl || `https://picsum.photos/seed/${product.id}/400/320`}
          alt={product.name}
          className="card__img"
          loading="lazy"
        />
        <div className="card__img-overlay" />

        {product.stock <= 5 && product.stock > 0 && (
          <span className="card__badge card__badge--low">Gần hết</span>
        )}
        {product.stock === 0 && (
          <span className="card__badge card__badge--sold">Hết hàng</span>
        )}

        <div className="card__hover-actions">
          <Link
            to={`/products/${product.id}`}
            className="card__icon-btn"
            onClick={e => e.stopPropagation()}
            title="Xem chi tiết"
          >
            <Eye size={16} />
          </Link>
          <button
            className={`card__icon-btn ${liked ? 'liked' : ''}`}
            onClick={e => { e.preventDefault(); setLiked(v => !v); }}
            title="Yêu thích"
          >
            <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </Link>

      {/* Body */}
      <div className="card__body">
        {product.categoryName && (
          <span className="card__category">{product.categoryName}</span>
        )}
        <Link to={`/products/${product.id}`} className="card__name">
          {product.name}
        </Link>

        <div className="card__rating">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={11}
              fill={i < 4 ? 'currentColor' : 'none'}
              className={i < 4 ? 'star-on' : 'star-off'}
            />
          ))}
          <span className="card__review-count">(128)</span>
        </div>

        <div className="card__footer">
          <span className="card__price">{formatVND(product.price)}</span>
          <button
            className={`card__add-btn ${adding ? 'adding' : ''}`}
            onClick={handleAdd}
            disabled={product.stock === 0 || adding}
          >
            <ShoppingBag size={15} />
            <span>{adding ? '✓ Đã thêm' : 'Thêm'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
