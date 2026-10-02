import React, { useEffect, useState } from 'react';
import adminApi from '../../api/adminApi';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';
import LoadingState from '../../components/LoadingState';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  User,
  Stethoscope,
  Users,
  CheckCircle2,
  Calendar,
  Activity
} from 'lucide-react';

const AdminProfile = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(authUser || null);
  const [loading, setLoading] = useState(!authUser);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const res = await adminApi.getProfile();
        const data = res?.data || res?.admin;
        if (isMounted && data) {
          setProfile((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error('Error loading admin profile:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const admin = profile || authUser;

  if (loading && !admin) {
    return <LoadingState message="Loading hospital profile..." />;
  }

  if (!admin) {
    return (
      <div className="page-body" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--slate-500)' }}>Unable to load hospital profile data.</p>
      </div>
    );
  }

  const initial = admin.name ? admin.name.charAt(0).toUpperCase() : 'H';
  const hospitalInitial = admin.hospital ? admin.hospital.charAt(0).toUpperCase() : 'H';
  const formattedDate = admin.createdAt
    ? new Date(admin.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Registered Facility';

  return (
    <div className="page-body animate-fade" style={{ maxWidth: '840px', margin: '0 auto', paddingBottom: '2.5rem' }}>
      <PageHeader
        title="Hospital & Facility Profile"
        subtitle="Registered hospital institution details, jurisdiction, and official administrator credentials."
      />

      {/* Main Simple Profile Card */}
      <div
        className="card-modern"
        style={{
          borderRadius: '16px',
          border: '1px solid var(--slate-200)',
          background: '#ffffff',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
          marginBottom: '1.75rem'
        }}
      >
        {/* Hospital Facility Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            padding: '2rem 2.25rem',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                fontWeight: 700,
                color: '#ffffff',
                flexShrink: 0
              }}
            >
              {hospitalInitial}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.25)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}
                >
                  Healthcare Facility
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    background: '#ecfdf5',
                    color: '#065f46',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                >
                  <CheckCircle2 size={12} /> Verified & Active
                </span>
              </div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                {admin.hospital || 'Hospital Facility'}
              </h2>
              <p style={{ margin: '0.3rem 0 0 0', opacity: 0.9, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={15} />
                {admin.district ? `${admin.district}, ` : ''}{admin.state || 'India'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Facility Overview Metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            borderBottom: '1px solid var(--slate-100)',
            background: 'var(--slate-50)'
          }}
        >
          <div style={{ padding: '1.25rem 1.75rem', borderRight: '1px solid var(--slate-100)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Stethoscope size={15} style={{ color: 'var(--primary)' }} />
              Registered Doctors
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '0.25rem' }}>
              {admin.stats?.totalDoctors ?? '—'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '0.15rem' }}>
              Active on hospital roster
            </div>
          </div>

          <div style={{ padding: '1.25rem 1.75rem', borderRight: '1px solid var(--slate-100)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Users size={15} style={{ color: 'var(--success)' }} />
              Managed Patients
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '0.25rem' }}>
              {admin.stats?.totalPatients ?? '—'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '0.15rem' }}>
              Registered in OPD system
            </div>
          </div>

          <div style={{ padding: '1.25rem 1.75rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={15} style={{ color: 'var(--accent)' }} />
              Affiliation Date
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-800)', marginTop: '0.4rem' }}>
              {formattedDate}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '0.15rem' }}>
              SwasthyaSankalp Network
            </div>
          </div>
        </div>

        {/* Detailed Information Sections */}
        <div style={{ padding: '2rem 2.25rem' }}>
          {/* Facility Location & Jurisdiction Details */}
          <div style={{ marginBottom: '2rem' }}>
            <h3
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--slate-400)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Building2 size={16} style={{ color: 'var(--primary)' }} />
              Facility Jurisdiction Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div style={{ background: '#f8fafc', padding: '1.1rem 1.25rem', borderRadius: '12px', border: '1px solid var(--slate-100)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)', display: 'block' }}>
                  Hospital Entity Name
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '0.25rem', display: 'block' }}>
                  {admin.hospital}
                </span>
              </div>

              <div style={{ background: '#f8fafc', padding: '1.1rem 1.25rem', borderRadius: '12px', border: '1px solid var(--slate-100)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)', display: 'block' }}>
                  District
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '0.25rem', display: 'block' }}>
                  {admin.district || 'Not Specified'}
                </span>
              </div>

              <div style={{ background: '#f8fafc', padding: '1.1rem 1.25rem', borderRadius: '12px', border: '1px solid var(--slate-100)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)', display: 'block' }}>
                  State / Territory
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '0.25rem', display: 'block' }}>
                  {admin.state || 'Not Specified'}
                </span>
              </div>
            </div>
          </div>

          {/* Authorized Administrator In-Charge */}
          <div>
            <h3
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--slate-400)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <User size={16} style={{ color: 'var(--primary)' }} />
              Authorized Administrator In-Charge
            </h3>

            <div
              style={{
                background: '#f8fafc',
                padding: '1.5rem',
                borderRadius: '14px',
                border: '1px solid var(--slate-100)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'var(--primary-bg)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    border: '1px solid var(--primary-border)'
                  }}
                >
                  {initial}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                    {admin.name}
                  </h4>
                  <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.825rem', color: 'var(--slate-500)' }}>
                    Designated Hospital Admin & Surveillance Officer
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--slate-200)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#eff6ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary)',
                      flexShrink: 0
                    }}
                  >
                    <Mail size={16} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', display: 'block' }}>Email Address</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                      {admin.email}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#ecfdf5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#059669',
                      flexShrink: 0
                    }}
                  >
                    <Phone size={16} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', display: 'block' }}>Official Phone</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                      +91 {admin.phone}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#fef3c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#d97706',
                      flexShrink: 0
                    }}
                  >
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', display: 'block' }}>System Role</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                      Hospital Administrator
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer Verification Note */}
        <div
          style={{
            background: 'var(--slate-50)',
            padding: '1rem 2.25rem',
            borderTop: '1px solid var(--slate-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
            Official Healthcare Facility authorized under SwasthyaSankalp Health Network
          </div>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--slate-400)',
              fontWeight: 500
            }}
          >
            Facility ID: {admin._id ? admin._id.slice(-8).toUpperCase() : 'HOSP-ONLINE'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
