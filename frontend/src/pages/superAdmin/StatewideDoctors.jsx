import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Stethoscope, Search, Award, Building2, MapPin, Phone, Mail } from 'lucide-react';

const StatewideDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await api.get('/superadmin/doctors');
        const list = res.data?.data || res.data?.doctors || [];
        setDoctors(list);
      } catch (err) {
        console.error('Error fetching statewide doctors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filtered = doctors.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase()) ||
    d.hospital?.toLowerCase().includes(search.toLowerCase()) ||
    d.district?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-body animate-fade">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--slate-900)' }}>
          Statewide Medical Specialist Directory
        </h1>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>
          Registered clinicians, surgeons & practitioners across all state healthcare networks.
        </p>
      </div>

      <div className="card-modern" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by doctor, specialty, hospital or district..."
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
            Loading specialist directory...
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((doc) => (
            <div key={doc._id} className="card-modern" style={{ borderTop: '4px solid var(--secondary)' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  background: 'var(--secondary-light)',
                  color: 'var(--secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Stethoscope size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                    Dr. {doc.name}
                  </h3>
                  <div style={{ display: 'inline-block', marginTop: '0.2rem' }}>
                    <span className="badge badge-success">{doc.specialization}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--slate-600)', borderTop: '1px solid var(--slate-100)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building2 size={16} color="var(--slate-400)" />
                  <span>{doc.hospital}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} color="var(--slate-400)" />
                  <span>{doc.district}, {doc.state}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={16} color="var(--slate-400)" />
                  <span>{doc.qualification} ({doc.experience} yrs exp)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={16} color="var(--slate-400)" />
                  <span>+91 {doc.phone}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--slate-400)' }}>
            No matching doctors found.
          </div>
        )}
      </div>
    </div>
  );
};

export default StatewideDoctors;
