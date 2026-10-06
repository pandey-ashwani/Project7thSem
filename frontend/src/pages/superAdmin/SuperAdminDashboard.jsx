import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import superAdminApi from '../../api/superAdminApi';
import StatCard from '../../components/StatCard';
import Badge from '../../components/Badge';
import LoadingState from '../../components/LoadingState';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  ShieldCheck,
  Users,
  Building2,
  Stethoscope,
  ShieldAlert,
  TrendingUp,
  Activity,
  ArrowRight,
  Plus
} from 'lucide-react';

const COLORS = ['#0284c7', '#0d9488', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6', '#10b981', '#ec4899'];

const SuperAdminDashboard = () => {
  const [metrics, setMetrics] = useState({});
  const [charts, setCharts] = useState({});
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await superAdminApi.getAnalytics();
      const payload = res?.data || res;
      if (payload) {
        setMetrics(payload.metrics || {});
        setCharts(payload.charts || {});
      }

      const policyRes = await superAdminApi.getPolicies();
      if (policyRes?.data) {
        setPolicies(policyRes.data.slice(0, 4));
      }
    } catch (err) {
      console.error('Error fetching superadmin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingState message="Loading Statewide Healthcare Analytics & Surveillance Data..." />;
  }

  // Convert disease object counts to array for Recharts
  const diseaseData = charts.diseases
    ? Object.entries(charts.diseases).map(([name, count]) => ({ name, count }))
    : [];

  // Convert district object counts to array for Recharts
  const districtData = charts.districts
    ? Object.entries(charts.districts).map(([district, patients]) => ({ district, patients }))
    : [];

  // Convert hospital object counts to array for Recharts
  const hospitalData = charts.hospitals
    ? Object.entries(charts.hospitals).map(([name, count]) => ({ name, count }))
    : [];

  return (
    <div className="superadmin-dashboard-page animate-fade">
      {/* State Authority Header */}
      <div
        className="p-4 p-md-5 rounded-4 text-white mb-4 shadow-lg position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0369a1 100%)'
        }}
      >
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div>
            <div
              className="badge px-3 py-2 rounded-pill fw-semibold mb-2"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#38bdf8' }}
            >
              🏛️ Directorate of Health & Family Welfare • State Health Authority
            </div>
            <h1 className="fs-2 fw-bold text-white mb-1">State Health Surveillance Command Center</h1>
            <p className="text-white-50 fs-7 mb-0">
              Real-time cross-district symptom spike detection, hospital network caseloads & policy governance.
            </p>
          </div>

          <Link
            to="/superadmin/policies"
            className="btn btn-info fw-bold d-flex align-items-center gap-2"
            style={{ color: '#0f172a' }}
          >
            <ShieldAlert size={18} />
            <span>Enact Health Policy</span>
          </Link>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="stat-grid mb-4">
        <StatCard
          title="Statewide Patients"
          value={metrics.totalPatients || 0}
          icon={Users}
          color="primary"
          subtitle="Aadhaar-verified records"
        />
        <StatCard
          title="Connected Hospitals"
          value={metrics.totalHospitals || 0}
          icon={Building2}
          color="secondary"
          subtitle="District healthcare hubs"
        />
        <StatCard
          title="Practicing Specialists"
          value={metrics.totalDoctors || 0}
          icon={Stethoscope}
          color="accent"
          subtitle="Registered doctors"
        />
        <StatCard
          title="Active State Policies"
          value={metrics.activePolicies || 0}
          icon={ShieldAlert}
          color="warning"
          subtitle="Public health directives"
        />
      </div>

      {/* Analytics Chart Row */}
      <div className="row g-4 mb-4">
        {/* Symptom / Disease Bar Chart */}
        <div className="col-12 col-lg-6">
          <div className="card-modern p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h3 className="fs-6 fw-bold text-dark mb-0">Statewide Disease & Symptom Surveillance</h3>
                <small className="text-muted">Real-time disease distribution across intake streams</small>
              </div>
              <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">
                Live Data
              </span>
            </div>

            <div style={{ height: '280px', width: '100%' }}>
              {diseaseData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={diseaseData.slice(0, 8)}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#0f172a', color: '#fff', borderRadius: '8px', border: 'none' }} />
                    <Bar dataKey="count" fill="#0284c7" radius={[6, 6, 0, 0]}>
                      {diseaseData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-100 d-flex align-items-center justify-content-center text-muted fs-7">
                  No symptom triage records found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* District Caseload Distribution Chart */}
        <div className="col-12 col-lg-6">
          <div className="card-modern p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h3 className="fs-6 fw-bold text-dark mb-0">District-Wise Patient Caseload</h3>
                <small className="text-muted">Geographical concentration of medical consultations</small>
              </div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
                District Radar
              </span>
            </div>

            <div style={{ height: '280px', width: '100%' }}>
              {districtData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={districtData.slice(0, 8)} layout="vertical">
                    <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis dataKey="district" type="category" stroke="#64748b" fontSize={11} tickLine={false} width={90} />
                    <Tooltip contentStyle={{ background: '#0f172a', color: '#fff', borderRadius: '8px', border: 'none' }} />
                    <Bar dataKey="patients" fill="#0d9488" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-100 d-flex align-items-center justify-content-center text-muted fs-7">
                  No district patient records logged.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Active Policies Section */}
      <div className="card-modern p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
          <div>
            <h3 className="fs-6 fw-bold text-dark mb-0">Active State Health Directives</h3>
            <small className="text-muted">Statewide public health protocols broadcasted to all hospitals</small>
          </div>
          <Link to="/superadmin/policies" className="text-decoration-none fw-semibold fs-7 d-flex align-items-center gap-1 text-primary">
            <span>Manage All Policies</span> <ArrowRight size={15} />
          </Link>
        </div>

        <div className="row g-3">
          {policies.length > 0 ? (
            policies.map((p) => (
              <div key={p._id} className="col-12 col-md-6">
                <div className="border rounded-3 p-3 bg-light h-100">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Badge variant={p.category}>{p.category}</Badge>
                    <Badge variant={p.status}>{p.status}</Badge>
                  </div>
                  <h4 className="fs-6 fw-bold text-dark mb-1">{p.title}</h4>
                  <p className="text-muted fs-7 mb-2 line-clamp-2">{p.description}</p>
                  <small className="text-muted fs-8 d-block">
                    Effective: {new Date(p.effectiveDate || p.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-4 text-muted fs-7">
              No health policies active. Click "Enact Health Policy" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
