import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { ShieldCheck, Mail, Phone, Award } from 'lucide-react';

const SuperAdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/superadmin/profile');
        if (res.data?.success) setProfile(res.data.superAdmin);
      } catch (err) {
        console.error('Error fetching superadmin profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="page-body" style={{ textAlign: 'center', padding: '3rem' }}>Loading state authority profile...</div>;
  }

  if (!profile) return null;

  return (
    <div className="page-body animate-fade" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--slate-900)' }}>
          State Health Authority Officer Credentials
        </h1>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>
          Principal Health Department Administrator Credentials & Governance Scope.
        </p>
      </div>

      <div className="card-modern" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '1.5rem' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            background: 'var(--slate-900)',
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 800
          }}>
            <ShieldCheck size={36} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              {profile.name}
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
              <span className="badge badge-warning">State SuperAdmin Authority</span>
              <span className="badge badge-primary">Surveillance Chief</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: 'var(--slate-50)', padding: '1.25rem', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-500)', fontSize: '0.85rem', fontWeight: 600 }}>
              <Award size={16} /> Administrative Role
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '0.4rem' }}>
              State Health Director & SuperAdmin
            </div>
          </div>

          <div style={{ background: 'var(--slate-50)', padding: '1.25rem', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-500)', fontSize: '0.85rem', fontWeight: 600 }}>
              <Mail size={16} /> Official Government Email
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '0.4rem' }}>
              {profile.email}
            </div>
          </div>

          <div style={{ background: 'var(--slate-50)', padding: '1.25rem', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-500)', fontSize: '0.85rem', fontWeight: 600 }}>
              <Phone size={16} /> Official Hotline Phone
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '0.4rem' }}>
              +91 {profile.phone}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminProfile;
