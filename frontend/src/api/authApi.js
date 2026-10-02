import api from './client';

export const authApi = {
  // Login by Role
  login: async (role, credentials) => {
    let endpoint = '/auth/login-admin';
    const r = role.toLowerCase();
    if (r === 'doctor') endpoint = '/auth/login-doctor';
    else if (r === 'superadmin') endpoint = '/auth/login-superadmin';
    else if (r === 'patient') endpoint = '/auth/login-patient';

    const res = await api.post(endpoint, credentials);
    return res.data;
  },

  // Register by Role
  register: async (role, data) => {
    let endpoint = '/auth/register-admin';
    const r = role.toLowerCase();
    if (r === 'superadmin') endpoint = '/auth/register-superadmin';
    else if (r === 'patient') endpoint = '/auth/register-patient';

    const res = await api.post(endpoint, data);
    return res.data;
  },

  // Verify Current User Session
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  // Logout
  logout: async () => {
    const res = await api.post('/auth/logout');
    return res.data;
  },

  // Get Hospitals Directory grouped and sorted by state
  getHospitals: async () => {
    const res = await api.get('/auth/hospitals');
    return res.data;
  },

  // Get Live Database Statistics
  getPublicStats: async () => {
    const res = await api.get('/auth/stats');
    return res.data;
  }
};

export default authApi;
