import axios, { AxiosError } from 'axios';
import { LoginRequest, RegisterRequest, RefreshTokenResponse, AuthResponse, UpdateUserRequest, ChangePasswordRequest, User } from '@/types/auth';
import { Document } from '@/types/document';
import { QaRequest, QaResponse, QaHistoryResponse } from '@/types/chat';
import { FacultySummary, FacultyProfile, Article, FacultyUploadBatch } from '@/types/faculty';


export const API_URL = 'http://localhost:8081/api/v1';

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
    const originalRequest = error.config as any;
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
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
export const getDocuments = () => api.get<Document[]>('/documents', { params: { '_': new Date().getTime() } });
export const uploadDocument = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post<Document>('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const deleteDocument = (id: number) => api.delete(`/documents/${id}`);

// QA
export const askQuestion = (qaRequest: QaRequest) => api.post<QaResponse>('/qa/ask', qaRequest);
export const getHistory = (documentId: number) => api.get<QaHistoryResponse[]>(`/qa/history/${documentId}`);

// Publications API
export const uploadFacultyList = async (file: File, articles_limit?: number): Promise<FacultySummary[]> => {
  const formData = new FormData();
  formData.append('file', file);
  if (articles_limit) {
    formData.append('articles_limit', String(articles_limit));
  }

  const response = await api.post('/publications/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getFacultyBatches = async (): Promise<FacultyUploadBatch[]> => {
  const response = await api.get('/publications/batches');
  return response.data;
};

export const getFacultySummariesForBatch = async (batchId: number): Promise<FacultySummary[]> => {
  const response = await api.get(`/publications/batches/${batchId}/summaries`);
  return response.data;
};

export const deleteFacultyBatch = async (batchId: number): Promise<void> => {
  await api.delete(`/publications/batches/${batchId}`);
};

export const getFacultyProfile = async (facultyId: string): Promise<FacultyProfile> => {
  const response = await api.get(`/publications/profile/${facultyId}`);
  return response.data;
};

export const getFacultyArticles = async (facultyId: string, page: number, size: number): Promise<Article[]> => {
  const response = await api.get(`/publications/articles/${facultyId}`, {
    params: { page, size },
  });
  return response.data;
};

export const getFacultySummary = async (facultyId: string, fromYear?: number, toYear?: number): Promise<string> => {
    const response = await api.get(`/publications/summary/${facultyId}`, {
        params: { fromYear, toYear },
    });
    return response.data;
};

export const exportFacultyProfile = async (facultyId: string, format: 'excel' | 'word') => {
    return api.get(`/publications/export/${facultyId}`, {
        params: { format },
        responseType: 'blob',
    });
};
