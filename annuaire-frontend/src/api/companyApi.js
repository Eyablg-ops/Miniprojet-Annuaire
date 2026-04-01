// src/api/companyApi.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8082/api/annuaire',
});

export const getCompanies = (name = '', city = '') =>
  API.get(`/companies?name=${name}&city=${city}`);

export const getCompanyById = (id) =>
  API.get(`/companies/${id}`);

export const createCompany = (data) =>
  API.post('/companies', data);

export const updateCompany = (id, data) =>
  API.put(`/companies/${id}`, data);

export const deleteCompany = (id) =>
  API.delete(`/companies/${id}`);

export const getStats = () =>
  API.get('/stats');