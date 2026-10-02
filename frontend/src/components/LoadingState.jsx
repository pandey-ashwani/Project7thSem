import React from 'react';

/**
 * Reusable Loading State Component
 */
const LoadingState = ({ message = 'Loading records...' }) => {
  return (
    <div className="card-modern p-5 text-center d-flex flex-column align-items-center justify-content-center">
      <div className="spinner-border text-primary mb-3" style={{ width: '2.5rem', height: '2.5rem' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted fw-medium fs-7 mb-0">{message}</p>
    </div>
  );
};

export default LoadingState;
