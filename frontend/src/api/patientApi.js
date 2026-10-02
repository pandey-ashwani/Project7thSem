import api from './client';

export const patientApi = {
  getDashboard: async () => {
    const res = await api.get('/patient/dashboard');
    return res.data;
  },

  getRecords: async () => {
    const res = await api.get('/patient/records');
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get('/patient/profile');
    return res.data;
  },

  acknowledgeAssignment: async () => {
    const res = await api.post('/patient/acknowledge-assignment');
    return res.data;
  }
};

export default patientApi;
