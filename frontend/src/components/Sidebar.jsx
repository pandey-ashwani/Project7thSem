import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Stethoscope,
  CalendarCheck,
  Clock,
  FileText,
  ShieldAlert,
  Building,
  HeartHandshake,
  Activity,
  Award,
  Search,
  UserCheck,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  if (!user) return null;

  const role = user.role;

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Admin Workspace' },
    { to: '/admin/check-patient', icon: Search, label: 'Verify Aadhaar' },
    { to: '/admin/new-patient', icon: UserPlus, label: 'Register Patient' },
    { to: '/admin/patients', icon: Users, label: 'Hospital Patients' },
    { to: '/admin/doctors', icon: Stethoscope, label: 'Registered Doctors' },
    { to: '/admin/profile', icon: Building, label: 'Hospital Profile' },
  ];

  const doctorLinks = [
    { to: '/doctor/dashboard', icon: LayoutDashboard, label: 'Clinical Overview' },
    { to: '/doctor/today', icon: CalendarCheck, label: "Today's OPD Queue" },
    { to: '/doctor/upcoming', icon: Clock, label: 'Upcoming Schedule' },
    { to: '/doctor/history', icon: FileText, label: 'Treated Patients' },
    { to: '/doctor/profile', icon: UserCheck, label: 'Doctor Profile' },
  ];

  const superAdminLinks = [
    { to: '/superadmin/dashboard', icon: Activity, label: 'State Command Center' },
    { to: '/superadmin/patients', icon: Users, label: 'Statewide Registry' },
    { to: '/superadmin/doctors', icon: Stethoscope, label: 'Medical Specialists' },
    { to: '/superadmin/hospitals', icon: Building, label: 'Hospital Network' },
    { to: '/superadmin/policies', icon: ShieldAlert, label: 'Policy Governance' },
    { to: '/superadmin/profile', icon: Award, label: 'State Authority Profile' },
  ];

  const patientLinks = [
    { to: '/patient/dashboard', icon: LayoutDashboard, label: 'My Health Portal' },
    { to: '/patient/records', icon: HeartHandshake, label: 'Consultations & Rx' },
    { to: '/patient/profile', icon: UserCheck, label: 'My Aadhaar Health ID' },
  ];

  let links = [];
  let portalTitle = 'Portal';
  if (role === 'admin') {
    links = adminLinks;
    portalTitle = 'Hospital Admin';
  } else if (role === 'doctor') {
    links = doctorLinks;
    portalTitle = 'Medical Practitioner';
  } else if (role === 'superAdmin' || role === 'superadmin') {
    links = superAdminLinks;
    portalTitle = 'State Authority';
  } else if (role === 'patient') {
    links = patientLinks;
    portalTitle = 'Patient Care';
  }

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand-icon">
            <Activity size={22} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              SwasthyaSankalp
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--primary-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {portalTitle}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ color: 'var(--slate-400)', padding: '0.25rem', display: 'flex' }}
            aria-label="Close Sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--slate-500)', padding: '0.5rem 0.75rem' }}>
            Navigation Menu
          </div>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              flexShrink: 0
            }}>
              🇮🇳
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user.hospital || user.district || 'State Health Network'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>
                {user.state || 'India'}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
