import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

/**
 * Toast notification alert
 */
const Toast = ({ type = 'success', message, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const getStyle = () => {
    switch (type) {
      case 'error':
        return {
          bg: '#fef2f2',
          border: '#fecaca',
          color: '#991b1b',
          icon: <AlertCircle size={18} className="text-danger flex-shrink-0" />
        };
      case 'info':
        return {
          bg: '#eff6ff',
          border: '#bfdbfe',
          color: '#1e40af',
          icon: <Info size={18} className="text-primary flex-shrink-0" />
        };
      default:
        return {
          bg: '#ecfdf5',
          border: '#a7f3d0',
          color: '#065f46',
          icon: <CheckCircle2 size={18} className="text-success flex-shrink-0" />
        };
    }
  };

  const style = getStyle();

  return (
    <div
      className="position-fixed top-0 end-0 m-3 shadow-sm rounded-3 p-3 d-flex align-items-center gap-2"
      style={{
        zIndex: 1100,
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        color: style.color,
        minWidth: '280px',
        maxWidth: '420px',
        fontSize: '0.875rem'
      }}
    >
      {style.icon}
      <span className="flex-grow-1 fw-medium">{message}</span>
      {onClose && (
        <button
          type="button"
          className="btn btn-link p-0 text-decoration-none opacity-50 hover-opacity-100"
          style={{ color: style.color }}
          onClick={onClose}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Toast;
