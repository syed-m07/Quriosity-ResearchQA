import axios from 'axios';

const API_URL = 'http://localhost:8081/api/v1/auth';

export const register = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

export const login = (credentials) => {
  return axios.post(`${API_URL}/authenticate`, credentials);
};

export const refreshToken = (token) => {
  return axios.post(`${API_URL}/refresh-token`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
