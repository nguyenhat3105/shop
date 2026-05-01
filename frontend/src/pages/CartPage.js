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
    <div className="min-h-screen pt-[calc(4rem+3rem)] px-8 pb-20 max-w-7xl mx-auto">
      <div className="w-full">
        <div className="mb-10">
          <Link to="/" className="inline-flex items-center gap-1.5 text-[0.8rem] text-[#999] mb-4 transition-colors hover:text-[#111]">
            <ArrowLeft size={16} /> Tiếp tục mua sắm
          </Link>
          <h1 className="font-serif text-[clamp(1.8rem,3vw,2.5rem)] font-medium text-[#111] mb-2">
            Giỏ Hàng <span className="text-[#999]">({cartCount})</span>
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-5 py-20 text-center text-[#999]">
            <div className="text-black/10"><ShoppingBag size={44} /></div>
            <p>Giỏ hàng của bạn đang trống.</p>
            <Link to="/" className="inline-flex items-center gap-1.5 px-6 py-3 bg-[#111] text-white rounded-md text-[0.8rem] font-semibold transition-colors hover:bg-[#222]">
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-[1fr_340px] gap-8 items-start max-md:grid-cols-1">
            {/* Item list */}
            <ul className="flex flex-col gap-3">
              {cart.map(item => (
                <li key={item.id} className="flex items-center gap-4 p-4 bg-white border border-black/10 rounded-xl">
                  <img
                    src={item.imageUrl || `https://picsum.photos/seed/${item.id}/80/80`}
                    alt={item.name}
                    className="w-[70px] h-[70px] rounded-lg object-cover bg-[#f5f3ef] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.9rem] font-medium text-[#111] whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</p>
                    {item.categoryName && (
                      <p className="text-[0.65rem] text-[#b8955a] uppercase tracking-[0.1em] mt-0.5">{item.categoryName}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[0.8rem] text-[#999]">×{item.quantity}</span>
                    <span className="text-[0.9rem] font-semibold text-[#111]">
                      {formatVND(item.price * item.quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {/* Summary + CTA */}
            <div className="sticky top-[calc(4rem+1rem)] bg-white border border-black/10 rounded-xl p-6 flex flex-col gap-3 max-md:static max-md:top-0">
              <div className="flex justify-between text-[0.85rem] text-[#555] py-1">
                <span>Tạm tính ({cartCount} sản phẩm)</span>
                <span>{formatVND(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-[0.85rem] text-[#555] py-1">
                <span>Vận chuyển</span>
                <span className="text-[#3a7d52] font-medium">Miễn phí</span>
              </div>
              <div className="h-px bg-black/10 my-2" />
              <div className="flex justify-between items-center text-[#111] font-bold text-[1rem] pt-1">
                <span>Tổng cộng</span>
                <span className="text-[1.2rem]">{formatVND(cartTotal)}</span>
              </div>

              <button className="mt-4 w-full p-[0.85rem_1rem] bg-[#111] text-white border-none rounded-md text-[0.8rem] font-semibold tracking-[0.08em] uppercase flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-[#222] hover:-translate-y-px" onClick={openModal}>
                Tiến hành thanh toán →
              </button>
              <p className="text-[0.7rem] text-[#999] text-center mt-2">Nhấn để xem giỏ hàng đầy đủ &amp; điền thông tin giao hàng</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
