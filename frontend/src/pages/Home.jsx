import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authApi from '../api/authApi';
import {
  Building2,
  Stethoscope,
  ShieldCheck,
  UserCheck,
  Activity,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  HeartHandshake,
  Sparkles
} from 'lucide-react';

const Home = () => {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        const res = await authApi.getPublicStats();
        if (res?.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Error fetching live system stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchLiveStats();
  }, []);
  return (
    <div className="animate-fade">
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0284c7 100%)',
        color: '#fff',
        padding: 'clamp(2.5rem, 6vw, 5rem) clamp(1.25rem, 4vw, 3rem)',
        borderRadius: 'var(--radius-xl)',
        marginBottom: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xl)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(2, 132, 199, 0.25) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.9rem',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
            fontWeight: 600,
            marginBottom: '1.25rem',
            color: 'var(--primary-light)',
            maxWidth: '100%',
            textAlign: 'center'
          }}>
            <Sparkles size={15} style={{ flexShrink: 0 }} />
            <span>National Health Mission &bull; Integrated State Healthcare</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.85rem, 5.5vw, 3.25rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem'
          }}>
            Digital Unified Healthcare Operations & <span style={{ color: '#38bdf8' }}>State-Wide Symptom Surveillance</span>
          </h1>

          <p style={{
            fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
            color: 'var(--slate-300)',
            lineHeight: 1.6,
            marginBottom: '2rem',
            maxWidth: '750px',
            margin: '0 auto 2rem auto'
          }}>
            Connecting Hospital Administrators, Certified Medical Specialists, Citizens, and State Health Authorities under a secure Aadhaar-verified unified digital ecosystem.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            <Link to="/patient-signup" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: 'clamp(0.9rem, 2vw, 1rem)', borderRadius: '12px' }}>
              <span>Citizen Registration</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/login-admin" className="btn" style={{
              padding: '0.85rem 1.75rem',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#fff',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}>
              <Building2 size={18} />
              <span>Hospital Staff Portal</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Live System Metrics Section */}
      <div style={{ marginBottom: '3.5rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          padding: '0 0.5rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            National Health Grid Live Metrics
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#15803d',
            background: '#dcfce7',
            border: '1px solid #bbf7d0',
            padding: '0.3rem 0.75rem',
            borderRadius: '20px'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#16a34a',
              boxShadow: '0 0 0 2px rgba(22, 163, 74, 0.25)'
            }} />
            <span>Database Live Synced</span>
          </div>
        </div>

        <div className="stat-grid">
          {/* Card 1: Verified Patients */}
          <div className="stat-card">
            <div>
              <div className="stat-label">Verified Patient Profiles</div>
              <div className="stat-value">
                {loadingStats ? '...' : (stats?.totalPatients !== undefined ? stats.totalPatients : 0)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600, marginTop: '0.2rem' }}>
                &uarr; 12-Digit Aadhaar Unique
              </div>
            </div>
            <div className="stat-icon-wrapper" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <UserCheck size={26} />
            </div>
          </div>

          {/* Card 2: Network Hospitals */}
          <div className="stat-card">
            <div>
              <div className="stat-label">Network Hospitals</div>
              <div className="stat-value">
                {loadingStats ? '...' : (stats?.totalHospitals !== undefined ? stats.totalHospitals : 0)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.2rem' }}>
                {stats?.totalDistricts ? `${stats.totalDistricts} Districts Connected` : 'Districts Connected'}
              </div>
            </div>
            <div className="stat-icon-wrapper" style={{ background: 'var(--secondary-light)', color: 'var(--secondary)' }}>
              <Building2 size={26} />
            </div>
          </div>

          {/* Card 3: Practicing Doctors */}
          <div className="stat-card">
            <div>
              <div className="stat-label">Practicing Doctors</div>
              <div className="stat-value">
                {loadingStats ? '...' : (stats?.totalDoctors !== undefined ? stats.totalDoctors : 0)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, marginTop: '0.2rem' }}>
                Verified Credentials
              </div>
            </div>
            <div className="stat-icon-wrapper" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              <Stethoscope size={26} />
            </div>
          </div>

          {/* Card 4: Symptom Surge Surveillance */}
          <div className="stat-card">
            <div>
              <div className="stat-label">Symptom Surge Early Detection</div>
              <div className="stat-value">
                {stats?.surveillanceStatus || '24/7 Live'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 600, marginTop: '0.2rem' }}>
                {stats?.totalStates ? `${stats.totalStates} States Active Surveillance` : 'Cross-State Analytics'}
              </div>
            </div>
            <div className="stat-icon-wrapper" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
              <TrendingUp size={26} />
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Portals Selection */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em' }}>
            Choose Your Dedicated Role Portal
          </h2>
          <p style={{ color: 'var(--slate-500)', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', marginTop: '0.4rem' }}>
            Tailored workspaces designed for fast clinical workflows, administration, and public health governance.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 270px), 1fr))',
          gap: '1.5rem'
        }}>
          {/* Hospital Admin */}
          <div className="card-modern" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--primary)' }}>
            <div>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Building2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                Hospital Admin
              </h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Verify 12-digit Aadhaar, onboard patients, manage medical practitioner schedule, and assign doctors to OPD cases.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login-admin" className="btn btn-primary" style={{ flex: 1 }}>
                Admin Sign In
              </Link>
              <Link to="/register-admin" className="btn btn-secondary" style={{ padding: '0.75rem 1rem' }}>
                Register
              </Link>
            </div>
          </div>

          {/* Doctor Portal */}
          <div className="card-modern" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--secondary)' }}>
            <div>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'var(--secondary-light)',
                color: 'var(--secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Stethoscope size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                Doctor Workspace
              </h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Review assigned OPD queues, inspect previous clinical history, issue structured digital prescriptions, and track recovery.
              </p>
            </div>
            <Link to="/login-doctor" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, var(--secondary), var(--secondary-hover))', width: '100%' }}>
              Doctor Sign In
            </Link>
          </div>

          {/* Patient Portal */}
          <div className="card-modern" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--accent)' }}>
            <div>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'var(--accent-light)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <HeartHandshake size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                Patient Care Portal
              </h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Access verified medical records, active doctor consultations, digital prescriptions with dosages, and appointment schedules.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login-patient" className="btn btn-primary" style={{ flex: 1, background: 'linear-gradient(135deg, var(--accent), #4f46e5)' }}>
                Patient Sign In
              </Link>
              <Link to="/patient-signup" className="btn btn-secondary" style={{ padding: '0.75rem 1rem' }}>
                Sign Up
              </Link>
            </div>
          </div>

          {/* State SuperAdmin */}
          <div className="card-modern" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--slate-900)' }}>
            <div>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'var(--slate-100)',
                color: 'var(--slate-900)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                State SuperAdmin
              </h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                State-level health intelligence, district-wise disease surge monitoring, health policy announcements, and statewide registry auditing.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/superadmin-login" className="btn btn-primary" style={{ flex: 1, background: 'var(--slate-900)' }}>
                Authority Sign In
              </Link>
              <Link to="/superadmin-signup" className="btn btn-secondary" style={{ padding: '0.75rem 1rem' }}>
                Register
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-State Early Symptom Detection Showcase */}
      <section style={{
        background: '#fff',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--slate-200)',
        padding: 'clamp(1.5rem, 4vw, 3.5rem)',
        marginBottom: '3rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '2.5rem', alignItems: 'center' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '0.825rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem'
            }}>
              <Activity size={17} /> Public Health Breakthrough
            </div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 800, color: 'var(--slate-900)', lineHeight: 1.25, marginBottom: '1rem' }}>
              Real-Time Cross-District Symptom Spike Detection
            </h2>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              As patient data flows securely from hospitals across districts and states, SwasthyaSankalp's real-time aggregation engine flags emerging symptom surges before they become epidemic outbreaks.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={18} color="var(--success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--slate-700)' }}>
                  <strong>District-wise Hotspot Mapping:</strong> Immediate alerts when a specific symptom increases in any hospital cluster.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={18} color="var(--success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--slate-700)' }}>
                  <strong>Policy Formulation in Minutes:</strong> State health authorities can enact localized containment policies and allocate critical medical supplies.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={18} color="var(--success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--slate-700)' }}>
                  <strong>Zero Data Duplication:</strong> Aadhaar indexing ensures one citizen has one authoritative medical timeline everywhere.
                </span>
              </div>
            </div>
          </div>

          <div style={{
            background: 'var(--slate-900)',
            borderRadius: 'var(--radius-lg)',
            padding: 'clamp(1.25rem, 3vw, 2rem)',
            color: '#fff',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--slate-800)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={18} color="#38bdf8" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Live Symptom Radar (Surveillance)</span>
              </div>
              <span className="badge badge-danger">Live Alert</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.35rem' }}>
                  <span>Viral Fever / Dengue Symptoms</span>
                  <span style={{ color: '#f87171', fontWeight: 700 }}>+34% (Lucknow District)</span>
                </div>
                <div style={{ height: '8px', background: 'var(--slate-800)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: '78%', height: '100%', background: 'linear-gradient(90deg, #f59e0b, #ef4444)', borderRadius: '9999px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.35rem' }}>
                  <span>Respiratory Infection / Asthma</span>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>Stable (Kanpur District)</span>
                </div>
                <div style={{ height: '8px', background: 'var(--slate-800)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: '45%', height: '100%', background: 'linear-gradient(90deg, #0284c7, #38bdf8)', borderRadius: '9999px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.35rem' }}>
                  <span>Gastroenteritis / Water-borne</span>
                  <span style={{ color: '#34d399', fontWeight: 700 }}>-12% (Varanasi District)</span>
                </div>
                <div style={{ height: '8px', background: 'var(--slate-800)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: '28%', height: '100%', background: 'linear-gradient(90deg, #0d9488, #34d399)', borderRadius: '9999px' }} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', padding: '0.85rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--slate-400)' }}>
              &bull; Surveillance Model: Cross-referencing 10,000+ daily OPD triage entries against regional demographic baselines.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
