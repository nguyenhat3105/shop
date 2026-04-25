import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';

/* ─────────────────────────────────────────────
   CART CONTEXT
   Quản lý toàn bộ trạng thái giỏ hàng:
     • cart items (persist localStorage)
     • cart modal open/close
     • toast notifications
────────────────────────────────────────────── */
const CartContext = createContext(null);

export function CartProvider({ children }) {
  /* ── Cart state ── */
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); }
    catch { return []; }
  });

  /* ── Modal state ── */
  const [modalOpen, setModalOpen] = useState(false);

  /* ── Toast queue ── */
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  /* Sync to localStorage on every change */
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  /* ── Derived values ── */
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  /* ── Toast helpers ── */
  const addToast = useCallback((message, type = 'success', product = null) => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, message, type, product }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  /* ── Cart actions ── */
  const addToCart = useCallback((product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    addToast(`Đã thêm "${product.name}" vào giỏ!`, 'success', product);
  }, [addToast]);

  const removeFromCart = useCallback((id) => {
    setCart(prev => {
      const item = prev.find(i => i.id === id);
      if (item) addToast(`Đã xoá "${item.name}" khỏi giỏ.`, 'info');
      return prev.filter(i => i.id !== id);
    });
  }, [addToast]);

  const updateQty = useCallback((id, qty) => {
    if (qty <= 0) { removeFromCart(id); return; }
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    addToast('Giỏ hàng đã được xoá.', 'info');
  }, [addToast]);

  const openModal  = useCallback(() => setModalOpen(true),  []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <CartContext.Provider value={{
      cart, cartCount, cartTotal,
      addToCart, removeFromCart, updateQty, clearCart,
      modalOpen, openModal, closeModal,
      toasts, addToast, removeToast,
    }}>
      {children}
    </CartContext.Provider>
  );
}

/* Custom hook — dùng thay vì useContext(CartContext) trực tiếp */
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
