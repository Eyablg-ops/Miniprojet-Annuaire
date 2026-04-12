import api from './api';

// User management endpoints
export const getUsers = () => api.get('/admin/users');
export const getUser = (userId) => api.get(`/admin/users/${userId}`);
export const getUserStats = () => api.get('/admin/users/stats');
export const updateUserStatus = (userId, status) => api.patch(`/admin/users/${userId}/status`, { status });
export const deleteUser = (userId) => api.delete(`/admin/users/${userId}`);

// Company management endpoints (existing)
export const getCompanies = () => api.get('/admin/companies');
export const getCompany = (companyId) => api.get(`/admin/companies/${companyId}`);
export const getCompanyStats = () => api.get('/admin/companies/stats');
export const updateCompany = (companyId, data) => api.put(`/admin/companies/${companyId}`, data);
export const deleteCompany = (companyId) => api.delete(`/admin/companies/${companyId}`);
export const createCompany = (data) => api.post('/admin/companies', data);