import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import {
  HeartHandshake,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Building2,
  MapPin,
  Compass,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

const PatientSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    aadhar: '',
    disease: '',
    district: '',
    state: '',
    hospital: '',
    adminId: '',
    username: '',
    password: '',
  });

  const [states, setStates] = useState([]);
  const [hospitalsByState, setHospitalsByState] = useState({});
  const [fetchingHospitals, setFetchingHospitals] = useState(true);
  const [hospitalsError, setHospitalsError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Load database hospitals sorted by state on mount
  const loadHospitalsDirectory = async () => {
    setFetchingHospitals(true);
    setHospitalsError('');
    try {
      const response = await authApi.getHospitals();
      if (response && response.data) {
        setStates(response.data.states || []);
        setHospitalsByState(response.data.hospitalsByState || {});
      }
    } catch (err) {
      console.error('Failed to load hospitals directory:', err);
      setHospitalsError('Unable to load hospital database. Please refresh or check connection.');
    } finally {
      setFetchingHospitals(false);
    }
  };

  useEffect(() => {
    loadHospitalsDirectory();
  }, []);

  // Handle State Dropdown Change
  const handleStateChange = (e) => {
    const chosenState = e.target.value;
    setFormData((prev) => ({
      ...prev,
      state: chosenState,
      hospital: '',
      district: '',
      adminId: ''
    }));
  };

  // Handle Hospital Dropdown Change
  const handleHospitalChange = (e) => {
    const chosenHospitalName = e.target.value;
    if (!chosenHospitalName) {
      setFormData((prev) => ({
        ...prev,
        hospital: '',
        district: '',
        adminId: ''
      }));
      return;
    }

    const availableHospitals = hospitalsByState[formData.state] || [];
    const matched = availableHospitals.find((h) => h.hospital === chosenHospitalName);

    setFormData((prev) => ({
      ...prev,
      hospital: chosenHospitalName,
      district: matched ? matched.district : prev.district,
      adminId: matched ? matched.adminId : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^\d{12}$/.test(formData.aadhar)) {
      setError('Aadhaar number must be exactly 12 numeric digits.');
      return;
    }

    if (!formData.state) {
      setError('Please select your State from the dropdown.');
      return;
    }

    if (!formData.hospital) {
      setError('Please select a Hospital from the database.');
      return;
    }

    setLoading(true);
    try {
      await register('patient', formData);
      navigate('/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const availableHospitals = formData.state ? (hospitalsByState[formData.state] || []) : [];

  return (
    <div style={{ maxWidth: '680px', margin: 'clamp(1.5rem, 4vw, 3rem) auto' }} className="animate-fade">
      <div className="card-modern" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, var(--accent-light), #c7d2fe)',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            boxShadow: '0 8px 16px -4px rgba(99, 102, 241, 0.2)'
          }}>
            <HeartHandshake size={32} />
          </div>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3.2vw, 1.75rem)', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em' }}>
            Citizen Health Registration
          </h2>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Aadhaar-verified Digital Health ID & Smart Hospital OPD Access
          </p>
        </div>

        {error && (
          <div style={{
            background: 'var(--danger-light)',
            color: 'var(--danger)',
            padding: '0.85rem 1.15rem',
            borderRadius: '10px',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            marginBottom: '1.5rem',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {hospitalsError && (
          <div style={{
            background: 'var(--warning-light)',
            color: 'var(--warning)',
            padding: '0.85rem 1.15rem',
            borderRadius: '10px',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <AlertCircle size={20} />
              <span>{hospitalsError}</span>
            </div>
            <button
              type="button"
              onClick={loadHospitalsDirectory}
              className="btn btn-outline"
              style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', gap: '0.3rem' }}
            >
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Personal Info */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Citizen Name as on Aadhaar"
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
                placeholder="e.g. 28"
                required
                min="1"
                max="120"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
          </div>

          {/* Aadhaar Number */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>12-Digit Aadhaar Number (Unique Health Index)</span>
              {formData.aadhar.length === 12 && (
                <span style={{ color: 'var(--success)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <CheckCircle2 size={13} /> 12 Digits Verified
                </span>
              )}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder="12-digit number (e.g. 657898467859)"
                required
                maxLength="12"
                value={formData.aadhar}
                onChange={(e) => setFormData({ ...formData, aadhar: e.target.value.replace(/\D/g, '') })}
              />
              <div style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: formData.aadhar.length === 12 ? 'var(--success)' : 'var(--slate-400)',
                transition: 'color 0.2s'
              }}>
                <ShieldCheck size={20} />
              </div>
            </div>
          </div>

          {/* Consultation / Disease Reason */}
          <div className="form-group">
            <label className="form-label">Primary Symptom / Consultation Reason</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Fever, Cough, Chest Pain, Routine Medical Checkup"
              required
              value={formData.disease}
              onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
            />
          </div>

          {/* Hospital Selection Section */}
          <div style={{
            background: 'linear-gradient(to bottom, var(--slate-50), #fff)',
            border: '1.5px solid var(--slate-200)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            marginBottom: '1.25rem',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '0.875rem',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <Building2 size={16} />
              <span>Select Hospital from SwasthyaSankalp Network</span>
            </div>

            <div className="form-row-2">
              {/* State Dropdown */}
              <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Compass size={14} color="var(--slate-500)" />
                  <span>State</span>
                </label>
                <select
                  className="form-control"
                  required
                  value={formData.state}
                  onChange={handleStateChange}
                  disabled={fetchingHospitals}
                >
                  <option value="">
                    {fetchingHospitals ? 'Loading States...' : '-- Select State --'}
                  </option>
                  {states.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hospital Dropdown (Filtered by selected state) */}
              <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building2 size={14} color="var(--slate-500)" />
                  <span>Hospital</span>
                </label>
                <select
                  className="form-control"
                  required
                  value={formData.hospital}
                  onChange={handleHospitalChange}
                  disabled={!formData.state || fetchingHospitals}
                >
                  <option value="">
                    {!formData.state
                      ? '-- First select a state --'
                      : availableHospitals.length === 0
                      ? '-- No hospitals found in state --'
                      : `-- Select Hospital (${availableHospitals.length} available) --`}
                  </option>
                  {availableHospitals.map((h) => (
                    <option key={`${h.hospital}-${h.district}`} value={h.hospital}>
                      {h.hospital} ({h.district})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Auto-detected District Info Badge */}
            {formData.hospital && formData.district && (
              <div style={{
                marginTop: '0.85rem',
                padding: '0.6rem 0.85rem',
                background: 'var(--primary-light)',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: 'var(--primary-dark)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <MapPin size={15} style={{ flexShrink: 0 }} />
                <span>
                  <strong>Hospital Location:</strong> {formData.district} District, {formData.state}
                </span>
              </div>
            )}
          </div>

          {/* Account Credentials */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Create Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Choose username (e.g. ram_verma)"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Create Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Minimum 6 characters"
                required
                minLength="6"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              marginTop: '1.25rem',
              padding: '0.9rem',
              background: 'linear-gradient(135deg, var(--accent), #4f46e5)',
              fontSize: '0.975rem',
              fontWeight: 700,
              boxShadow: '0 8px 20px -4px rgba(99, 102, 241, 0.4)'
            }}
            disabled={loading || fetchingHospitals}
          >
            {loading ? 'Creating Digital Health Record...' : 'Complete Registration & Open Health Portal'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--slate-100)',
          fontSize: '0.875rem'
        }}>
          <span style={{ color: 'var(--slate-500)' }}>Already registered with SwasthyaSankalp? </span>
          <Link to="/login-patient" style={{ color: 'var(--accent)', fontWeight: 700 }}>
            Sign In to Patient Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientSignup;
