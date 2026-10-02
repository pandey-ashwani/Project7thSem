import api from './client';

export const adminApi = {
  getDashboard: async () => {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },

  checkPatient: async (aadhar) => {
    const res = await api.post('/admin/check-patient', { aadhar });
    return res.data;
  },

  registerPatient: async (patientData) => {
    const res = await api.post('/admin/new-patient', patientData);
    return res.data;
  },

  getPatients: async () => {
    const res = await api.get('/admin/patients');
    return res.data;
  },

  getPatientById: async (id) => {
    const res = await api.get(`/admin/patients/${id}`);
    return res.data;
  },

  assignDoctor: async (payload) => {
    const res = await api.post('/admin/assign-doctor', payload);
    return res.data;
  },

  endConsultation: async (patientId) => {
    const res = await api.post(`/admin/end-consultation/${patientId}`);
    return res.data;
  },

  getDoctors: async () => {
    const res = await api.get('/admin/doctors');
    return res.data;
  },

  addDoctor: async (doctorData) => {
    const res = await api.post('/admin/add-doctor', doctorData);
    return res.data;
  },

  getDoctorById: async (id) => {
    const res = await api.get(`/admin/doctors/${id}`);
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get('/admin/profile');
    return res.data;
  }
};

export default adminApi;
