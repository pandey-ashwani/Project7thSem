import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import StatCard from '../../components/StatCard';
import Modal from '../../components/Modal';
import { 
  Users, 
  Stethoscope, 
  UserPlus, 
  Clock, 
  CheckCircle2, 
  Search, 
  AlertCircle,
  ArrowUpRight,
  Activity,
  Calendar,
  FileText,
  Sparkles,
  Building2,
  ShieldCheck
} from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assignment Modal State
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [assignNotes, setAssignNotes] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState('');
  const [assignSuccess, setAssignSuccess] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashRes, docRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/doctors')
      ]);
      if (dashRes.data?.success) {
        setData(dashRes.data.data || dashRes.data);
      }
      if (docRes.data?.success) {
        setDoctors(docRes.data.data || docRes.data.doctors || []);
      }
    } catch (err) {
      console.error("Fetch admin dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const openAssignModal = (patient) => {
    setSelectedPatient(patient);
    setSelectedDoctorId(doctors[0]?._id || '');
    setAppointmentDate(new Date().toISOString().split('T')[0]);
    setAssignNotes('Please report to OPD Room 101.');
    setAssignError('');
    setAssignModalOpen(true);
  };

  const handleAssignDoctor = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId) {
      setAssignError('Please select a doctor from the hospital roster.');
      return;
    }

    setAssignLoading(true);
    setAssignError('');
    try {
      const res = await api.post('/admin/assign-doctor', {
        patientId: selectedPatient._id,
        doctorId: selectedDoctorId,
        disease: selectedPatient.disease,
        appointmentDate,
        notes: assignNotes
      });

      if (res.data?.success) {
        setAssignModalOpen(false);
        setAssignSuccess(`Doctor successfully assigned to ${selectedPatient.name}! Citizen has been notified.`);
        setTimeout(() => setAssignSuccess(''), 5000);
        fetchDashboardData();
      }
    } catch (err) {
      setAssignError(err.response?.data?.message || 'Failed to assign doctor.');
    } finally {
      setAssignLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-500)' }}>
        <Activity size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
        <p>Loading Hospital Workspace Data...</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentPatients = data?.recentPatients || [];
  const unassignedList = data?.unassignedList || [];

  return (
    <div className="page-body animate-fade">
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--slate-900) 0%, #0369a1 100%)',
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
            🏥 Hospital Control Center
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
            {data?.admin?.hospital || 'Hospital'} Workspace
          </h1>
          <p style={{ color: 'var(--slate-300)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            District: {data?.admin?.district || 'District'} &bull; State: {data?.admin?.state || 'State'} &bull; Admin: {data?.admin?.name}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/check-patient" className="btn btn-primary" style={{ background: '#fff', color: 'var(--slate-900)', boxShadow: 'none' }}>
            <Search size={16} />
            <span>Verify Aadhaar</span>
          </Link>
          <Link to="/admin/new-patient" className="btn btn-primary">
            <UserPlus size={16} />
            <span>New Patient</span>
          </Link>
        </div>
      </div>

      {/* Success notification banner after assignment */}
      {assignSuccess && (
        <div style={{
          background: 'var(--success-light)',
          color: '#065f46',
          border: '1px solid #a7f3d0',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={20} color="#059669" />
          <span>{assignSuccess}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="stat-grid" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Hospital Patients"
          value={stats.totalPatients || 0}
          icon={Users}
          color="primary"
          subtitle="Registered in this facility"
        />
        <StatCard
          title="Medical Practitioners"
          value={stats.totalDoctors || 0}
          icon={Stethoscope}
          color="secondary"
          subtitle="Active doctors in roster"
        />
        <StatCard
          title="Unassigned Cases"
          value={stats.unassignedPatients || 0}
          icon={Clock}
          color="warning"
          subtitle="Awaiting doctor assignment"
        />
        <StatCard
          title="Active Consultations"
          value={stats.activeConsultations || 0}
          icon={Activity}
          color="accent"
          subtitle="Ongoing treatments"
        />
      </div>

      {/* High-Priority Notification Queue: Citizen Self-Registrations Awaiting Doctor */}
      {unassignedList.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          border: '2px solid #fde68a',
          borderRadius: 'var(--radius-xl)',
          padding: '1.75rem',
          marginBottom: '2.5rem',
          boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: '#f59e0b',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#78350f', margin: 0 }}>
                  🚨 Action Required: {unassignedList.length} Citizen Self-Registration(s) Awaiting Doctor Assignment
                </h3>
                <p style={{ color: '#b45309', fontSize: '0.875rem', margin: '0.2rem 0 0 0' }}>
                  These patients selected <strong>{data?.admin?.hospital}</strong> during self-signup. Assign specialist doctors & schedule their consultation date below.
                </p>
              </div>
            </div>
            <span style={{
              background: '#b45309',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.35rem 0.8rem',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Hospital Intake Queue
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {unassignedList.map((p) => (
              <div
                key={p._id}
                style={{
                  background: '#fff',
                  border: '1px solid #fcd34d',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                        Age: {p.age} yrs &bull; Aadhaar: <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>•••• •••• {p.aadhar?.slice(-4)}</span>
                      </div>
                    </div>
                    <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
                      Pending Assignment
                    </span>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--slate-200)', marginTop: '0.6rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                      Reported Symptom / Reason:
                    </div>
                    <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--accent)', marginTop: '2px' }}>
                      {p.disease || 'General Consultation'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openAssignModal(p)}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    borderRadius: '8px',
                    gap: '0.4rem'
                  }}
                >
                  <Stethoscope size={16} />
                  <span>Assign Doctor & Schedule Date</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Patients Table */}
      <div className="table-container">
        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-100)' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--slate-900)' }}>
              Recent Patient Registrations
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
              Latest patients checked into {data?.admin?.hospital}
            </p>
          </div>
          <Link to="/admin/patients" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>
            <span>View All Patients</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table-modern">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Aadhaar Number</th>
                <th>Age</th>
                <th>Reported Symptom / Disease</th>
                <th>Assigned Doctor</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentPatients.length > 0 ? (
                recentPatients.map((p) => {
                  const isPending = !p.doctor || p.assignmentStatus === 'pending_assignment';
                  const hasActive = p.consultations?.some(c => c.status === 'active');
                  return (
                    <tr key={p._id}>
                      <td style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{p.name}</td>
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
                          <span style={{ color: '#b45309', fontWeight: 600, fontStyle: 'italic' }}>
                            Awaiting Assignment
                          </span>
                        )}
                      </td>
                      <td>
                        {isPending ? (
                          <span className="badge badge-warning">Awaiting Doctor</span>
                        ) : hasActive ? (
                          <span className="badge badge-success">Under Consultation</span>
                        ) : (
                          <span className="badge badge-secondary">Completed</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {isPending ? (
                          <button
                            type="button"
                            onClick={() => openAssignModal(p)}
                            className="btn btn-primary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', background: '#0284c7' }}
                          >
                            Assign Doctor
                          </button>
                        ) : (
                          <Link
                            to={`/admin/patients/${p._id}`}
                            className="btn btn-outline"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                          >
                            View
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--slate-400)' }}>
                    No patient records found in this facility yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Doctor Assignment & Schedule Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={selectedPatient ? `Assign Doctor: ${selectedPatient.name}` : 'Assign Doctor'}
      >
        {assignError && (
          <div style={{
            background: 'var(--danger-light)',
            color: 'var(--danger)',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={18} />
            <span>{assignError}</span>
          </div>
        )}

        <form onSubmit={handleAssignDoctor}>
          {/* Patient Summary Box */}
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem', border: '1px solid var(--slate-200)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>Patient:</span>
              <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{selectedPatient?.name} (Age: {selectedPatient?.age})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>Aadhaar:</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>•••• •••• {selectedPatient?.aadhar?.slice(-4)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>Reported Symptom:</span>
              <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{selectedPatient?.disease}</span>
            </div>
          </div>

          {/* Select Doctor from Hospital Roster */}
          <div className="form-group">
            <label className="form-label">Select Consulting Doctor</label>
            {doctors.length === 0 ? (
              <div style={{ padding: '0.75rem', background: 'var(--warning-light)', color: '#92400e', borderRadius: '8px', fontSize: '0.85rem' }}>
                No active doctors registered under this hospital. Please register a doctor in the Doctor Roster first.
              </div>
            ) : (
              <select
                className="form-control"
                required
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
              >
                <option value="">-- Choose Specialist Doctor --</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    Dr. {doc.name} &bull; {doc.specialization} ({doc.experience} yrs exp)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Schedule Consultation Date */}
          <div className="form-group">
            <label className="form-label">Consultation Date</label>
            <input
              type="date"
              className="form-control"
              required
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
            />
          </div>

          {/* Clinical Instructions / Notes */}
          <div className="form-group">
            <label className="form-label">OPD Instructions / Room Number</label>
            <textarea
              className="form-control"
              rows="2"
              placeholder="e.g. Please report to Ground Floor OPD Room 104 with previous reports."
              value={assignNotes}
              onChange={(e) => setAssignNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setAssignModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={assignLoading || doctors.length === 0}
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))' }}
            >
              {assignLoading ? 'Assigning & Notifying...' : 'Confirm Assignment & Notify Citizen'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
