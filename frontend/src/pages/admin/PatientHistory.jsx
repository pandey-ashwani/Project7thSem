import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import Modal from '../../components/Modal';
import { 
  Users, 
  Search, 
  Stethoscope, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Activity,
  Plus
} from 'lucide-react';

const PatientHistory = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modals
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [diseaseInput, setDiseaseInput] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [assignNotes, setAssignNotes] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState('');

  // Details Modal
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [patientDetails, setPatientDetails] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pRes, dRes] = await Promise.all([
        api.get('/admin/patients'),
        api.get('/admin/doctors')
      ]);
      if (pRes.data?.success) setPatients(pRes.data.data || pRes.data.patients || []);
      if (dRes.data?.success) setDoctors(dRes.data.data || dRes.data.doctors || []);
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAssignModal = (patient) => {
    setSelectedPatient(patient);
    setDiseaseInput(patient.disease || '');
    setSelectedDoctorId(patient.doctor?._id || (doctors[0]?._id || ''));
    setAppointmentDate(new Date().toISOString().split('T')[0]);
    setAssignNotes('');
    setAssignError('');
    setAssignModalOpen(true);
  };

  const handleAssignDoctor = async (e) => {
    e.preventDefault();
    setAssignLoading(true);
    setAssignError('');
    try {
      const res = await api.post('/admin/assign-doctor', {
        patientId: selectedPatient._id,
        doctorId: selectedDoctorId,
        disease: diseaseInput,
        appointmentDate,
        notes: assignNotes
      });
      if (res.data?.success) {
        setAssignModalOpen(false);
        fetchData();
      }
    } catch (err) {
      setAssignError(err.response?.data?.message || 'Failed to assign doctor.');
    } finally {
      setAssignLoading(false);
    }
  };

  const viewDetails = (patient) => {
    setPatientDetails(patient);
    setDetailsModalOpen(true);
  };

  const filteredPatients = patients.filter(p => {
    const query = search.toLowerCase();
    const matchQuery = 
      p.name?.toLowerCase().includes(query) ||
      p.aadhar?.includes(query) ||
      p.disease?.toLowerCase().includes(query) ||
      p.doctor?.name?.toLowerCase().includes(query);

    const hasActive = p.consultations?.some(c => c.status === 'active');
    const isCompleted = p.consultations?.length > 0 && !hasActive;
    const isUnassigned = !p.doctor && (!p.consultations || p.consultations.length === 0);

    if (filterStatus === 'active') return matchQuery && hasActive;
    if (filterStatus === 'completed') return matchQuery && isCompleted;
    if (filterStatus === 'unassigned') return matchQuery && isUnassigned;
    return matchQuery;
  });

  return (
    <div className="page-body animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Hospital Patient Directory & Triage
          </h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>
            Manage patient records, assign clinical specialists & track OPD consultations.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card-modern" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by patient name, Aadhaar, symptom, or doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilterStatus('all')}
              className={`btn ${filterStatus === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              All ({patients.length})
            </button>
            <button
              onClick={() => setFilterStatus('unassigned')}
              className={`btn ${filterStatus === 'unassigned' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              Awaiting Doctor
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`btn ${filterStatus === 'active' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              Active Cases
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`btn ${filterStatus === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              Treated / Completed
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table-modern">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Aadhaar Number</th>
              <th>Age</th>
              <th>Reported Symptom</th>
              <th>Assigned Doctor</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-500)' }}>
                  Loading patient records...
                </td>
              </tr>
            ) : filteredPatients.length > 0 ? (
              filteredPatients.map((p) => {
                const hasActive = p.consultations?.some(c => c.status === 'active');
                return (
                  <tr key={p._id}>
                    <td style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{p.name}</td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600, background: 'var(--slate-100)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        •••• •••• {p.aadhar?.slice(-4)}
                      </span>
                    </td>
                    <td>{p.age} yrs</td>
                    <td>
                      <span className="badge badge-primary">{p.disease}</span>
                    </td>
                    <td>
                      {p.doctor ? (
                        <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>
                          Dr. {p.doctor.name} ({p.doctor.specialization})
                        </span>
                      ) : (
                        <span style={{ color: 'var(--warning)', fontWeight: 600 }}>Unassigned</span>
                      )}
                    </td>
                    <td>
                      {hasActive ? (
                        <span className="badge badge-success">Under Treatment</span>
                      ) : p.consultations?.length > 0 ? (
                        <span className="badge badge-secondary">Treated</span>
                      ) : (
                        <span className="badge badge-warning">Awaiting Doctor</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => openAssignModal(p)}
                          className="btn btn-primary"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                        >
                          <Stethoscope size={14} />
                          <span>Assign</span>
                        </button>
                        <button
                          onClick={() => viewDetails(p)}
                          className="btn btn-secondary"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                        >
                          <FileText size={14} />
                          <span>History</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-400)' }}>
                  No matching patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Assign Doctor Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={`Assign Doctor to Patient: ${selectedPatient?.name}`}
      >
        {assignError && (
          <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {assignError}
          </div>
        )}

        <form onSubmit={handleAssignDoctor}>
          <div className="form-group">
            <label className="form-label">Select Specialist from Hospital Roster</label>
            <select
              className="form-control"
              required
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
            >
              <option value="">-- Choose Doctor --</option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>
                  Dr. {d.name} ({d.specialization} &bull; {d.experience} yrs exp)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Triage Disease / Primary Condition</label>
            <input
              type="text"
              className="form-control"
              required
              value={diseaseInput}
              onChange={(e) => setDiseaseInput(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Scheduled Appointment Date</label>
            <input
              type="date"
              className="form-control"
              required
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Clinical Triage Notes</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Initial intake notes, allergy alerts, blood pressure etc."
              value={assignNotes}
              onChange={(e) => setAssignNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setAssignModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={assignLoading || !selectedDoctorId}
            >
              {assignLoading ? 'Assigning...' : 'Confirm Assignment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Patient History Details Modal */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={`Complete Health Timeline: ${patientDetails?.name}`}
        maxWidth="750px"
      >
        {patientDetails && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', background: 'var(--slate-50)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>Aadhaar Health ID</span>
                <div style={{ fontWeight: 700, fontFamily: 'monospace' }}>•••• •••• {patientDetails.aadhar?.slice(-4)}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>Age & Gender</span>
                <div style={{ fontWeight: 700 }}>{patientDetails.age} yrs</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>District & Hospital</span>
                <div style={{ fontWeight: 700 }}>{patientDetails.hospital}</div>
              </div>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
              Consultation & Prescription History ({patientDetails.consultations?.length || 0})
            </h4>

            {patientDetails.consultations && patientDetails.consultations.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {patientDetails.consultations.map((c, idx) => (
                  <div key={idx} style={{ border: '1px solid var(--slate-200)', borderRadius: '8px', padding: '1.25rem', background: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>
                        Condition: {c.disease}
                      </span>
                      <span className={`badge ${c.status === 'active' ? 'badge-success' : 'badge-secondary'}`}>
                        {c.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '0.75rem' }}>
                      Attending Specialist: <strong>Dr. {c.doctorName || c.doctor?.name || 'Doctor'}</strong> &bull; Started: {new Date(c.startDate).toLocaleDateString()}
                    </div>

                    {c.prescriptions && c.prescriptions.length > 0 && (
                      <div style={{ background: 'var(--slate-50)', padding: '0.75rem', borderRadius: '6px', marginTop: '0.5rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                          Prescribed Medicines:
                        </div>
                        {c.prescriptions.map((rx, rxIdx) => (
                          <div key={rxIdx} style={{ fontSize: '0.85rem' }}>
                            {rx.medicines?.map((m, mIdx) => (
                              <div key={mIdx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0', borderBottom: '1px dashed var(--slate-200)' }}>
                                <span>&bull; {m.name}</span>
                                <span style={{ color: 'var(--slate-500)' }}>{m.dosage} &bull; {m.duration}</span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-400)', background: 'var(--slate-50)', borderRadius: '8px' }}>
                No prior clinical consultations recorded yet.
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PatientHistory;
