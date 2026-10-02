import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Users, Search, Filter, ShieldCheck, MapPin, Building2 } from 'lucide-react';

const StatewidePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const res = await api.get('/superadmin/patients');
        const list = res.data?.data || res.data?.patients || [];
        setPatients(list);
      } catch (err) {
        console.error('Error fetching statewide patients:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const uniqueDistricts = ['All', ...new Set(patients.map(p => p.district).filter(Boolean))];

  const filtered = patients.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) ||
                        p.aadhar?.includes(search) ||
                        p.disease?.toLowerCase().includes(search.toLowerCase()) ||
                        p.hospital?.toLowerCase().includes(search.toLowerCase());
    const matchDist = districtFilter === 'All' || p.district === districtFilter;
    return matchSearch && matchDist;
  });

  return (
    <div className="page-body animate-fade">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--slate-900)' }}>
          Statewide Citizen Registry & Health ID Index
        </h1>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>
          Centralized demographic records indexed by 12-digit Aadhaar across all state districts.
        </p>
      </div>

      <div className="card-modern" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by citizen name, Aadhaar, hospital, or symptom..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--slate-500)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-600)' }}>District:</span>
            <select
              className="form-control"
              style={{ width: 'auto', padding: '0.45rem 1rem' }}
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
            >
              {uniqueDistricts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="table-modern">
          <thead>
            <tr>
              <th>Citizen Name</th>
              <th>12-Digit Aadhaar Health ID</th>
              <th>Age</th>
              <th>Registered Hospital</th>
              <th>District & State</th>
              <th>Primary Condition</th>
              <th>Assigned Doctor</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-500)' }}>
                  Loading statewide patient records...
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((p) => (
                <tr key={p._id}>
                  <td style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{p.name}</td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, background: 'var(--slate-100)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {p.aadhar}
                    </span>
                  </td>
                  <td>{p.age} yrs</td>
                  <td>{p.hospital}</td>
                  <td>{p.district}, {p.state}</td>
                  <td>
                    <span className="badge badge-primary">{p.disease}</span>
                  </td>
                  <td>
                    {p.doctor ? (
                      <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>Dr. {p.doctor.name}</span>
                    ) : (
                      <span style={{ color: 'var(--slate-400)' }}>Unassigned</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-400)' }}>
                  No matching statewide records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatewidePatients;
