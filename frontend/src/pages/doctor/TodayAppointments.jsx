import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import Modal from '../../components/Modal';
import { CalendarCheck, FileText, Plus, Trash2, Search, Activity } from 'lucide-react';

const TodayAppointments = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Prescription Modal
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

  const fetchToday = async () => {
    try {
      setLoading(true);
      const res = await api.get('/doctor/appointments/today');
      const list = res.data?.data || res.data?.patients || [];
      setPatients(list);
    } catch (err) {
      console.error('Error fetching today appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToday();
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
          fetchToday();
        }, 1200);
      }
    } catch (err) {
      setRxError(err.response?.data?.message || 'Failed to submit prescription.');
    } finally {
      setRxLoading(false);
    }
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
          Today's Active OPD Queue
        </h1>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>
          Real-time patient check-ins assigned to your OPD shift today.
        </p>
      </div>

      <div className="card-modern" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search queue by name, disease or Aadhaar..."
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
              <th>Reported Symptom / Reason</th>
              <th>Location</th>
              <th style={{ textAlign: 'right' }}>Prescribe & Consult</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-500)' }}>
                  Loading today's queue...
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((p) => (
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
                  No active patients waiting in today's OPD queue.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
            <div><strong>Reported Condition:</strong> {selectedPatient?.disease}</div>
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
                  placeholder="Medicine Name"
                  required
                  value={med.name}
                  onChange={(e) => updateMedicine(idx, 'name', e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Dosage"
                  required
                  value={med.dosage}
                  onChange={(e) => updateMedicine(idx, 'dosage', e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Duration"
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
              placeholder="Advice notes, lifestyle precautions, follow-up date..."
              value={rxNotes}
              onChange={(e) => setRxNotes(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="completeCheck2"
              checked={completeConsultation}
              onChange={(e) => setCompleteConsultation(e.target.checked)}
              style={{ width: '18px', height: '18px' }}
            />
            <label htmlFor="completeCheck2" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-800)', cursor: 'pointer' }}>
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

export default TodayAppointments;
