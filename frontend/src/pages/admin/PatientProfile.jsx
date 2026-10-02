import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import PageHeader from '../../components/PageHeader';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import LoadingState from '../../components/LoadingState';
import Toast from '../../components/Toast';
import {
  User,
  CreditCard,
  Phone,
  Hospital,
  MapPin,
  Calendar,
  Clock,
  UserCheck,
  Stethoscope,
  Pill,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const PatientProfile = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Re-assign Doctor Modal State
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignDoctorId, setAssignDoctorId] = useState('');
  const [assignDisease, setAssignDisease] = useState('');
  const [assignDate, setAssignDate] = useState('');
  const [assignNotes, setAssignNotes] = useState('');
  const [submittingAssign, setSubmittingAssign] = useState(false);

  // End Consultation Dialog State
  const [endConsultationOpen, setEndConsultationOpen] = useState(false);
  const [endingConsultation, setEndingConsultation] = useState(false);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getPatientById(id);
      if (res?.data) {
        setPatient(res.data);
        setAssignDisease(res.data.disease || '');
      }

      const docRes = await adminApi.getDoctors();
      if (docRes?.data) {
        setDoctors(docRes.data);
      }
    } catch (err) {
      console.error('Fetch patient profile error:', err);
      setToast({ message: err.response?.data?.message || 'Failed to load patient record.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [id]);

  const handleAssignDoctor = async (e) => {
    e.preventDefault();
    if (!assignDoctorId) {
      setToast({ message: 'Please select a doctor.', type: 'error' });
      return;
    }

    try {
      setSubmittingAssign(true);
      await adminApi.assignDoctor({
        patientId: id,
        doctorId: assignDoctorId,
        disease: assignDisease,
        appointmentDate: assignDate,
        notes: assignNotes
      });

      setToast({ message: 'Doctor assigned and consultation scheduled successfully!', type: 'success' });
      setAssignModalOpen(false);
      setAssignDoctorId('');
      setAssignNotes('');
      fetchPatientData();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to assign doctor.', type: 'error' });
    } finally {
      setSubmittingAssign(false);
    }
  };

  const handleEndConsultation = async () => {
    try {
      setEndingConsultation(true);
      await adminApi.endConsultation(id);
      setToast({ message: 'Consultation ended and moved to history record.', type: 'success' });
      setEndConsultationOpen(false);
      fetchPatientData();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to end consultation.', type: 'error' });
    } finally {
      setEndingConsultation(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading patient health records..." />;
  }

  if (!patient) {
    return (
      <div className="card-modern p-5 text-center">
        <AlertCircle size={40} className="text-danger mb-2 mx-auto" />
        <h3 className="fs-5 fw-bold text-dark">Patient Record Not Found</h3>
        <p className="text-muted fs-7 mb-3">The requested patient record could not be found or has been removed.</p>
        <Link to="/admin/patients" className="btn btn-sm btn-primary">
          <ArrowLeft size={16} className="me-1" /> Back to Patients
        </Link>
      </div>
    );
  }

  const activeConsultation = patient.consultations?.find((c) => c.status === 'active');
  const pastConsultations = patient.consultations?.filter((c) => c.status === 'completed') || [];
  const appointments = patient.appointments || [];

  return (
    <div className="patient-profile-page">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <div className="mb-3">
        <Link to="/admin/patients" className="text-decoration-none text-muted d-inline-flex align-items-center gap-1 fs-7 fw-medium">
          <ArrowLeft size={15} /> Back to Hospital Patients
        </Link>
      </div>

      <PageHeader
        title={patient.name}
        subtitle={`Aadhaar Verified Health Record • Hospital: ${patient.hospital || 'District Hospital'}`}
        badge={<Badge variant={activeConsultation ? 'active' : 'completed'}>{activeConsultation ? 'Active Consultation' : 'Completed'}</Badge>}
        actions={
          <div className="d-flex gap-2">
            <button
              className="btn btn-primary d-flex align-items-center gap-1"
              onClick={() => setAssignModalOpen(true)}
            >
              <Stethoscope size={16} /> Re-assign Doctor / Appointment
            </button>
            {activeConsultation && (
              <button
                className="btn btn-outline-danger d-flex align-items-center gap-1"
                onClick={() => setEndConsultationOpen(true)}
              >
                <CheckCircle size={16} /> End Consultation
              </button>
            )}
          </div>
        }
      />

      {/* Demographics Card */}
      <div className="card-modern p-4 mb-4">
        <h5 className="fs-6 fw-bold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
          <User size={18} className="text-primary" /> Patient Demographics & Identification
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
            <span className="text-muted fs-7 d-block">Aadhaar Health ID</span>
            <span className="fw-bold fs-6 text-primary">{patient.aadhar || '—'}</span>
          </div>
          <div className="col-sm-6 col-md-3">
            <span className="text-muted fs-7 d-block">Contact Username</span>
            <span className="fw-bold fs-6 text-dark">{patient.username}</span>
          </div>
          <div className="col-sm-6 col-md-3">
            <span className="text-muted fs-7 d-block">Current Condition / Symptoms</span>
            <span className="fw-bold fs-6 text-dark">{patient.disease || 'General Symptoms'}</span>
          </div>
          <div className="col-sm-6 col-md-3">
            <span className="text-muted fs-7 d-block">Assigned Doctor</span>
            <span className="fw-bold fs-6 text-dark">
              {activeConsultation?.doctorName || patient.doctor?.name || 'Not assigned'}
            </span>
          </div>
          <div className="col-sm-6 col-md-3">
            <span className="text-muted fs-7 d-block">Facility / Hospital</span>
            <span className="fw-bold fs-6 text-dark">{patient.hospital}</span>
          </div>
          <div className="col-sm-6 col-md-3">
            <span className="text-muted fs-7 d-block">District & State</span>
            <span className="fw-bold fs-6 text-dark">{patient.district}, {patient.state}</span>
          </div>
        </div>
      </div>

      {/* Scheduled Appointments */}
      <div className="card-modern mb-4">
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <Calendar size={18} className="text-primary" /> Scheduled Clinic Visits & Appointments
          </h5>
          <span className="badge bg-light text-dark border">{appointments.length} recorded</span>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light fs-7 text-uppercase">
              <tr>
                <th>Appointment Date</th>
                <th>Condition / Disease</th>
                <th>Assigned Doctor</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted fs-7">
                    No scheduled appointments found for this patient.
                  </td>
                </tr>
              ) : (
                appointments.map((app, idx) => (
                  <tr key={app._id || idx}>
                    <td className="fw-medium">
                      {new Date(app.appointmentDate).toLocaleDateString(undefined, {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td>{app.disease}</td>
                    <td className="fw-semibold text-primary">{app.doctorName || 'Assigned Specialist'}</td>
                    <td><Badge variant={app.status}>{app.status}</Badge></td>
                    <td className="text-muted fs-7">{app.notes || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Consultations & Medical History with Prescriptions */}
      <div className="card-modern mb-4">
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <Pill size={18} className="text-primary" /> Medical History & Consultation Records
          </h5>
          <span className="badge bg-light text-dark border">{patient.consultations?.length || 0} consultations</span>
        </div>
        <div className="p-3">
          {(!patient.consultations || patient.consultations.length === 0) ? (
            <p className="text-center text-muted py-4 fs-7 mb-0">No consultation records on file.</p>
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
                  <span className="text-muted">Treating Doctor: </span>
                  <span className="fw-semibold text-primary">{c.doctorName || 'Specialist'}</span>
                </div>

                {/* Prescriptions List */}
                {c.prescriptions && c.prescriptions.length > 0 ? (
                  <div className="mt-2 bg-white rounded border p-2">
                    <span className="fw-bold fs-7 text-dark d-block mb-1">Prescribed Medicines:</span>
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered align-middle mb-0 fs-7">
                        <thead className="table-light">
                          <tr>
                            <th>Medicine</th>
                            <th>Dosage</th>
                            <th>Duration</th>
                            <th>Instructions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {c.prescriptions.flatMap((rx, rxIdx) =>
                            rx.medicines?.map((med, medIdx) => (
                              <tr key={`${rxIdx}-${medIdx}`}>
                                <td className="fw-medium text-dark">{med.name}</td>
                                <td>{med.dosage}</td>
                                <td>{med.duration}</td>
                                <td className="text-muted">{med.instructions || '—'}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted fs-7 mb-0 fst-italic">No prescriptions issued during this consultation.</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Assign Doctor Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Assign Doctor / Schedule Appointment"
      >
        <form onSubmit={handleAssignDoctor}>
          <div className="mb-3">
            <label className="form-label fs-7 fw-semibold text-dark">
              Select Doctor <span className="text-danger">*</span>
            </label>
            <select
              className="form-select form-select-sm"
              value={assignDoctorId}
              onChange={(e) => setAssignDoctorId(e.target.value)}
              required
            >
              <option value="">-- Choose Doctor from Roster --</option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>
                  Dr. {d.name} — {d.specialization} ({d.hospital})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fs-7 fw-semibold text-dark">
              Condition / Disease Diagnosis <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="e.g. Viral Fever, Hypertension"
              value={assignDisease}
              onChange={(e) => setAssignDisease(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fs-7 fw-semibold text-dark">Appointment Date</label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={assignDate}
              onChange={(e) => setAssignDate(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fs-7 fw-semibold text-dark">Clinical Notes (Optional)</label>
            <textarea
              className="form-control form-control-sm"
              rows="2"
              placeholder="Add preliminary notes or symptoms"
              value={assignNotes}
              onChange={(e) => setAssignNotes(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-end gap-2 pt-2 border-top">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setAssignModalOpen(false)}
              disabled={submittingAssign}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-sm btn-primary"
              disabled={submittingAssign}
            >
              {submittingAssign ? 'Assigning...' : 'Confirm Doctor Assignment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* End Consultation Confirmation */}
      <ConfirmDialog
        isOpen={endConsultationOpen}
        onClose={() => setEndConsultationOpen(false)}
        onConfirm={handleEndConsultation}
        title="End Current Consultation"
        message="Are you sure you want to end this active consultation? The consultation will be marked completed and moved to medical history."
        confirmText="End Consultation"
        isDanger={true}
        loading={endingConsultation}
      />
    </div>
  );
};

export default PatientProfile;
