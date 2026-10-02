import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * Reusable Confirmation Dialog Modal
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  loading = false
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop-modern position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        zIndex: 1050,
        backdropFilter: 'blur(3px)'
      }}
      onClick={onClose}
    >
      <div
        className="card-modern shadow-lg border-0"
        style={{ width: '90%', maxWidth: '440px', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          <div className="d-flex align-items-start gap-3">
            <div
              className={`rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0 ${
                isDanger ? 'bg-danger-subtle text-danger' : 'bg-warning-subtle text-warning'
              }`}
              style={{ width: '40px', height: '40px' }}
            >
              <AlertTriangle size={22} />
            </div>
            <div className="flex-grow-1">
              <h4 className="fs-6 fw-bold text-dark mb-1">{title}</h4>
              <p className="text-muted fs-7 mb-0">{message}</p>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-link text-muted p-0 text-decoration-none"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-3 bg-light border-top d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn btn-sm ${isDanger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
