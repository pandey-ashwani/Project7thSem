import React from 'react';

/**
 * Reusable Status & Category Badge Component
 */
const Badge = ({ variant = 'default', children, className = '' }) => {
  const getBadgeStyle = () => {
    const v = (variant || '').toLowerCase();
    switch (v) {
      case 'active':
      case 'success':
        return {
          backgroundColor: '#ecfdf5',
          color: '#065f46',
          border: '1px solid #a7f3d0'
        };
      case 'completed':
      case 'info':
        return {
          backgroundColor: '#eff6ff',
          color: '#1e40af',
          border: '1px solid #bfdbfe'
        };
      case 'pending':
      case 'warning':
      case 'draft':
        return {
          backgroundColor: '#fefce8',
          color: '#854d0e',
          border: '1px solid #fde047'
        };
      case 'cancelled':
      case 'danger':
      case 'archived':
        return {
          backgroundColor: '#fef2f2',
          color: '#991b1b',
          border: '1px solid #fecaca'
        };
      case 'today':
      case 'primary':
        return {
          backgroundColor: '#f0fdf4',
          color: '#166534',
          border: '1px solid #bbf7d0'
        };
      default:
        return {
          backgroundColor: '#f1f5f9',
          color: '#334155',
          border: '1px solid #e2e8f0'
        };
    }
  };

  return (
    <span
      className={`badge rounded-pill fw-semibold text-capitalize ${className}`}
      style={{
        padding: '0.35rem 0.65rem',
        fontSize: '0.75rem',
        letterSpacing: '0.02em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        ...getBadgeStyle()
      }}
    >
      {children || variant}
    </span>
  );
};

export default Badge;
