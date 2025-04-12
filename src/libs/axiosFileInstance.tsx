// lib/axiosFileUpload.ts
import axios from 'axios';
import { getBaseURL } from './axios';


const axiosFileInstance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Add a request interceptor
axiosFileInstance.interceptors.request.use(
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
axiosFileInstance.interceptors.response.use(
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

export default axiosFileInstance;
