import React from 'react';
import Navbar from '../components/Navbar';

const PublicLayout = ({ children }) => {
  return (
    <div className="public-layout min-vh-100 d-flex flex-column" style={{ backgroundColor: 'var(--bg-canvas, #f8fafc)' }}>
      <Navbar />
      <main className="flex-grow-1">
        {children}
      </main>
      <footer className="footer-modern py-4 border-top mt-auto" style={{ backgroundColor: '#fff', color: '#64748b' }}>
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <span className="fw-bold text-dark">SwasthyaSankalp</span>
            <span className="text-muted fs-7">| Unified State Healthcare System</span>
          </div>
          <div className="text-muted fs-7">
            &copy; {new Date().getFullYear()} SwasthyaSankalp. Secure Public Health Platform.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
