import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  X, Minus, Plus, Trash2, ShoppingBag,
  ChevronRight, CheckCircle, Loader2, Lock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrder, validateCoupon, createPaymentUrl } from '../services/api';
import { cn } from './ui/Skeleton';

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

/* ── Steps ── */
const STEP_CART     = 'cart';
const STEP_CHECKOUT = 'checkout';
const STEP_SUCCESS  = 'success';

export default function CartModal() {
  const { cart, cartTotal, cartCount, removeFromCart, updateQty, clearCart,
          modalOpen, closeModal, addToast } = useCart();

  const [step, setStep]     = useState(STEP_CART);
  const [form, setForm]     = useState({ customerName: '', customerEmail: '', phone: '', address: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [orderRef, setOrderRef] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  
  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const overlayRef = useRef(null);

  /* Reset to cart step when modal re-opens */
  useEffect(() => {
    if (modalOpen) setStep(STEP_CART);
  }, [modalOpen]);

  /* Trap scroll when open */
  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalOpen]);

  /* Close on overlay click */
  const handleOverlay = (e) => {
    if (e.target === overlayRef.current) closeModal();
  };

  /* ── Validation ── */
  const validate = () => {
    const errs = {};
    if (!form.customerName.trim())  errs.customerName  = 'Vui lòng nhập họ tên.';
    if (!form.customerEmail.trim()) errs.customerEmail = 'Vui lòng nhập email.';
    else if (!/\S+@\S+\.\S+/.test(form.customerEmail))
      errs.customerEmail = 'Email không hợp lệ.';
    if (!form.address.trim()) errs.address = 'Vui lòng nhập địa chỉ.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) return;
    setCouponError('');
    try {
      const res = await validateCoupon(couponCodeInput, cartTotal);
      setAppliedCoupon(res.data);
      if (res.data.discountType === 'PERCENT') {
        setDiscountAmount((cartTotal * res.data.discountValue) / 100);
      } else {
        setDiscountAmount(res.data.discountValue);
      }
      addToast('Áp dụng mã giảm giá thành công!', 'success');
    } catch (err) {
      setCouponError(err.response?.data || 'Mã giảm giá không hợp lệ.');
      setAppliedCoupon(null);
      setDiscountAmount(0);
    }
  };

  const finalTotal = Math.max(0, cartTotal - discountAmount);

  /* ── Place order ── */
  const handleOrder = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await createOrder({
        customerName:  form.customerName,
        customerEmail: form.customerEmail,
        phone: form.phone,
        address: form.address,
        paymentMethod: paymentMethod,
        totalAmount:   finalTotal,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        items: cart.map(i => ({
          productId: i.id,
          quantity:  i.quantity,
          unitPrice: i.price,
          productVariantId: i.selectedVariantId
        })),
      });
      const orderId = res?.data?.id;
      setOrderRef(orderId || 'ORD-' + Date.now());
      clearCart();
      
      if (paymentMethod === 'VNPAY' && orderId) {
        const payRes = await createPaymentUrl(orderId);
        window.location.href = payRes.data.url;
        return;
      }
      
      setStep(STEP_SUCCESS);
    } catch {
      addToast('Đặt hàng thất bại. Vui lòng thử lại!', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!modalOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[500] bg-black/45 backdrop-blur-[3px] flex justify-end animate-in fade-in duration-250"
      ref={overlayRef} 
      onClick={handleOverlay}
    >
      <div 
        className={cn(
          "relative w-full max-w-[480px] h-full bg-white border-l border-black/10 flex flex-col overflow-hidden shadow-[-8px_0_40px_rgba(0,0,0,0.1)] transition-transform duration-[380ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          modalOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={18} className="text-[#b8955a]" />
            <div>
              <h2 className="font-serif text-[1.2rem] font-semibold text-[#111] leading-[1.2]">
                {step === STEP_CART     && 'Giỏ Hàng'}
                {step === STEP_CHECKOUT && 'Thanh Toán'}
                {step === STEP_SUCCESS  && 'Đặt Hàng Thành Công'}
              </h2>
              {step === STEP_CART && (
                <p className="text-[0.73rem] text-[#999] mt-px">{cartCount} sản phẩm</p>
              )}
            </div>
          </div>
          <button 
            className="w-[34px] h-[34px] flex items-center justify-center bg-[#f5f3ef] border border-black/10 rounded-full text-[#999] transition-all hover:bg-[#eeebe5] hover:text-[#111] hover:rotate-90"
            onClick={closeModal} 
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Step indicator ── */}
        {step !== STEP_SUCCESS && (
          <div className="flex items-center px-6 py-[0.85rem] border-b border-black/10 shrink-0">
            <div className={cn("flex items-center gap-[7px] font-[0.75rem] transition-colors", step === STEP_CART ? "text-[#111]" : step === STEP_CHECKOUT ? "text-[#3a7d52]" : "text-[#999]")}>
              <span className={cn("w-[21px] h-[21px] rounded-full border flex items-center justify-center text-[0.68rem] font-bold shrink-0 transition-all", step === STEP_CART ? "bg-[#111] border-[#111] text-white" : step === STEP_CHECKOUT ? "bg-[#3a7d52] border-[#3a7d52] text-white" : "bg-[#f5f3ef] border-black/10 text-[#999]")}>1</span>
              <span className="text-sm">Giỏ hàng</span>
            </div>
            <div className="flex-1 h-px bg-black/10 mx-2.5" />
            <div className={cn("flex items-center gap-[7px] font-[0.75rem] transition-colors", step === STEP_CHECKOUT ? "text-[#111]" : "text-[#999]")}>
              <span className={cn("w-[21px] h-[21px] rounded-full border flex items-center justify-center text-[0.68rem] font-bold shrink-0 transition-all", step === STEP_CHECKOUT ? "bg-[#111] border-[#111] text-white" : "bg-[#f5f3ef] border-black/10 text-[#999]")}>2</span>
              <span className="text-sm">Thông tin</span>
            </div>
          </div>
        )}

        {/* ════════════════ STEP: CART ════════════════ */}
        {step === STEP_CART && (
          <>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-16 text-center text-[#999]">
                  <div className="w-[68px] h-[68px] rounded-full bg-[#f5f3ef] border border-black/10 flex items-center justify-center text-[#b8955a] opacity-70"><ShoppingBag size={40} /></div>
                  <p>Giỏ hàng của bạn đang trống.</p>
                  <Link to="/" className="inline-flex items-center gap-1.5 mt-2 px-5 py-2 bg-[#111] text-white rounded-full text-[0.78rem] font-semibold transition-all hover:bg-[#b8955a] hover:-translate-y-px" onClick={closeModal}>
                    Khám phá sản phẩm <ChevronRight size={15} />
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  {cart.map(item => (
                    <li key={item.cartItemId} className="flex items-center gap-3 p-[0.85rem] bg-[#f5f3ef] border border-black/10 rounded-xl transition-colors hover:border-black/[0.13]">
                      <img
                        src={item.imageUrl || `https://picsum.photos/seed/${item.id}/80/80`}
                        alt={item.name}
                        className="w-14 h-14 rounded-lg object-cover bg-[#eeebe5] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[0.85rem] font-medium text-[#111] whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</p>
                        {item.categoryName && (
                          <p className="text-[0.62rem] uppercase tracking-[0.1em] text-[#b8955a] mt-0.5">{item.categoryName}</p>
                        )}
                        {(item.selectedSize || item.selectedColor) && (
                          <p className="text-[12px] text-[#666] mb-1">
                            {item.selectedSize && `Size: ${item.selectedSize}`}
                            {item.selectedSize && item.selectedColor && ' | '}
                            {item.selectedColor && `Màu: ${item.selectedColor}`}
                          </p>
                        )}
                        <p className="text-[0.76rem] text-[#999] mt-1">{formatVND(item.price)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <div className="flex items-center border border-black/10 rounded-md overflow-hidden">
                          <button
                            className="w-[26px] h-[26px] bg-[#f5f3ef] text-[#111] flex items-center justify-center transition-colors hover:bg-[#eeebe5]"
                            onClick={() => updateQty(item.cartItemId, item.quantity - 1)}
                          ><Minus size={12} /></button>
                          <span className="min-w-[26px] text-center text-[0.8rem] font-semibold text-[#111] px-1">{item.quantity}</span>
                          <button
                            className="w-[26px] h-[26px] bg-[#f5f3ef] text-[#111] flex items-center justify-center transition-colors hover:bg-[#eeebe5]"
                            onClick={() => updateQty(item.cartItemId, item.quantity + 1)}
                          ><Plus size={12} /></button>
                        </div>
                        <p className="font-serif font-semibold text-[0.95rem] text-[#111]">{formatVND(item.price * item.quantity)}</p>
                        <button
                          className="w-[26px] h-[26px] bg-transparent border border-black/10 rounded-md text-[#999] flex items-center justify-center transition-all hover:border-[#c0392b] hover:text-[#c0392b] hover:bg-[#c0392b]/5"
                          onClick={() => removeFromCart(item.cartItemId)}
                          title="Xoá"
                        ><Trash2 size={13} /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 sm:p-[1.1rem_1.5rem] border-t border-black/10 shrink-0 flex flex-col gap-2">
                <div className="mb-2">
                  <div className="flex justify-between text-[0.83rem] text-[#999] py-1">
                    <span>Tạm tính ({cartCount} sp)</span>
                    <span>{formatVND(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-[0.83rem] text-[#999] py-1">
                    <span>Phí vận chuyển</span>
                    <span className="text-[#3a7d52] font-semibold">Miễn phí</span>
                  </div>
                  <div className="h-px bg-black/10 my-1.5" />
                  <div className="flex justify-between text-[1rem] font-bold text-[#111] py-1">
                    <span>Tổng cộng</span>
                    <span>{formatVND(cartTotal)}</span>
                  </div>
                </div>
                <button
                  className="w-full flex items-center justify-center gap-2 p-[0.85rem_1rem] bg-[#111] text-white border-none rounded-md text-[0.85rem] font-semibold tracking-[0.08em] uppercase transition-all hover:bg-[#2d2d2d] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setStep(STEP_CHECKOUT)}
                >
                  Tiến hành thanh toán <ChevronRight size={16} />
                </button>
                <button className="w-full p-[0.65rem_1rem] bg-transparent border border-black/10 rounded-md text-[#555] text-[0.8rem] transition-colors hover:border-black/[0.13] hover:text-[#111]" onClick={closeModal}>
                  Tiếp tục mua sắm
                </button>
              </div>
            )}
          </>
        )}

        {/* ════════════════ STEP: CHECKOUT ════════════════ */}
        {step === STEP_CHECKOUT && (
          <>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="flex flex-col gap-5">
                {/* Order summary mini */}
                <div className="bg-[#f5f3ef] border border-black/10 rounded-xl p-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.12em] text-[#b8955a] font-semibold mb-3">Đơn hàng ({cartCount} sản phẩm)</p>
                  <div className="flex flex-col gap-2 mb-3">
                    {cart.map(i => (
                      <div key={i.cartItemId} className="flex items-start gap-2 text-[0.78rem] text-[#999]">
                        <img src={i.imageUrl || `https://picsum.photos/seed/${i.id}/40/40`} alt={i.name} className="w-[26px] h-[26px] rounded object-cover shrink-0" />
                        <div className="flex flex-col flex-1 pr-2.5">
                          <span>{i.name}</span>
                          {(i.selectedSize || i.selectedColor) && (
                            <span className="text-[11px] text-[#888] mt-0.5">
                              {i.selectedSize && `Size: ${i.selectedSize}`}
                              {i.selectedSize && i.selectedColor && ' | '}
                              {i.selectedColor && `Màu: ${i.selectedColor}`}
                            </span>
                          )}
                        </div>
                        <span className="text-[#999] mt-0.5">×{i.quantity}</span>
                        <span className="text-[#111] font-semibold ml-auto mt-0.5">{formatVND(i.price * i.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-semibold text-[0.88rem] text-[#111] border-t border-black/10 pt-2.5">
                    <span>Tạm tính</span>
                    <span>{formatVND(cartTotal)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between font-semibold text-[0.88rem] text-[#3a7d52] border-t border-black/10 pt-2.5 mt-2">
                      <span>Giảm giá ({appliedCoupon.code})</span>
                      <span>-{formatVND(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-[1.1rem] text-[#111] border-t border-black/10 pt-2.5 mt-2.5">
                    <span>Tổng cộng</span>
                    <span>{formatVND(finalTotal)}</span>
                  </div>

                  {/* Coupon Form */}
                  <div className="mt-4">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Mã giảm giá" 
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        className="w-full p-[0.65rem_0.9rem] bg-white border border-black/10 rounded-md text-[#111] text-[0.85rem] outline-none uppercase transition-all focus:border-black/[0.13] focus:ring-[3px] focus:ring-black/[0.04] disabled:bg-gray-100"
                        disabled={appliedCoupon != null}
                      />
                      <button 
                        onClick={appliedCoupon ? () => { setAppliedCoupon(null); setDiscountAmount(0); setCouponCodeInput(''); } : handleApplyCoupon}
                        className={cn("px-4 text-white border-none rounded-md cursor-pointer whitespace-nowrap", appliedCoupon ? "bg-[#ff4d4f]" : "bg-[#111]")}
                      >
                        {appliedCoupon ? 'Huỷ' : 'Áp dụng'}
                      </button>
                    </div>
                    {couponError && <p className="text-red-500 text-xs mt-1.5">{couponError}</p>}
                  </div>
                </div>

                {/* Form fields */}
                <div className="flex flex-col gap-3">
                  <p className="text-[0.68rem] uppercase tracking-[0.12em] text-[#b8955a] font-semibold mb-1">Thông tin giao hàng</p>

                  <Field label="Họ và tên *" error={errors.customerName}>
                    <input
                      placeholder="Nguyễn Văn A"
                      value={form.customerName}
                      onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
                      className={cn("w-full p-[0.65rem_0.9rem] bg-white border border-black/10 rounded-md text-[#111] text-[0.85rem] outline-none transition-all focus:border-black/[0.13] focus:ring-[3px] focus:ring-black/[0.04]", errors.customerName ? 'border-[#c0392b]/40' : '')}
                    />
                  </Field>

                  <Field label="Email *" error={errors.customerEmail}>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={form.customerEmail}
                      onChange={e => setForm(f => ({ ...f, customerEmail: e.target.value }))}
                      className={cn("w-full p-[0.65rem_0.9rem] bg-white border border-black/10 rounded-md text-[#111] text-[0.85rem] outline-none transition-all focus:border-black/[0.13] focus:ring-[3px] focus:ring-black/[0.04]", errors.customerEmail ? 'border-[#c0392b]/40' : '')}
                    />
                  </Field>

                  <Field label="Số điện thoại" error={errors.phone}>
                    <input
                      type="tel"
                      placeholder="0901 234 567"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full p-[0.65rem_0.9rem] bg-white border border-black/10 rounded-md text-[#111] text-[0.85rem] outline-none transition-all focus:border-black/[0.13] focus:ring-[3px] focus:ring-black/[0.04]"
                    />
                  </Field>

                  <Field label="Địa chỉ giao hàng *" error={errors.address}>
                    <textarea
                      rows={2}
                      placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                      value={form.address}
                      onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                      className={cn("w-full p-[0.65rem_0.9rem] bg-white border border-black/10 rounded-md text-[#111] text-[0.85rem] outline-none resize-none transition-all focus:border-black/[0.13] focus:ring-[3px] focus:ring-black/[0.04]", errors.address ? 'border-[#c0392b]/40' : '')}
                    />
                  </Field>

                  <div className="flex flex-col gap-1 mt-4">
                    <label className="text-[0.72rem] font-semibold tracking-[0.04em] text-[#555]">Phương thức thanh toán</label>
                    <div className="flex flex-col sm:flex-row gap-4 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-sm">
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="COD" 
                          checked={paymentMethod === 'COD'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        Thanh toán khi nhận hàng (COD)
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-sm">
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="VNPAY" 
                          checked={paymentMethod === 'VNPAY'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        Thanh toán qua VNPay
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-[1.1rem_1.5rem] border-t border-black/10 shrink-0 flex flex-col gap-2">
              <button
                className="w-full flex items-center justify-center gap-2 p-[0.85rem_1rem] bg-[#111] text-white border-none rounded-md text-[0.85rem] font-semibold tracking-[0.08em] uppercase transition-all hover:bg-[#2d2d2d] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleOrder}
                disabled={loading}
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Đang xử lý...</>
                  : <><Lock size={15} /> Đặt Hàng — {formatVND(finalTotal)}</>
                }
              </button>
              <button
                className="w-full p-[0.65rem_1rem] bg-transparent border border-black/10 rounded-md text-[#555] text-[0.8rem] transition-colors hover:border-black/[0.13] hover:text-[#111] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setStep(STEP_CART)}
                disabled={loading}
              >
                ← Quay lại giỏ hàng
              </button>
            </div>
          </>
        )}

        {/* ════════════════ STEP: SUCCESS ════════════════ */}
        {step === STEP_SUCCESS && (
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center text-center gap-3 p-6 min-h-[400px]">
            <div className="w-[86px] h-[86px] rounded-full bg-[#3a7d52]/10 border-2 border-[#3a7d52]/25 flex items-center justify-center text-[#3a7d52] animate-in zoom-in duration-500">
              <CheckCircle size={52} />
            </div>
            <h3 className="font-serif text-[1.4rem] font-semibold text-[#111]">Cảm ơn bạn đã đặt hàng!</h3>
            <p className="text-sm">Mã đơn: <strong className="text-[#b8955a] font-mono tracking-[0.05em]">#{orderRef}</strong></p>
            <p className="text-[0.83rem] text-[#999] leading-[1.6] max-w-[300px]">
              Chúng tôi sẽ gửi xác nhận đến <strong className="text-[#555]">{form.customerEmail}</strong> và liên hệ sớm nhất.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 mt-4 p-[0.85rem_1rem] bg-[#111] text-white border-none rounded-md text-[0.85rem] font-semibold tracking-[0.08em] uppercase transition-all hover:bg-[#2d2d2d] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)]"
              onClick={closeModal}
            >
              Tiếp tục mua sắm <ChevronRight size={16} />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

/* ── Small helper component for form fields ── */
function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[0.72rem] font-semibold tracking-[0.04em] text-[#555]">{label}</label>
      {children}
      {error && <p className="text-[0.72rem] text-[#c0392b]">{error}</p>}
    </div>
  );
}
