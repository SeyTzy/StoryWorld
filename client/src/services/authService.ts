import api from './api';
import { AuthResponse, User } from '../types';

export const authService = {
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  register: async (data: { name: string; email: string; password: string }): Promise<AuthResponse> => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  getMe: async (): Promise<User> => {
    const res = await api.get('/auth/me');
    return res.data.user;
  },

  updateProfile: async (data: { name?: string; password?: string; avatar?: string }): Promise<User> => {
    const res = await api.put('/users/profile', data);
    return res.data.user;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore server logout failure if network offline
    }
  },
};
