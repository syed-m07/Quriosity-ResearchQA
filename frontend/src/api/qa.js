import axios from 'axios';

const API_URL = 'http://localhost:8081/api/v1/qa';

export const getHistory = (documentId, token) => {
  return axios.get(`${API_URL}/history/${documentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const askQuestion = (qaRequest, token) => {
  return axios.post(`${API_URL}/ask`, qaRequest, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
