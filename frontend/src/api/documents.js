import axios from 'axios';

const API_URL = 'http://localhost:8081/api/v1/documents';

export const getDocuments = (token) => {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const uploadDocument = (file, token) => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post(API_URL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};
