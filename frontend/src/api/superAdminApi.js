import api from './client';

export const superAdminApi = {
  getAnalytics: async () => {
    const res = await api.get('/superadmin/analytics');
    return res.data;
  },

  getPatients: async (params = {}) => {
    const res = await api.get('/superadmin/patients', { params });
    return res.data;
  },

  getDoctors: async () => {
    const res = await api.get('/superadmin/doctors');
    return res.data;
  },

  getHospitals: async () => {
    const res = await api.get('/superadmin/hospitals');
    return res.data;
  },

  getPolicies: async () => {
    const res = await api.get('/superadmin/policies');
    return res.data;
  },

  createPolicy: async (data) => {
    const res = await api.post('/superadmin/policies', data);
    return res.data;
  },

  updatePolicy: async (id, data) => {
    const res = await api.put(`/superadmin/policies/${id}`, data);
    return res.data;
  },

  deletePolicy: async (id) => {
    const res = await api.delete(`/superadmin/policies/${id}`);
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get('/superadmin/profile');
    return res.data;
  }
};

export default superAdminApi;
