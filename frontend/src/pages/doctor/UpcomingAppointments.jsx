import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Clock, Calendar, Search } from 'lucide-react';

const UpcomingAppointments = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        setLoading(true);
        const res = await api.get('/doctor/appointments/upcoming');
        const list = res.data?.data || res.data?.patients || [];
        setPatients(list);
      } catch (err) {
        console.error('Error fetching upcoming appointments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, []);

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.disease?.toLowerCase().includes(search.toLowerCase()) ||
    p.aadhar?.includes(search)
  );

  return (
    <div className="page-body animate-fade">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--slate-900)' }}>
          Upcoming Clinical Appointments
        </h1>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>
          Future scheduled OPD appointments and patient follow-ups.
        </p>
      </div>

      <div className="card-modern" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search upcoming appointments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
        </div>
      </div>

      <div className="table-container">
        <table className="table-modern">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Aadhaar Number</th>
              <th>Condition</th>
              <th>Scheduled Appointment Date</th>
              <th>Triage Notes</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-500)' }}>
                  Loading upcoming schedule...
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((p) => {
                const appointment = p.appointments?.find(a => new Date(a.appointmentDate) >= new Date()) || p.appointments?.[0];
                return (
                  <tr key={p._id}>
                    <td style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{p.name}</td>
                    <td>•••• •••• {p.aadhar?.slice(-4)}</td>
                    <td>
                      <span className="badge badge-primary">{p.disease}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--slate-900)' }}>
                        <Calendar size={14} color="var(--primary)" />
                        <span>{appointment?.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString() : 'Scheduled'}</span>
                      </div>
                    </td>
                    <td>{appointment?.notes || 'Standard checkup'}</td>
                    <td>
                      <span className="badge badge-primary">Scheduled</span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-400)' }}>
                  No upcoming appointments scheduled.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UpcomingAppointments;
