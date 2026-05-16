import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  X, Minus, Plus, Trash2, ShoppingBag,
  ChevronRight, CheckCircle, Loader2, Lock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrder, validateCoupon, createPaymentUrl } from '../services/api';

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
      className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity duration-300 flex justify-end ${modalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
      ref={overlayRef} 
      onClick={handleOverlay}
    >
      <div className={`w-full max-w-[420px] h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${modalOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* ── Header ── */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-900">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-gray-900 leading-tight">
                {step === STEP_CART     && 'Giỏ Hàng'}
                {step === STEP_CHECKOUT && 'Thanh Toán'}
                {step === STEP_SUCCESS  && 'Đặt Hàng Thành Công'}
              </h2>
              {step === STEP_CART && (
                <p className="text-xs text-gray-500 mt-0.5">{cartCount} sản phẩm</p>
              )}
            </div>
          </div>
          <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors" onClick={closeModal} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>

        {/* ── Step indicator ── */}
        {step !== STEP_SUCCESS && (
          <div className="flex items-center px-6 py-4 border-b border-gray-50 bg-gray-50/50">
            <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors ${step === STEP_CART ? 'text-gray-900' : 'text-gray-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === STEP_CART ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'}`}>1</span>
              <span>Giỏ hàng</span>
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-4" />
            <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors ${step === STEP_CHECKOUT ? 'text-gray-900' : 'text-gray-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === STEP_CHECKOUT ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'}`}>2</span>
              <span>Thông tin</span>
            </div>
          </div>
        )}

        {/* ════════════════ STEP: CART ════════════════ */}
        {step === STEP_CART && (
          <>
            <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                    <ShoppingBag size={32} />
                  </div>
                  <p className="text-gray-500 mb-6">Giỏ hàng của bạn đang trống.</p>
                  <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg text-sm font-semibold tracking-wide hover:bg-gray-800 transition-colors" onClick={closeModal}>
                    Khám phá sản phẩm <ChevronRight size={15} />
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col gap-5">
                  {cart.map(item => (
                    <li key={item.cartItemId} className="flex gap-4 group">
                      <img
                        src={item.imageUrl || `https://picsum.photos/seed/${item.id}/80/80`}
                        alt={item.name}
                        className="w-20 h-24 object-cover rounded-md border border-gray-100"
                      />
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <p className="font-medium text-gray-900 text-sm leading-tight line-clamp-2">{item.name}</p>
                          {item.categoryName && (
                            <p className="text-[10px] uppercase tracking-wider text-accent mt-1">{item.categoryName}</p>
                          )}
                          {(item.selectedSize || item.selectedColor) && (
                            <p className="text-xs text-gray-500 mt-1">
                              {item.selectedSize && `Size: ${item.selectedSize}`}
                              {item.selectedSize && item.selectedColor && ' | '}
                              {item.selectedColor && `Màu: ${item.selectedColor}`}
                            </p>
                          )}
                          <p className="font-serif font-semibold text-gray-900 mt-1">{formatVND(item.price)}</p>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-gray-200 rounded">
                            <button
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                              onClick={() => updateQty(item.cartItemId, item.quantity - 1)}
                            ><Minus size={12} /></button>
                            <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                            <button
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                              onClick={() => updateQty(item.cartItemId, item.quantity + 1)}
                            ><Plus size={12} /></button>
                          </div>
                          <button
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            onClick={() => removeFromCart(item.cartItemId)}
                            title="Xoá"
                          ><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 border-t border-gray-100 bg-gray-50">
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tạm tính ({cartCount} sp)</span>
                    <span className="font-medium text-gray-900">{formatVND(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className="text-green-600 font-medium">Miễn phí</span>
                  </div>
                  <div className="h-px w-full bg-gray-200 my-2" />
                  <div className="flex justify-between text-base">
                    <span className="font-semibold text-gray-900">Tổng cộng</span>
                    <span className="font-serif text-xl font-bold text-gray-900">{formatVND(cartTotal)}</span>
                  </div>
                </div>
                <button
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 text-white rounded-lg text-sm font-bold tracking-wide uppercase hover:bg-accent transition-colors shadow-md"
                  onClick={() => setStep(STEP_CHECKOUT)}
                >
                  Tiến hành thanh toán <ChevronRight size={16} />
                </button>
                <button className="w-full mt-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors" onClick={closeModal}>
                  Tiếp tục mua sắm
                </button>
              </div>
            )}
          </>
        )}

        {/* ════════════════ STEP: CHECKOUT ════════════════ */}
        {step === STEP_CHECKOUT && (
          <>
            <div className="flex-1 overflow-y-auto p-5 scrollbar-hide bg-gray-50">
              <div className="flex flex-col gap-6">
                {/* Order summary mini */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">Đơn hàng ({cartCount} sản phẩm)</p>
                  <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-1 scrollbar-hide">
                    {cart.map(i => (
                      <div key={i.cartItemId} className="flex items-start gap-3">
                        <img src={i.imageUrl || `https://picsum.photos/seed/${i.id}/40/40`} alt={i.name} className="w-12 h-12 object-cover rounded border border-gray-100" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 line-clamp-1">{i.name}</p>
                          {(i.selectedSize || i.selectedColor) && (
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              {i.selectedSize && `Size: ${i.selectedSize}`}
                              {i.selectedSize && i.selectedColor && ' | '}
                              {i.selectedColor && `Màu: ${i.selectedColor}`}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">×{i.quantity}</p>
                          <p className="text-xs font-medium text-gray-900 mt-0.5">{formatVND(i.price * i.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Tạm tính</span>
                      <span className="font-medium text-gray-900">{formatVND(cartTotal)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá ({appliedCoupon.code})</span>
                        <span className="font-medium">-{formatVND(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
                      <span className="font-semibold text-gray-900">Tổng cộng</span>
                      <span className="font-serif text-lg font-bold text-accent">{formatVND(finalTotal)}</span>
                    </div>
                  </div>

                  {/* Coupon Form */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Mã giảm giá" 
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded uppercase text-sm focus:outline-none focus:border-gray-900 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                        disabled={appliedCoupon != null}
                      />
                      <button 
                        onClick={appliedCoupon ? () => { setAppliedCoupon(null); setDiscountAmount(0); setCouponCodeInput(''); } : handleApplyCoupon}
                        className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${appliedCoupon ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                      >
                        {appliedCoupon ? 'Huỷ' : 'Áp dụng'}
                      </button>
                    </div>
                    {couponError && <p className="text-red-500 text-xs mt-1.5">{couponError}</p>}
                  </div>
                </div>

                {/* Form fields */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Thông tin giao hàng</p>

                  <div className="space-y-4">
                    <Field label="Họ và tên *" error={errors.customerName}>
                      <input
                        placeholder="Nguyễn Văn A"
                        value={form.customerName}
                        onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors ${errors.customerName ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:border-gray-900'}`}
                      />
                    </Field>

                    <Field label="Email *" error={errors.customerEmail}>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={form.customerEmail}
                        onChange={e => setForm(f => ({ ...f, customerEmail: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors ${errors.customerEmail ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:border-gray-900'}`}
                      />
                    </Field>

                    <Field label="Số điện thoại" error={errors.phone}>
                      <input
                        type="tel"
                        placeholder="0901 234 567"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 transition-colors"
                      />
                    </Field>

                    <Field label="Địa chỉ giao hàng *" error={errors.address}>
                      <textarea
                        rows={2}
                        placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                        value={form.address}
                        onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors resize-none ${errors.address ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:border-gray-900'}`}
                      />
                    </Field>

                    <div className="pt-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Phương thức thanh toán</label>
                      <div className="flex flex-col gap-2">
                        <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="COD" 
                            checked={paymentMethod === 'COD'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4 text-gray-900 focus:ring-gray-900"
                          />
                          <span className="text-sm font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</span>
                        </label>
                        <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'VNPAY' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="VNPAY" 
                            checked={paymentMethod === 'VNPAY'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4 text-gray-900 focus:ring-gray-900"
                          />
                          <span className="text-sm font-medium text-gray-900">Thanh toán qua VNPay</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
              <button
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 text-white rounded-lg text-sm font-bold tracking-wide uppercase hover:bg-accent disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md"
                onClick={handleOrder}
                disabled={loading}
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Đang xử lý...</>
                  : <><Lock size={15} /> Đặt Hàng — {formatVND(finalTotal)}</>
                }
              </button>
              <button
                className="w-full mt-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50"
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
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50">
            <div className="w-20 h-20 rounded-full bg-green-100 text-green-500 flex items-center justify-center mb-6 animate-fadeUp">
              <CheckCircle size={40} />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-gray-900 mb-2">Cảm ơn bạn đã đặt hàng!</h3>
            <p className="text-gray-600 mb-4">Mã đơn: <strong className="text-gray-900 bg-white px-2 py-1 rounded border border-gray-200">#{orderRef}</strong></p>
            <p className="text-sm text-gray-500 mb-8 max-w-[280px]">
              Chúng tôi sẽ gửi xác nhận đến <strong className="text-gray-700">{form.customerEmail}</strong> và liên hệ sớm nhất.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg text-sm font-semibold tracking-wide hover:bg-gray-800 transition-colors shadow-md"
              onClick={closeModal}
            >
              Tiếp tục mua sắm <ChevronRight size={15} />
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
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-700">{label}</label>
      {children}
      {error && <p className="text-[10px] text-red-500">{error}</p>}
    </div>
  );
}
