// lib/axios.ts
import axios from 'axios';

const getBaseURL = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return 'http://127.0.0.1:8000/api';
    case 'test':
    case 'production':
      return 'http://103.196.155.202:3333/api';
    default:
      return 'http://127.0.0.1:8000/api';
  }
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user')
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
