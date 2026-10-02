import React, { useEffect, useState } from 'react';
import doctorApi from '../../api/doctorApi';
import PageHeader from '../../components/PageHeader';
import Modal from '../../components/Modal';
import LoadingState from '../../components/LoadingState';
import Toast from '../../components/Toast';
import {
  Stethoscope,
  Award,
  Mail,
  Phone,
  Building2,
  MapPin,
  Edit3,
  UserCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react';

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Edit Modal State
  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    qualification: '',
    experience: ''
  });
  const [updating, setUpdating] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await doctorApi.getProfile();
      if (res?.data) {
        setDoctor(res.data);
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          specialization: res.data.specialization || '',
          qualification: res.data.qualification || '',
          experience: res.data.experience || 0
        });
      }
    } catch (err) {
      console.error('Error fetching doctor profile:', err);
      setToast({ message: 'Failed to load doctor profile.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await doctorApi.updateProfile(formData);
      setToast({ message: 'Profile updated successfully!', type: 'success' });
      setEditOpen(false);
      fetchProfile();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to update profile.', type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading practitioner profile..." />;
  }

  if (!doctor) return null;

  return (
    <div className="doctor-profile-page animate-fade" style={{ maxWidth: '820px', margin: '0 auto', paddingBottom: '2.5rem' }}>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <PageHeader
        title="Doctor Practitioner Profile"
        subtitle="Registered medical credentials, specialization, and hospital affiliation."
        actions={
          <button
            className="btn btn-primary"
            onClick={() => setEditOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem' }}
          >
            <Edit3 size={15} />
            <span>Edit Profile Information</span>
          </button>
        }
      />

      {/* Main Doctor Profile Card - Simple, Clean & Professional */}
      <div className="card-modern" style={{
        padding: '2rem',
        borderRadius: '16px',
        border: '1px solid var(--slate-200)',
        background: '#ffffff',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '2rem'
      }}>
        {/* Doctor Header Block */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          paddingBottom: '1.75rem',
          borderBottom: '1px solid var(--slate-100)',
          flexWrap: 'wrap'
        }}>
          {/* Simple Clean Avatar Box */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '14px',
            background: 'var(--secondary-light)',
            color: 'var(--secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: '1px solid rgba(13, 148, 136, 0.2)'
          }}>
            <Stethoscope size={32} />
          </div>

          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                Dr. {doctor.name}
              </h2>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#15803d',
                background: '#dcfce7',
                padding: '0.2rem 0.6rem',
                borderRadius: '12px'
              }}>
                <CheckCircle2 size={13} /> Active Practitioner
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '0.35rem' }}>
              <span style={{
                background: 'var(--secondary-light)',
                color: 'var(--secondary)',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700
              }}>
                {doctor.specialization}
              </span>
              <span style={{
                background: 'var(--slate-100)',
                color: 'var(--slate-700)',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700
              }}>
                {doctor.qualification}
              </span>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.825rem' }}>
                &bull; {doctor.experience} Years Clinical Experience
              </span>
            </div>
          </div>
        </div>

        {/* Simple Structured Information Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          paddingTop: '1.75rem'
        }}>
          {/* Hospital */}
          <div style={{
            background: 'var(--slate-50)',
            padding: '1.1rem 1.25rem',
            borderRadius: '10px',
            border: '1px solid var(--slate-200)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-500)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <Building2 size={16} color="var(--primary)" />
              <span>Hospital Facility</span>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
              {doctor.hospital || 'District Hospital'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '2px' }}>
              Affiliated Health Provider
            </div>
          </div>

          {/* District & State */}
          <div style={{
            background: 'var(--slate-50)',
            padding: '1.1rem 1.25rem',
            borderRadius: '10px',
            border: '1px solid var(--slate-200)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-500)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <MapPin size={16} color="var(--primary)" />
              <span>District & State</span>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
              {doctor.district}, {doctor.state}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '2px' }}>
              Clinical Jurisdiction
            </div>
          </div>

          {/* Clinical Practice */}
          <div style={{
            background: 'var(--slate-50)',
            padding: '1.1rem 1.25rem',
            borderRadius: '10px',
            border: '1px solid var(--slate-200)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-500)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <Award size={16} color="var(--primary)" />
              <span>Clinical Practice</span>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
              {doctor.experience} Years Active Service
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '2px' }}>
              Certified Specialist
            </div>
          </div>

          {/* Email */}
          <div style={{
            background: 'var(--slate-50)',
            padding: '1.1rem 1.25rem',
            borderRadius: '10px',
            border: '1px solid var(--slate-200)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-500)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <Mail size={16} color="var(--primary)" />
              <span>Official Email</span>
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-900)', wordBreak: 'break-all' }}>
              {doctor.email || '—'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '2px' }}>
              Verified Correspondence
            </div>
          </div>

          {/* Phone */}
          <div style={{
            background: 'var(--slate-50)',
            padding: '1.1rem 1.25rem',
            borderRadius: '10px',
            border: '1px solid var(--slate-200)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-500)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <Phone size={16} color="var(--primary)" />
              <span>Phone Contact</span>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
              +91 {doctor.phone || '—'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '2px' }}>
              OPD Direct Extension
            </div>
          </div>

          {/* Username */}
          <div style={{
            background: 'var(--slate-50)',
            padding: '1.1rem 1.25rem',
            borderRadius: '10px',
            border: '1px solid var(--slate-200)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-500)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <UserCheck size={16} color="var(--primary)" />
              <span>Portal Account</span>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
              @{doctor.username}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '2px' }}>
              Role: Medical Practitioner
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal - Simple & Clean */}
      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Update Practitioner Profile"
        maxWidth="540px"
      >
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Specialization</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Cardiologist"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Qualification</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. MBBS, MD"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Experience (Years)</label>
            <input
              type="number"
              className="form-control"
              min="0"
              max="60"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--slate-100)' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setEditOpen(false)}
              disabled={updating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={updating}
            >
              {updating ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DoctorProfile;
