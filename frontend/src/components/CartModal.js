import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  X, Minus, Plus, Trash2, ShoppingBag,
  ChevronRight, CheckCircle, Loader2, Lock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrder, validateCoupon, createPaymentUrl } from '../services/api';
import './CartModal.css';

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
    <div className="cm-overlay" ref={overlayRef} onClick={handleOverlay}>
      <div className={`cm-panel ${modalOpen ? 'cm-panel--open' : ''}`}>

        {/* ── Header ── */}
        <div className="cm-header">
          <div className="cm-header__left">
            <ShoppingBag size={18} className="cm-header__icon" />
            <div>
              <h2 className="cm-title">
                {step === STEP_CART     && 'Giỏ Hàng'}
                {step === STEP_CHECKOUT && 'Thanh Toán'}
                {step === STEP_SUCCESS  && 'Đặt Hàng Thành Công'}
              </h2>
              {step === STEP_CART && (
                <p className="cm-subtitle">{cartCount} sản phẩm</p>
              )}
            </div>
          </div>
          <button className="cm-close" onClick={closeModal} aria-label="Đóng">
            <X size={20} />
          </button>
        </div>

        {/* ── Step indicator ── */}
        {step !== STEP_SUCCESS && (
          <div className="cm-steps">
            <div className={`cm-step ${step === STEP_CART ? 'active' : step === STEP_CHECKOUT ? 'done' : ''}`}>
              <span className="cm-step__dot">1</span>
              <span>Giỏ hàng</span>
            </div>
            <div className="cm-step__line" />
            <div className={`cm-step ${step === STEP_CHECKOUT ? 'active' : ''}`}>
              <span className="cm-step__dot">2</span>
              <span>Thông tin</span>
            </div>
          </div>
        )}

        {/* ════════════════ STEP: CART ════════════════ */}
        {step === STEP_CART && (
          <>
            <div className="cm-body">
              {cart.length === 0 ? (
                <div className="cm-empty">
                  <div className="cm-empty__icon"><ShoppingBag size={40} /></div>
                  <p>Giỏ hàng của bạn đang trống.</p>
                  <Link to="/" className="cm-shop-btn" onClick={closeModal}>
                    Khám phá sản phẩm <ChevronRight size={15} />
                  </Link>
                </div>
              ) : (
                <ul className="cm-list">
                  {cart.map(item => (
                    <li key={item.id} className="cm-item">
                      <img
                        src={item.imageUrl || `https://picsum.photos/seed/${item.id}/80/80`}
                        alt={item.name}
                        className="cm-item__img"
                      />
                      <div className="cm-item__info">
                        <p className="cm-item__name">{item.name}</p>
                        {item.categoryName && (
                          <p className="cm-item__cat">{item.categoryName}</p>
                        )}
                        <p className="cm-item__price">{formatVND(item.price)}</p>
                      </div>
                      <div className="cm-item__right">
                        <div className="cm-qty">
                          <button
                            className="cm-qty__btn"
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                          ><Minus size={12} /></button>
                          <span className="cm-qty__val">{item.quantity}</span>
                          <button
                            className="cm-qty__btn"
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                          ><Plus size={12} /></button>
                        </div>
                        <p className="cm-item__total">{formatVND(item.price * item.quantity)}</p>
                        <button
                          className="cm-item__del"
                          onClick={() => removeFromCart(item.id)}
                          title="Xoá"
                        ><Trash2 size={13} /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="cm-footer">
                <div className="cm-summary">
                  <div className="cm-summary__row">
                    <span>Tạm tính ({cartCount} sp)</span>
                    <span>{formatVND(cartTotal)}</span>
                  </div>
                  <div className="cm-summary__row">
                    <span>Phí vận chuyển</span>
                    <span className="free">Miễn phí</span>
                  </div>
                  <div className="cm-summary__divider" />
                  <div className="cm-summary__row cm-summary__row--total">
                    <span>Tổng cộng</span>
                    <span>{formatVND(cartTotal)}</span>
                  </div>
                </div>
                <button
                  className="cm-primary-btn"
                  onClick={() => setStep(STEP_CHECKOUT)}
                >
                  Tiến hành thanh toán <ChevronRight size={16} />
                </button>
                <button className="cm-ghost-btn" onClick={closeModal}>
                  Tiếp tục mua sắm
                </button>
              </div>
            )}
          </>
        )}

        {/* ════════════════ STEP: CHECKOUT ════════════════ */}
        {step === STEP_CHECKOUT && (
          <>
            <div className="cm-body">
              <div className="cm-checkout">
                {/* Order summary mini */}
                <div className="co-summary-mini">
                  <p className="co-label">Đơn hàng ({cartCount} sản phẩm)</p>
                  <div className="co-items-mini">
                    {cart.map(i => (
                      <div key={i.id} className="co-mini-item">
                        <img src={i.imageUrl || `https://picsum.photos/seed/${i.id}/40/40`} alt={i.name} />
                        <span>{i.name}</span>
                        <span className="co-mini-qty">×{i.quantity}</span>
                        <span className="co-mini-price">{formatVND(i.price * i.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="co-total-row">
                    <span>Tạm tính</span>
                    <span>{formatVND(cartTotal)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="co-total-row" style={{ color: 'var(--success)' }}>
                      <span>Giảm giá ({appliedCoupon.code})</span>
                      <span>-{formatVND(discountAmount)}</span>
                    </div>
                  )}
                  <div className="co-total-row" style={{ fontWeight: 600, fontSize: '1.1rem', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                    <span>Tổng cộng</span>
                    <span>{formatVND(finalTotal)}</span>
                  </div>

                  {/* Coupon Form */}
                  <div style={{ marginTop: '15px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        placeholder="Mã giảm giá" 
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        className="co-input"
                        style={{ margin: 0, textTransform: 'uppercase' }}
                        disabled={appliedCoupon != null}
                      />
                      <button 
                        onClick={appliedCoupon ? () => { setAppliedCoupon(null); setDiscountAmount(0); setCouponCodeInput(''); } : handleApplyCoupon}
                        style={{ padding: '0 15px', background: appliedCoupon ? '#ff4d4f' : '#111', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                      >
                        {appliedCoupon ? 'Huỷ' : 'Áp dụng'}
                      </button>
                    </div>
                    {couponError && <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{couponError}</p>}
                  </div>
                </div>

                {/* Form fields */}
                <div className="co-form">
                  <p className="co-label">Thông tin giao hàng</p>

                  <Field label="Họ và tên *" error={errors.customerName}>
                    <input
                      placeholder="Nguyễn Văn A"
                      value={form.customerName}
                      onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
                      className={`co-input ${errors.customerName ? 'err' : ''}`}
                    />
                  </Field>

                  <Field label="Email *" error={errors.customerEmail}>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={form.customerEmail}
                      onChange={e => setForm(f => ({ ...f, customerEmail: e.target.value }))}
                      className={`co-input ${errors.customerEmail ? 'err' : ''}`}
                    />
                  </Field>

                  <Field label="Số điện thoại" error={errors.phone}>
                    <input
                      type="tel"
                      placeholder="0901 234 567"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="co-input"
                    />
                  </Field>

                  <Field label="Địa chỉ giao hàng *" error={errors.address}>
                    <textarea
                      rows={2}
                      placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                      value={form.address}
                      onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                      className={`co-input co-textarea ${errors.address ? 'err' : ''}`}
                    />
                  </Field>

                  <div className="co-field" style={{ marginTop: '15px' }}>
                    <label className="co-field__label">Phương thức thanh toán</label>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="COD" 
                          checked={paymentMethod === 'COD'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        Thanh toán khi nhận hàng (COD)
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
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

            <div className="cm-footer">
              <button
                className="cm-primary-btn"
                onClick={handleOrder}
                disabled={loading}
              >
                {loading
                  ? <><Loader2 size={16} className="spin" /> Đang xử lý...</>
                  : <><Lock size={15} /> Đặt Hàng — {formatVND(finalTotal)}</>
                }
              </button>
              <button
                className="cm-ghost-btn"
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
          <div className="cm-body cm-success">
            <div className="success-ring">
              <CheckCircle size={52} />
            </div>
            <h3>Cảm ơn bạn đã đặt hàng!</h3>
            <p>Mã đơn: <strong className="order-ref">#{orderRef}</strong></p>
            <p className="success-sub">
              Chúng tôi sẽ gửi xác nhận đến <strong>{form.customerEmail}</strong> và liên hệ sớm nhất.
            </p>
            <Link
              to="/"
              className="cm-primary-btn"
              style={{ display: 'inline-flex', marginTop: '1rem' }}
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
    <div className="co-field">
      <label className="co-field__label">{label}</label>
      {children}
      {error && <p className="co-field__error">{error}</p>}
    </div>
  );
}
