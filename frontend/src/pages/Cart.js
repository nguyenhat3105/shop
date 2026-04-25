import React, { useState, useEffect } from 'react';
import { createOrder } from '../services/api';

function Cart() {
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({ customerName: '', customerEmail: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(saved);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const removeItem = (id) => {
    const updated = cart.filter((i) => i.id !== id);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const handleOrder = async () => {
    if (!form.customerName || !form.customerEmail) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    const orderData = {
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      totalAmount: total,
      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
    };
    try {
      await createOrder(orderData);
      localStorage.removeItem('cart');
      setSubmitted(true);
    } catch (err) {
      alert('Đặt hàng thất bại, vui lòng thử lại!');
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '12px' }}>
        <h2 style={{ color: 'green' }}>✅ Đặt hàng thành công!</h2>
        <p style={{ marginTop: '1rem', color: '#555' }}>Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ qua email.</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>🛒 Giỏ hàng</h2>
      {cart.length === 0 ? (
        <p style={{ color: '#888' }}>Giỏ hàng trống.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #eee' }}>
              <div>
                <strong>{item.name}</strong>
                <p style={{ color: '#888', fontSize: '0.9rem' }}>x{item.quantity}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                  {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                </span>
                <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c', fontSize: '1.2rem' }}>✕</button>
              </div>
            </div>
          ))}

          <p style={{ textAlign: 'right', marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
            Tổng: {total.toLocaleString('vi-VN')}₫
          </p>

          <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Thông tin đặt hàng</h3>
            <input
              placeholder="Họ và tên"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              style={{ display: 'block', width: '100%', padding: '0.75rem', marginBottom: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
            />
            <input
              placeholder="Email"
              type="email"
              value={form.customerEmail}
              onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
              style={{ display: 'block', width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
            />
            <button
              onClick={handleOrder}
              style={{ width: '100%', padding: '1rem', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer' }}
            >
              Đặt hàng
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
