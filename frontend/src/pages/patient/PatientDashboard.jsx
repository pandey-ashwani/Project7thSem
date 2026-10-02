import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import patientApi from '../../api/patientApi';
import Modal from '../../components/Modal';
import { 
  HeartHandshake, 
  Stethoscope, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  Pill, 
  Building2, 
  Activity,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  MapPin,
  AlertCircle
} from 'lucide-react';

const PatientDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAssignmentPopup, setShowAssignmentPopup] = useState(false);
  const [acknowledging, setAcknowledging] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/patient/dashboard');
      if (res.data?.success) {
        const dashboardData = res.data.data || res.data;
        setData(dashboardData);

        // Check if hospital admin assigned a doctor and citizen hasn't acknowledged yet
        const notif = dashboardData.patient?.assignmentNotification;
        if (notif?.assigned && !notif?.viewed) {
          setShowAssignmentPopup(true);
        }
      }
    } catch (err) {
      console.error('Error fetching patient dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleAcknowledgePopup = async () => {
    setAcknowledging(true);
    try {
      await patientApi.acknowledgeAssignment();
      setShowAssignmentPopup(false);
      if (data?.patient?.assignmentNotification) {
        data.patient.assignmentNotification.viewed = true;
      }
    } catch (err) {
      console.error('Failed to acknowledge assignment notification:', err);
      setShowAssignmentPopup(false);
    } finally {
      setAcknowledging(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-500)' }}>
        <Activity size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
        <p>Loading My Health Records...</p>
      </div>
    );
  }

  const patient = data?.patient;
  const activeConsultation = data?.activeConsultation;
  const upcomingAppointment = data?.upcomingAppointment;
  const latestRx = data?.latestPrescription;
  const isPendingAssignment = !patient?.doctor || patient?.assignmentStatus === 'pending_assignment';
  const assignmentNotif = patient?.assignmentNotification;

  return (
    <div className="page-body animate-fade">
      {/* Aadhaar Health Card Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0284c7 0%, #4338ca 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem',
        color: '#fff',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.2)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              <ShieldCheck size={16} /> National Aadhaar Digital Health ID
            </div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>
              {patient?.name}
            </h1>
            <p style={{ color: 'var(--primary-light)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Age: {patient?.age} yrs &bull; Registered Hospital: {patient?.hospital} ({patient?.district})
            </p>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '1rem 1.5rem', borderRadius: '12px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Aadhaar Index
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '0.1em', fontFamily: 'monospace', marginTop: '0.25rem' }}>
              •••• •••• {patient?.aadhar?.slice(-4)}
            </div>
          </div>
        </div>
      </div>

      {/* Pending Assignment Alert Banner */}
      {isPendingAssignment && (
        <div style={{
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          border: '2px solid #fde68a',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem 1.75rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '14px',
              background: '#f59e0b',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Clock size={28} />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#78350f', fontSize: '1.15rem' }}>
                Hospital OPD Intake & Doctor Assignment In Progress
              </div>
              <div style={{ color: '#b45309', fontSize: '0.9rem', marginTop: '0.25rem', maxWidth: '680px' }}>
                Your registration was successfully submitted to <strong>{patient?.hospital}</strong>. The hospital administration has received your record and is assigning an available clinical specialist and consultation date for your symptom: <strong>{patient?.disease}</strong>.
              </div>
            </div>
          </div>

          <span style={{
            background: '#b45309',
            color: '#fff',
            fontSize: '0.8rem',
            fontWeight: 800,
            padding: '0.4rem 0.9rem',
            borderRadius: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            Awaiting Admin Schedule
          </span>
        </div>
      )}

      {/* Main Status Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem', marginBottom: '2rem' }}>
        {/* Attending Doctor & Status */}
        <div className="card-modern" style={{ borderTop: `4px solid ${isPendingAssignment ? 'var(--warning)' : 'var(--primary)'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: isPendingAssignment ? 'var(--warning-light)' : 'var(--primary-light)',
              color: isPendingAssignment ? '#b45309' : 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Stethoscope size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                Attending Specialist & Condition
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Current Medical Care</span>
            </div>
          </div>

          <div style={{ background: 'var(--slate-50)', padding: '1.25rem', borderRadius: '10px', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>Reported Health Condition:</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)', margin: '0.25rem 0 0.75rem 0' }}>
              {patient?.disease || 'General Consultation'}
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>Assigned Doctor:</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: isPendingAssignment ? '#b45309' : 'var(--primary-dark)', marginTop: '0.25rem' }}>
              {patient?.doctor ? (
                `Dr. ${patient.doctor.name} (${patient.doctor.specialization})`
              ) : (
                '⏳ Awaiting Hospital Doctor Assignment'
              )}
            </div>

            {upcomingAppointment && (
              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--slate-200)', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--slate-500)' }}>Scheduled Consultation: </span>
                <strong style={{ color: 'var(--primary)' }}>
                  {new Date(upcomingAppointment.appointmentDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </strong>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>Consultation Status:</span>
            {isPendingAssignment ? (
              <span className="badge badge-warning">Awaiting Assignment</span>
            ) : activeConsultation ? (
              <span className="badge badge-success">Active Ongoing Treatment</span>
            ) : (
              <span className="badge badge-secondary">Routine / Completed</span>
            )}
          </div>
        </div>

        {/* Latest Digital Prescription */}
        <div className="card-modern" style={{ borderTop: '4px solid var(--secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--secondary-light)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pill size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                Latest Digital Prescription (Rx)
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Prescribed by Doctor</span>
            </div>
          </div>

          {latestRx?.prescription?.medicines && latestRx.prescription.medicines.length > 0 ? (
            <div>
              <div style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: '10px', marginBottom: '1rem', maxHeight: '160px', overflowY: 'auto' }}>
                {latestRx.prescription.medicines.map((m, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: idx < latestRx.prescription.medicines.length - 1 ? '1px dashed var(--slate-200)' : 'none', fontSize: '0.9rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--slate-900)' }}>&bull; {m.name}</span>
                    <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>{m.dosage} &bull; {m.duration}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontStyle: 'italic', marginBottom: '1rem' }}>
                Advice: "{latestRx.prescription.notes || 'Take medicines regularly as directed.'}"
              </div>
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-400)', background: 'var(--slate-50)', borderRadius: '10px', marginBottom: '1rem' }}>
              No active prescription issued yet.
            </div>
          )}

          <Link to="/patient/records" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem', color: 'var(--secondary)', fontWeight: 700, fontSize: '0.9rem' }}>
            <span>View All Medical Records</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Doctor Assignment Popup Celebration Modal */}
      <Modal
        isOpen={showAssignmentPopup}
        onClose={handleAcknowledgePopup}
        title="🎉 Doctor Assigned & Consultation Scheduled!"
        maxWidth="560px"
      >
        <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #e0f2fe, #ccfbf1)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            boxShadow: '0 8px 20px -4px rgba(2, 132, 199, 0.3)'
          }}>
            <Sparkles size={34} color="#0284c7" />
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
            Your Consultation Has Been Scheduled!
          </h3>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.925rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
            The Hospital Administration at <strong>{patient?.hospital}</strong> has reviewed your registration and assigned your specialist doctor.
          </p>

          {/* Assignment Details Card */}
          <div style={{
            background: '#f8fafc',
            border: '1.5px solid var(--slate-200)',
            borderRadius: '16px',
            padding: '1.25rem',
            textAlign: 'left',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--slate-200)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Stethoscope size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Assigned Specialist
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                  Dr. {assignmentNotif?.doctorName || patient?.doctor?.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                  {assignmentNotif?.doctorSpecialization || patient?.doctor?.specialization || 'Clinical Specialist'}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Consultation Date
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0369a1', marginTop: '2px' }}>
                  {assignmentNotif?.consultationDate ? (
                    new Date(assignmentNotif.consultationDate).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })
                  ) : (
                    'Scheduled for Today'
                  )}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Reported Concern
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent)', marginTop: '2px' }}>
                  {patient?.disease}
                </div>
              </div>
            </div>

            {assignmentNotif?.notes && (
              <div style={{ marginTop: '0.5rem', padding: '0.6rem 0.8rem', background: '#fff', borderRadius: '8px', border: '1px solid var(--slate-200)', fontSize: '0.825rem', color: 'var(--slate-700)' }}>
                <strong>OPD Instruction:</strong> {assignmentNotif.notes}
              </div>
            )}
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAcknowledgePopup}
            disabled={acknowledging}
            style={{
              width: '100%',
              padding: '0.85rem',
              fontSize: '1rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, var(--primary), #4338ca)',
              borderRadius: '12px',
              gap: '0.5rem'
            }}
          >
            <CheckCircle2 size={18} />
            <span>{acknowledging ? 'Confirming...' : 'Acknowledge & Confirm Appointment'}</span>
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PatientDashboard;
