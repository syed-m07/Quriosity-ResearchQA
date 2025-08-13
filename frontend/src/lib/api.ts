import axios, { AxiosError } from 'axios';
import { LoginRequest, RegisterRequest, RefreshTokenResponse, AuthResponse } from '@/types/auth';
import { Document } from '@/types/document';
import { QaRequest, QaResponse, QaHistoryResponse } from '@/types/chat';
import { UpdateUserRequest, ChangePasswordRequest, User } from '@/types/auth';


const API_URL = 'http://localhost:8081/api/v1';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // Redirect to login or handle logout
          window.location.href = '/login';
          return Promise.reject(error);
        }
        const { data } = await axios.post<RefreshTokenResponse>(
          `${API_URL}/auth/refresh-token`,
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
          }
        );
        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('refreshToken', data.refresh_token);
        api.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token;
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login or handle logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


// Auth
export const register = (userData: RegisterRequest) => api.post<AuthResponse>('/auth/register', userData);
export const login = (credentials: LoginRequest) => api.post<AuthResponse>('/auth/authenticate', credentials);
export const refreshToken = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    return api.post<RefreshTokenResponse>('/auth/refresh-token', {}, {
        headers: { Authorization: `Bearer ${refreshToken}` },
    });
};
export const logout = () => api.post('/auth/logout');


// User
export const getMyInfo = () => api.get<User>('/users/me');
export const updateMyInfo = (data: UpdateUserRequest) => api.put('/users/me', data);
export const changePassword = (data: ChangePasswordRequest) => api.patch('/users/password', data);
export const deleteMyAccount = () => api.delete('/users/me');


// Documents
export const getDocuments = () => api.get<Document[]>('/documents');
export const uploadDocument = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post<Document>('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// QA
export const askQuestion = (qaRequest: QaRequest) => api.post<QaResponse>('/qa/ask', qaRequest);
export const getHistory = (documentId: number) => api.get<QaHistoryResponse[]>(`/qa/history/${documentId}`);