import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Building2, Search, MapPin, Mail, Phone, UserCheck } from 'lucide-react';

const HospitalNetwork = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true);
        const res = await api.get('/superadmin/hospitals');
        const list = res.data?.data || res.data?.hospitals || [];
        setHospitals(list);
      } catch (err) {
        console.error('Error fetching hospital network:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  const filtered = hospitals.filter(h =>
    h.hospital?.toLowerCase().includes(search.toLowerCase()) ||
    h.district?.toLowerCase().includes(search.toLowerCase()) ||
    h.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-body animate-fade">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--slate-900)' }}>
          Statewide Connected Hospital Network
        </h1>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>
          Registered district hospital facilities, administrative chiefs and contact hubs.
        </p>
      </div>

      <div className="card-modern" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search hospital facility, district, or admin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--slate-500)' }}>
            Loading hospital network...
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((h) => (
            <div key={h._id} className="card-modern" style={{ borderTop: '4px solid var(--primary)' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Building2 size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                    {h.hospital}
                  </h3>
                  <div style={{ display: 'inline-block', marginTop: '0.2rem' }}>
                    <span className="badge badge-primary">District Health Hub</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--slate-600)', borderTop: '1px solid var(--slate-100)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} color="var(--slate-400)" />
                  <span>District: <strong>{h.district}</strong>, {h.state}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserCheck size={16} color="var(--slate-400)" />
                  <span>Admin: <strong>{h.name}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={16} color="var(--slate-400)" />
                  <span>{h.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={16} color="var(--slate-400)" />
                  <span>+91 {h.phone}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--slate-400)' }}>
            No hospitals registered yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalNetwork;
