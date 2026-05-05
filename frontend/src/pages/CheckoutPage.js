import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check, MapPin, Truck, CreditCard, ChevronRight, Plus, Edit2, Trash2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  getMyAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../services/addressApi';
import { createOrder } from '../services/api';
import AddressForm from '../components/AddressForm';
import './CheckoutPage.css';

const STEPS = [
  { id: 1, label: 'Địa chỉ giao hàng', icon: <MapPin size={18} /> },
  { id: 2, label: 'Phương thức vận chuyển', icon: <Truck size={18} /> },
  { id: 3, label: 'Thanh toán', icon: <CreditCard size={18} /> },
];

const SHIPPING_METHODS = [
  { id: 'standard', name: 'Giao hàng tiêu chuẩn', duration: '3-5 ngày', price: 0 },
  { id: 'express', name: 'Giao hàng nhanh', duration: '1-2 ngày', price: 30000 },
  { id: 'instant', name: 'Giao hàng trong 2H', duration: 'Trong ngày', price: 50000 },
];

const PAYMENT_METHODS = [
  { id: 'cod', name: 'Thanh toán khi nhận hàng (COD)', desc: 'Thanh toán bằng tiền mặt' },
  { id: 'vnpay', name: 'VNPay', desc: 'Thanh toán qua ví điện tử VNPay' },
  { id: 'bank', name: 'Chuyển khoản ngân hàng', desc: 'Chuyển khoản trước khi nhận hàng' },
];

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Address
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [savingAddress, setSavingAddress] = useState(false);

  // Step 2: Shipping
  const [selectedShipping, setSelectedShipping] = useState('standard');

  // Step 3: Payment
  const [selectedPayment, setSelectedPayment] = useState('cod');

  // Order
  const [submitting, setSubmitting] = useState(false);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = SHIPPING_METHODS.find(m => m.id === selectedShipping)?.price || 0;
  const total = subtotal + shippingCost;

  // Load addresses on mount
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (cart.length === 0) {
      navigate('/cart');
      return;
    }
    fetchAddresses();
    // eslint-disable-next-line
  }, []);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const res = await getMyAddresses();
      const addrs = res.data;
      setAddresses(addrs);
      const def = addrs.find(a => a.isDefault);
      if (def) setSelectedAddress(def.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleSaveAddress = async (data) => {
    setSavingAddress(true);
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, data);
      } else {
        await createAddress(data);
      }
      await fetchAddresses();
      setShowAddressForm(false);
      setEditingAddress(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi lưu địa chỉ');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;
    try {
      await deleteAddress(id);
      await fetchAddresses();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi xóa địa chỉ');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      await fetchAddresses();
      setSelectedAddress(id);
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi đặt địa chỉ mặc định');
    }
  };

  const canProceed = (step) => {
    if (step === 1) return selectedAddress !== null;
    if (step === 2) return selectedShipping !== null;
    if (step === 3) return selectedPayment !== null;
    return false;
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handlePlaceOrder = async () => {
    if (!canProceed(3)) return;

    const addr = addresses.find(a => a.id === selectedAddress);
    if (!addr) return;

    setSubmitting(true);
    try {
      const orderData = {
        customerName: addr.receiverName,
        customerEmail: user.email,
        phone: addr.phoneNumber,
        addressId: selectedAddress,
        totalAmount: total,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          variantId: item.selectedVariantId || null,
        })),
        paymentMethod: selectedPayment,
        shippingMethod: selectedShipping,
      };

      await createOrder(orderData);
      clearCart();
      navigate('/order-success');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi đặt hàng');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || cart.length === 0) return null;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        
        <h1 className="checkout-title">Thanh toán</h1>

        {/* Stepper */}
        <div className="stepper">
          {STEPS.map((step, i) => (
            <React.Fragment key={step.id}>
              <div
                className={`stepper-item ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
              >
                <div className="stepper-icon">
                  {currentStep > step.id ? <Check size={18} /> : step.icon}
                </div>
                <div className="stepper-label">{step.label}</div>
              </div>
              {i < STEPS.length - 1 && <div className="stepper-line" />}
            </React.Fragment>
          ))}
        </div>

        {/* Content */}
        <div className="checkout-layout">

          {/* Main */}
          <div className="checkout-main">

            {/* STEP 1: Address */}
            {currentStep === 1 && (
              <div className="step-content">
                <div className="step-header">
                  <h2 className="step-title">Chọn địa chỉ giao hàng</h2>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setEditingAddress(null);
                      setShowAddressForm(true);
                    }}
                  >
                    <Plus size={16} /> Thêm địa chỉ mới
                  </button>
                </div>

                {showAddressForm ? (
                  <AddressForm
                    initialData={editingAddress}
                    onSubmit={handleSaveAddress}
                    onCancel={() => {
                      setShowAddressForm(false);
                      setEditingAddress(null);
                    }}
                    loading={savingAddress}
                  />
                ) : loadingAddresses ? (
                  <div className="loading-box">Đang tải địa chỉ...</div>
                ) : addresses.length === 0 ? (
                  <div className="empty-box">
                    <MapPin size={48} className="empty-icon" />
                    <p>Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ giao hàng.</p>
                  </div>
                ) : (
                  <div className="address-list">
                    {addresses.map(addr => (
                      <div
                        key={addr.id}
                        className={`address-card ${selectedAddress === addr.id ? 'selected' : ''}`}
                        onClick={() => setSelectedAddress(addr.id)}
                      >
                        <div className="address-card__radio">
                          <div className={`radio ${selectedAddress === addr.id ? 'checked' : ''}`}>
                            {selectedAddress === addr.id && <div className="radio-dot" />}
                          </div>
                        </div>

                        <div className="address-card__content">
                          <div className="address-card__header">
                            <strong>{addr.receiverName}</strong>
                            {addr.isDefault && <span className="badge badge-default">Mặc định</span>}
                          </div>
                          <p className="address-card__phone">{addr.phoneNumber}</p>
                          <p className="address-card__full">
                            {addr.detailAddress}, {addr.ward}, {addr.district}, {addr.province}
                          </p>
                        </div>

                        <div className="address-card__actions">
                          {!addr.isDefault && (
                            <button
                              className="address-action-btn"
                              onClick={(e) => { e.stopPropagation(); handleSetDefault(addr.id); }}
                              title="Đặt làm mặc định"
                            >
                              Mặc định
                            </button>
                          )}
                          <button
                            className="address-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingAddress(addr);
                              setShowAddressForm(true);
                            }}
                            title="Sửa"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="address-action-btn danger"
                            onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr.id); }}
                            title="Xóa"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Shipping */}
            {currentStep === 2 && (
              <div className="step-content">
                <h2 className="step-title">Chọn phương thức vận chuyển</h2>
                <div className="shipping-list">
                  {SHIPPING_METHODS.map(method => (
                    <div
                      key={method.id}
                      className={`shipping-card ${selectedShipping === method.id ? 'selected' : ''}`}
                      onClick={() => setSelectedShipping(method.id)}
                    >
                      <div className="radio-wrap">
                        <div className={`radio ${selectedShipping === method.id ? 'checked' : ''}`}>
                          {selectedShipping === method.id && <div className="radio-dot" />}
                        </div>
                      </div>
                      <div className="shipping-content">
                        <strong>{method.name}</strong>
                        <p className="shipping-duration">{method.duration}</p>
                      </div>
                      <div className="shipping-price">
                        {method.price === 0 ? 'Miễn phí' : formatVND(method.price)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: Payment */}
            {currentStep === 3 && (
              <div className="step-content">
                <h2 className="step-title">Chọn phương thức thanh toán</h2>
                <div className="payment-list">
                  {PAYMENT_METHODS.map(method => (
                    <div
                      key={method.id}
                      className={`payment-card ${selectedPayment === method.id ? 'selected' : ''}`}
                      onClick={() => setSelectedPayment(method.id)}
                    >
                      <div className="radio-wrap">
                        <div className={`radio ${selectedPayment === method.id ? 'checked' : ''}`}>
                          {selectedPayment === method.id && <div className="radio-dot" />}
                        </div>
                      </div>
                      <div className="payment-content">
                        <strong>{method.name}</strong>
                        <p className="payment-desc">{method.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="checkout-nav">
              {currentStep > 1 && (
                <button className="btn btn-outline" onClick={handleBack}>
                  Quay lại
                </button>
              )}
              <div style={{ flex: 1 }} />
              {currentStep < 3 ? (
                <button
                  className="btn btn-dark"
                  onClick={handleNext}
                  disabled={!canProceed(currentStep)}
                >
                  Tiếp tục <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  className="btn btn-dark"
                  onClick={handlePlaceOrder}
                  disabled={!canProceed(3) || submitting}
                >
                  {submitting ? 'Đang đặt hàng...' : 'Đặt hàng'}
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="checkout-sidebar">
            <div className="order-summary">
              <h3 className="order-summary__title">Tóm tắt đơn hàng</h3>
              <div className="order-summary__items">
                {cart.map(item => (
                  <div key={item.id} className="summary-item">
                    <img src={item.imageUrl} alt={item.name} className="summary-item__img" />
                    <div className="summary-item__info">
                      <p className="summary-item__name">{item.name}</p>
                      <p className="summary-item__qty">x{item.quantity}</p>
                    </div>
                    <p className="summary-item__price">{formatVND(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="order-summary__totals">
                <div className="total-row">
                  <span>Tạm tính</span>
                  <span>{formatVND(subtotal)}</span>
                </div>
                <div className="total-row">
                  <span>Phí vận chuyển</span>
                  <span>{shippingCost === 0 ? 'Miễn phí' : formatVND(shippingCost)}</span>
                </div>
                <div className="total-row total-row--final">
                  <strong>Tổng cộng</strong>
                  <strong className="total-amount">{formatVND(total)}</strong>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
