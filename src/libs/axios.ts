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
    // Only try to access localStorage on the client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
    // Only handle 401s on client side
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      // Just clear the token, but DON'T redirect here
      // Let the auth system handle redirects
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
