import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import Modal from '../../components/Modal';
import { ShieldAlert, Plus, Edit2, Trash2, CheckCircle2, Search, Filter } from 'lucide-react';

const PolicyManager = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Health',
    status: 'active'
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const res = await api.get('/superadmin/policies');
      const list = res.data?.data || res.data?.policies || [];
      setPolicies(list);
    } catch (err) {
      console.error('Error fetching policies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const openCreateModal = () => {
    setEditingPolicy(null);
    setFormData({
      title: '',
      description: '',
      category: 'Health',
      status: 'active'
    });
    setModalError('');
    setModalOpen(true);
  };

  const openEditModal = (policy) => {
    setEditingPolicy(policy);
    setFormData({
      title: policy.title,
      description: policy.description,
      category: policy.category,
      status: policy.status
    });
    setModalError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError('');
    try {
      if (editingPolicy) {
        await api.put(`/superadmin/policies/${editingPolicy._id}`, formData);
      } else {
        await api.post('/superadmin/policies', formData);
      }
      setModalOpen(false);
      fetchPolicies();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to save health policy.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete / archive this state health directive?')) return;
    try {
      await api.delete(`/superadmin/policies/${id}`);
      fetchPolicies();
    } catch (err) {
      console.error('Delete policy error:', err);
    }
  };

  const filtered = policies.filter(p => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase()) ||
                        p.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'All' || p.category === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="page-body animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            State Health Policy & Protocol Governance
          </h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>
            Formulate, announce and enforce public health directives across all network hospitals.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} />
          <span>Enact New Directive</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card-modern" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search policies by keyword, directive title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['All', 'Health', 'Finance', 'Infrastructure', 'Emergency', 'Other'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`btn ${filterCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Policies Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--slate-500)' }}>
            Loading state health directives...
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((policy) => (
            <div key={policy._id} className="card-modern" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className="badge badge-primary">{policy.category}</span>
                  <span className={`badge ${policy.status === 'active' ? 'badge-success' : 'badge-secondary'}`}>
                    {policy.status}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                  {policy.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: 1.6, marginBottom: '1rem' }}>
                  {policy.description}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--slate-100)', paddingTop: '1rem', marginTop: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                  Enacted: {new Date(policy.effectiveDate || policy.createdAt).toLocaleDateString()}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => openEditModal(policy)}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                    title="Edit Directive"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(policy._id)}
                    className="btn btn-danger"
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                    title="Archive / Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--slate-400)' }}>
            No matching directives found.
          </div>
        )}
      </div>

      {/* Create / Edit Policy Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPolicy ? 'Update State Health Directive' : 'Enact New Public Health Directive'}
        maxWidth="600px"
      >
        {modalError && (
          <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {modalError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Directive Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Free Dengue Serology Triage & Platelet Stock Protocol"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Health">Health / Clinical</option>
                <option value="Emergency">Emergency Outbreak</option>
                <option value="Finance">Subsidies & Finance</option>
                <option value="Infrastructure">Hospital Infrastructure</option>
                <option value="Other">General Directive</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Enforcement Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active (Enforced)</option>
                <option value="draft">Draft (Internal Review)</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Directive Instructions & Scope</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Detailed guidelines, mandatory diagnostic tests, subsidy details..."
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={modalLoading}
            >
              {modalLoading ? 'Publishing...' : editingPolicy ? 'Update Directive' : 'Announce Directive'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PolicyManager;
