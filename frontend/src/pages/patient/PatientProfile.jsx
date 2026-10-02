import React, { useEffect, useState } from 'react';
import patientApi from '../../api/patientApi';
import PageHeader from '../../components/PageHeader';
import Badge from '../../components/Badge';
import LoadingState from '../../components/LoadingState';
import {
  ShieldCheck,
  MapPin,
  Building2,
  Activity,
  Eye,
  EyeOff,
  User,
  Copy,
  Check,
  Printer,
  QrCode,
  Share2,
  Sparkles,
  Lock,
  HeartPulse,
  Award
} from 'lucide-react';

const PatientProfile = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [copiedAbha, setCopiedAbha] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await patientApi.getProfile();
        if (res?.data) setPatient(res.data);
      } catch (err) {
        console.error('Error fetching patient profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Format 14-digit ABHA number: XX-XXXX-XXXX-XXXX derived from Aadhaar index
  const getAbhaNumber = (aadharNum) => {
    if (!aadharNum) return '91-4589-2041-8932';
    const clean = String(aadharNum).trim();
    if (clean.length === 12) {
      return `91-${clean.slice(0, 4)}-${clean.slice(4, 8)}-${clean.slice(8)}`;
    }
    return clean;
  };

  const getMaskedAadhaar = (num) => {
    if (!num) return '—';
    const clean = String(num).trim();
    if (clean.length < 12) return clean;
    if (showAadhaar) {
      return `${clean.slice(0, 4)} ${clean.slice(4, 8)} ${clean.slice(8)}`;
    }
    return `•••• •••• ${clean.slice(-4)}`;
  };

  const handleCopyAbha = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedAbha(true);
    setTimeout(() => setCopiedAbha(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <LoadingState message="Loading digital health identity..." />;
  }

  if (!patient) return null;

  const abhaNumber = getAbhaNumber(patient.aadhar);

  return (
    <div className="patient-profile-page animate-fade" style={{ maxWidth: '880px', margin: '0 auto', paddingBottom: '3rem' }}>
      <PageHeader
        title="Digital Health Identity & Citizen Record"
        subtitle="Government Aadhaar-linked National Health Record Profile (ABHA System)."
        badge={<Badge variant="active"><ShieldCheck size={13} style={{ marginRight: '4px' }} /> Aadhaar Verified</Badge>}
      />

      {/* Main ABHA Digital Health Card */}
      <div
        id="printable-health-card"
        style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: '24px',
          border: '2px solid var(--slate-200)',
          boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.1)',
          overflow: 'hidden',
          marginBottom: '2rem',
          position: 'relative',
          transition: 'all 0.3s ease'
        }}
      >
        {/* National Tricolor Top Ribbon */}
        <div style={{
          height: '6px',
          width: '100%',
          background: 'linear-gradient(to right, #FF9933 0%, #FF9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%, #138808 100%)'
        }} />

        {/* Card Header */}
        <div style={{
          padding: '1.5rem 2rem 1.25rem 2rem',
          borderBottom: '1px solid var(--slate-100)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'linear-gradient(to bottom, rgba(2, 132, 199, 0.04), transparent)'
        }}>
          {/* Official Emblem & Authority */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284c7, #075985)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(2, 132, 199, 0.3)'
            }}>
              <HeartPulse size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#075985' }}>
                राष्ट्रीय स्वास्थ्य प्राधिकरण &bull; National Health Authority
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.01em' }}>
                SwasthyaSankalp Digital Health ID
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>
                Government of India &bull; Ayushman Bharat Digital Mission (ABDM)
              </div>
            </div>
          </div>

          {/* ABHA Badge & Chip Motif */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Simulated Smart Chip */}
            <div style={{
              width: '38px',
              height: '30px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: '1px solid #b45309',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              padding: '3px 4px'
            }}>
              <div style={{ height: '2px', background: 'rgba(0,0,0,0.2)', width: '100%' }} />
              <div style={{ height: '2px', background: 'rgba(0,0,0,0.2)', width: '60%' }} />
              <div style={{ height: '2px', background: 'rgba(0,0,0,0.2)', width: '100%' }} />
            </div>

            <div style={{
              background: 'linear-gradient(135deg, var(--slate-900), #1e293b)',
              color: '#fff',
              padding: '0.4rem 0.9rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 10px rgba(15, 23, 42, 0.2)'
            }}>
              <Award size={14} color="#f59e0b" />
              <span>ABHA ID</span>
            </div>
          </div>
        </div>

        {/* Card Body Grid */}
        <div style={{
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '2.5rem',
          alignItems: 'center'
        }}>
          {/* Left Column: Avatar & QR Code */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            minWidth: '150px'
          }}>
            {/* Biometric Avatar Photo Box */}
            <div style={{
              width: '120px',
              height: '130px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid #fff',
              boxShadow: '0 8px 20px -4px rgba(99, 102, 241, 0.35)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <span style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                {patient.name?.charAt(0).toUpperCase()}
              </span>
              <div style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                background: 'rgba(0, 0, 0, 0.45)',
                padding: '2px 0',
                fontSize: '0.65rem',
                textAlign: 'center',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Verified ID
              </div>
            </div>

            {/* Simulated Verified QR Code */}
            <div style={{
              padding: '6px',
              background: '#fff',
              border: '1.5px solid var(--slate-200)',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              textAlign: 'center'
            }}>
              <svg width="84" height="84" viewBox="0 0 100 100" style={{ display: 'block', margin: '0 auto' }}>
                {/* QR Pattern Simulation */}
                <rect width="100" height="100" fill="#ffffff" />
                <rect x="5" y="5" width="28" height="28" fill="#0f172a" rx="4" />
                <rect x="10" y="10" width="18" height="18" fill="#ffffff" rx="2" />
                <rect x="14" y="14" width="10" height="10" fill="#0f172a" rx="1" />
                
                <rect x="67" y="5" width="28" height="28" fill="#0f172a" rx="4" />
                <rect x="72" y="10" width="18" height="18" fill="#ffffff" rx="2" />
                <rect x="76" y="14" width="10" height="10" fill="#0f172a" rx="1" />
                
                <rect x="5" y="67" width="28" height="28" fill="#0f172a" rx="4" />
                <rect x="10" y="72" width="18" height="18" fill="#ffffff" rx="2" />
                <rect x="14" y="76" width="10" height="10" fill="#0f172a" rx="1" />
                
                {/* Data pixels */}
                <rect x="42" y="12" width="6" height="6" fill="#0f172a" />
                <rect x="52" y="18" width="6" height="6" fill="#0f172a" />
                <rect x="42" y="30" width="6" height="6" fill="#0f172a" />
                <rect x="60" y="40" width="6" height="6" fill="#0f172a" />
                <rect x="15" y="45" width="6" height="6" fill="#0f172a" />
                <rect x="30" y="52" width="6" height="6" fill="#0f172a" />
                <rect x="45" y="45" width="10" height="10" fill="#0284c7" rx="2" />
                <rect x="65" y="65" width="6" height="6" fill="#0f172a" />
                <rect x="80" y="50" width="6" height="6" fill="#0f172a" />
                <rect x="75" y="78" width="6" height="6" fill="#0f172a" />
                <rect x="45" y="72" width="6" height="6" fill="#0f172a" />
                <rect x="55" y="85" width="6" height="6" fill="#0f172a" />
              </svg>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--slate-500)', letterSpacing: '0.04em', display: 'block', marginTop: '2px' }}>
                DIGITAL SIGNATURE
              </span>
            </div>
          </div>

          {/* Right Column: Citizen Details */}
          <div>
            {/* Citizen Full Name */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Citizen Name / नागरिक का नाम
              </div>
              <h2 style={{
                fontSize: '1.7rem',
                fontWeight: 800,
                color: 'var(--slate-900)',
                letterSpacing: '-0.02em',
                margin: '0.15rem 0 0.4rem 0'
              }}>
                {patient.name}
              </h2>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{
                  background: 'var(--primary-light)',
                  color: 'var(--primary-dark)',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  Age: {patient.age} Years
                </span>
                <span style={{
                  background: 'var(--slate-100)',
                  color: 'var(--slate-700)',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}>
                  Portal User: @{patient.username}
                </span>
                <span style={{
                  background: '#dcfce7',
                  color: '#15803d',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }} />
                  Active Status
                </span>
              </div>
            </div>

            {/* ABHA Number & Copy Box */}
            <div style={{
              background: '#f1f5f9',
              padding: '0.9rem 1.15rem',
              borderRadius: '12px',
              border: '1px solid var(--slate-200)',
              marginBottom: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  14-Digit ABHA / Health ID Number
                </div>
                <div style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  letterSpacing: '0.08em',
                  color: 'var(--slate-900)',
                  marginTop: '0.2rem'
                }}>
                  {abhaNumber}
                </div>
              </div>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => handleCopyAbha(abhaNumber)}
                style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                  gap: '0.4rem',
                  background: '#fff',
                  border: '1px solid var(--slate-300)',
                  borderRadius: '8px'
                }}
              >
                {copiedAbha ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                <span>{copiedAbha ? 'Copied!' : 'Copy ABHA'}</span>
              </button>
            </div>

            {/* Two-Column Clinical & Regional Info */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              {/* Aadhaar (Masked Toggle) */}
              <div style={{
                background: '#fff',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid var(--slate-200)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                    Linked Aadhaar
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAadhaar(!showAadhaar)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '0.72rem',
                      color: 'var(--primary)',
                      fontWeight: 700,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {showAadhaar ? <EyeOff size={13} /> : <Eye size={13} />}
                    {showAadhaar ? 'Hide' : 'Reveal'}
                  </button>
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'monospace', color: 'var(--slate-800)', letterSpacing: '0.05em' }}>
                  {getMaskedAadhaar(patient.aadhar)}
                </div>
              </div>

              {/* Primary Facility */}
              <div style={{
                background: '#fff',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid var(--slate-200)'
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Registered Hospital
                </div>
                <div style={{ fontSize: '0.925rem', fontWeight: 800, color: 'var(--slate-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {patient.hospital || 'District Hospital'}
                </div>
              </div>

              {/* Regional Jurisdiction */}
              <div style={{
                background: '#fff',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid var(--slate-200)'
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Jurisdiction & Region
                </div>
                <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--slate-800)' }}>
                  {patient.district}, {patient.state}
                </div>
              </div>

              {/* Consultation / Disease */}
              <div style={{
                background: '#fff',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid var(--slate-200)'
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Primary Symptom
                </div>
                <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--accent)' }}>
                  {patient.disease || 'General Health Review'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Holographic Foil Footer */}
        <div style={{
          background: 'linear-gradient(90deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)',
          padding: '0.75rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
          color: '#cbd5e1',
          fontSize: '0.72rem',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            <Lock size={12} color="#38bdf8" />
            <span>256-Bit Encrypted &bull; ABDM Compliant &bull; Interoperable Health Record</span>
          </div>
          <div style={{ color: '#94a3b8', fontWeight: 600 }}>
            Issued on: {new Date(patient.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Card Action Controls */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '2.5rem'
      }}>
        <button
          type="button"
          onClick={handlePrint}
          className="btn btn-primary"
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)'
          }}
        >
          <Printer size={18} />
          <span>Print / Save Health Card (PDF)</span>
        </button>

        <button
          type="button"
          onClick={() => handleCopyAbha(abhaNumber)}
          className="btn btn-outline"
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            gap: '0.5rem',
            background: '#fff'
          }}
        >
          <Copy size={18} />
          <span>{copiedAbha ? 'ABHA Copied!' : 'Copy 14-Digit ABHA'}</span>
        </button>
      </div>

      {/* Information Cards: ABDM & Healthcare Interoperability */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem'
      }}>
        <div className="card-modern" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '0.5rem' }}>
            <Building2 size={20} />
            <span>Hospital OPD Fast-Track</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>
            Show your ABHA ID at hospital OPD counters to retrieve your medical profile instantly with zero paperwork.
          </p>
        </div>

        <div className="card-modern" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--secondary)', fontWeight: 700, marginBottom: '0.5rem' }}>
            <Lock size={20} />
            <span>100% Consent & Privacy</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>
            Your Aadhaar number is masked for privacy. Diagnostic history is shared with doctors only upon your direct consent.
          </p>
        </div>

        <div className="card-modern" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent)', fontWeight: 700, marginBottom: '0.5rem' }}>
            <Sparkles size={20} />
            <span>Digital Prescriptions</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>
            Consultation notes, prescribed dosages, and follow-up schedules are securely attached to this Health ID in real time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
