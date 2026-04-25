import React from 'react';
import { CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ToastContainer.css';

const ICONS = {
  success: <CheckCircle size={16} />,
  info:    <Info size={16} />,
  warning: <AlertTriangle size={16} />,
  error:   <AlertTriangle size={16} />,
};

export default function ToastContainer() {
  const { toasts, removeToast } = useCart();

  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast toast--${toast.type}`}
        >
          {/* Left: icon + optional product thumb */}
          <div className="toast__left">
            {toast.product?.imageUrl
              ? <img src={toast.product.imageUrl} alt="" className="toast__thumb" />
              : <span className={`toast__icon toast__icon--${toast.type}`}>{ICONS[toast.type]}</span>
            }
          </div>

          {/* Message */}
          <p className="toast__msg">{toast.message}</p>

          {/* Close */}
          <button
            className="toast__close"
            onClick={() => removeToast(toast.id)}
            aria-label="Đóng"
          >
            <X size={13} />
          </button>

          {/* Progress bar */}
          <div className="toast__progress" />
        </div>
      ))}
    </div>
  );
}
