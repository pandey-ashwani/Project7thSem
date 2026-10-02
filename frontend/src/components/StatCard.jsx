import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'primary', subtitle }) => {
  const colorMap = {
    primary: { bg: 'var(--primary-light)', text: 'var(--primary-dark)', icon: '#0284c7' },
    secondary: { bg: 'var(--secondary-light)', text: '#0f766e', icon: '#0d9488' },
    warning: { bg: 'var(--warning-light)', text: '#92400e', icon: '#f59e0b' },
    success: { bg: 'var(--success-light)', text: '#065f46', icon: '#10b981' },
    danger: { bg: 'var(--danger-light)', text: '#991b1b', icon: '#ef4444' },
    accent: { bg: 'var(--accent-light)', text: '#3730a3', icon: '#6366f1' },
  };

  const scheme = colorMap[color] || colorMap.primary;

  return (
    <div className="stat-card">
      <div>
        <div className="stat-label">{title}</div>
        <div className="stat-value">{value}</div>
        {subtitle && (
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '0.25rem' }}>
            {subtitle}
          </div>
        )}
      </div>
      <div 
        className="stat-icon-wrapper"
        style={{ backgroundColor: scheme.bg, color: scheme.icon }}
      >
        {Icon && <Icon size={26} />}
      </div>
    </div>
  );
};

export default StatCard;
