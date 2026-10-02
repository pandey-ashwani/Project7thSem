import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/client';
import { UserPlus, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

const NewPatient = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const initialAadhaar = queryParams.get('aadhar') || '';

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    aadhar: initialAadhaar,
    disease: '',
    username: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!/^\d{12}$/.test(formData.aadhar)) {
      setError('Aadhaar number must be exactly 12 numeric digits.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/admin/new-patient', formData);
      if (res.data?.success) {
        setSuccess('Patient successfully registered into hospital database!');
        setTimeout(() => {
          navigate('/admin/patients');
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to register patient.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-body animate-fade" style={{ maxWidth: '700px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--slate-900)' }}>
          Onboard New Patient
        </h1>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>
          Record Aadhaar verified citizen credentials and primary triage symptoms.
        </p>
      </div>

      <div className="card-modern" style={{ padding: '2.5rem' }}>
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

        {success && (
          <div style={{
            background: 'var(--success-light)',
            color: 'var(--success)',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Patient Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Full name as on ID"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 35"
                required
                min="1"
                max="120"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">12-Digit Aadhaar Card Number</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder="123456789012"
                required
                maxLength="12"
                value={formData.aadhar}
                onChange={(e) => setFormData({ ...formData, aadhar: e.target.value.replace(/\D/g, '') })}
              />
              <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: formData.aadhar.length === 12 ? 'var(--success)' : 'var(--slate-400)' }}>
                <ShieldCheck size={20} />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Primary Symptom / Disease</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. High Fever, Headache, Joint Pain, Hypertension"
              required
              value={formData.disease}
              onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Portal Username (Optional)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Leave blank for auto"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Portal Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Default: Patient@1234"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}
            disabled={loading}
          >
            <UserPlus size={18} />
            <span>{loading ? 'Registering Patient...' : 'Register Patient in Hospital'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPatient;
