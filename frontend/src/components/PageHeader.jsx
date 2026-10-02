import React from 'react';

/**
 * Reusable PageHeader Component
 */
const PageHeader = ({ title, subtitle, badge, actions }) => {
  return (
    <div className="page-header mb-4">
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h1 className="page-title mb-0 fs-3 fw-bold text-dark">{title}</h1>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && <p className="page-subtitle text-muted mb-0 fs-7">{subtitle}</p>}
        </div>
        {actions && <div className="d-flex align-items-center gap-2 flex-wrap">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
