
/**
 * Toast — Notificación temporal reutilizable.
 * Demuestra: Componente con auto-dismiss y variantes semánticas.
 */

import { useEffect } from 'react';
import { FiCheckCircle, FiAlertTriangle, FiInfo, FiXCircle } from 'react-icons/fi';

const toastStyles = {
  success: {
    bg: 'bg-green-50 border-green-200',
    text: 'text-green-700',
    Icon: FiCheckCircle,
  },
  error: {
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-700',
    Icon: FiXCircle,
  },
  warning: {
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-700',
    Icon: FiAlertTriangle,
  },
  info: {
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-700',
    Icon: FiInfo,
  },
};

export default function Toast({ type = 'info', message, onClose, duration = 4000 }) {
  useEffect(() => {
    if (message && duration > 0) {
      const timer = setTimeout(() => onClose?.(), duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const style = toastStyles[type] || toastStyles.info;
  const ToastIcon = style.Icon;

  return (
    <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-fade-in border ${style.bg} ${style.text}`}>
      <ToastIcon size={16} className="flex-shrink-0" />
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 p-0.5 rounded hover:bg-black/5 transition-colors border-none bg-transparent cursor-pointer"
          aria-label="Cerrar"
        >
          <FiXCircle size={14} className={style.text} />
        </button>
      )}
    </div>
  );
}
