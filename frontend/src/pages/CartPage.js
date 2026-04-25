import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CartPage.css';

/*
  CartPage giờ chỉ là một trang giới thiệu giỏ hàng
  và mời người dùng mở CartModal để thanh toán.
  Toàn bộ logic checkout đã chuyển sang CartModal.
*/
export default function CartPage() {
  const { cart, cartCount, cartTotal, openModal } = useCart();

  const formatVND = (n) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-top">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} /> Tiếp tục mua sắm
          </Link>
          <h1 className="cart-title">
            Giỏ Hàng <span className="cart-count">({cartCount})</span>
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty__icon"><ShoppingBag size={44} /></div>
            <p>Giỏ hàng của bạn đang trống.</p>
            <Link to="/" className="back-home-btn">Khám phá sản phẩm</Link>
          </div>
        ) : (
          <div className="cart-preview">
            {/* Item list */}
            <ul className="cp-list">
              {cart.map(item => (
                <li key={item.id} className="cp-item">
                  <img
                    src={item.imageUrl || `https://picsum.photos/seed/${item.id}/80/80`}
                    alt={item.name}
                    className="cp-item__img"
                  />
                  <div className="cp-item__info">
                    <p className="cp-item__name">{item.name}</p>
                    {item.categoryName && (
                      <p className="cp-item__cat">{item.categoryName}</p>
                    )}
                  </div>
                  <div className="cp-item__right">
                    <span className="cp-item__qty">×{item.quantity}</span>
                    <span className="cp-item__total">
                      {formatVND(item.price * item.quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {/* Summary + CTA */}
            <div className="cp-summary-box">
              <div className="cp-row">
                <span>Tạm tính ({cartCount} sản phẩm)</span>
                <span>{formatVND(cartTotal)}</span>
              </div>
              <div className="cp-row">
                <span>Vận chuyển</span>
                <span className="free">Miễn phí</span>
              </div>
              <div className="cp-divider" />
              <div className="cp-row cp-row--total">
                <span>Tổng cộng</span>
                <span>{formatVND(cartTotal)}</span>
              </div>

              <button className="cp-checkout-btn" onClick={openModal}>
                Tiến hành thanh toán →
              </button>
              <p className="cp-hint">Nhấn để xem giỏ hàng đầy đủ &amp; điền thông tin giao hàng</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
