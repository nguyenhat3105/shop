import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

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
    <div className="min-h-screen pt-[calc(64px+3rem)] px-4 md:px-8 pb-20 max-w-[1280px] mx-auto">
      <div>
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-[0.8rem] font-medium text-text-muted hover:text-text transition-colors mb-8">
            <ArrowLeft size={16} /> Tiếp tục mua sắm
          </Link>
          <h1 className="font-serif text-[clamp(1.8rem,3vw,2.5rem)] font-medium text-text mb-2">
            Giỏ Hàng <span className="text-text-muted text-[0.82rem] font-sans">({cartCount})</span>
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-5 py-20 text-center text-text-muted">
            <div className="text-border-2"><ShoppingBag size={44} /></div>
            <p>Giỏ hàng của bạn đang trống.</p>
            <Link to="/" className="inline-flex items-center gap-1.5 px-6 py-3 bg-text text-white rounded-lg text-[0.8rem] font-semibold transition-colors hover:bg-brand-dark">Khám phá sản phẩm</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-8 items-start">
            {/* Item list */}
            <ul className="flex flex-col gap-3 list-none">
              {cart.map(item => (
                <li key={item.id} className="flex items-center gap-4 p-4 bg-surface border border-border rounded-xl">
                  <img
                    src={item.imageUrl || `https://picsum.photos/seed/${item.id}/80/80`}
                    alt={item.name}
                    className="w-[70px] h-[70px] rounded object-cover bg-bg-2 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.9rem] font-medium text-text truncate">{item.name}</p>
                    {item.categoryName && (
                      <p className="text-[0.65rem] text-accent uppercase tracking-[0.1em] mt-[2px]">{item.categoryName}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="block text-[0.78rem] text-text-muted mt-1">×{item.quantity}</span>
                    <span className="block font-medium text-text mt-1">
                      {formatVND(item.price * item.quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {/* Summary + CTA */}
            <div className="sticky top-[calc(64px+1rem)] bg-surface border border-border rounded-xl p-6 flex flex-col gap-3 relative md:sticky">
              <h2 className="font-serif text-[1.4rem] font-medium text-text mb-2">Tổng quan</h2>
              <div className="flex justify-between text-[0.85rem] text-text-2 py-1">
                <span>Tạm tính ({cartCount} sản phẩm)</span>
                <span>{formatVND(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-[0.85rem] text-text-2 py-1">
                <span>Vận chuyển</span>
                <span className="text-success font-medium">Miễn phí</span>
              </div>
              <div className="h-[1px] bg-border my-2" />
              <div className="flex justify-between text-[0.85rem] text-text-2 py-1 font-bold text-text text-base pt-2">
                <span>Tổng cộng</span>
                <span>{formatVND(cartTotal)}</span>
              </div>

              <button className="w-full mt-2 px-4 py-3.5 bg-text text-white border-none rounded text-[0.8rem] font-semibold uppercase tracking-[0.08em] flex items-center justify-center gap-2 transition-all hover:bg-brand-dark hover:-translate-y-[1px] cursor-pointer font-sans" onClick={openModal}>
                Tiến hành thanh toán →
              </button>
              <p className="text-[0.75rem] text-text-muted text-center mt-2">Nhấn để xem giỏ hàng đầy đủ &amp; điền thông tin giao hàng</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
