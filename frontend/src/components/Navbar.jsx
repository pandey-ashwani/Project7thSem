import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Building2, 
  User, 
  LogOut, 
  ShieldCheck, 
  Stethoscope, 
  Activity, 
  Menu,
  X,
  HeartHandshake
} from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="badge badge-primary"><Building2 size={12} /> Hospital Admin</span>;
      case 'doctor':
        return <span className="badge badge-success"><Stethoscope size={12} /> Doctor</span>;
      case 'superAdmin':
      case 'superadmin':
        return <span className="badge badge-warning"><ShieldCheck size={12} /> State SuperAdmin</span>;
      case 'patient':
        return <span className="badge badge-secondary"><User size={12} /> Patient</span>;
      default:
        return null;
    }
  };

  return (
    <header className="top-navbar">
      <div className="navbar-brand-wrapper">
        {user && (
          <button 
            onClick={onToggleSidebar}
            className="navbar-toggle-btn"
            aria-label="Toggle Navigation Menu"
          >
            <Menu size={20} />
          </button>
        )}

        <Link to="/" className="navbar-brand-link" onClick={() => setMobileMenuOpen(false)}>
          <div className="navbar-logo-icon">
            <Activity size={20} />
          </div>
          <span className="navbar-brand-text">
            Swasthya<span style={{ color: 'var(--primary)' }}>Sankalp</span>
          </span>
        </Link>
      </div>

      {/* Desktop Navigation Links / User Controls */}
      <div className="navbar-actions-desktop">
        {user ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'right' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--slate-900)' }}>
                  {user.name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
                  {getRoleBadge(user.role)}
                </div>
              </div>
              <div className="navbar-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              title="Logout"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/login-patient" className="btn btn-secondary" style={{ padding: '0.5rem 1.15rem' }}>
              Patient Portal
            </Link>
            <Link to="/login-admin" className="btn btn-primary" style={{ padding: '0.5rem 1.15rem' }}>
              Hospital Login
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Hamburger Button (when logged out or on small screens) */}
      {!user && (
        <button
          className="navbar-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Mobile Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      )}

      {/* Mobile Dropdown Menu */}
      {!user && mobileMenuOpen && (
        <div className="navbar-mobile-dropdown animate-fade">
          <Link 
            to="/login-patient" 
            className="navbar-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <HeartHandshake size={18} color="var(--accent)" />
            <span>Citizen / Patient Portal</span>
          </Link>
          <Link 
            to="/login-admin" 
            className="navbar-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Building2 size={18} color="var(--primary)" />
            <span>Hospital Administrator</span>
          </Link>
          <Link 
            to="/login-doctor" 
            className="navbar-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Stethoscope size={18} color="var(--secondary)" />
            <span>Doctor Specialist</span>
          </Link>
          <Link 
            to="/superadmin-login" 
            className="navbar-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ShieldCheck size={18} color="var(--slate-900)" />
            <span>State SuperAdmin Authority</span>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
