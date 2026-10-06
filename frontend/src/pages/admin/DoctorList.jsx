import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import Modal from '../../components/Modal';
import { Stethoscope, UserPlus, Search, Award, Phone, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    qualification: '',
    username: '',
    password: ''
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/doctors');
      if (res.data?.success) {
        setDoctors(res.data.data || res.data.doctors || []);
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess('');
    setAddLoading(true);
    try {
      const res = await api.post('/admin/add-doctor', formData);
      if (res.data?.success) {
        setAddSuccess('Doctor registered successfully in hospital roster!');
        setTimeout(() => {
          setAddModalOpen(false);
          setFormData({
            name: '',
            email: '',
            phone: '',
            specialization: '',
            experience: '',
            qualification: '',
            username: '',
            password: ''
          });
          setAddSuccess('');
          fetchDoctors();
        }, 1200);
      }
    } catch (err) {
      setAddError(err.response?.data?.message || err.message || 'Failed to register doctor.');
    } finally {
      setAddLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase()) ||
    d.qualification?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-body animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Hospital Medical Staff & Registered Doctors
          </h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>
            Registered doctors, qualifications, clinical specializations, and credentials.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="btn btn-primary"
        >
          <UserPlus size={18} />
          <span>Register New Doctor</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="card-modern" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search doctor name or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--slate-500)' }}>
            Loading hospital doctors...
          </div>
        ) : filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc) => (
            <div key={doc._id} className="card-modern" style={{ borderTop: '4px solid var(--secondary)' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  background: 'var(--secondary-light)',
                  color: 'var(--secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Stethoscope size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                    Dr. {doc.name}
                  </h3>
                  <div style={{ display: 'inline-block', marginTop: '0.2rem' }}>
                    <span className="badge badge-success">{doc.specialization}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--slate-600)', borderTop: '1px solid var(--slate-100)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={16} color="var(--slate-400)" />
                  <span>Qualification: <strong>{doc.qualification}</strong> ({doc.experience} yrs exp)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={16} color="var(--slate-400)" />
                  <span>{doc.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={16} color="var(--slate-400)" />
                  <span>+91 {doc.phone}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--slate-400)' }}>
            No doctors registered in this hospital yet.
          </div>
        )}
      </div>

      {/* Add Doctor Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Register Medical Practitioner / Doctor"
        maxWidth="650px"
      >
        {addError && (
          <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {addError}
          </div>
        )}
        {addSuccess && (
          <div style={{ background: 'var(--success-light)', color: 'var(--success)', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {addSuccess}
          </div>
        )}

        <form onSubmit={handleAddDoctor}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Doctor Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Dr. Full Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="doctor@hospital.org"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="10-digit mobile"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Specialization</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Cardiologist, General Physician, Pediatrician"
                required
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Qualification</label>
              <input
                type="text"
                className="form-control"
                placeholder="MBBS, MD, MS"
                required
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Years of Experience</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 8"
                required
                min="0"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Doctor Login Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. dr_verma"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Doctor Login Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Set password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={addLoading}
            >
              {addLoading ? 'Registering Doctor...' : 'Add to Hospital Roster'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DoctorList;
