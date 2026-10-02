import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Search, ShieldCheck, User, UserPlus, Stethoscope, AlertCircle, CheckCircle2 } from 'lucide-react';

const PatientCheck = () => {
  const [aadhar, setAadhar] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!/^\d{12}$/.test(aadhar)) {
      setError('Please enter a valid 12-digit Aadhaar number.');
      return;
    }

    setError('');
    setLoading(true);
    setSearched(false);
    try {
      const res = await api.get(`/admin/check-patient?aadhar=${aadhar}`);
      setSearched(true);
      if (res.data?.exists && res.data?.patient) {
        setPatient(res.data.patient);
      } else {
        setPatient(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error searching patient record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-body animate-fade" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--slate-900)' }}>
          Patient Aadhaar Verification & Lookup
        </h1>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>
          Search existing patient profile via 12-digit Aadhaar or onboard as a new patient.
        </p>
      </div>

      {/* Search Box */}
      <div className="card-modern" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '1rem', marginBottom: '0.6rem' }}>
              Enter 12-Digit Aadhaar Card Number
            </label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  className="form-control"
                  style={{ fontSize: '1.1rem', letterSpacing: '0.1em', fontWeight: 600, padding: '0.85rem 1rem' }}
                  placeholder="1234 5678 9012"
                  maxLength="12"
                  required
                  value={aadhar}
                  onChange={(e) => setAadhar(e.target.value.replace(/\D/g, ''))}
                />
                <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: aadhar.length === 12 ? 'var(--success)' : 'var(--slate-400)' }}>
                  <ShieldCheck size={24} />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0 2rem', fontSize: '1rem' }}
                disabled={loading || aadhar.length !== 12}
              >
                <Search size={18} />
                <span>{loading ? 'Verifying...' : 'Verify'}</span>
              </button>
            </div>
          </div>
        </form>

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
            marginTop: '1rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Search Result */}
      {searched && patient && (
        <div className="card-modern animate-fade" style={{ borderLeft: '4px solid var(--success)', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <CheckCircle2 size={24} color="var(--success)" />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--slate-900)' }}>
              Aadhaar Verified Citizen Record Found
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
            <div style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>Patient Full Name</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '0.25rem' }}>
                {patient.name}
              </div>
            </div>

            <div style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>Age & Gender</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '0.25rem' }}>
                {patient.age} yrs
              </div>
            </div>

            <div style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>Home District & State</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '0.25rem' }}>
                {patient.district}, {patient.state}
              </div>
            </div>

            <div style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>Reported Symptom</div>
              <div style={{ marginTop: '0.25rem' }}>
                <span className="badge badge-primary">{patient.disease}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid var(--slate-100)', paddingTop: '1.25rem' }}>
            <Link to={`/admin/patients`} className="btn btn-secondary">
              View Hospital Records
            </Link>
            <Link to={`/admin/patients`} className="btn btn-primary">
              <Stethoscope size={16} />
              <span>Assign Doctor / Schedule</span>
            </Link>
          </div>
        </div>
      )}

      {searched && !patient && (
        <div className="card-modern animate-fade" style={{ borderLeft: '4px solid var(--warning)', padding: '2rem', textAlign: 'center' }}>
          <AlertCircle size={40} color="var(--warning)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
            No Existing Patient Record for Aadhaar {aadhar}
          </h3>
          <p style={{ color: 'var(--slate-500)', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
            This citizen is not yet registered in the hospital network. Onboard them now to generate their digital OPD record.
          </p>
          <Link to={`/admin/new-patient?aadhar=${aadhar}`} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
            <UserPlus size={18} />
            <span>Register New Patient Now</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default PatientCheck;
