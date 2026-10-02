import api from './client';

export const doctorApi = {
  getDashboard: async () => {
    const res = await api.get('/doctor/dashboard');
    return res.data;
  },

  getTodayAppointments: async () => {
    const res = await api.get('/doctor/appointments/today');
    return res.data;
  },

  getUpcomingAppointments: async () => {
    const res = await api.get('/doctor/appointments/upcoming');
    return res.data;
  },

  getPatientHistory: async () => {
    const res = await api.get('/doctor/patient-history');
    return res.data;
  },

  getPatientDetails: async (id) => {
    const res = await api.get(`/doctor/patient/${id}`);
    return res.data;
  },

  createPrescription: async (payload) => {
    const res = await api.post('/doctor/prescription', payload);
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get('/doctor/profile');
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await api.put('/doctor/profile', data);
    return res.data;
  }
};

export default doctorApi;
