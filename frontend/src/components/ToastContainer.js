import React from 'react';
import { CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ICONS = {
  success: <CheckCircle size={16} />,
  info:    <Info size={16} />,
  warning: <AlertTriangle size={16} />,
  error:   <AlertTriangle size={16} />,
};

const THEMES = {
  success: {
    border: 'border-l-success',
    iconBg: 'bg-success/10 text-success',
    progress: 'bg-success/25'
  },
  error: {
    border: 'border-l-error',
    iconBg: 'bg-error/10 text-error',
    progress: 'bg-error/25'
  },
  info: {
    border: 'border-l-blue-500',
    iconBg: 'bg-blue-500/10 text-blue-500',
    progress: 'bg-blue-500/25'
  },
  warning: {
    border: 'border-l-yellow-600',
    iconBg: 'bg-yellow-600/10 text-yellow-600',
    progress: 'bg-yellow-600/25'
  }
};

export default function ToastContainer() {
  const { toasts, removeToast } = useCart();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-2.5 pointer-events-none max-w-full sm:max-w-[360px]" aria-live="polite">
      {toasts.map(toast => {
        const theme = THEMES[toast.type] || THEMES.info;
        
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-2.5 min-w-[280px] p-3.5 bg-surface border border-border rounded-lg shadow-lg pointer-events-auto relative overflow-hidden animate-[toastIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)_both] border-l-[3px] ${theme.border}`}
          >
            {/* Left: icon + optional product thumb */}
            <div className="shrink-0">
              {toast.product?.imageUrl
                ? <img src={toast.product.imageUrl} alt="" className="w-10 h-10 rounded-md object-cover border border-border shrink-0" />
                : <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 ${theme.iconBg}`}>
                    {ICONS[toast.type]}
                  </div>
              }
            </div>

            {/* Message */}
            <div className="flex-1 min-w-0">
              <p className="text-[0.82rem] font-medium text-text leading-[1.35]">{toast.message}</p>
            </div>

            {/* Close */}
            <button
              className="w-[22px] h-[22px] flex items-center justify-center text-text-muted shrink-0 rounded transition-colors hover:text-text hover:bg-bg-2"
              onClick={() => removeToast(toast.id)}
              aria-label="Đóng"
            >
              <X size={13} />
            </button>

            {/* Progress bar */}
            <div className={`absolute bottom-0 left-0 h-[2px] w-full animate-[progressBar_3.2s_linear_forwards] origin-left ${theme.progress}`} />
          </div>
        )
      })}
    </div>
  );
}
