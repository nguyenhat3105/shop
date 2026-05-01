import React from 'react';
import { CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cn } from './ui/Skeleton';

const ICONS = {
  success: <CheckCircle size={16} />,
  info:    <Info size={16} />,
  warning: <AlertTriangle size={16} />,
  error:   <AlertTriangle size={16} />,
};

const TYPE_CLASSES = {
  success: 'before:bg-[#3a7d52]',
  error:   'before:bg-[#c0392b]',
  info:    'before:bg-[#2c6fad]',
  warning: 'before:bg-[#d4830a]',
};

const ICON_BG = {
  success: 'bg-[#3a7d52]/10 text-[#3a7d52]',
  error:   'bg-[#c0392b]/10 text-[#c0392b]',
  info:    'bg-[#2c6fad]/10 text-[#2c6fad]',
  warning: 'bg-[#d4830a]/10 text-[#d4830a]',
};

const PROGRESS_BG = {
  success: 'bg-[#3a7d52]/25',
  error:   'bg-[#c0392b]/25',
  info:    'bg-black/10',
  warning: 'bg-black/10',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useCart();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-2.5 pointer-events-none max-sm:left-4 max-sm:right-4 max-sm:bottom-4" aria-live="polite">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-2.5 min-w-[280px] max-w-[360px] max-sm:min-w-0 max-sm:max-w-full p-[0.85rem_1rem] bg-white border border-black/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.1),_0_2px_8px_rgba(0,0,0,0.06)] pointer-events-auto relative overflow-hidden animate-in slide-in-from-right-full duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            "before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:rounded-[3px_0_0_3px]",
            TYPE_CLASSES[toast.type] || TYPE_CLASSES.info
          )}
        >
          {/* Left: icon + optional product thumb */}
          <div className="shrink-0">
            {toast.product?.imageUrl
              ? <img src={toast.product.imageUrl} alt="" className="w-10 h-10 rounded-md object-cover border border-black/10" />
              : <span className={cn("w-[30px] h-[30px] rounded-full flex items-center justify-center", ICON_BG[toast.type] || ICON_BG.info)}>
                  {ICONS[toast.type] || ICONS.info}
                </span>
            }
          </div>

          {/* Message */}
          <div className="flex-1 min-w-0">
            <p className="text-[0.82rem] font-medium text-[#111] leading-[1.35]">{toast.message}</p>
            {toast.subMessage && (
               <p className="text-[0.72rem] text-[#999] mt-px whitespace-nowrap overflow-hidden text-ellipsis">{toast.subMessage}</p>
            )}
          </div>

          {/* Close */}
          <button
            className="w-[22px] h-[22px] flex items-center justify-center text-[#999] shrink-0 rounded transition-colors hover:text-[#111] hover:bg-[#f5f3ef]"
            onClick={() => removeToast(toast.id)}
            aria-label="Đóng"
          >
            <X size={13} />
          </button>

          {/* Progress bar */}
          <div 
            className={cn(
              "absolute bottom-0 left-0 right-0 h-[2px]",
              PROGRESS_BG[toast.type] || PROGRESS_BG.info
            )} 
            style={{
               animation: 'progressBar 3.2s linear forwards',
               transformOrigin: 'left'
            }}
          />
        </div>
      ))}
      <style>{`
        @keyframes progressBar {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}
