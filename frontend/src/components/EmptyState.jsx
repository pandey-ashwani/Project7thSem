import React from 'react';
import { Inbox } from 'lucide-react';

/**
 * Reusable Empty State Component
 */
const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No Data Available',
  description = 'There are no records to display at this time.',
  action = null
}) => {
  return (
    <div className="card-modern p-5 text-center d-flex flex-column align-items-center justify-content-center">
      <div
        className="rounded-circle d-flex align-items-center justify-content-center mb-3 text-primary"
        style={{ width: '64px', height: '64px', backgroundColor: '#eff6ff' }}
      >
        <Icon size={32} />
      </div>
      <h3 className="fs-5 fw-bold text-dark mb-1">{title}</h3>
      <p className="text-muted fs-7 mb-3" style={{ maxWidth: '420px' }}>
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
