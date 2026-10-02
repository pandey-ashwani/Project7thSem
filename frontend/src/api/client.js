import axios from 'axios';

// Central Axios API Client
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('swasthya_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors and session expirations
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if expired or unauthorized
      if (localStorage.getItem('swasthya_token')) {
        localStorage.removeItem('swasthya_token');
        localStorage.removeItem('swasthya_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
