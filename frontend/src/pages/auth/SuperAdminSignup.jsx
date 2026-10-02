import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

const SuperAdminSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register('superAdmin', formData);
      navigate('/superadmin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'SuperAdmin registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '540px', margin: 'clamp(1.5rem, 4vw, 3rem) auto' }} className="animate-fade">
      <div className="card-modern">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'var(--slate-900)',
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            <ShieldCheck size={30} />
          </div>
          <h2 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.6rem)', fontWeight: 800, color: 'var(--slate-900)' }}>
            Register State Authority Profile
          </h2>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>
            State Health Department SuperAdmin Credentialing
          </p>
        </div>

        {error && (
          <div style={{
            background: 'var(--danger-light)',
            color: 'var(--danger)',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Authority Officer Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Dr. A. K. Verma, Principal Secretary"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Official Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="authority@health.gov.in"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="tel"
                className="form-control"
                placeholder="10-digit number"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Choose username"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Strong password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.85rem', background: 'var(--slate-900)' }}
            disabled={loading}
          >
            {loading ? 'Creating Authority Account...' : 'Register State SuperAdmin'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--slate-100)', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--slate-500)' }}>Already registered? </span>
          <Link to="/superadmin-login" style={{ color: 'var(--slate-900)', fontWeight: 700 }}>
            Sign In as State SuperAdmin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSignup;
