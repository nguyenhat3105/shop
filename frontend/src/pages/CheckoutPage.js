import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check, MapPin, Truck, CreditCard, ChevronRight, Plus, Edit2, Trash2,
  Loader2, Tag, X, AlertCircle, Zap,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  getMyAddresses, createAddress, updateAddress,
  deleteAddress, setDefaultAddress,
} from '../services/addressApi';
import { createOrder, validateCoupon, calculateShipping } from '../services/api';
import AddressForm from '../components/AddressForm';

const STEPS = [
  { id: 1, label: 'Địa chỉ',    icon: <MapPin size={18} /> },
  { id: 2, label: 'Vận chuyển', icon: <Truck size={18} /> },
  { id: 3, label: 'Thanh toán', icon: <CreditCard size={18} /> },
];

const PAYMENT_METHODS = [
  { id: 'COD',   name: 'Thanh toán khi nhận hàng (COD)', desc: 'Thanh toán bằng tiền mặt khi nhận hàng', emoji: '💵' },
  { id: 'VNPAY', name: 'VNPay',                          desc: 'Thanh toán qua ví điện tử VNPay',         emoji: '💳' },
  { id: 'BANK',  name: 'Chuyển khoản ngân hàng',         desc: 'Chuyển khoản trước khi nhận hàng',        emoji: '🏦' },
];

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

function SelectorCard({ selected, onClick, children }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-4 p-4 border-[1.5px] rounded-xl cursor-pointer transition-all ${
        selected
          ? 'border-gray-900 bg-gray-900/5 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-400'
      }`}
    >
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
        selected ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
      }`}>
        {selected && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
      {children}
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);

  // ── Address state ──
  const [addresses, setAddresses]             = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress]   = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [savingAddress, setSavingAddress]     = useState(false);

  // ── Shipping state ──
  const [shippingOptions, setShippingOptions] = useState([
    { id: 'standard', name: 'Giao hàng tiêu chuẩn', duration: '3–5 ngày', price: 35000 },
    { id: 'express',  name: 'Giao hàng nhanh',       duration: '1–2 ngày', price: 55000 },
  ]);
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [loadingShipping, setLoadingShipping] = useState(false);

  // ── Payment & Coupon ──
  const [selectedPayment, setSelectedPayment] = useState('COD');
  const [couponCode, setCouponCode]           = useState('');
  const [couponInput, setCouponInput]         = useState('');
  const [couponDiscount, setCouponDiscount]   = useState(0);
  const [couponError, setCouponError]         = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // ── Order ──
  const [submitting, setSubmitting]   = useState(false);
  const [orderError, setOrderError]   = useState('');

  // ── Computed totals ──
  const subtotal    = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = shippingOptions.find(m => m.id === selectedShipping)?.price ?? 35000;
  const total       = Math.max(0, subtotal + shippingFee - couponDiscount);

  // ── Init ──
  useEffect(() => {
    if (!user)           { navigate('/login');  return; }
    if (cart.length === 0) { navigate('/');      return; }
    fetchAddresses();
  // eslint-disable-next-line
  }, []);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const res   = await getMyAddresses();
      const addrs = res.data;
      setAddresses(addrs);
      const def = addrs.find(a => a.isDefault);
      if (def) setSelectedAddress(def.id);
    } catch { /* silent */ }
    finally  { setLoadingAddresses(false); }
  };

  // Auto-calc shipping fee when address changes (step 2)
  const calcShipping = useCallback(async (addressId) => {
    const addr = addresses.find(a => a.id === addressId);
    if (!addr) return;
    setLoadingShipping(true);
    try {
      const res  = await calculateShipping(addr.province);
      const base = res.data.fee;
      setShippingOptions([
        { id: 'standard', name: 'Giao hàng tiêu chuẩn', duration: `${res.data.estimatedDays + 2}–${res.data.estimatedDays + 4} ngày`, price: base },
        { id: 'express',  name: 'Giao hàng nhanh',       duration: `${res.data.estimatedDays}–${res.data.estimatedDays + 1} ngày`,   price: base + 20000 },
      ]);
      setSelectedShipping('standard');
    } catch { /* keep defaults */ }
    finally  { setLoadingShipping(false); }
  }, [addresses]);

  // Trigger when moving to step 2
  useEffect(() => {
    if (currentStep === 2 && selectedAddress) {
      calcShipping(selectedAddress);
    }
  // eslint-disable-next-line
  }, [currentStep]);

  const handleSaveAddress = async (data) => {
    setSavingAddress(true);
    try {
      if (editingAddress) await updateAddress(editingAddress.id, data);
      else                await createAddress(data);
      await fetchAddresses();
      setShowAddressForm(false);
      setEditingAddress(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi lưu địa chỉ');
    } finally { setSavingAddress(false); }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Xóa địa chỉ này?')) return;
    try { await deleteAddress(id); await fetchAddresses(); }
    catch { alert('Lỗi khi xóa địa chỉ'); }
  };

  const handleSetDefault = async (id) => {
    try { await setDefaultAddress(id); await fetchAddresses(); setSelectedAddress(id); }
    catch { alert('Lỗi khi đặt mặc định'); }
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setValidatingCoupon(true);
    setCouponError('');
    try {
      const res = await validateCoupon(couponInput.trim().toUpperCase(), subtotal);
      setCouponCode(couponInput.trim().toUpperCase());
      setCouponDiscount(res.data.discountAmount || 0);
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Mã không hợp lệ hoặc đã hết hạn.');
      setCouponDiscount(0);
      setCouponCode('');
    } finally { setValidatingCoupon(false); }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponInput('');
    setCouponDiscount(0);
    setCouponError('');
  };

  const canProceed = (step) => {
    if (step === 1) return selectedAddress !== null;
    if (step === 2) return selectedShipping !== null;
    if (step === 3) return selectedPayment !== null;
    return false;
  };

  const handlePlaceOrder = async () => {
    if (!canProceed(3)) return;
    const addr = addresses.find(a => a.id === selectedAddress);
    if (!addr) return;

    setSubmitting(true);
    setOrderError('');
    try {
      const orderData = {
        customerName:  addr.receiverName,
        customerEmail: user.email,
        phone:         addr.phoneNumber,
        address:       `${addr.detailAddress}, ${addr.ward}, ${addr.district}, ${addr.province}`,
        paymentMethod: selectedPayment,
        couponCode:    couponCode || undefined,
        items: cart.map(item => ({
          productId:        item.id,
          quantity:         item.quantity,
          productVariantId: item.selectedVariantId || null,
        })),
      };

      const res = await createOrder(orderData);
      const savedOrder = res.data;

      // Lưu thông tin để hiển thị trên trang success
      sessionStorage.setItem('lastOrder', JSON.stringify({
        orderId:      savedOrder.id,
        total:        savedOrder.totalAmount,
        paymentMethod: selectedPayment,
        earnedPoints: Math.floor(savedOrder.totalAmount / 1000),
      }));

      clearCart();

      if (selectedPayment === 'VNPAY') {
        // Redirect sang VNPay
        const payRes = await import('../services/api').then(m => m.createPaymentUrl(savedOrder.id));
        window.location.href = payRes.data.paymentUrl;
      } else {
        navigate('/order-success');
      }
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
    } finally { setSubmitting(false); }
  };

  if (!user || cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-[68px] pb-16">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <h1 className="text-3xl font-normal text-gray-900 font-serif mb-8">Thanh toán</h1>

        {/* ── Stepper ── */}
        <div className="flex items-center mb-10">
          {STEPS.map((step, i) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  currentStep > step.id  ? 'bg-gray-900 border-gray-900 text-white'
                  : currentStep === step.id ? 'border-gray-900 text-gray-900 bg-white'
                  : 'border-gray-300 text-gray-400 bg-white'
                }`}>
                  {currentStep > step.id ? <Check size={18} /> : step.icon}
                </div>
                <span className={`text-sm font-semibold hidden sm:block ${
                  currentStep === step.id ? 'text-gray-900' : 'text-gray-400'
                }`}>{step.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-[2px] mx-3 transition-all ${currentStep > step.id ? 'bg-gray-900' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left: main content ── */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-fadeUp">

              {/* STEP 1: Address */}
              {currentStep === 1 && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-semibold text-gray-900">Địa chỉ giao hàng</h2>
                    <button
                      onClick={() => { setEditingAddress(null); setShowAddressForm(true); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg text-xs font-semibold hover:border-gray-900 hover:bg-gray-50 transition-all"
                    >
                      <Plus size={14} /> Thêm địa chỉ
                    </button>
                  </div>

                  {showAddressForm ? (
                    <AddressForm
                      initialData={editingAddress}
                      onSubmit={handleSaveAddress}
                      onCancel={() => { setShowAddressForm(false); setEditingAddress(null); }}
                      loading={savingAddress}
                    />
                  ) : loadingAddresses ? (
                    <div className="flex items-center justify-center py-12 text-gray-400 gap-3">
                      <Loader2 size={24} className="animate-spin" /> Đang tải địa chỉ...
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="flex flex-col items-center py-12 text-gray-400 gap-3">
                      <MapPin size={40} className="text-gray-300" />
                      <p className="text-sm">Bạn chưa có địa chỉ. Hãy thêm địa chỉ giao hàng.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {addresses.map(addr => (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddress(addr.id)}
                          className={`flex items-start gap-4 p-4 border-[1.5px] rounded-xl cursor-pointer transition-all ${
                            selectedAddress === addr.id
                              ? 'border-gray-900 bg-gray-900/5'
                              : 'border-gray-200 bg-white hover:border-gray-400'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                            selectedAddress === addr.id ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                          }`}>
                            {selectedAddress === addr.id && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <strong className="text-sm text-gray-900">{addr.receiverName}</strong>
                              {addr.isDefault && (
                                <span className="text-[0.65rem] px-2 py-0.5 bg-blue-100 text-blue-700 border border-blue-200 rounded font-bold">Mặc định</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mb-0.5">{addr.phoneNumber}</p>
                            <p className="text-xs text-gray-500">{addr.detailAddress}, {addr.ward}, {addr.district}, {addr.province}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                            {!addr.isDefault && (
                              <button
                                onClick={() => handleSetDefault(addr.id)}
                                className="text-[0.68rem] px-2 py-1 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                              >Mặc định</button>
                            )}
                            <button onClick={() => { setEditingAddress(addr); setShowAddressForm(true); }} className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"><Edit2 size={14} /></button>
                            <button onClick={() => handleDeleteAddress(addr.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: Shipping */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Phương thức vận chuyển</h2>
                  {(() => {
                    const addr = addresses.find(a => a.id === selectedAddress);
                    return addr && (
                      <p className="text-xs text-gray-500 mb-5 flex items-center gap-1.5">
                        <MapPin size={12} className="text-gray-400" />
                        Giao đến: <strong className="text-gray-700">{addr.province}</strong>
                      </p>
                    );
                  })()}

                  {loadingShipping ? (
                    <div className="flex items-center justify-center py-10 text-gray-400 gap-2">
                      <Loader2 size={20} className="animate-spin" /> Đang tính phí vận chuyển...
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {shippingOptions.map(method => (
                        <SelectorCard key={method.id} selected={selectedShipping === method.id} onClick={() => setSelectedShipping(method.id)}>
                          <div className="flex-1 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{method.name}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{method.duration}</p>
                            </div>
                            <span className="text-sm font-bold text-gray-900">{formatVND(method.price)}</span>
                          </div>
                        </SelectorCard>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Payment + Coupon */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-5">Thanh toán</h2>

                  <div className="flex flex-col gap-3 mb-7">
                    {PAYMENT_METHODS.map(method => (
                      <SelectorCard key={method.id} selected={selectedPayment === method.id} onClick={() => setSelectedPayment(method.id)}>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{method.emoji} {method.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{method.desc}</p>
                        </div>
                      </SelectorCard>
                    ))}
                  </div>

                  {/* ── Coupon Section ── */}
                  <div className="border-t border-gray-100 pt-5">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Tag size={15} className="text-gray-500" /> Mã giảm giá
                    </h3>

                    {couponCode ? (
                      <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                        <Check size={16} className="text-green-600 shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-green-800 font-mono">{couponCode}</p>
                          <p className="text-xs text-green-600">Giảm {formatVND(couponDiscount)}</p>
                        </div>
                        <button onClick={removeCoupon} className="p-1 text-green-500 hover:text-green-800 transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                          onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                          placeholder="Nhập mã giảm giá..."
                          className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:border-gray-900 transition-colors uppercase placeholder:font-sans placeholder:normal-case"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={validatingCoupon || !couponInput.trim()}
                          className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold disabled:opacity-40 hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                          {validatingCoupon ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                          Áp dụng
                        </button>
                      </div>
                    )}

                    {couponError && (
                      <p className="text-xs text-red-600 flex items-center gap-1.5 mt-2">
                        <AlertCircle size={12} /> {couponError}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">Thử: <code className="bg-gray-100 px-1 rounded">TET2026</code>, <code className="bg-gray-100 px-1 rounded">FREESHIP</code>, <code className="bg-gray-100 px-1 rounded">WELCOME50K</code></p>
                  </div>

                  {/* Order error */}
                  {orderError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-start gap-2">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      {orderError}
                    </div>
                  )}
                </div>
              )}

              {/* ── Navigation ── */}
              <div className="flex items-center gap-3 mt-7 pt-6 border-t border-gray-100">
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(s => s - 1)}
                    className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:border-gray-900 hover:bg-gray-50 transition-all"
                  >
                    ← Quay lại
                  </button>
                )}
                <div className="flex-1" />
                {currentStep < 3 ? (
                  <button
                    onClick={() => setCurrentStep(s => s + 1)}
                    disabled={!canProceed(currentStep)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold tracking-wide transition-all hover:bg-gray-800 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Tiếp tục <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={!canProceed(3) || submitting}
                    className="inline-flex items-center gap-2 px-8 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold tracking-wide transition-all hover:bg-gray-800 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {submitting
                      ? <><Loader2 size={16} className="animate-spin" /> Đang đặt hàng...</>
                      : `Đặt hàng • ${formatVND(total)}`
                    }
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Right: Order summary ── */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm sticky top-24">
              <h3 className="text-base font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Tóm tắt đơn hàng
              </h3>

              {/* Items */}
              <div className="flex flex-col gap-3 mb-4">
                {cart.map(item => (
                  <div key={`${item.id}-${item.selectedVariantId}`} className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img src={item.imageUrl || `https://picsum.photos/seed/${item.id}/80/80`} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 line-clamp-2">{item.name}</p>
                      {(item.size || item.color) && (
                        <p className="text-[10px] text-gray-400">{[item.size, item.color].filter(Boolean).join(' / ')}</p>
                      )}
                    </div>
                    <p className="text-xs font-bold text-gray-900 shrink-0">{formatVND(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 pt-4 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Tạm tính ({cart.reduce((s, i) => s + i.quantity, 0)} sản phẩm)</span>
                  <span>{formatVND(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span>{formatVND(shippingFee)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex items-center justify-between text-sm text-green-600">
                    <span className="flex items-center gap-1.5"><Tag size={12} /> {couponCode}</span>
                    <span className="font-semibold">-{formatVND(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                  <strong>Tổng cộng</strong>
                  <strong className="text-lg text-gray-900">{formatVND(total)}</strong>
                </div>
              </div>

              {/* Loyalty points estimate */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-xl">
                <p className="text-xs text-yellow-800">
                  🌟 Bạn sẽ nhận được <strong>{Math.floor(total / 1000).toLocaleString()} điểm</strong> từ đơn hàng này.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
