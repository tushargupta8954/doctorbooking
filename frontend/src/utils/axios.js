import axios from 'axios';
import { store } from '../store/store';
import { logout } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const API = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status, data } = error.response || {};
    
    if (status === 401) {
      store.dispatch(logout());
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
    } else if (status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (status === 404) {
      toast.error(data?.message || 'Resource not found');
    } else if (status === 500) {
      toast.error('Internal server error. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

export default API;