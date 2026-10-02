import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import doctorApi from '../../api/doctorApi';
import PageHeader from '../../components/PageHeader';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import LoadingState from '../../components/LoadingState';
import Toast from '../../components/Toast';
import {
  User,
  Calendar,
  Pill,
  FilePlus,
  ArrowLeft,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';

const DoctorPatientDetail = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Prescription Modal State
  const [rxModalOpen, setRxModalOpen] = useState(false);
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '', duration: '', instructions: '' }
  ]);
  const [rxNotes, setRxNotes] = useState('');
  const [completeConsultation, setCompleteConsultation] = useState(false);
  const [submittingRx, setSubmittingRx] = useState(false);

  const fetchPatient = async () => {
    try {
      setLoading(true);
      const res = await doctorApi.getPatientDetails(id);
      if (res?.data) {
        setPatient(res.data);
      }
    } catch (err) {
      console.error('Fetch patient details error:', err);
      setToast({ message: err.response?.data?.message || 'Failed to load patient records.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const handleAddMedicineRow = () => {
    setMedicines([...medicines, { name: '', dosage: '', duration: '', instructions: '' }]);
  };

  const handleRemoveMedicineRow = (index) => {
    if (medicines.length <= 1) return;
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    const validMeds = medicines.filter((m) => m.name.trim() && m.dosage.trim() && m.duration.trim());
    if (validMeds.length === 0) {
      setToast({ message: 'Please enter at least one medicine with name, dosage, and duration.', type: 'error' });
      return;
    }

    try {
      setSubmittingRx(true);
      await doctorApi.createPrescription({
        patientId: id,
        medicines: validMeds,
        notes: rxNotes,
        completeConsultation
      });

      setToast({ message: 'Digital prescription generated successfully!', type: 'success' });
      setRxModalOpen(false);
      setMedicines([{ name: '', dosage: '', duration: '', instructions: '' }]);
      setRxNotes('');
      setCompleteConsultation(false);
      fetchPatient();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to submit prescription.', type: 'error' });
    } finally {
      setSubmittingRx(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading patient clinical records..." />;
  }

  if (!patient) {
    return (
      <div className="card-modern p-5 text-center">
        <AlertCircle size={40} className="text-danger mb-2 mx-auto" />
        <h3 className="fs-5 fw-bold text-dark">Patient Record Not Found</h3>
        <p className="text-muted fs-7 mb-3">The clinical record could not be loaded.</p>
        <Link to="/doctor/dashboard" className="btn btn-sm btn-primary">
          <ArrowLeft size={16} className="me-1" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const activeConsultation = patient.consultations?.find((c) => c.status === 'active');

  return (
    <div className="doctor-patient-detail-page">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <div className="mb-3">
        <Link to="/doctor/today" className="text-decoration-none text-muted d-inline-flex align-items-center gap-1 fs-7 fw-medium">
          <ArrowLeft size={15} /> Back to OPD Queue
        </Link>
      </div>

      <PageHeader
        title={patient.name}
        subtitle={`Clinical History • ${patient.age} yrs • Condition: ${patient.disease || 'General'}`}
        badge={<Badge variant={activeConsultation ? 'active' : 'completed'}>{activeConsultation ? 'Active Case' : 'Completed'}</Badge>}
        actions={
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => setRxModalOpen(true)}
          >
            <FilePlus size={16} /> Write Digital Prescription
          </button>
        }
      />

      {/* Patient Demographic Summary */}
      <div className="card-modern p-4 mb-4">
        <h5 className="fs-6 fw-bold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
          <User size={18} className="text-primary" /> Patient Demographics
        </h5>
        <div className="row g-3">
          <div className="col-sm-6 col-md-3">
            <span className="text-muted fs-7 d-block">Full Name</span>
            <span className="fw-bold fs-6 text-dark">{patient.name}</span>
          </div>
          <div className="col-sm-6 col-md-3">
            <span className="text-muted fs-7 d-block">Age</span>
            <span className="fw-bold fs-6 text-dark">{patient.age} Years</span>
          </div>
          <div className="col-sm-6 col-md-3">
            <span className="text-muted fs-7 d-block">Contact Phone</span>
            <span className="fw-bold fs-6 text-dark">{patient.username}</span>
          </div>
          <div className="col-sm-6 col-md-3">
            <span className="text-muted fs-7 d-block">Facility</span>
            <span className="fw-bold fs-6 text-dark">{patient.hospital}</span>
          </div>
        </div>
      </div>

      {/* Consultations & Rx History */}
      <div className="card-modern mb-4">
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <Pill size={18} className="text-primary" /> Clinical Timeline & Prescriptions
          </h5>
          <span className="badge bg-light text-dark border">{patient.consultations?.length || 0} consultations</span>
        </div>
        <div className="p-3">
          {(!patient.consultations || patient.consultations.length === 0) ? (
            <p className="text-center text-muted py-4 fs-7 mb-0">No consultation records recorded yet.</p>
          ) : (
            patient.consultations.map((c, idx) => (
              <div
                key={c._id || idx}
                className="border rounded-3 p-3 mb-3"
                style={{ backgroundColor: c.status === 'active' ? '#f0fdf4' : '#ffffff' }}
              >
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-2 pb-2 border-bottom">
                  <div>
                    <span className="fw-bold fs-6 text-dark me-2">{c.disease}</span>
                    <Badge variant={c.status}>{c.status}</Badge>
                  </div>
                  <div className="text-muted fs-7">
                    <span>Started: {new Date(c.startDate).toLocaleDateString()}</span>
                    {c.endDate && <span className="ms-2">• Ended: {new Date(c.endDate).toLocaleDateString()}</span>}
                  </div>
                </div>

                <div className="mb-2 fs-7">
                  <span className="text-muted">Physician: </span>
                  <span className="fw-semibold text-primary">{c.doctorName || 'Attending Doctor'}</span>
                </div>

                {/* Prescriptions */}
                {c.prescriptions && c.prescriptions.length > 0 ? (
                  <div className="mt-2 bg-white rounded border p-2">
                    <span className="fw-bold fs-7 text-dark d-block mb-1">Prescriptions:</span>
                    {c.prescriptions.map((rx, rIdx) => (
                      <div key={rIdx} className="mb-2 pb-2 border-bottom last-border-0">
                        <div className="text-muted fs-7 mb-1">
                          Date: {new Date(rx.date).toLocaleDateString()} {rx.notes && `• Note: ${rx.notes}`}
                        </div>
                        <div className="table-responsive">
                          <table className="table table-sm table-bordered align-middle mb-0 fs-7">
                            <thead className="table-light">
                              <tr>
                                <th>Medicine Name</th>
                                <th>Dosage</th>
                                <th>Duration</th>
                                <th>Instructions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rx.medicines?.map((med, mIdx) => (
                                <tr key={mIdx}>
                                  <td className="fw-medium text-dark">{med.name}</td>
                                  <td>{med.dosage}</td>
                                  <td>{med.duration}</td>
                                  <td className="text-muted">{med.instructions || '—'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted fs-7 mb-0 fst-italic">No prescriptions attached.</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Prescription Generator Modal */}
      <Modal
        isOpen={rxModalOpen}
        onClose={() => setRxModalOpen(false)}
        title={`Digital Prescription — ${patient.name}`}
      >
        <form onSubmit={handlePrescriptionSubmit}>
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label fs-7 fw-bold text-dark mb-0">Medicines & Instructions</label>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                onClick={handleAddMedicineRow}
              >
                <Plus size={14} /> Add Medicine
              </button>
            </div>

            {medicines.map((med, index) => (
              <div key={index} className="border rounded p-2 mb-2 bg-light">
                <div className="row g-2">
                  <div className="col-12 col-md-4">
                    <label className="fs-7 text-muted">Medicine Name *</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g. Paracetamol 500mg"
                      value={med.name}
                      onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="fs-7 text-muted">Dosage *</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g. 1-0-1"
                      value={med.dosage}
                      onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="fs-7 text-muted">Duration *</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g. 5 days"
                      value={med.duration}
                      onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-11">
                    <label className="fs-7 text-muted">Instructions</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g. After meals with warm water"
                      value={med.instructions}
                      onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-1 d-flex align-items-end justify-content-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger w-100"
                      disabled={medicines.length <= 1}
                      onClick={() => handleRemoveMedicineRow(index)}
                      title="Remove medicine"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-3">
            <label className="form-label fs-7 fw-semibold text-dark">Physician Notes & Advice</label>
            <textarea
              className="form-control form-control-sm"
              rows="2"
              placeholder="e.g. Drink plenty of fluids. Review in 5 days if fever persists."
              value={rxNotes}
              onChange={(e) => setRxNotes(e.target.value)}
            />
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="completeConsultationCheck"
              checked={completeConsultation}
              onChange={(e) => setCompleteConsultation(e.target.checked)}
            />
            <label className="form-check-label fs-7 text-dark" htmlFor="completeConsultationCheck">
              Mark consultation completed (treatment concluded)
            </label>
          </div>

          <div className="d-flex justify-content-end gap-2 pt-2 border-top">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setRxModalOpen(false)}
              disabled={submittingRx}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-sm btn-primary"
              disabled={submittingRx}
            >
              {submittingRx ? 'Saving Prescription...' : 'Issue Prescription'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DoctorPatientDetail;
