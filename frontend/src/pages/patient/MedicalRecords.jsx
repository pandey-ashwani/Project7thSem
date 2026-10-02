import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { HeartHandshake, FileText, Calendar, Pill, Activity, User, ShieldCheck } from 'lucide-react';

const MedicalRecords = () => {
  const [records, setRecords] = useState({ consultations: [], appointments: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const res = await api.get('/patient/records');
        if (res.data?.success) {
          setRecords(res.data.data || res.data);
        }
      } catch (err) {
        console.error('Error fetching medical records:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  if (loading) {
    return <div className="page-body" style={{ textAlign: 'center', padding: '3rem' }}>Loading health history...</div>;
  }

  const consultations = records.consultations || [];

  return (
    <div className="page-body animate-fade" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--slate-900)' }}>
          Digital Health Records & Prescription Timeline
        </h1>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>
          Complete medical history, past diagnoses, and certified digital prescriptions.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {consultations.length > 0 ? (
          consultations.map((c, idx) => (
            <div key={idx} className="card-modern" style={{ borderLeft: '4px solid var(--primary)', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span className="badge badge-primary">{c.disease}</span>
                    <span className={`badge ${c.status === 'active' ? 'badge-success' : 'badge-secondary'}`}>
                      {c.status}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                    Attending Doctor: Dr. {c.doctorName || c.doctor?.name || 'Practitioner'}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                    Specialization: {c.doctor?.specialization || 'Medical Specialist'} &bull; {c.doctor?.hospital || 'Hospital'}
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end' }}>
                    <Calendar size={14} color="var(--primary)" />
                    <span>Started: {new Date(c.startDate).toLocaleDateString()}</span>
                  </div>
                  {c.endDate && (
                    <div style={{ marginTop: '0.2rem' }}>
                      Completed: {new Date(c.endDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Prescriptions issued */}
              {c.prescriptions && c.prescriptions.length > 0 ? (
                <div style={{ background: 'var(--slate-50)', padding: '1.25rem', borderRadius: '10px', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '0.75rem' }}>
                    <Pill size={16} color="var(--primary)" />
                    <span>Certified Prescription (Rx)</span>
                  </div>

                  {c.prescriptions.map((rx, rxIdx) => (
                    <div key={rxIdx}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {rx.medicines?.map((m, mIdx) => (
                          <div key={mIdx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px dashed var(--slate-200)', fontSize: '0.9rem' }}>
                            <div>
                              <strong style={{ color: 'var(--slate-900)' }}>{m.name}</strong>
                              {m.instructions && <span style={{ color: 'var(--slate-500)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>({m.instructions})</span>}
                            </div>
                            <span style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>{m.dosage} &bull; {m.duration}</span>
                          </div>
                        ))}
                      </div>
                      {rx.notes && (
                        <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--slate-600)', fontStyle: 'italic', background: '#fff', padding: '0.75rem', borderRadius: '6px' }}>
                          Doctor's Clinical Notes: "{rx.notes}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--slate-400)', fontStyle: 'italic', marginTop: '0.5rem' }}>
                  No medicines prescribed in this consultation session.
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="card-modern" style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-400)' }}>
            No past medical consultation records found.
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;
