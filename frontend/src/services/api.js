import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Token JWT automatique ─────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Gestion 401 globale ───────────────────────────────────
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

// ══════════════════════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════════════════════
export const studentRegister   = (data) => api.post('/auth/student/register', data);
export const recruiterRegister = (data) => api.post('/auth/recruiter/register', data);
export const login             = (data) => api.post('/auth/login', data);
export const adminLogin        = (data) => api.post('/auth/admin/login', data);

// ══════════════════════════════════════════════════════════
// RECRUTEUR
// ══════════════════════════════════════════════════════════
export const getRecruiterMe = () => api.get('/recruiters/me');

// ══════════════════════════════════════════════════════════
// ANNUAIRE COMPANIES  →  /api/annuaire
// ══════════════════════════════════════════════════════════
export const getCompanies    = (params = {}) => api.get('/annuaire/companies', { params });
export const getCompanyById  = (id)          => api.get(`/annuaire/companies/${id}`);
export const createCompany   = (data)        => api.post('/annuaire/companies', data);
export const updateCompany   = (id, data)    => api.put(`/annuaire/companies/${id}`, data);
export const deleteCompany   = (id)          => api.delete(`/annuaire/companies/${id}`);
export const getCompanyStats = ()            => api.get('/annuaire/stats');

// ══════════════════════════════════════════════════════════
// OFFRES  →  /api/offers
// ══════════════════════════════════════════════════════════
export const getPublicOffers    = ()          => api.get('/offers/public');
export const getOffersByCompany = (companyId) => api.get(`/offers/company/${companyId}`);
export const getOfferById       = (id)        => api.get(`/offers/${id}`);
export const createOffer        = (data)      => api.post('/offers', data);
export const updateOffer        = (id, data)  => api.put(`/offers/${id}`, data);
export const deleteOffer        = (id)        => api.delete(`/offers/${id}`);
export const searchOffers       = (params={}) => api.get('/offers/search', { params });

// ══════════════════════════════════════════════════════════
// CANDIDATURES  →  /api/postulations + /api/applications
// ══════════════════════════════════════════════════════════
// Dans api.js — remplace ou ajoute :
// APRÈS
// ✅ APRÈS — api instance, token auto, bonne baseURL
export const applyToOffer = (offerId, coverLetter, cvFile) => {
  const formData = new FormData();
  formData.append('coverLetter', coverLetter || '');
  if (cvFile) formData.append('cv', cvFile);

  return api.post(
    `/postulations/offre/${offerId}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
};
export const getMyApplications      = ()             => api.get('/postulations/my');
// Remplace ces deux lignes
export const getApplicationsByOffer  = (offerId) =>
  api.get(`/postulations/offre/${offerId}`);

export const updateApplicationStatus = (id, status) =>
  api.patch(`/postulations/${id}/statut`, null, { params: { statut: status } });
// ══════════════════════════════════════════════════════════
// ÉTUDIANTS  →  /api/students
// ══════════════════════════════════════════════════════════
export const getStudentById = (id)          => api.get(`/students/${id}`);
export const searchStudents = (params = {}) => api.get('/students/search', { params });

// ══════════════════════════════════════════════════════════
// PROFIL COMPANY  →  /api/companies
// ══════════════════════════════════════════════════════════
export const getCompanyProfile    = (id)       => api.get(`/companies/${id}`);

export const updateCompanyProfile = (id, data) => api.put(`/annuaire/companies/${id}`, data);

// API publique companies (pour RecruiterSignup)
export const getPublicCompanies = () => api.get('/public/companies');

export default api;