import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import StatCard from '../../components/StatCard';
import Modal from '../../components/Modal';
import { 
  CalendarCheck, 
  Clock, 
  FileText, 
  Users, 
  Stethoscope, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Activity,
  ArrowRight
} from 'lucide-react';

const DoctorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Prescription Modal State
  const [rxModalOpen, setRxModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '1 Tab - Twice Daily', duration: '5 Days', instructions: 'After meals' }
  ]);
  const [rxNotes, setRxNotes] = useState('');
  const [completeConsultation, setCompleteConsultation] = useState(true);
  const [rxLoading, setRxLoading] = useState(false);
  const [rxError, setRxError] = useState('');
  const [rxSuccess, setRxSuccess] = useState('');

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/doctor/dashboard');
      if (res.data?.success) {
        setData(res.data.data || res.data);
      }
    } catch (err) {
      console.error('Error fetching doctor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const openPrescriptionModal = (patient) => {
    setSelectedPatient(patient);
    setMedicines([
      { name: '', dosage: '1 Tab - Twice Daily', duration: '5 Days', instructions: 'After meals' }
    ]);
    setRxNotes('');
    setCompleteConsultation(true);
    setRxError('');
    setRxSuccess('');
    setRxModalOpen(true);
  };

  const addMedicineRow = () => {
    setMedicines([
      ...medicines,
      { name: '', dosage: '1 Tab - Twice Daily', duration: '5 Days', instructions: 'After meals' }
    ]);
  };

  const removeMedicineRow = (index) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((_, idx) => idx !== index));
  };

  const updateMedicine = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    setRxError('');
    setRxSuccess('');

    const validMeds = medicines.filter(m => m.name.trim().length > 0);
    if (validMeds.length === 0) {
      setRxError('Please specify at least one medicine name.');
      return;
    }

    setRxLoading(true);
    try {
      const res = await api.post('/doctor/prescription', {
        patientId: selectedPatient._id,
        medicines: validMeds,
        notes: rxNotes,
        completeConsultation
      });
      if (res.data?.success) {
        setRxSuccess('Digital Prescription created and consultation completed!');
        setTimeout(() => {
          setRxModalOpen(false);
          fetchDashboard();
        }, 1200);
      }
    } catch (err) {
      setRxError(err.response?.data?.message || 'Failed to submit prescription.');
    } finally {
      setRxLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-500)' }}>
        <Activity size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
        <p>Loading Clinical Dashboard...</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const todayPatients = data?.todayPatients || [];

  return (
    <div className="page-body animate-fade">
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0d9488 0%, #075985 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem',
        color: '#fff',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            🩺 Medical Specialist Workspace
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
            Welcome, Dr. {data?.doctor?.name}
          </h1>
          <p style={{ color: 'var(--slate-200)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Specialization: <strong>{data?.doctor?.specialization}</strong> &bull; Hospital: {data?.doctor?.hospital}
          </p>
        </div>

        <Link to="/doctor/today" className="btn" style={{ background: '#fff', color: 'var(--secondary-hover)', fontWeight: 700, padding: '0.8rem 1.5rem' }}>
          <CalendarCheck size={18} />
          <span>Launch Today's OPD ({stats.todayAppointmentsCount || 0})</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="stat-grid">
        <StatCard
          title="Today's OPD Queue"
          value={stats.todayAppointmentsCount || 0}
          icon={CalendarCheck}
          color="secondary"
          subtitle="Patients waiting today"
        />
        <StatCard
          title="Upcoming Schedule"
          value={stats.upcomingAppointmentsCount || 0}
          icon={Clock}
          color="primary"
          subtitle="Future scheduled slots"
        />
        <StatCard
          title="Completed Consultations"
          value={stats.completedConsultationsCount || 0}
          icon={CheckCircle2}
          color="success"
          subtitle="Treated & recovered"
        />
        <StatCard
          title="Total Historical Cases"
          value={stats.totalPatientsTreated || 0}
          icon={Users}
          color="accent"
          subtitle="All patient records"
        />
      </div>

      {/* Today's Queue Section */}
      <div className="table-container" style={{ marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-100)' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--slate-900)' }}>
              Active Patient Consultations for Today
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
              Aadhaar-verified patients waiting for clinical consultation and digital prescription.
            </p>
          </div>
          <Link to="/doctor/today" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--secondary)', fontWeight: 700, fontSize: '0.9rem' }}>
            <span>Full OPD Queue</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table-modern">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Aadhaar Health ID</th>
                <th>Age</th>
                <th>Reported Symptom</th>
                <th>Location</th>
                <th style={{ textAlign: 'right' }}>Prescription</th>
              </tr>
            </thead>
            <tbody>
              {todayPatients.length > 0 ? (
                todayPatients.map((p) => (
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
                    <td>{p.district}, {p.state}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => openPrescriptionModal(p)}
                        className="btn btn-primary"
                        style={{ background: 'linear-gradient(135deg, var(--secondary), var(--secondary-hover))', padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}
                      >
                        <FileText size={14} />
                        <span>Write Rx / Consult</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-400)' }}>
                    No patients waiting in queue today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Digital Prescription Modal */}
      <Modal
        isOpen={rxModalOpen}
        onClose={() => setRxModalOpen(false)}
        title={`Digital Prescription & Diagnosis: ${selectedPatient?.name}`}
        maxWidth="750px"
      >
        {rxError && (
          <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {rxError}
          </div>
        )}
        {rxSuccess && (
          <div style={{ background: 'var(--success-light)', color: 'var(--success)', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {rxSuccess}
          </div>
        )}

        <form onSubmit={handlePrescriptionSubmit}>
          <div style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div><strong>Patient:</strong> {selectedPatient?.name} ({selectedPatient?.age} yrs)</div>
            <div><strong>Aadhaar:</strong> •••• •••• {selectedPatient?.aadhar?.slice(-4)}</div>
            <div><strong>Diagnosis/Condition:</strong> {selectedPatient?.disease}</div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Prescribed Medicines</label>
              <button
                type="button"
                onClick={addMedicineRow}
                style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <Plus size={16} /> Add Medicine
              </button>
            </div>

            {medicines.map((med, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 1fr 1fr 36px', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Medicine Name (e.g. Paracetamol 650mg)"
                  required
                  value={med.name}
                  onChange={(e) => updateMedicine(idx, 'name', e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Dosage (e.g. 1 Tab Twice)"
                  required
                  value={med.dosage}
                  onChange={(e) => updateMedicine(idx, 'dosage', e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Duration (5 Days)"
                  required
                  value={med.duration}
                  onChange={(e) => updateMedicine(idx, 'duration', e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Instructions"
                  value={med.instructions}
                  onChange={(e) => updateMedicine(idx, 'instructions', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeMedicineRow(idx)}
                  disabled={medicines.length === 1}
                  style={{ color: medicines.length === 1 ? 'var(--slate-300)' : 'var(--danger)', padding: '0.4rem', borderRadius: '4px' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="form-group">
            <label className="form-label">Doctor Clinical Advice & Dietary Instructions</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Drink plenty of fluids, rest for 3 days, follow up if fever persists..."
              value={rxNotes}
              onChange={(e) => setRxNotes(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="completeCheck"
              checked={completeConsultation}
              onChange={(e) => setCompleteConsultation(e.target.checked)}
              style={{ width: '18px', height: '18px' }}
            />
            <label htmlFor="completeCheck" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-800)', cursor: 'pointer' }}>
              Mark OPD consultation as Completed (Patient status updated to Treated)
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setRxModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ background: 'linear-gradient(135deg, var(--secondary), var(--secondary-hover))' }}
              disabled={rxLoading}
            >
              {rxLoading ? 'Generating Prescription...' : 'Issue Digital Prescription'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DoctorDashboard;
