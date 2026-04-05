import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Public endpoints
export const getCompanies = () => api.get('/public/companies');

// Auth endpoints
export const studentRegister = (data) => api.post('/auth/student/register', data);
export const recruiterRegister = (data) => api.post('/auth/recruiter/register', data);
export const login = (data) => api.post('/auth/login', data);

// Student endpoints
export const getApplications = () => api.get('/student/applications');
export const applyToInternship = (offerId, coverLetter) => 
  api.post(`/student/apply/${offerId}`, { coverLetter });

// Recruiter endpoints
export const getRecruiterProfile = () => api.get('/recruiter/profile');
export const createInternship = (data) => api.post('/recruiter/internships', data);
export const getInternships = () => api.get('/recruiter/internships');
export const getApplicationsForOffers = () => api.get('/recruiter/applications');
export const updateApplicationStatus = (applicationId, status) => 
  api.put(`/recruiter/applications/${applicationId}`, { status });

export default api;