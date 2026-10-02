import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import Modal from '../../components/Modal';
import { FileText, Search, UserCheck } from 'lucide-react';

const DoctorPatientHistory = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await api.get('/doctor/patient-history');
        const list = res.data?.data || res.data?.patients || [];
        setPatients(list);
      } catch (err) {
        console.error('Error fetching patient history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const openDetails = (p) => {
    setSelectedPatient(p);
    setDetailsModalOpen(true);
  };

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.disease?.toLowerCase().includes(search.toLowerCase()) ||
    p.aadhar?.includes(search)
  );

  return (
    <div className="page-body animate-fade">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--slate-900)' }}>
          Clinical Patient Records & Case History
        </h1>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>
          Historical consultations, past prescriptions issued, and patient recovery notes.
        </p>
      </div>

      <div className="card-modern" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search past patient history..."
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
              <th>Aadhaar Health ID</th>
              <th>Age</th>
              <th>Diagnosed Condition</th>
              <th>Consultations</th>
              <th style={{ textAlign: 'right' }}>Prescription History</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-500)' }}>
                  Loading patient histories...
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((p) => (
                <tr key={p._id}>
                  <td style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{p.name}</td>
                  <td>•••• •••• {p.aadhar?.slice(-4)}</td>
                  <td>{p.age} yrs</td>
                  <td>
                    <span className="badge badge-primary">{p.disease}</span>
                  </td>
                  <td>{p.consultations?.length || 0} Sessions</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => openDetails(p)}
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      <FileText size={14} />
                      <span>View Case Details</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-400)' }}>
                  No past treated patient records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={`Medical Case History: ${selectedPatient?.name}`}
        maxWidth="750px"
      >
        {selectedPatient && (
          <div>
            <div style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div><strong>Age:</strong> {selectedPatient.age} yrs</div>
              <div><strong>Aadhaar:</strong> •••• •••• {selectedPatient.aadhar?.slice(-4)}</div>
              <div><strong>Hospital:</strong> {selectedPatient.hospital}</div>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
              Past Prescriptions & Diagnosis Notes
            </h4>

            {selectedPatient.consultations && selectedPatient.consultations.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {selectedPatient.consultations.map((c, idx) => (
                  <div key={idx} style={{ border: '1px solid var(--slate-200)', borderRadius: '8px', padding: '1.25rem', background: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>Condition: {c.disease}</span>
                      <span className={`badge ${c.status === 'completed' ? 'badge-secondary' : 'badge-success'}`}>{c.status}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginBottom: '0.75rem' }}>
                      Date: {new Date(c.startDate).toLocaleDateString()}
                    </div>

                    {c.prescriptions && c.prescriptions.map((rx, rxIdx) => (
                      <div key={rxIdx} style={{ background: 'var(--slate-50)', padding: '0.75rem', borderRadius: '6px', marginTop: '0.5rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                          Medicines Prescribed:
                        </div>
                        {rx.medicines?.map((m, mIdx) => (
                          <div key={mIdx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0', fontSize: '0.85rem' }}>
                            <span>&bull; {m.name}</span>
                            <span style={{ color: 'var(--slate-500)' }}>{m.dosage} ({m.duration})</span>
                          </div>
                        ))}
                        {rx.notes && (
                          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--slate-600)', fontStyle: 'italic' }}>
                            Clinical Advice: "{rx.notes}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--slate-400)' }}>No consultations on record.</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DoctorPatientHistory;
